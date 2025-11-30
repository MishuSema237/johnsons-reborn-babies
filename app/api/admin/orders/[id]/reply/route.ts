import { NextResponse } from "next/server";
import connectMongoose from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";
import { sendOrderUpdateEmail } from "@/lib/email";

// Since sendOrderConfirmationEmail is specific, we might need to expose a generic sendEmail or create a new function
// For now, I'll assume we can use the existing infrastructure or I'll modify emailjs.ts later if needed.
// Actually, the user wants to "reply via the site which then send the reply to the client via email template for payment details"
// So this is basically sending payment details.

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongoose();
        const { id } = await params;
        const body = await request.json();
        const { message, subject } = body;

        const order = await Order.findById(id);
        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        await sendOrderUpdateEmail(order.customer.email, subject, message);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || "Failed to send reply" },
            { status: 500 }
        );
    }
}
