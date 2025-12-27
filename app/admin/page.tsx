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
  Settings,
  HelpCircle,
  Copy,
  Check,
  Layers,
  Percent,
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
      <div className="min-h-screen bg-ink flex items-center justify-center">
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
    <div className="min-h-screen bg-ink relative">
      <div className="fixed inset-0 bg-grain opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-honey to-honey-dark flex items-center justify-center shadow-lg shadow-honey/20 group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-ink" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-white tracking-tight">Rush</span>
                <span className="text-[10px] font-medium text-mist tracking-[0.2em]">DASHBOARD</span>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <div className="hidden sm:block text-right">
                <p className="font-semibold text-white text-sm">{user.name || user.email?.split('@')[0] || 'User'}</p>
                <p className="text-xs text-mist">
                  {isAdmin ? 'Admin Dashboard' : 'Customer Account'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-mist hover:text-white transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-charcoal/50 backdrop-blur-sm rounded-2xl p-1.5 inline-flex border border-white/5 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id
                  ? "bg-gradient-to-r from-honey to-honey-dark text-ink shadow-lg shadow-honey/20"
                  : "text-mist hover:text-white hover:bg-white/5"
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
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-dark p-8 md:p-12">
              <div className="absolute right-0 top-0 w-80 h-80 bg-honey/10 rounded-full blur-[80px]" />
              <div className="relative z-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Welcome back, {user.name || 'User'}! 👋</h1>
                <p className="text-mist mb-8 max-w-xl text-lg">Your production status, orders, and account details in one place.</p>
                <Link
                  href="/order"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-honey text-ink font-bold rounded-xl hover:bg-honey-light hover:scale-105 transition-all shadow-lg shadow-honey/20"
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
                  className="bg-charcoal rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                    <stat.icon className="w-6 h-6 text-ink" />
                  </div>
                  <p className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</p>
                  <p className="text-sm text-mist font-medium uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-charcoal rounded-3xl border border-white/5 overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">Recent Activity</h2>
                {orders.length > 0 && (
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-sm text-honey font-bold hover:underline flex items-center gap-1"
                  >
                    View All
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              {orders.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <FileImage className="w-10 h-10 text-white/10" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">No active orders</h3>
                  <p className="text-mist mb-6 max-w-sm mx-auto">
                    Your recent project activity will appear here.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6 text-mist" />
                        </div>
                        <div>
                          <p className="font-bold text-white mb-0.5">{order.productName}</p>
                          <p className="text-xs text-mist flex items-center gap-2">
                            <span className="font-mono text-white/40">{order.trackingNumber}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </span>
                        <div className="text-right">
                          <p className="text-sm font-bold text-white">${order.total}</p>
                          <p className="text-xs text-mist">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { title: "New Order", icon: Camera, desc: "Start a product shoot", href: "/order" },
                { title: "Help & FAQ", icon: HelpCircle, desc: "Get support", href: "/#faq" },
                ...(isAdmin ? [{ title: "Pricing", icon: DollarSign, desc: "Manage rates", action: () => setActiveTab("pricing") }] : []),
                { title: "Settings", icon: Settings, desc: "Update profile", action: () => setActiveTab("profile") }
              ].map((action: any, i) => {
                const Content = (
                  <div className="bg-charcoal p-6 rounded-2xl border border-white/5 hover:border-honey/20 hover:bg-white/[0.02] transition-all group h-full">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-honey text-mist group-hover:text-ink transition-colors">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{action.title}</h3>
                    <p className="text-xs text-mist">{action.desc}</p>
                  </div>
                );

                return action.href ? (
                  <Link key={i} href={action.href} className="block">{Content}</Link>
                ) : (
                  <button key={i} onClick={action.action} className="text-left w-full h-full">{Content}</button>
                );
              })}
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
              <h2 className="text-2xl font-bold text-white">Order History</h2>
              <Link
                href="/order"
                className="flex items-center gap-2 px-5 py-2.5 bg-honey text-ink font-bold rounded-xl hover:bg-honey-light transition-all text-sm"
              >
                <Camera className="w-4 h-4" />
                New Order
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="bg-charcoal rounded-3xl border border-white/5 p-12 text-center">
                <p className="text-mist">No orders found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-charcoal rounded-2xl p-6 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Package className="w-8 h-8 text-white/20" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">{order.productName}</h3>
                        <div className="flex items-center gap-3 text-sm text-mist mt-1">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span>•</span>
                          <span className="font-mono">{order.trackingNumber}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                      <p className="text-xl font-bold text-white min-w-[80px] text-right">${order.total}</p>
                    </div>
                  </div>
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
                <h2 className="text-2xl font-bold text-white">Global Pricing</h2>
                <p className="text-mist text-sm">Update prices across the platform</p>
              </div>
              <button
                onClick={handleSavePricing}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${pricingSaved
                    ? 'bg-teal text-ink'
                    : 'bg-honey text-ink hover:bg-honey-light'
                  }`}
              >
                {pricingSaved ? (
                  <>
                    <Check className="w-4 h-4" />
                    Saved
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>

            {/* Simple input fields refactored with new styling */}
            <div className="bg-charcoal rounded-3xl border border-white/5 p-8">
              <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <Camera className="w-5 h-5 text-honey" /> E-commerce Rates
              </h3>
              <div className="grid sm:grid-cols-3 gap-6">
                {pricing.ecommerce.styles.map((style) => (
                  <div key={style.id} className="p-4 rounded-xl bg-ink border border-white/5">
                    <p className="text-sm font-bold text-white mb-1">{style.name}</p>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist">$</span>
                      <input
                        type="number"
                        value={style.pricePerAngle}
                        onChange={(e) => updateStylePrice(style.id, Number(e.target.value))}
                        className="w-full bg-charcoal rounded-lg py-2 pl-7 pr-3 text-white font-bold border border-white/10 focus:border-honey focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="bg-charcoal rounded-3xl border border-white/5 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Settings</h2>
              <div className="space-y-6">
                {[
                  { label: "Full Name", field: "name", type: "text" },
                  { label: "Email Address", field: "email", type: "email" },
                  { label: "Phone Number", field: "phone", type: "tel" },
                  { label: "Company", field: "company", type: "text" }
                ].map((item) => (
                  <div key={item.field}>
                    <label className="block text-xs font-bold text-mist uppercase tracking-wider mb-2">{item.label}</label>
                    <input
                      type={item.type}
                      value={editedUser?.[item.field] || ""}
                      onChange={(e) => setEditedUser({ ...editedUser, [item.field]: e.target.value })}
                      disabled={!isEditing}
                      className="w-full bg-ink border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-honey disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </div>
                ))}

                <div className="flex justify-end gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <button onClick={() => setIsEditing(false)} className="px-6 py-2.5 rounded-xl border border-white/10 text-white font-bold hover:bg-white/5">Cancel</button>
                      <button onClick={handleSaveProfile} className="px-6 py-2.5 rounded-xl bg-honey text-ink font-bold hover:bg-honey-light">Save Changes</button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="px-6 py-2.5 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 border border-white/5">Edit Profile</button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
