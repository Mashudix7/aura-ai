import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await auth();

        if (!session || !session.user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { tier } = await req.json();

        if (!tier || !["Standard", "Elite Access"].includes(tier)) {
            return NextResponse.json({ message: "Invalid subscription tier" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: { subscription_tier: tier }
        });

        return NextResponse.json({
            message: "Subscription updated successfully",
            tier: updatedUser.subscription_tier
        });

    } catch (error) {
        console.error("Subscription Update Error:", error);
        return NextResponse.json(
            { message: "An error occurred while updating the subscription." },
            { status: 500 }
        );
    }
}
