"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, ShoppingBag, Settings, LogOut, Users, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // @ts-ignore
    const isAdmin = session?.user?.role === "admin";

    useEffect(() => {
        if (status === "unauthenticated" || (status === "authenticated" && !isAdmin)) {
            router.push("/");
        }
    }, [status, isAdmin, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAdmin) {
        return null;
    }

    const navItems = [
        { name: "Overview", href: "/admin", icon: LayoutDashboard },
        { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
        { name: "Customers", href: "/admin/customers", icon: Users },
        { name: "Pricing", href: "/admin/pricing", icon: Settings },
    ];

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/", redirect: true });
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
                    className={`w-64 bg-white border-r border-gray-200 fixed h-full z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
                >
                    <div className="p-6 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-rush-dark rounded-xl flex items-center justify-center text-white font-black text-sm group-hover:bg-[#E63946] transition-colors">
                                R
                            </div>
                            <span className="font-bold text-xl text-rush-dark">Rush Admin</span>
                        </Link>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => {
                            const isActive = item.href === '/admin'
                                ? pathname === '/admin'
                                : pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                                        isActive
                                            ? "bg-[#E63946] text-white"
                                            : "text-gray-600 hover:bg-gray-50 hover:text-rush-dark"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-sm text-gray-600">
                                {session?.user?.name?.[0] || "A"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{session?.user?.name}</p>
                                <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 font-medium hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-h-screen">
                <div className="p-4 sm:p-6 md:p-8 max-w-7xl 3xl:max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
