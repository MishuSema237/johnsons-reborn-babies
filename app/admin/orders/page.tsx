"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Order {
    _id: string;
    orderReference: string;
    customer: { name: string; email: string };
    payment: { totalAmount: number; status: string };
    status: string;
    createdAt: string;
}

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/admin/orders");
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl font-serif font-bold mb-8">Orders</h1>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="p-4 font-medium text-gray-600">Reference</th>
                                <th className="p-4 font-medium text-gray-600">Customer</th>
                                <th className="p-4 font-medium text-gray-600">Total</th>
                                <th className="p-4 font-medium text-gray-600">Status</th>
                                <th className="p-4 font-medium text-gray-600">Date</th>
                                <th className="p-4 font-medium text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">Loading orders...</td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">No orders found.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium">{order.orderReference}</td>
                                        <td className="p-4">
                                            <div className="font-medium">{order.customer.name}</div>
                                            <div className="text-sm text-gray-500">{order.customer.email}</div>
                                        </td>
                                        <td className="p-4">${order.payment.totalAmount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                        ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-yellow-100 text-yellow-700'}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500 text-sm">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <Link href={`/admin/orders/${order._id}`}>
                                                <Button variant="outline" size="sm">View</Button>
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
                {isLoading ? (
                    <div className="text-center text-gray-500 py-8">Loading orders...</div>
                ) : orders.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">No orders found.</div>
                ) : (
                    orders.map((order) => (
                        <div key={order._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-lg">#{order.orderReference}</div>
                                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize
                                    ${order.status === 'paid' ? 'bg-green-100 text-green-700' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'}`}>
                                    {order.status.replace('_', ' ')}
                                </span>
                            </div>

                            <div className="border-t border-b border-gray-50 py-2 space-y-1">
                                <div className="text-sm">
                                    <span className="text-gray-500">Customer:</span> <span className="font-medium">{order.customer.name}</span>
                                </div>
                                <div className="text-sm text-gray-500">{order.customer.email}</div>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <div className="font-bold text-lg">${order.payment.totalAmount.toFixed(2)}</div>
                                <Link href={`/admin/orders/${order._id}`}>
                                    <Button size="sm" className="w-full">View Details</Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
