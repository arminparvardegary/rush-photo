"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Calendar, ShoppingBag, DollarSign, Trash2, Eye } from "lucide-react";
import { getAllOrders } from "@/lib/server/orders";

type Customer = {
    email: string;
    name: string;
    totalOrders: number;
    totalSpent: number;
    firstOrder: string;
    lastOrder: string;
};

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const orders = await getAllOrders();

            // Group orders by customer email
            const customerMap = new Map<string, Customer>();

            orders.forEach(order => {
                const existing = customerMap.get(order.email);

                if (existing) {
                    existing.totalOrders += 1;
                    existing.totalSpent += order.totals.total;
                    existing.lastOrder = order.createdAt > existing.lastOrder ? order.createdAt : existing.lastOrder;
                } else {
                    customerMap.set(order.email, {
                        email: order.email,
                        name: order.name || "Unknown",
                        totalOrders: 1,
                        totalSpent: order.totals.total,
                        firstOrder: order.createdAt,
                        lastOrder: order.createdAt,
                    });
                }
            });

            setCustomers(Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent));
        } catch (error) {
            console.error("Error loading customers:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCustomers = customers.length;
    const totalRevenue = customers.reduce((acc, c) => acc + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / customers.reduce((acc, c) => acc + c.totalOrders, 0) || 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Customers</h1>
                <p className="text-gray-500 font-medium">Manage your customer base and insights.</p>
            </div>

            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Customers</p>
                            <p className="text-2xl font-black text-gray-900">{totalCustomers}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Revenue</p>
                            <p className="text-2xl font-black text-gray-900">${totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Avg Order Value</p>
                            <p className="text-2xl font-black text-gray-900">${avgOrderValue.toFixed(0)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search customers by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E63946] transition-colors font-medium"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Orders</th>
                                <th className="px-6 py-4">Total Spent</th>
                                <th className="px-6 py-4">First Order</th>
                                <th className="px-6 py-4">Last Order</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.email} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#E63946] to-[#D62839] flex items-center justify-center text-white font-bold text-sm">
                                                {customer.name[0]}
                                            </div>
                                            <span className="font-bold text-gray-900">{customer.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-4 h-4" />
                                            {customer.email}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700">
                                            {customer.totalOrders} {customer.totalOrders === 1 ? 'order' : 'orders'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-gray-900">
                                        ${customer.totalSpent.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(customer.firstOrder).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(customer.lastOrder).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredCustomers.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No customers found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
