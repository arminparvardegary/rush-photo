import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getOrdersByEmail } from "@/lib/server/orders";
import { ArrowUpRight, Package, ShoppingBag, Clock, CheckCircle, Sparkles, Camera, ArrowRight } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?redirect=/dashboard");
  }

  const orders = await getOrdersByEmail(session.user.email);

  const totalOrders = orders.length;
  const activeOrders = orders.filter(o => o.status === "pending" || o.status === "processing" || o.status === "pending_payment").length;
  const completedOrders = orders.filter(o => o.status === "completed" || o.status === "shipped").length;
  const totalSpent = orders.filter(o => o.status !== "pending_payment").reduce((acc, o) => acc + o.totals.total, 0);

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-[#E63946]", bg: "bg-[#E63946]/10" },
    { label: "Active", value: activeOrders, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Completed", value: completedOrders, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Spent", value: `$${totalSpent.toLocaleString()}`, icon: Sparkles, color: "text-violet-600", bg: "bg-violet-50" },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Welcome back{session.user.name ? `, ${session.user.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-500 font-medium mt-1">Here's an overview of your orders.</p>
        </div>
        <Link
          href="/order"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
        >
          <Camera className="w-4 h-4" />
          New Order
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 sm:w-5.5 sm:h-5.5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-gray-900">{stat.value}</p>
            <p className="text-xs sm:text-sm font-medium text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Ready to capture your product?</h2>
            <p className="text-gray-400 text-sm">Professional photography starts at $29 per photo.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/order"
              className="px-5 py-2.5 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors flex items-center gap-2"
            >
              Start Order
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/#packages"
              className="px-5 py-2.5 bg-white/10 backdrop-blur text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
            >
              View Packages
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm font-bold text-[#E63946] hover:text-[#D62839] flex items-center gap-1">
            View All <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile View */}
        <div className="block sm:hidden divide-y divide-gray-100">
          {recentOrders.map((order) => (
            <Link
              key={order.id}
              href={`/dashboard/orders?highlight=${order.id}`}
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono font-bold text-sm text-gray-900">{order.trackingNumber}</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold capitalize ${
                  order.status === 'completed' || order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' :
                  order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                  order.status === 'pending_payment' ? 'bg-red-100 text-red-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                  {order.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {order.package === 'fullpackage' ? 'Full Package' : order.package}
                </span>
                <span className="font-bold text-gray-900">${order.totals.total}</span>
              </div>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <div className="p-8 text-center">
              <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-3">No orders yet.</p>
              <Link href="/order" className="text-[#E63946] font-bold hover:text-[#D62839]">
                Start your first order
              </Link>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Package</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-sm text-gray-900">
                    <Link href={`/dashboard/orders?highlight=${order.id}`} className="hover:text-[#E63946]">
                      {order.trackingNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700 capitalize">
                      {order.package === 'fullpackage' ? 'Full Package' : order.package}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold capitalize ${
                      order.status === 'completed' || order.status === 'shipped' ? 'bg-emerald-100 text-emerald-700' :
                      order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'pending_payment' ? 'bg-red-100 text-red-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-sm text-gray-900">
                    ${order.totals.total}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="w-12 h-12 text-gray-300" />
                      <p>No orders yet.</p>
                      <Link
                        href="/order"
                        className="text-[#E63946] font-bold hover:text-[#D62839]"
                      >
                        Start your first order
                      </Link>
                    </div>
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
