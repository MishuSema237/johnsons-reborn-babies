import { NextResponse } from "next/server";
import connectMongoose from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";

export async function POST(request: Request) {
    try {
        await connectMongoose();
        const { orderReference, email } = await request.json();

        if (!orderReference || !email) {
            return NextResponse.json(
                { error: "Order reference and email are required" },
                { status: 400 }
            );
        }

        // Find order by reference and email (case-insensitive for email)
        const order = await Order.findOne({
            orderReference: orderReference.toUpperCase(),
            "customer.email": { $regex: new RegExp(`^${email}$`, "i") },
        });

        if (!order) {
            return NextResponse.json(
                { error: "Order not found. Please check your details." },
                { status: 404 }
            );
        }

        // Return only necessary details for public view
        const publicOrder = {
            orderReference: order.orderReference,
            status: order.status,
            createdAt: order.createdAt,
            shipping: {
                city: order.shipping.city,
                country: order.shipping.country,
            },
            items: order.items.map((item: any) => ({
                name: item.name,
                quantity: item.quantity,
            })),
            statusHistory: order.statusHistory,
        };

        return NextResponse.json(publicOrder);
    } catch (error: any) {
        console.error("Track order error:", error);
        return NextResponse.json(
            { error: "Failed to track order" },
            { status: 500 }
        );
    }
}
