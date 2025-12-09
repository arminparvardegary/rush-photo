"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Package,
  Camera,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  LogOut,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Image as ImageIcon,
} from "lucide-react";
import Link from "next/link";

interface Order {
  id: string;
  trackingNumber: string;
  package: string;
  styles: string[];
  status: "pending" | "processing" | "completed" | "shipped";
  createdAt: string;
  estimatedDelivery: string;
  total: number;
  productName: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "profile">("overview");

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user");
    if (!userData) {
      router.push("/login");
      return;
    }
    setUser(JSON.parse(userData));

    // Load orders from localStorage (in production, fetch from API)
    const savedOrders = localStorage.getItem("orders");
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: Package,
      color: "from-[#E54A4A] to-[#ff7f7f]",
    },
    {
      label: "In Progress",
      value: orders.filter((o) => o.status === "processing").length,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Spent",
      value: `$${orders.reduce((sum, o) => sum + o.total, 0)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
    },
  ];

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6]">
      {/* Header */}
      <header className="bg-white border-b border-[#1a1a1a]/10 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <div>
                <span className="text-[#1a1a1a] font-bold">Rush</span>
                <span className="text-[#E54A4A] font-bold">.photo</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-[#1a1a1a]">{user.name || user.email}</p>
                <p className="text-xs text-[#1a1a1a]/60">Customer Dashboard</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-[#1a1a1a]/5 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-[#1a1a1a]/60" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white rounded-xl p-2 inline-flex">
          {[
            { id: "overview", label: "Overview", icon: Package },
            { id: "orders", label: "Orders", icon: Camera },
            { id: "profile", label: "Profile", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white shadow-lg"
                  : "text-[#1a1a1a]/60 hover:text-[#1a1a1a]"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-[#1a1a1a] mb-1">{stat.value}</p>
                  <p className="text-sm text-[#1a1a1a]/60">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Recent Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-[#1a1a1a]/20 mx-auto mb-4" />
                  <p className="text-[#1a1a1a]/60 mb-4">No orders yet</p>
                  <Link
                    href="/order"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                  >
                    Place Your First Order
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 bg-[#FFFAF5] rounded-xl hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center">
                          <Camera className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#1a1a1a]">{order.productName}</p>
                          <p className="text-sm text-[#1a1a1a]/60">Tracking: {order.trackingNumber}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-sm text-[#1a1a1a]/60 mt-1">${order.total}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">All Orders</h2>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-[#1a1a1a]/20 mx-auto mb-4" />
                <p className="text-[#1a1a1a]/60 mb-4">No orders yet</p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Place Your First Order
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-[#1a1a1a]/10 rounded-xl p-6 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-[#1a1a1a] mb-2">{order.productName}</h3>
                        <div className="flex items-center gap-4 text-sm text-[#1a1a1a]/60">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            Est. {order.estimatedDelivery}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                        <p className="text-xl font-bold text-[#E54A4A] mt-2">${order.total}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]/10">
                      <div>
                        <p className="text-sm text-[#1a1a1a]/60 mb-1">Tracking Number</p>
                        <p className="font-mono font-semibold text-[#1a1a1a]">{order.trackingNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-4 py-2 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                        {order.status === "completed" && (
                          <button className="px-4 py-2 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-6"
          >
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-6">Profile Information</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-[#1a1a1a]/10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-full flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div>
                  <p className="text-xl font-bold text-[#1a1a1a]">{user.name || "User"}</p>
                  <p className="text-sm text-[#1a1a1a]/60">{user.email}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Full Name</label>
                  <div className="flex items-center gap-3 p-4 bg-[#FFFAF5] rounded-xl">
                    <User className="w-5 h-5 text-[#1a1a1a]/40" />
                    <span className="text-[#1a1a1a]">{user.name || "Not set"}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Email</label>
                  <div className="flex items-center gap-3 p-4 bg-[#FFFAF5] rounded-xl">
                    <Mail className="w-5 h-5 text-[#1a1a1a]/40" />
                    <span className="text-[#1a1a1a]">{user.email}</span>
                  </div>
                </div>

                {user.phone && (
                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Phone</label>
                    <div className="flex items-center gap-3 p-4 bg-[#FFFAF5] rounded-xl">
                      <Phone className="w-5 h-5 text-[#1a1a1a]/40" />
                      <span className="text-[#1a1a1a]">{user.phone}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">Account Type</label>
                  <div className="flex items-center gap-3 p-4 bg-[#FFFAF5] rounded-xl">
                    <Package className="w-5 h-5 text-[#1a1a1a]/40" />
                    <span className="text-[#1a1a1a] capitalize">{user.role || "Customer"}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#1a1a1a]/10">
                <button className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-xl hover:shadow-lg transition-all">
                  Edit Profile
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

