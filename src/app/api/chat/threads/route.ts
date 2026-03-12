import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const threads = await prisma.thread.findMany({
            where: { userId: session.user.id },
            orderBy: { updatedAt: 'desc' },
            select: {
                id: true,
                title: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(threads);
    } catch (error) {
        console.error("Fetch Threads Error:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching threads." },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { title } = body;

        const newThread = await prisma.thread.create({
            data: {
                userId: session.user.id,
                title: title || "New Conversation",
            }
        });

        return NextResponse.json(newThread, { status: 201 });
    } catch (error) {
        console.error("Create Thread Error:", error);
        return NextResponse.json(
            { message: "An error occurred while creating a thread." },
            { status: 500 }
        );
    }
}
