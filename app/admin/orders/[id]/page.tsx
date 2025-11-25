"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface OrderDetail {
    _id: string;
    orderReference: string;
    customer: { name: string; email: string; phone?: string };
    shipping: { address: string; city: string; zipCode: string; country: string };
    items: { name: string; quantity: number; price: number }[];
    payment: { totalAmount: number; preferredMethod: string };
    status: string;
    createdAt: string;
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [replyMessage, setReplyMessage] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`);
            if (!res.ok) throw new Error("Order not found");
            const data = await res.json();
            setOrder(data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReply = async () => {
        if (!replyMessage.trim()) return;
        setIsSending(true);
        try {
            const res = await fetch(`/api/admin/orders/${id}/reply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subject: `Payment Details for Order ${order?.orderReference}`,
                    message: replyMessage,
                }),
            });

            if (res.ok) {
                alert("Reply sent successfully!");
                setReplyMessage("");
            } else {
                alert("Failed to send reply.");
            }
        } catch (err) {
            console.error(err);
            alert("Error sending reply.");
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (!order) return <div className="p-8 text-center">Order not found</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-serif font-bold">Order {order.orderReference}</h1>
                <Button variant="outline" onClick={() => router.back()}>Back to Orders</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Details */}
                <div className="md:col-span-2 space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Items</h2>
                        <div className="space-y-4">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0">
                                    <div>
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                                    </div>
                                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                            ))}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-100 font-bold text-lg">
                                <span>Total</span>
                                <span>${order.payment.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold mb-4">Reply to Customer</h2>
                        <div className="space-y-4">
                            <p className="text-sm text-gray-600">
                                Send payment details or updates to <strong>{order.customer.email}</strong>.
                            </p>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition-all"
                                rows={6}
                                placeholder="Enter your message here..."
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                            />
                            <div className="flex justify-end">
                                <Button onClick={handleReply} disabled={isSending || !replyMessage.trim()}>
                                    {isSending ? "Sending..." : "Send Reply"}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Customer</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Name:</span> {order.customer.name}</p>
                            <p><span className="text-gray-500">Email:</span> {order.customer.email}</p>
                            {order.customer.phone && <p><span className="text-gray-500">Phone:</span> {order.customer.phone}</p>}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Shipping</h2>
                        <div className="space-y-2 text-sm">
                            <p>{order.shipping.address}</p>
                            <p>{order.shipping.city}, {order.shipping.zipCode}</p>
                            <p>{order.shipping.country}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-bold mb-4">Payment</h2>
                        <div className="space-y-2 text-sm">
                            <p><span className="text-gray-500">Method:</span> {order.payment.preferredMethod}</p>
                            <div className="mt-4">
                                <label className="block text-gray-500 mb-1">Order Status</label>
                                <select
                                    value={order.status}
                                    onChange={async (e) => {
                                        const newStatus = e.target.value;
                                        try {
                                            const res = await fetch(`/api/admin/orders/${order._id}`, {
                                                method: "PUT",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({ status: newStatus }),
                                            });
                                            if (res.ok) {
                                                const updatedOrder = await res.json();
                                                setOrder(updatedOrder);
                                                alert("Status updated successfully");
                                            } else {
                                                throw new Error("Failed to update status");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                            alert("Error updating status");
                                        }
                                    }}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm capitalize"
                                >
                                    {[
                                        "new",
                                        "pending",
                                        "confirmed",
                                        "awaiting_deposit",
                                        "paid",
                                        "in_progress",
                                        "shipped",
                                        "completed",
                                        "cancelled"
                                    ].map((s) => (
                                        <option key={s} value={s}>
                                            {s.replace("_", " ")}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
