import { streamGemini, SUPPORTED_IMAGE_TYPES } from "@/lib/gemini";
import type { ChatMessage } from "@/lib/gemini";
import { streamOpenRouter } from "@/lib/openrouter";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// All available models — Gemini + OpenRouter
const ALL_MODELS = [
    { id: "gemini-2.5-flash", name: "Aura AI 2.5", provider: "gemini" },
    { id: "stepfun/step-3.5-flash:free", name: "Step 3.5 Flash", provider: "openrouter" },
    { id: "arcee-ai/trinity-large-preview:free", name: "Trinity Large", provider: "openrouter" },
];

const getSystemPrompt = (modelName: string) => `You are Aura AI, an elite, highly intelligent, and precise AI assistant.
You speak concisely, with authority, and focus on delivering high-end, premium quality answers.
You were created to assist professionals, executives, and power users.
Make your responses highly analytical, well-structured, and exact.
You are powered by the ${modelName} model.
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
        const { messages, modelId, threadId } = await req.json();

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

        // --- Subscription & Usage Logic ---
        const session = await auth();
        if (!session?.user?.id) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { subscription_tier: true, promptCount: true, lastPromptDate: true }
        });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // start of today

        let currentPromptCount = user.promptCount;
        const lastPromptDate = user.lastPromptDate ? new Date(user.lastPromptDate) : null;
        if (lastPromptDate) {
            lastPromptDate.setHours(0, 0, 0, 0);
        }

        // Reset if it's a new day
        if (!lastPromptDate || lastPromptDate.getTime() !== today.getTime()) {
            currentPromptCount = 0;
        }

        // Process logic based on tier
        if (user.subscription_tier === "Standard") {
            // Check prompt limit
            if (currentPromptCount >= 20) {
                 return new Response(JSON.stringify({ error: "Daily prompt limit reached for Standard tier. Please upgrade for unlimited access." }), { status: 403 });
            }

            // Check model selection (only Aura AI 2.5)
            if (selectedModel.id !== "gemini-2.5-flash") {
                 return new Response(JSON.stringify({ error: "Premium models require Elite Access." }), { status: 403 });
            }

            // Check file uploads (not allowed)
            const hasImages = sanitizedMessages.some((msg: { images?: ImageAttachment[] }) => msg.images && msg.images.length > 0);
            if (hasImages) {
                 return new Response(JSON.stringify({ error: "Image uploads require Elite Access." }), { status: 403 });
            }
        }

        // --- End Subscription Logic ---

        // Log user prompt if threadId exists
        const lastUserMessage = sanitizedMessages[sanitizedMessages.length - 1];
        if (threadId && lastUserMessage?.content && lastUserMessage.role === "user") {
            try {
                await prisma.message.create({
                    data: {
                        threadId,
                        role: "user",
                        content: lastUserMessage.content,
                    }
                });
            } catch (err) {
                console.error("Failed to save user message to DB:", err);
            }
        }

        let stream: ReadableStream<Uint8Array>;

        if (selectedModel.provider === "gemini") {
            // Use Gemini streaming
            const geminiMessages: ChatMessage[] = sanitizedMessages.map(
                (msg: { role: string; content: string; images?: ImageAttachment[] }) => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                    ...(msg.images && { images: msg.images }),
                })
            );
            stream = await streamGemini(geminiMessages, getSystemPrompt(selectedModel.name));
        } else {
            // Use OpenRouter streaming
            stream = await streamOpenRouter(
                sanitizedMessages,
                selectedModel.id,
                getSystemPrompt(selectedModel.name)
            );
        }

        // Increment count on successful request start
        await prisma.user.update({
            where: { id: session.user.id },
            data: { 
                promptCount: currentPromptCount + 1,
                lastPromptDate: new Date()
            }
        });

        // Create a TransformStream to log the AI response to the database
        let fullAiResponse = "";
        const transformStream = new TransformStream({
            transform(chunk, controller) {
                fullAiResponse += new TextDecoder().decode(chunk);
                controller.enqueue(chunk);
            },
            async flush(controller) {
                if (threadId && fullAiResponse) {
                    try {
                        await prisma.message.create({
                            data: {
                                threadId,
                                role: "assistant", // "assistant" model
                                content: fullAiResponse,
                            }
                        });
                        // Update thread's updatedAt
                        await prisma.thread.update({
                            where: { id: threadId },
                            data: { updatedAt: new Date() }
                        });
                    } catch (err) {
                        console.error("Failed to save assistant message to DB:", err);
                    }
                }
            }
        });

        const outputStream = stream.pipeThrough(transformStream);

        return new Response(outputStream, {
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
