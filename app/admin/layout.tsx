"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isLoginPage = pathname === "/admin/login";

    useEffect(() => {
        const token = localStorage.getItem("adminToken");

        if (isLoginPage) {
            if (token) {
                router.push("/admin/dashboard");
            } else {
                setIsAuthorized(true);
            }
            setIsLoading(false);
            return;
        }

        if (!token) {
            router.push("/admin/login");
        } else {
            setIsAuthorized(true);
        }
        setIsLoading(false);
    }, [pathname, router, isLoginPage]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const toggleButton = document.getElementById('mobile-menu-button');

            // Only apply on mobile (when sidebar is fixed/absolute)
            if (window.innerWidth >= 768) return;

            if (sidebar && !sidebar.classList.contains('hidden') &&
                !sidebar.contains(event.target as Node) &&
                (!toggleButton || !toggleButton.contains(event.target as Node))) {
                sidebar.classList.add('hidden');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
            </div>
        );
    }

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (!isAuthorized) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-20 flex justify-between items-center">
                <h2 className="text-xl font-serif font-bold text-pink-600">Joanna's Reborns</h2>
                <Button id="mobile-menu-button" variant="ghost" size="icon" onClick={() => document.getElementById('mobile-sidebar')?.classList.toggle('hidden')}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
                </Button>
            </div>

            {/* Sidebar */}
            <aside id="mobile-sidebar" className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30 pt-16 md:pt-0 transition-transform shadow-lg md:shadow-none">
                <div className="p-6 border-b border-gray-100 hidden md:block flex-shrink-0">
                    <h2 className="text-2xl font-serif font-bold text-pink-600">Joanna's Reborns</h2>
                </div>
                <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
                    <Link
                        href="/admin/dashboard"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname === "/admin/dashboard"
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/products"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/products") || pathname.startsWith("/admin/babies")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Products
                    </Link>
                    <Link
                        href="/admin/orders"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/orders")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Orders
                    </Link>
                    <Link
                        href="/admin/gallery"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/gallery")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Gallery
                    </Link>
                    <Link
                        href="/admin/testimonials"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/testimonials")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Testimonials
                    </Link>
                    <Link
                        href="/admin/hero"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/hero")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Hero Slider
                    </Link>
                    <div className="pt-4 pb-2">
                        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Settings</p>
                    </div>
                    <Link
                        href="/admin/socials"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/socials")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Social Media
                    </Link>
                    <Link
                        href="/admin/payment-methods"
                        className={`block px-4 py-2 rounded-lg transition-colors font-medium ${pathname.startsWith("/admin/payment-methods")
                            ? "bg-pink-50 text-pink-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        Payment Methods
                    </Link>
                </nav>
                <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
                    <Button
                        variant="outline"
                        className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
                {children}
            </main>
        </div>
    );
}
