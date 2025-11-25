"use client";

import { usePathname } from "next/navigation";

export function MainContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === "/";
    const isAdmin = pathname?.startsWith("/admin");

    if (isAdmin) {
        return (
            <main className="flex-1 bg-gray-50/50">
                {children}
            </main>
        );
    }

    return (
        <main
            className={`flex-1 w-full ${isHome ? "p-0" : "max-w-viewport mx-auto px-4 pt-[35px]"
                }`}
        >
            {children}
        </main>
    );
}
