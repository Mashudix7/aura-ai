import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                subscription_tier: true,
                promptCount: true,
                lastPromptDate: true,
            }
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            tier: user.subscription_tier,
            promptCount: user.promptCount,
            lastPromptDate: user.lastPromptDate,
        });

    } catch (error) {
        console.error("Fetch Usage Error:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching user usage." },
            { status: 500 }
        );
    }
}
