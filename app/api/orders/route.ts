import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db/mongodb";
import { createOrder } from "@/lib/utils/db-helpers";
import { sendOrderConfirmationEmail, sendOrderNotificationToAdmin } from "@/lib/email";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { error: "Order must contain at least one item" },
        { status: 400 }
      );
    }

    if (!body.customer?.name || !body.customer?.email) {
      return NextResponse.json(
        { error: "Customer name and email are required" },
        { status: 400 }
      );
    }

    if (!body.shipping?.address || !body.shipping?.city || !body.shipping?.zipCode || !body.shipping?.country) {
      return NextResponse.json(
        { error: "Complete shipping address is required" },
        { status: 400 }
      );
    }

    if (!body.payment?.preferredMethod) {
      return NextResponse.json(
        { error: "Payment method is required" },
        { status: 400 }
      );
    }

    // Generate order reference
    const count = await mongoose.models.Order?.countDocuments() || 0;
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const orderReference = `RB${date}${String(count + 1).padStart(4, "0")}`;

    // Create order
    const order = await createOrder({
      orderReference,
      items: body.items,
      customer: body.customer,
      shipping: body.shipping,
      payment: {
        preferredMethod: body.payment.preferredMethod,
        customMethod: body.payment.customMethod,
        totalAmount: body.payment.totalAmount,
        status: "pending",
      },
      status: "new",
      statusHistory: [
        {
          status: "new",
          timestamp: new Date(),
          note: "Order created",
        },
      ],
    });

    // Send emails
    try {
      await Promise.all([
        sendOrderConfirmationEmail(order),
        sendOrderNotificationToAdmin(order)
      ]);
    } catch (emailError) {
      console.error("Failed to send order emails:", emailError);
      // Don't fail the request if email fails, but log it
    }

    return NextResponse.json(
      {
        success: true,
        orderReference: order.orderReference,
        orderId: order._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Order creation error details:", JSON.stringify(error, null, 2));
    console.error("Order creation error message:", error.message);
    return NextResponse.json(
      { error: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
