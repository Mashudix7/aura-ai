import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const threadId = resolvedParams.id;

        const thread = await prisma.thread.findUnique({
            where: { id: threadId, userId: session.user.id },
            include: {
                messages: {
                    orderBy: { createdAt: 'asc' }
                }
            }
        });

        if (!thread) {
            return NextResponse.json({ message: "Thread not found" }, { status: 404 });
        }

        return NextResponse.json(thread);
    } catch (error) {
        console.error("Fetch Thread Details Error:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching thread details." },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const resolvedParams = await params;
        const threadId = resolvedParams.id;

        // Verify ownership
        const thread = await prisma.thread.findUnique({
            where: { id: threadId, userId: session.user.id },
        });

        if (!thread) {
            return NextResponse.json({ message: "Thread not found or unauthorized" }, { status: 404 });
        }

        await prisma.thread.delete({
            where: { id: threadId }
        });

        return NextResponse.json({ message: "Thread deleted successfully" });
    } catch (error) {
        console.error("Delete Thread Error:", error);
        return NextResponse.json(
            { message: "An error occurred while deleting the thread." },
            { status: 500 }
        );
    }
}
