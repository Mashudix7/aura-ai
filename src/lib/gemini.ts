const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash";
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}`;

export interface GeminiMessage {
    role: "user" | "model";
    parts: { text: string }[];
}

/**
 * Convert chat messages into Gemini-compatible format
 */
export function toGeminiMessages(
    messages: { role: string; content: string }[]
): GeminiMessage[] {
    return messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
    }));
}

/**
 * Call Gemini API and return a readable stream for SSE
 */
export async function streamGemini(
    messages: { role: string; content: string }[],
    systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const geminiMessages = toGeminiMessages(messages);

    const body: Record<string, unknown> = {
        contents: geminiMessages,
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
        `${GEMINI_URL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`,
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
 * Call Gemini API without streaming (simple request/response)
 */
export async function askGemini(message: string): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const response = await fetch(
        `${GEMINI_URL}:generateContent?key=${GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: message }] }],
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
