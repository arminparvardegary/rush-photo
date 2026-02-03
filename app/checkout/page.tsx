"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import { useCartSync } from "@/hooks/useCartSync";
import { useModal } from "@/hooks/useModal";
import {
  ArrowLeft,
  Mail,
  Package as PackageIcon,
  CreditCard,
  Lock,
  Truck,
  Clock,
  Shield,
  Check,
  Loader2,
  User,
} from "lucide-react";

type CheckoutStep = "information" | "shipping" | "payment";

export default function CheckoutPage() {
  useCartSync();
  const router = useRouter();
  const { items, getCartTotal, clearCart } = useCartStore();
  const { showModal, ModalComponent } = useModal();

  const [step, setStep] = useState<CheckoutStep>("information");
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set());
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
    productName: "",
    notes: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
  });

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  // Check auth status and load profile
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            setIsLoggedIn(true);
            setFormData((prev) => ({
              ...prev,
              email: data.user.email || "",
              firstName: data.user.name?.split(" ")[0] || "",
              lastName: data.user.name?.split(" ").slice(1).join(" ") || "",
            }));

            // Load saved profile for auto-fill
            try {
              const profileRes = await fetch("/api/profile");
              if (profileRes.ok) {
                const profileData = await profileRes.json();
                if (profileData.profile) {
                  const p = profileData.profile;
                  setFormData((prev) => ({
                    ...prev,
                    phone: p.phone || prev.phone,
                    company: p.company || prev.company,
                    address: p.address || prev.address,
                    apartment: p.apartment || prev.apartment,
                    city: p.city || prev.city,
                    state: p.state || prev.state,
                    zipCode: p.zip_code || prev.zipCode,
                    country: p.country || prev.country,
                  }));
                }
              }
            } catch (profileErr) {
              console.error("Profile load failed", profileErr);
            }
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (!isLoading && items.length === 0) {
      router.push("/cart");
    }
  }, [isLoading, items, router]);

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContinue = () => {
    if (step === "information") {
      // Validate product name
      if (!formData.productName.trim()) {
        showModal({
          title: "Product Name Required",
          message: "Please enter a product name to continue with your order.",
          type: "warning",
        });
        return;
      }
      setCompletedSteps(prev => new Set(prev).add("information"));
      setStep("shipping");
    } else if (step === "shipping") {
      // Validate shipping information
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        showModal({
          title: "Name Required",
          message: "Please enter your full name for shipping.",
          type: "warning",
        });
        return;
      }
      if (!formData.address.trim()) {
        showModal({
          title: "Address Required",
          message: "Please enter your shipping address to continue.",
          type: "warning",
        });
        return;
      }
      setCompletedSteps(prev => new Set(prev).add("shipping"));
      setStep("payment");
    }
  };

  const handleBack = () => {
    if (step === "shipping") setStep("information");
    else if (step === "payment") setStep("shipping");
  };

  const startStripeCheckout = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          email: formData.email,
          name: `${formData.firstName} ${formData.lastName}`,
          phone: formData.phone,
          company: formData.company,
          productName: formData.productName,
          notes: formData.notes,
        }),
      });

      // Check if response has content
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid response from payment server");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Payment processing failed");
      }

      if (!data.url) {
        throw new Error("No payment URL received");
      }

      window.location.href = data.url;
    } catch (e: any) {
      console.error("Checkout error:", e);
      showModal({
        title: "Checkout Failed",
        message: e.message || "Unable to process payment. Please try again or contact support.",
        type: "error",
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rush-light">
        <Loader2 className="w-8 h-8 animate-spin text-[#E63946]" />
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const steps = [
    { id: "information", label: "Information", icon: Mail },
    { id: "shipping", label: "Shipping", icon: PackageIcon },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <>
      <ModalComponent />
      <div className="min-h-screen bg-rush-light">
      {/* Header */}
      <header className="bg-white border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-6 sm:h-7 w-auto">
              <Image
                src="/rushlogo.png"
                alt="Rush"
                width={120}
                height={28}
                className="h-6 sm:h-7 w-auto object-contain"
                priority
              />
            </div>
            <span className="font-bold text-xl sm:text-2xl">photos</span>
          </Link>
          <div className="flex items-center gap-2 text-rush-gray text-sm font-medium">
            <Lock className="w-4 h-4" />
            Secure Checkout
          </div>
        </div>
      </header>

      <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-6 md:py-8">
        {/* Back to Cart */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-rush-gray hover:text-rush-dark font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, idx) => {
            const isCompleted = completedSteps.has(s.id as CheckoutStep);
            const isActive = s.id === step;

            return (
              <div key={s.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (idx <= currentStepIndex) {
                      setStep(s.id as CheckoutStep);
                    }
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                    isCompleted
                      ? "bg-emerald-500 text-white hover:bg-emerald-600"
                      : isActive
                      ? "bg-[#E63946] text-white"
                      : idx < currentStepIndex
                      ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <s.icon className="w-4 h-4" />
                  )}
                  {s.label}
                </button>
                {idx < steps.length - 1 && (
                  <div className="w-8 h-px bg-gray-200 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-5 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Information Step */}
            {step === "information" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-rush-border p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#E63946]/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-[#E63946]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                </div>

                {!isLoggedIn ? (
                  /* Not Logged In - Show Sign In / Create Account */
                  <div className="space-y-4">
                    <Link
                      href={`/login?redirect=/checkout`}
                      className="w-full flex items-center justify-center gap-2 bg-[#E63946] hover:bg-[#D62839] text-white py-4 rounded-xl font-bold transition-colors"
                    >
                      <Lock className="w-4 h-4" />
                      Sign In
                    </Link>

                    <Link
                      href={`/signup?redirect=/checkout`}
                      className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-900 py-4 rounded-xl font-bold transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Create Account
                    </Link>

                    <p className="text-center text-sm text-gray-500 mt-4">
                      Sign in or create an account to continue
                    </p>
                  </div>
                ) : (
                  /* Logged In - Show User Info + Form */
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Signed in as</p>
                          <p className="font-medium text-gray-900">
                            {user?.name || "User"} ({user?.email})
                          </p>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              // Clear local state first
                              setUser(null);
                              setIsLoggedIn(false);
                              setFormData((prev) => ({
                                ...prev,
                                email: "",
                                firstName: "",
                                lastName: "",
                              }));

                              // Call logout endpoint
                              await fetch("/api/auth/logout", { method: "POST" });

                              // Redirect to home
                              window.location.href = "/";
                            } catch (error) {
                              console.error("Logout error:", error);
                              window.location.href = "/";
                            }
                          }}
                          className="text-sm text-[#E63946] hover:text-[#D62839] font-medium"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name <span className="text-[#E63946]">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.productName}
                          onChange={(e) => updateFormData("productName", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors"
                          placeholder="E.g. Wireless Headphones"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">What product will you be sending for photography?</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Order Notes <span className="text-gray-400">(Optional)</span>
                        </label>
                        <textarea
                          value={formData.notes}
                          onChange={(e) => updateFormData("notes", e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors resize-none h-24"
                          placeholder="Any special requests..."
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleContinue}
                      className="w-full bg-[#E63946] hover:bg-[#D62839] text-white py-4 rounded-xl font-bold transition-colors"
                    >
                      Continue to Shipping
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Shipping Step */}
            {step === "shipping" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-rush-border p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#E63946]/10 rounded-xl flex items-center justify-center">
                    <PackageIcon className="w-5 h-5 text-[#E63946]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name <span className="text-[#E63946]">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address <span className="text-[#E63946]">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors"
                      placeholder="Street address"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone <span className="text-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#E63946] focus:outline-none transition-colors"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-[2] bg-[#E63946] hover:bg-[#D62839] text-white py-4 rounded-xl font-bold transition-colors"
                  >
                    Continue to Payment
                  </button>
                </div>
              </motion.div>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-rush-border p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-[#E63946]/10 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-[#E63946]" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Payment</h2>
                </div>

                <div className="space-y-4 mb-6">
                  {/* Payment Options */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                          <path d="M3 8.5L12 3L21 8.5V15.5L12 21L3 15.5V8.5Z" stroke="#635BFF" strokeWidth="2"/>
                          <path d="M12 12L21 8.5" stroke="#635BFF" strokeWidth="2"/>
                          <path d="M12 12L3 8.5" stroke="#635BFF" strokeWidth="2"/>
                          <path d="M12 12V21" stroke="#635BFF" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">Stripe Secure Checkout</p>
                        <p className="text-xs text-gray-500">Multiple payment options available</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                        <CreditCard className="w-3.5 h-3.5" />
                        Credit Card
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M7 15H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Stripe Link
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        Apple Pay
                      </div>
                      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z"/>
                        </svg>
                        Google Pay
                      </div>
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Secure & Encrypted</p>
                      <p className="text-xs text-green-600">Your payment info is protected with 256-bit SSL encryption</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-4 rounded-xl font-bold transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={startStripeCheckout}
                    disabled={isSubmitting}
                    className="flex-[2] bg-[#E63946] hover:bg-[#D62839] text-white py-4 rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ${total}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-rush-border p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  // Get the appropriate image based on style/package
                  const getProductImage = () => {
                    if (item.packageType === "lifestyle") return "/images/portfolio/flowers-table.jpg";
                    if (item.packageType === "fullpackage") return "/images/portfolio/pink-bottle.jpg";
                    if (item.photoStyle === "straight-on") return "/images/portfolio/speakers.jpg";
                    if (item.photoStyle === "angled") return "/images/portfolio/sneaker.jpg";
                    return "/images/portfolio/speakers.jpg";
                  };

                  // Get display name
                  const getDisplayName = () => {
                    if (item.packageType === "lifestyle") return "Lifestyle";
                    if (item.packageType === "fullpackage") return "Full Package";
                    if (item.photoStyle) {
                      const styleName = item.photoStyle.replace("-", " ");
                      return styleName.charAt(0).toUpperCase() + styleName.slice(1);
                    }
                    return "E-Commerce";
                  };

                  // Get subtitle
                  const getSubtitle = () => {
                    if (item.selectedAngles && item.selectedAngles.length > 0) {
                      return `${item.selectedAngles.length} angles`;
                    }
                    if (item.packageType === "lifestyle") return "Styled photography";
                    if (item.packageType === "fullpackage") return "Complete package";
                    return "";
                  };

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={getProductImage()}
                          alt={getDisplayName()}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">
                          {getDisplayName()}
                        </p>
                        {getSubtitle() && (
                          <p className="text-xs text-gray-500">{getSubtitle()}</p>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">${item.price}</p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-medium text-gray-900">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 mt-4 border-t border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-[#E63946]">${total}</span>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Truck className="w-4 h-4" />
                  Free shipping on all orders
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  3-5 business days delivery
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  100% satisfaction guarantee
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
