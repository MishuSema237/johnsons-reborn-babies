"use client";

import { useEffect, useState } from "react";
import { StatsCard } from "@/components/admin/stats-card";
import { FaShoppingBag, FaBoxOpen, FaImages, FaCommentAlt, FaClock } from "react-icons/fa";
import Link from "next/link";

interface DashboardStats {
  orders: {
    total: number;
    pending: number;
  };
  products: number;
  gallery: number;
  testimonials: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500">Welcome back to your admin overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <StatsCard
          title="Total Orders"
          value={stats?.orders.total || 0}
          icon={<FaShoppingBag className="text-xl" />}
        />
        <StatsCard
          title="Pending Orders"
          value={stats?.orders.pending || 0}
          icon={<FaClock className="text-xl" />}
          trend={stats?.orders.pending ? "Needs Attention" : "All Clear"}
          trendUp={!stats?.orders.pending}
        />
        <StatsCard
          title="Total Babies"
          value={stats?.products || 0}
          icon={<FaBoxOpen className="text-xl" />}
        />
        <StatsCard
          title="Gallery Images"
          value={stats?.gallery || 0}
          icon={<FaImages className="text-xl" />}
        />
        <StatsCard
          title="Testimonials"
          value={stats?.testimonials || 0}
          icon={<FaCommentAlt className="text-xl" />}
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-pink-600 hover:text-pink-700 font-medium"
          >
            View All
          </Link>
        </div>

        {stats?.recentOrders && stats.recentOrders.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Order ID</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="border-b border-gray-50 last:border-0">
                      <td className="py-4 text-sm font-medium text-gray-900">
                        #{order.orderReference || order._id.slice(-6)}
                      </td>
                      <td className="py-4 text-sm text-gray-600">
                        {order.customer?.name || "Guest"}
                      </td>
                      <td className="py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {stats.recentOrders.map((order: any) => (
                <div key={order._id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-gray-900">#{order.orderReference || order._id.slice(-6)}</div>
                      <div className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                      ${order.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-1">
                    <span className="text-gray-400">Customer:</span> {order.customer?.name || "Guest"}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">No recent orders found.</div>
        )}
      </div>
    </div>
  );
}
