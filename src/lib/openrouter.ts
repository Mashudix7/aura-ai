const API_KEY = process.env.OPENROUTER_API_KEY;
const URL = "https://openrouter.ai/api/v1/chat/completions";

export const MODELS = [
    { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large" },
];

export async function askAI(message: string, model: string) {
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://localhost:3000",
            "X-Title": "AiAura",
        },
        body: JSON.stringify({
            model,
            messages: [{ role: "user", content: message }],
        }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
}

export async function askAIWithImage(
    message: string,
    imageBase64: string,
    mimeType: string,
    model: string
) {
    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://localhost:3000",
            "X-Title": "AiAura",
        },
        body: JSON.stringify({
            model,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "image_url",
                            image_url: {
                                url: `data:${mimeType};base64,${imageBase64}`,
                            },
                        },
                        { type: "text", text: message },
                    ],
                },
            ],
        }),
    });
    const data = await res.json();
    return data.choices[0].message.content;
}

/**
 * Stream chat completions from OpenRouter (supports conversation history + images)
 */
export async function streamOpenRouter(
    messages: Array<{
        role: string;
        content: string;
        images?: Array<{ data: string; mimeType: string }>;
    }>,
    model: string,
    systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
    // Convert messages to OpenRouter format
    const openRouterMessages: Array<{
        role: string;
        content:
            | string
            | Array<
                  | { type: "text"; text: string }
                  | {
                        type: "image_url";
                        image_url: { url: string };
                    }
              >;
    }> = [];

    // Add system prompt
    if (systemPrompt) {
        openRouterMessages.push({ role: "system", content: systemPrompt });
    }

    for (const msg of messages) {
        if (msg.images && msg.images.length > 0) {
            // Multimodal message with images
            const content: Array<
                | { type: "text"; text: string }
                | { type: "image_url"; image_url: { url: string } }
            > = [];

            for (const img of msg.images) {
                content.push({
                    type: "image_url",
                    image_url: {
                        url: `data:${img.mimeType};base64,${img.data}`,
                    },
                });
            }

            if (msg.content) {
                content.push({ type: "text", text: msg.content });
            }

            openRouterMessages.push({
                role: msg.role === "assistant" ? "assistant" : "user",
                content,
            });
        } else {
            // Text-only message
            openRouterMessages.push({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content,
            });
        }
    }

    const res = await fetch(URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://localhost:3000",
            "X-Title": "AiAura",
        },
        body: JSON.stringify({
            model,
            messages: openRouterMessages,
            stream: true,
        }),
    });

    if (!res.ok) {
        const errorData = await res.text();
        console.error("OpenRouter API Error:", errorData);
        throw new Error(`OpenRouter API returned ${res.status}: ${errorData}`);
    }

    if (!res.body) {
        throw new Error("OpenRouter API returned no body");
    }

    // Transform SSE stream into a simple text stream
    const reader = res.body.getReader();
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
                        if (!trimmed || !trimmed.startsWith("data: "))
                            continue;

                        const jsonStr = trimmed.slice(6);
                        if (jsonStr === "[DONE]") continue;

                        try {
                            const parsed = JSON.parse(jsonStr);
                            const text =
                                parsed?.choices?.[0]?.delta?.content;
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
