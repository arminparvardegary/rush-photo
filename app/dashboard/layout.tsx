"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ShoppingCart, LogOut, Menu, X, User, Home, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?redirect=/dashboard");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "My Orders", href: "/dashboard/orders", icon: ShoppingBag },
        { name: "Profile", href: "/dashboard/profile", icon: User },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/" });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Menu Button */}
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-rush-dark hover:bg-gray-50 transition-colors"
            >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside
                className={`w-64 bg-white border-r border-gray-100 fixed h-full z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <div className="p-5 border-b border-gray-100">
                    <Link href="/" className="flex items-center gap-2 group">
                        <img src="/rushlogo.png" alt="Rush" className="h-6 w-auto object-contain" />
                        <span className="font-bold text-xl text-rush-dark">photos</span>
                    </Link>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = item.href === '/dashboard'
                            ? pathname === '/dashboard'
                            : pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                                    isActive
                                        ? "bg-[#E63946] text-white shadow-md shadow-[#E63946]/20"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                            >
                                <item.icon className={`w-5 h-5 ${isActive ? '' : 'opacity-70'}`} />
                                {item.name}
                            </Link>
                        );
                    })}

                    <div className="pt-3 mt-3 border-t border-gray-100">
                        <Link
                            href="/order"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-[#E63946]/5 hover:text-[#E63946] transition-all"
                        >
                            <Camera className="w-5 h-5 opacity-70" />
                            New Order
                        </Link>
                        <Link
                            href="/cart"
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
                        >
                            <ShoppingCart className="w-5 h-5 opacity-70" />
                            Cart
                        </Link>
                    </div>
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 mb-1">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#D62839] flex items-center justify-center font-bold text-sm text-white shadow-md shadow-[#E63946]/20">
                            {session?.user?.name?.[0] || session?.user?.email?.[0]?.toUpperCase() || "U"}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name || "User"}</p>
                            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen bg-gray-50/50">
                <div className="p-4 pt-16 sm:p-6 sm:pt-6 md:p-8 max-w-5xl 3xl:max-w-[1400px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
