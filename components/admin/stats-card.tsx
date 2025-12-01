import { ReactNode } from "react";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    trend?: string;
    trendUp?: boolean;
}

export function StatsCard({ title, value, icon, trend, trendUp }: StatsCardProps) {
    return (
        <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
                <p className="text-gray-500 md:text-lg text-xl font-medium">{title}</p>
                <div className=" text-pink-600">
                    {icon}
                </div>
            </div>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                {trend && (
                    <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${trendUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                    >
                        {trend}
                    </span>
                )}
            </div>
        </div>
    );
}
