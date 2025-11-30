import { NextResponse } from "next/server";
import connectMongoose from "@/lib/db/mongodb";
import Order from "@/lib/models/Order";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongoose();
        const { id } = await params;
        const order = await Order.findById(id);

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error(`Error fetching order ${params}:`, error);
        return NextResponse.json(
            { error: error.message || "Failed to fetch order" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectMongoose();
        const { id } = await params;
        const body = await request.json();
        const { status, notes } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (notes) updateData.notes = notes;

        const order = await Order.findByIdAndUpdate(
            id,
            {
                $set: updateData,
                $push: {
                    statusHistory: {
                        status: status || "updated",
                        timestamp: new Date(),
                        note: notes || `Status updated to ${status}`,
                    },
                },
            },
            { new: true }
        );

        if (!order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error(`Error updating order ${params}:`, error);
        return NextResponse.json(
            { error: error.message || "Failed to update order" },
            { status: 500 }
        );
    }
}
