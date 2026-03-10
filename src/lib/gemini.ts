const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

function getApiKey(): string {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }
    return key;
}

// Supported image MIME types for Gemini multimodal
export const SUPPORTED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/heic",
] as const;

export type SupportedImageType = (typeof SUPPORTED_IMAGE_TYPES)[number];

export interface ImageAttachment {
    data: string; // base64 encoded
    mimeType: string;
}

export interface ChatMessage {
    role: string;
    content: string;
    images?: ImageAttachment[];
}

// Gemini API types
interface GeminiPart {
    text?: string;
    inline_data?: {
        mime_type: string;
        data: string;
    };
}

interface GeminiContent {
    role: "user" | "model";
    parts: GeminiPart[];
}

/**
 * Convert chat messages into Gemini-compatible format with multimodal support
 */
export function toGeminiContents(messages: ChatMessage[]): GeminiContent[] {
    return messages.map((msg) => {
        const parts: GeminiPart[] = [];

        // Add image parts first (Gemini prefers images before text)
        if (msg.images && msg.images.length > 0) {
            for (const img of msg.images) {
                parts.push({
                    inline_data: {
                        mime_type: img.mimeType,
                        data: img.data,
                    },
                });
            }
        }

        // Add text part
        if (msg.content) {
            parts.push({ text: msg.content });
        }

        // Ensure at least one part exists
        if (parts.length === 0) {
            parts.push({ text: "" });
        }

        return {
            role: msg.role === "user" ? "user" : "model",
            parts,
        };
    });
}

/**
 * Call Gemini API and return a readable stream for SSE (supports multimodal)
 */
export async function streamGemini(
    messages: ChatMessage[],
    systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
    const apiKey = getApiKey();

    const contents = toGeminiContents(messages);

    const body: Record<string, unknown> = {
        contents,
        generationConfig: {
            temperature: 0.9,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 8192,
        },
    };

    if (systemPrompt) {
        body.systemInstruction = {
            parts: [{ text: systemPrompt }],
        };
    }

    const response = await fetch(
        `${GEMINI_BASE_URL}:streamGenerateContent?alt=sse&key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        console.error("Gemini API Error:", errorData);
        throw new Error(`Gemini API returned ${response.status}: ${errorData}`);
    }

    if (!response.body) {
        throw new Error("Gemini API returned no body");
    }

    // Transform Gemini SSE stream into a simple text stream
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
        async start(controller) {
            let buffer = "";

            try {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (!trimmed || !trimmed.startsWith("data: ")) continue;

                        const jsonStr = trimmed.slice(6);
                        if (jsonStr === "[DONE]") continue;

                        try {
                            const parsed = JSON.parse(jsonStr);
                            const text =
                                parsed?.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (text) {
                                controller.enqueue(encoder.encode(text));
                            }
                        } catch {
                            // skip malformed JSON chunks
                        }
                    }
                }
            } catch (err) {
                controller.error(err);
            } finally {
                controller.close();
            }
        },
    });
}

/**
 * Call Gemini API without streaming (simple request/response) — supports multimodal
 */
export async function askGemini(
    message: string,
    images?: ImageAttachment[]
): Promise<string> {
    const apiKey = getApiKey();

    const parts: GeminiPart[] = [];

    // Add images first
    if (images && images.length > 0) {
        for (const img of images) {
            parts.push({
                inline_data: {
                    mime_type: img.mimeType,
                    data: img.data,
                },
            });
        }
    }

    // Add text
    parts.push({ text: message });

    const response = await fetch(
        `${GEMINI_BASE_URL}:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts }],
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Gemini API returned ${response.status}: ${errorData}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}
