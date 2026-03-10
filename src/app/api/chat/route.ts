import { streamGemini } from "@/lib/gemini";

const SYSTEM_PROMPT = `You are Aura AI, an elite, highly intelligent, and precise AI assistant.
You speak concisely, with authority, and focus on delivering high-end, premium quality answers.
You were created to assist professionals, executives, and power users.
Make your responses highly analytical, well-structured, and exact.
You are powered by the Gemini 2.5 Flash model.
When appropriate, use markdown formatting to structure your responses with headings, bullet points, and code blocks.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "No messages provided" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const stream = await streamGemini(messages, SYSTEM_PROMPT);

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
