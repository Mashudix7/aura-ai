import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { messages, threadId } = await req.json();

        // In a real app, we'd fetch or create the thread id here to associate in DB
        // Assuming threadId is passed, or if null, just handle stream

        const result = streamText({
            model: openai("gpt-4o"),
            system: `You are Aura AI, an elite, highly intelligent, and precise AI assistant. 
      You speak concisely, with authority, and focus on delivering high-end, premium quality answers.
      You were created to assist professionals, executives, and power users. 
      Do not use overly emotive language unless appropriate for a luxury or premium context.
      Make your responses highly analytical, well-structured, and exact.`,
            messages,
            async onFinish({ text, toolCalls, toolResults, usage, finishReason }) {
                // Here we could save the generated message to Prisma DB
                // await prisma.message.create({ ... })
                console.log("Chat generation finished:", { usage, finishReason });
            },
        });

        return result.toDataStreamResponse();
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "An error occurred during chat generation" },
            { status: 500 }
        );
    }
}
