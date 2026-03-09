import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const contact = await prisma.contactMessage.create({
            data: { name, email, message }
        });

        // Here we could also trigger an email notification via Resend, Nodemailer, etc.

        return NextResponse.json({
            message: "Message received successfully",
            id: contact.id
        }, { status: 201 });

    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { message: "An error occurred while saving the message." },
            { status: 500 }
        );
    }
}
