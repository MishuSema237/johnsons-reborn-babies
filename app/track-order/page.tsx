"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/ui/form-input";
import { FaSearch, FaBoxOpen, FaShippingFast, FaCheckCircle } from "react-icons/fa";

export default function TrackOrderPage() {
    const [orderReference, setOrderReference] = useState("");
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<any | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        setOrder(null);

        try {
            const res = await fetch("/api/track-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderReference, email }),
            });

            const data = await res.json();

            if (res.ok) {
                setOrder(data);
            } else {
                setError(data.error || "Failed to find order");
            }
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed": return <FaCheckCircle className="text-green-500 text-4xl" />;
            case "shipped": return <FaShippingFast className="text-blue-500 text-4xl" />;
            default: return <FaBoxOpen className="text-pink-500 text-4xl" />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">Track Your Order</h1>
                    <p className="text-lg text-gray-600">
                        Enter your order reference and email address to check the status of your shipment.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput
                                label="Order Reference"
                                value={orderReference}
                                onChange={(e) => setOrderReference(e.target.value.toUpperCase())}
                                placeholder="e.g. RB20230001"
                                required
                            />
                            <FormInput
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Used during checkout"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Searching..." : "Track Order"}
                        </Button>
                    </form>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                            {error}
                        </div>
                    )}
                </div>

                {order && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-8 mb-8">
                            <div className="flex items-center gap-4 mb-4 md:mb-0">
                                {getStatusIcon(order.status)}
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">Order {order.orderReference}</h2>
                                    <p className="text-gray-500 capitalize">Status: <span className="font-medium text-gray-900">{order.status.replace("_", " ")}</span></p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Ordered on</p>
                                <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Shipping To</h3>
                                <p className="text-gray-600">{order.shipping.city}, {order.shipping.country}</p>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Items</h3>
                                <ul className="space-y-2">
                                    {order.items.map((item: any, idx: number) => (
                                        <li key={idx} className="text-gray-600 flex justify-between">
                                            <span>{item.name}</span>
                                            <span className="text-gray-400">x{item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {order.statusHistory.length > 0 && (
                            <div>
                                <h3 className="font-bold text-gray-900 mb-4">Order History</h3>
                                <div className="space-y-4">
                                    {order.statusHistory.map((history: any, idx: number) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className="w-3 h-3 rounded-full bg-pink-500" />
                                                {idx < order.statusHistory.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-200 my-1" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium capitalize">{history.status.replace("_", " ")}</p>
                                                <p className="text-sm text-gray-500">{new Date(history.timestamp).toLocaleString()}</p>
                                                {history.note && <p className="text-sm text-gray-600 mt-1">{history.note}</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
