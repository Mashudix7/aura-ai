import { streamGemini, SUPPORTED_IMAGE_TYPES } from "@/lib/gemini";
import type { ChatMessage } from "@/lib/gemini";
import { streamOpenRouter } from "@/lib/openrouter";

// All available models — Gemini + OpenRouter
const ALL_MODELS = [
    { id: "gemini-2.5-flash", name: "Aura AI 2.5", provider: "gemini" },
    { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash", provider: "openrouter" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large", provider: "openrouter" },
];

const SYSTEM_PROMPT = `You are Aura AI, an elite, highly intelligent, and precise AI assistant.
You speak concisely, with authority, and focus on delivering high-end, premium quality answers.
You were created to assist professionals, executives, and power users.
Make your responses highly analytical, well-structured, and exact.
You are powered by the Gemini 2.5 Flash model.
When appropriate, use markdown formatting to structure your responses with headings, bullet points, and code blocks.
When the user sends an image, analyze it thoroughly and provide detailed, insightful observations.`;

// Max image size: 4MB (Gemini limit is 20MB but we cap at 4MB for performance)
const MAX_IMAGE_SIZE_BYTES = 4 * 1024 * 1024;
const MAX_IMAGES_PER_MESSAGE = 5;

interface ImageAttachment {
    data: string;
    mimeType: string;
}

interface IncomingMessage {
    role: string;
    content: string;
    images?: ImageAttachment[];
}

export async function POST(req: Request) {
    try {
        const { messages, modelId } = await req.json();

        if (!messages || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "No messages provided" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Find the selected model, default to Gemini
        const selectedModel = ALL_MODELS.find((m) => m.id === modelId) || ALL_MODELS[0];

        // Validate and sanitize messages with image attachments
        const sanitizedMessages = messages.map(
            (msg: IncomingMessage) => {
                const sanitized: {
                    role: string;
                    content: string;
                    images?: ImageAttachment[];
                } = {
                    role: msg.role,
                    content: msg.content || "",
                };

                if (msg.images && Array.isArray(msg.images)) {
                    // Limit number of images
                    const validImages = msg.images
                        .slice(0, MAX_IMAGES_PER_MESSAGE)
                        .filter((img: ImageAttachment) => {
                            // Validate mime type
                            if (
                                !SUPPORTED_IMAGE_TYPES.includes(
                                    img.mimeType as (typeof SUPPORTED_IMAGE_TYPES)[number]
                                )
                            ) {
                                console.warn(`Unsupported image type: ${img.mimeType}`);
                                return false;
                            }

                            // Validate base64 data exists
                            if (!img.data || typeof img.data !== "string") {
                                console.warn("Invalid image data");
                                return false;
                            }

                            // Approximate size check (base64 is ~4/3 of original)
                            const approxSize = (img.data.length * 3) / 4;
                            if (approxSize > MAX_IMAGE_SIZE_BYTES) {
                                console.warn(
                                    `Image too large: ~${Math.round(approxSize / 1024 / 1024)}MB`
                                );
                                return false;
                            }

                            return true;
                        });

                    if (validImages.length > 0) {
                        sanitized.images = validImages;
                    }
                }

                return sanitized;
            }
        );

        let stream: ReadableStream<Uint8Array>;

        if (selectedModel.provider === "gemini") {
            // Use Gemini streaming
            const geminiMessages: ChatMessage[] = sanitizedMessages.map(
                (msg: { role: string; content: string; images?: ImageAttachment[] }) => ({
                    role: msg.role,
                    content: msg.content,
                    ...(msg.images && { images: msg.images }),
                })
            );
            stream = await streamGemini(geminiMessages, SYSTEM_PROMPT);
        } else {
            // Use OpenRouter streaming
            stream = await streamOpenRouter(
                sanitizedMessages,
                selectedModel.id,
                SYSTEM_PROMPT
            );
        }

        return new Response(stream, {
            headers: {
                "Content-Type": "text/plain; charset=utf-8",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(
            JSON.stringify({
                error:
                    error instanceof Error
                        ? error.message
                        : "An error occurred during chat generation",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
