"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ArrowRight,
  Edit3,
  Save,
  X,
  ChevronRight,
  FileImage,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  Bell,
  Settings,
  HelpCircle,
  ExternalLink,
  Copy,
  Check,
  Tag,
  Percent,
  ImagePlus,
  Layers,
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

interface PricingStyle {
  id: string;
  name: string;
  description: string;
  image: string;
  pricePerAngle: number;
}

interface PricingAngle {
  id: string;
  name: string;
  image: string;
  price: number;
}

interface PricingSettings {
  ecommerce: {
    perAngle: number;
    styles: PricingStyle[];
  };
  lifestyle: {
    flatRate: number;
  };
  fullPackageDiscount: number;
  angles: PricingAngle[];
}

const defaultPricing: PricingSettings = {
  ecommerce: {
    perAngle: 25,
    styles: [
      {
        id: "straight-on",
        name: "Straight On",
        description: "Direct front-facing shots, perfect for showcasing product details",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        pricePerAngle: 25,
      },
      {
        id: "top-down",
        name: "Top Down",
        description: "Bird's eye view photography, ideal for flat-lay compositions",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        pricePerAngle: 25,
      },
      {
        id: "angled",
        name: "Angled",
        description: "Dynamic 45° angle shots that add depth and dimension",
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
        pricePerAngle: 25,
      },
    ],
  },
  lifestyle: {
    flatRate: 149,
  },
  fullPackageDiscount: 10,
  angles: [
    { id: "front", name: "Front", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", price: 25 },
    { id: "back", name: "Back", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop", price: 25 },
    { id: "left", name: "Left Side", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop", price: 25 },
    { id: "right", name: "Right Side", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop", price: 25 },
  ],
};

export default function AdminPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "pricing" | "profile">("overview");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<any>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  
  // Pricing state
  const [pricing, setPricing] = useState<PricingSettings>(defaultPricing);
  const [pricingSaved, setPricingSaved] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const meRes = await fetch("/api/auth/me");
        if (!meRes.ok) {
          router.push("/login");
          return;
        }
        const meData = await meRes.json();
        setUser(meData.user);
        setEditedUser(meData.user);

        const [ordersRes, pricingRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/pricing"),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          setOrders(Array.isArray(ordersData.orders) ? ordersData.orders : []);
        }

        if (pricingRes.ok) {
          const pricingData = await pricingRes.json();
          if (pricingData?.pricing) setPricing(pricingData.pricing);
        }
      } catch (e) {
        console.error("Admin bootstrap failed:", e);
        router.push("/login");
      }
    };
    load();
  }, [router]);

  const handleLogout = () => {
    fetch("/api/auth/logout", { method: "POST" }).finally(() => {
      router.push("/");
    });
  };

  const handleSaveProfile = () => {
    fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editedUser?.name,
        email: editedUser?.email,
        phone: editedUser?.phone,
        company: editedUser?.company,
      }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed");
        setUser(data.user);
        setEditedUser(data.user);
        setIsEditing(false);
      })
      .catch((e) => {
        console.error("Save profile failed:", e);
      });
  };

  const handleSavePricing = () => {
    fetch("/api/pricing", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pricing }),
    })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed");
        setPricingSaved(true);
        setTimeout(() => setPricingSaved(false), 3000);
      })
      .catch((e) => {
        console.error("Save pricing failed:", e);
      });
  };

  const updateStylePrice = (styleId: string, price: number) => {
    setPricing(prev => ({
      ...prev,
      ecommerce: {
        ...prev.ecommerce,
        styles: prev.ecommerce.styles.map(style => 
          style.id === styleId ? { ...style, pricePerAngle: price } : style
        ),
      },
    }));
  };

  const updateAnglePrice = (angleId: string, price: number) => {
    setPricing(prev => ({
      ...prev,
      angles: prev.angles.map(angle => 
        angle.id === angleId ? { ...angle, price } : angle
      ),
    }));
  };

  const copyTracking = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedTracking(tracking);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-teal/20 text-teal border-teal/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-honey/20 text-honey border-honey/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const stats = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "from-honey to-honey/80",
      bgColor: "bg-honey/20",
    },
    {
      label: "In Progress",
      value: orders.filter((o) => o.status === "processing").length,
      icon: Clock,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-500/20",
    },
    {
      label: "Completed",
      value: orders.filter((o) => o.status === "completed").length,
      icon: CheckCircle,
      color: "from-teal to-teal/80",
      bgColor: "bg-teal/20",
    },
    {
      label: "Total Spent",
      value: `$${orders.reduce((sum, o) => sum + o.total, 0)}`,
      icon: DollarSign,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-500/20",
    },
  ];

  const isAdmin = user?.role === "admin";

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-honey border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "orders", label: "Orders", icon: ShoppingBag },
    ...(isAdmin ? [{ id: "pricing", label: "Pricing", icon: DollarSign }] : []),
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      
      {/* Header */}
      <header className="bg-[#1a1a1a]/80 backdrop-blur-lg border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-honey to-honey/80 rounded-xl flex items-center justify-center shadow-lg shadow-honey/20 group-hover:shadow-honey/30 transition-shadow">
                <span className="text-black font-bold text-lg">R</span>
              </div>
              <div>
                <span className="text-white font-bold text-lg">Rush</span>
                <span className="text-honey font-bold text-lg">.photo</span>
              </div>
            </Link>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-white">{user.name || user.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-white/50">
                  {isAdmin ? 'Admin Dashboard' : 'Customer Dashboard'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-honey/20 hover:border-honey/30 text-white/70 hover:text-honey transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-2xl p-2 inline-flex border border-white/10 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-honey to-honey/90 text-black shadow-lg shadow-honey/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-honey/20 to-teal/10 rounded-3xl p-8 text-white relative overflow-hidden border border-white/10">
              <div className="absolute right-0 top-0 w-64 h-64 bg-honey/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute right-20 bottom-0 w-32 h-32 bg-teal/10 rounded-full translate-y-1/2" />
              <div className="relative z-10">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || user.email?.split('@')[0] || 'User'}! 👋</h1>
                <p className="text-white/60 mb-6">Here&apos;s what&apos;s happening with your photo orders.</p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-honey/20 transition-all"
                >
                  <Camera className="w-5 h-5" />
                  New Order
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <stat.icon className="w-7 h-7 text-black" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                  <p className="text-sm text-white/50">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Orders</h2>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-sm text-honey font-medium hover:underline flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {orders.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <FileImage className="w-10 h-10 text-white/20" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                  <p className="text-white/50 mb-6 max-w-sm mx-auto">
                    Start your first professional product photo shoot today and elevate your brand.
                  </p>
                  <Link
                    href="/order"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-honey/20 transition-all"
                  >
                    <Sparkles className="w-5 h-5" />
                    Place Your First Order
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-white/10">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="p-5 hover:bg-white/5 transition-colors flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-honey/10 rounded-2xl flex items-center justify-center">
                          <Camera className="w-6 h-6 text-honey" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{order.productName}</p>
                          <p className="text-sm text-white/50 flex items-center gap-2">
                            <span className="font-mono">{order.trackingNumber}</span>
                            <button
                              onClick={() => copyTracking(order.trackingNumber)}
                              className="p-1 rounded hover:bg-white/10 transition-colors"
                            >
                              {copiedTracking === order.trackingNumber ? (
                                <Check className="w-3 h-3 text-teal" />
                              ) : (
                                <Copy className="w-3 h-3 text-white/30" />
                              )}
                            </button>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <p className="font-bold text-honey min-w-[60px] text-right">${order.total}</p>
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-honey"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className={`grid gap-4 ${isAdmin ? 'sm:grid-cols-4' : 'sm:grid-cols-3'}`}>
              <Link href="/order" className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-honey/30 hover:bg-honey/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-honey/20 flex items-center justify-center mb-4 group-hover:bg-honey transition-colors">
                  <Camera className="w-6 h-6 text-honey group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-1">New Photo Order</h3>
                <p className="text-sm text-white/50">Start a new product photo shoot</p>
              </Link>
              {isAdmin && (
                <button onClick={() => setActiveTab("pricing")} className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-honey/30 hover:bg-honey/5 transition-all group text-left">
                  <div className="w-12 h-12 rounded-xl bg-honey/20 flex items-center justify-center mb-4 group-hover:bg-honey transition-colors">
                    <DollarSign className="w-6 h-6 text-honey group-hover:text-black transition-colors" />
                  </div>
                  <h3 className="font-bold text-white mb-1">Manage Pricing</h3>
                  <p className="text-sm text-white/50">Set product prices</p>
                </button>
              )}
              <Link href="/#faq" className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-teal/30 hover:bg-teal/5 transition-all group">
                <div className="w-12 h-12 rounded-xl bg-teal/20 flex items-center justify-center mb-4 group-hover:bg-teal transition-colors">
                  <HelpCircle className="w-6 h-6 text-teal group-hover:text-black transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-1">Help & FAQ</h3>
                <p className="text-sm text-white/50">Get answers to common questions</p>
              </Link>
              <button onClick={() => setActiveTab("profile")} className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group text-left">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
                  <Settings className="w-6 h-6 text-purple-400 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-white mb-1">Account Settings</h3>
                <p className="text-sm text-white/50">Manage your profile</p>
              </button>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Orders</h2>
              <Link
                href="/order"
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-honey/20 transition-all"
              >
                <Camera className="w-4 h-4" />
                New Order
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                  <FileImage className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No orders yet</h3>
                <p className="text-white/50 mb-6">Start your first professional product photo shoot today.</p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-lg transition-all"
                >
                  Place Your First Order
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden hover:border-white/20 transition-all"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 bg-honey/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Camera className="w-8 h-8 text-honey" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white mb-1">{order.productName}</h3>
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-white/50">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                Est. {order.estimatedDelivery}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-4 py-2 rounded-full text-sm font-medium border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                          <p className="text-2xl font-bold text-honey">${order.total}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-between pt-4 border-t border-white/10 gap-4">
                        <div>
                          <p className="text-xs text-white/40 mb-1">Tracking Number</p>
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-semibold text-white">{order.trackingNumber}</code>
                            <button
                              onClick={() => copyTracking(order.trackingNumber)}
                              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                            >
                              {copiedTracking === order.trackingNumber ? (
                                <Check className="w-4 h-4 text-teal" />
                              ) : (
                                <Copy className="w-4 h-4 text-white/30" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2 border border-white/10"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          {order.status === "completed" && (
                            <button className="px-4 py-2.5 bg-gradient-to-r from-honey to-honey/90 text-black rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-honey/20 transition-all flex items-center gap-2">
                              <Download className="w-4 h-4" />
                              Download Photos
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Pricing Tab (Admin Only) */}
        {activeTab === "pricing" && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Pricing Management</h2>
                <p className="text-white/50">Set prices for all photography packages and styles</p>
              </div>
              <button
                onClick={handleSavePricing}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                  pricingSaved 
                    ? 'bg-teal text-black' 
                    : 'bg-gradient-to-r from-honey to-honey/90 text-black hover:shadow-lg hover:shadow-honey/20'
                }`}
              >
                {pricingSaved ? (
                  <>
                    <Check className="w-5 h-5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* E-commerce Styles Pricing */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-honey/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-honey flex items-center justify-center">
                    <Camera className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">E-commerce Photography Styles</h3>
                    <p className="text-sm text-white/50">Set price per angle for each style</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-3 gap-6">
                  {pricing.ecommerce.styles.map((style) => (
                    <div key={style.id} className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                      <div className="aspect-video relative">
                        <img src={style.image} alt={style.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <h4 className="absolute bottom-3 left-3 text-white font-bold text-lg">{style.name}</h4>
                      </div>
                      <div className="p-4 bg-[#0d0d0d]">
                        <p className="text-sm text-white/50 mb-3">{style.description}</p>
                        <div>
                          <label className="block text-xs text-white/50 mb-1">Price per angle</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                            <input
                              type="number"
                              value={style.pricePerAngle}
                              onChange={(e) => updateStylePrice(style.id, Number(e.target.value))}
                              className="w-full pl-9 pr-4 py-3 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all font-bold text-lg"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Angles Pricing */}
            <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10 bg-teal/5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal flex items-center justify-center">
                    <Layers className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Angle Options</h3>
                    <p className="text-sm text-white/50">Individual pricing for each shooting angle</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pricing.angles.map((angle) => (
                    <div key={angle.id} className="border border-white/10 rounded-2xl p-4 hover:border-white/20 transition-all bg-[#0d0d0d]">
                      <div className="w-20 h-20 rounded-xl overflow-hidden mx-auto mb-3">
                        <img src={angle.image} alt={angle.name} className="w-full h-full object-cover" />
                      </div>
                      <h4 className="font-bold text-white text-center mb-3">{angle.name}</h4>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 font-bold">$</span>
                        <input
                          type="number"
                          value={angle.price}
                          onChange={(e) => updateAnglePrice(angle.id, Number(e.target.value))}
                          className="w-full pl-8 pr-4 py-2.5 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all font-bold text-center"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lifestyle & Package Pricing */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Lifestyle Pricing */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-purple-500/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Lifestyle Photography</h3>
                      <p className="text-sm text-white/50">Flat rate for styled shoots</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">Flat Rate Price</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-xl">$</span>
                    <input
                      type="number"
                      value={pricing.lifestyle.flatRate}
                      onChange={(e) => setPricing(prev => ({
                        ...prev,
                        lifestyle: { flatRate: Number(e.target.value) }
                      }))}
                      className="w-full pl-10 pr-4 py-4 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-purple-500 focus:bg-white/10 focus:outline-none transition-all font-bold text-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Full Package Discount */}
              <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10 bg-honey/5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-honey flex items-center justify-center">
                      <Percent className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Full Package Discount</h3>
                      <p className="text-sm text-white/50">Bundle discount percentage</p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <label className="block text-sm font-medium text-white/70 mb-2">Discount Percentage</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={pricing.fullPackageDiscount}
                      onChange={(e) => setPricing(prev => ({
                        ...prev,
                        fullPackageDiscount: Number(e.target.value)
                      }))}
                      className="w-full pl-4 pr-10 py-4 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all font-bold text-2xl"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 font-bold text-xl">%</span>
                  </div>
                  <p className="text-sm text-white/40 mt-2">Applied when customers choose the Full Package</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <div className="bg-[#1a1a1a] rounded-3xl border border-white/10 overflow-hidden">
              <div className="p-8 border-b border-white/10 bg-honey/5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-20 h-20 bg-gradient-to-br from-honey to-honey/80 rounded-2xl flex items-center justify-center shadow-lg shadow-honey/20">
                      <User className="w-10 h-10 text-black" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{user.name || user.email?.split('@')[0] || 'User'}</h2>
                      <p className="text-white/50">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-honey/20 text-honey rounded-full text-xs font-medium mt-1">
                          <Settings className="w-3 h-3" />
                          Admin
                        </span>
                      )}
                    </div>
                  </div>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors border border-white/10"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="p-8 space-y-6">
                {isEditing ? (
                  <>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
                        <input
                          type="text"
                          value={editedUser.name || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Email</label>
                        <input
                          type="email"
                          value={editedUser.email || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editedUser.phone || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all"
                          placeholder="Enter your phone"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/70 mb-2">Company</label>
                        <input
                          type="text"
                          value={editedUser.company || ''}
                          onChange={(e) => setEditedUser({ ...editedUser, company: e.target.value })}
                          className="w-full px-4 py-3 bg-white/5 border-2 border-transparent rounded-xl text-white focus:border-honey focus:bg-white/10 focus:outline-none transition-all"
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-honey/20 transition-all"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditedUser(user);
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-colors border border-white/10"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <User className="w-5 h-5 text-white/40" />
                        <span className="text-sm text-white/50">Full Name</span>
                      </div>
                      <p className="font-medium text-white pl-8">{user.name || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <Mail className="w-5 h-5 text-white/40" />
                        <span className="text-sm text-white/50">Email</span>
                      </div>
                      <p className="font-medium text-white pl-8">{user.email}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <Phone className="w-5 h-5 text-white/40" />
                        <span className="text-sm text-white/50">Phone</span>
                      </div>
                      <p className="font-medium text-white pl-8">{user.phone || 'Not set'}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-1">
                        <Package className="w-5 h-5 text-white/40" />
                        <span className="text-sm text-white/50">Account Type</span>
                      </div>
                      <p className="font-medium text-white pl-8 capitalize">{user.role || 'Customer'}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#1a1a1a] border border-white/10 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#1a1a1a] rounded-t-3xl">
                <h3 className="text-xl font-bold text-white">Order Details</h3>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-honey/10 rounded-2xl flex items-center justify-center">
                    <Camera className="w-8 h-8 text-honey" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{selectedOrder.productName}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border inline-flex items-center gap-1 mt-1 ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Tracking Number</p>
                    <p className="font-mono font-semibold text-white">{selectedOrder.trackingNumber}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Package Type</p>
                    <p className="font-semibold text-white capitalize">{selectedOrder.package}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Order Date</p>
                    <p className="font-semibold text-white">
                      {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                    <p className="text-xs text-white/50 mb-1">Est. Delivery</p>
                    <p className="font-semibold text-white">{selectedOrder.estimatedDelivery}</p>
                  </div>
                </div>

                {selectedOrder.styles && selectedOrder.styles.length > 0 && (
                  <div>
                    <p className="text-sm text-white/50 mb-2">Styles Included</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedOrder.styles.map((style) => (
                        <span key={style} className="px-3 py-1.5 bg-honey/20 text-honey rounded-full text-sm font-medium">
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 bg-honey/10 rounded-xl border border-honey/30 flex items-center justify-between">
                  <span className="font-medium text-white">Total Amount</span>
                  <span className="text-2xl font-bold text-honey">${selectedOrder.total}</span>
                </div>

                {selectedOrder.status === "completed" && (
                  <button className="w-full py-4 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-xl hover:shadow-lg hover:shadow-honey/20 transition-all flex items-center justify-center gap-2">
                    <Download className="w-5 h-5" />
                    Download All Photos
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
