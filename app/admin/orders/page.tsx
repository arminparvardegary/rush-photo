import { getAllOrders } from "@/lib/server/orders";
import { ArrowUpRight, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
    const orders = await getAllOrders();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Orders</h1>
                    <p className="text-gray-500 font-medium">Manage and track all production orders.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search orders..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-rush-dark text-sm w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Package</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4 text-right">Total</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono font-bold text-sm text-gray-900">
                                        {order.trackingNumber}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                                        <div>{order.email}</div>
                                        <div className="text-xs text-gray-400">{order.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                        {order.productName}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-800 capitalize">
                                            {order.package === 'fullpackage' ? 'Full' : order.package}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${order.status === 'completed' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right font-black text-sm">
                                        ${order.totals.total}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link href={`/admin/orders/${order.id}`} className="text-gray-400 hover:text-rush-dark block">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-medium">
                                        No orders found.
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
