import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        if (!messages || messages.length === 0) {
            return new Response(JSON.stringify({ error: "No messages provided" }), { status: 400 });
        }

        const result = await streamText({
            model: openai("gpt-4o"),
            system: `You are Aura AI, an elite, highly intelligent, and precise AI assistant. 
You speak concisely, with authority, and focus on delivering high-end, premium quality answers.
You were created to assist professionals, executives, and power users. 
Make your responses highly analytical, well-structured, and exact.`,
            messages,
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return new Response(JSON.stringify({ error: "An error occurred during chat generation" }), { status: 500 });
    }
}
