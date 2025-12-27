"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ShoppingCart,
  Camera,
  Sparkles,
  Package,
  Info,
  X,
  Mail,
  Phone,
  User,
  Send,
  CheckCircle,
  Clock,
  Copy,
  ChevronRight,
  ChevronDown,
  Shield,
  Lock,
  Tag,
  CreditCard,
  Heart,
  Star,
  Zap
} from "lucide-react";
import { StepProgress } from "@/components/ui/ProgressBar";

// Types
type PackageType = "ecommerce" | "lifestyle" | "fullpackage" | null;
type EcommerceStyle = "straight-on" | "top-down" | "angled";
type Angle = "front" | "back" | "left" | "right";
type CheckoutStep = "information" | "shipping" | "payment";

interface CartItem {
  style: EcommerceStyle;
  angles: Angle[];
  pricePerAngle: number;
}

interface OrderState {
  packageType: PackageType;
  cart: CartItem[];
  lifestyleIncluded: boolean;
  formData: {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    company: string;
    productName: string;
    notes: string;
    address: string;
    apartment: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

// Default Pricing (will be overridden by admin settings)
const DEFAULT_PRICES = {
  ecommerce: {
    perAngle: 25,
  },
  lifestyle: {
    flatRate: 149,
  },
  fullPackageDiscount: 0.1,
};

// Package images
const PACKAGE_IMAGES = {
  ecommerce: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
  lifestyle: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80",
  fullpackage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
};

// Default Style info (will be overridden by admin settings)
const DEFAULT_ECOMMERCE_STYLES: { id: EcommerceStyle; name: string; description: string; image: string; pricePerAngle: number }[] = [
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
];

const DEFAULT_ANGLES: { id: Angle; name: string; image: string; price: number }[] = [
  { id: "front", name: "Front", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop", price: 25 },
  { id: "back", name: "Back", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop", price: 25 },
  { id: "left", name: "Left Side", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop", price: 25 },
  { id: "right", name: "Right Side", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop", price: 25 },
];

export default function OrderPage() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>("information");
  const [order, setOrder] = useState<OrderState>({
    packageType: null,
    cart: [],
    lifestyleIncluded: false,
    formData: {
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
    },
  });
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(null);
  const [currentStyle, setCurrentStyle] = useState<EcommerceStyle | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Angle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [confirmedTotal, setConfirmedTotal] = useState<number | null>(null);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
    minSubtotal?: number;
  } | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  // User state
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Dynamic pricing state
  const [PRICES, setPRICES] = useState(DEFAULT_PRICES);
  const [ECOMMERCE_STYLES, setECOMMERCE_STYLES] = useState(DEFAULT_ECOMMERCE_STYLES);
  const [ANGLES, setANGLES] = useState(DEFAULT_ANGLES);

  // Load pricing from API on mount
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/pricing");
        if (!res.ok) return;
        const data = await res.json();
        const pricing = data?.pricing;
        if (!pricing) return;
        setPRICES({
          ecommerce: { perAngle: pricing.ecommerce?.perAngle || 25 },
          lifestyle: { flatRate: pricing.lifestyle?.flatRate || 149 },
          fullPackageDiscount: (pricing.fullPackageDiscount || 10) / 100,
        });
        if (pricing.ecommerce?.styles) setECOMMERCE_STYLES(pricing.ecommerce.styles);
        if (pricing.angles) setANGLES(pricing.angles);
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    };
    load();
  }, []);

  // Handle URL package parameter - run only once on mount
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (hasInitialized) return;

    const packageParam = searchParams.get("package");
    if (packageParam && ["ecommerce", "lifestyle", "fullpackage"].includes(packageParam)) {
      const type = packageParam as PackageType;

      if (type === "fullpackage") {
        // Full package: automatically include ALL styles with ALL angles
        const allAngles: Angle[] = ["front", "back", "left", "right"];
        const fullCart: CartItem[] = ECOMMERCE_STYLES.map(style => ({
          style: style.id,
          angles: allAngles,
          pricePerAngle: style.pricePerAngle || PRICES.ecommerce.perAngle,
        }));

        setOrder(prev => ({
          ...prev,
          packageType: type,
          lifestyleIncluded: true,
          cart: fullCart,
        }));
        setSelectedPackage(type);
        setStep(4);
        setCheckoutStep("information");
      } else {
        setOrder(prev => ({
          ...prev,
          packageType: type,
          lifestyleIncluded: type === "lifestyle",
        }));
        setSelectedPackage(type);

        if (type === "lifestyle") {
          setStep(4);
        } else {
          setStep(2);
        }
      }

      setHasInitialized(true);
    }
  }, [searchParams, hasInitialized, ECOMMERCE_STYLES, PRICES.ecommerce.perAngle]);

  // Load user data and pre-fill form (via API session), and restore checkout state after login redirects
  useEffect(() => {
    // Restore checkout after login redirect
    const returnToCheckout = localStorage.getItem("returnToCheckout");
    if (returnToCheckout) {
      try {
        const savedOrder = JSON.parse(returnToCheckout);
        setOrder(savedOrder.order);
        setStep(savedOrder.step);
        setCheckoutStep(savedOrder.checkoutStep);
        localStorage.removeItem("returnToCheckout");
      } catch (e) {
        console.error("Error restoring checkout:", e);
      }
    }

    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        const parsedUser = data?.user;
        if (!parsedUser) return;
        setUser(parsedUser);
        setIsLoggedIn(true);

        // Pre-fill form data from user info (without overwriting existing)
        setOrder((prev) => ({
          ...prev,
          formData: {
            ...prev.formData,
            email: parsedUser.email || prev.formData.email,
            firstName: parsedUser.name?.split(" ")[0] || prev.formData.firstName,
            lastName: parsedUser.name?.split(" ").slice(1).join(" ") || prev.formData.lastName,
            phone: parsedUser.phone || prev.formData.phone,
            company: parsedUser.company || prev.formData.company,
          },
        }));
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };
    loadUser();
  }, []);

  // Save order state before redirecting to login
  const handleLoginRedirect = () => {
    localStorage.setItem("returnToCheckout", JSON.stringify({
      order,
      step,
      checkoutStep,
    }));
    window.location.href = "/login?redirect=/order";
  };

  const calculateItemsSubtotal = () => {
    let subtotal = 0;
    order.cart.forEach((item) => {
      subtotal += item.angles.length * item.pricePerAngle;
    });
    if (order.lifestyleIncluded) subtotal += PRICES.lifestyle.flatRate;
    return Math.round(subtotal);
  };

  const calculateBundleDiscount = (itemsSubtotal: number) => {
    if (order.packageType === "fullpackage" && order.cart.length > 0) {
      return Math.round(itemsSubtotal * PRICES.fullPackageDiscount);
    }
    return 0;
  };

  const calculatePromoDiscount = (subtotalAfterBundle: number) => {
    if (!appliedPromo) return 0;
    if (appliedPromo.minSubtotal && subtotalAfterBundle < appliedPromo.minSubtotal) return 0;
    if (appliedPromo.type === "percent") {
      return Math.round(subtotalAfterBundle * (appliedPromo.value / 100));
    }
    return Math.round(appliedPromo.value);
  };

  const calculateBreakdown = () => {
    const itemsSubtotal = calculateItemsSubtotal();
    const bundleDiscount = calculateBundleDiscount(itemsSubtotal);
    const afterBundle = Math.max(0, itemsSubtotal - bundleDiscount);
    const promoDiscount = calculatePromoDiscount(afterBundle);
    const total = Math.max(0, Math.round(afterBundle - promoDiscount));
    return { itemsSubtotal, bundleDiscount, promoDiscount, total };
  };

  const calculateTotal = () => calculateBreakdown().total;

  const getTotalAngles = () => {
    return order.cart.reduce((acc, item) => acc + item.angles.length, 0);
  };

  const getTotalItems = () => {
    let count = order.cart.length;
    if (order.lifestyleIncluded) count++;
    return count;
  };

  const selectPackageType = (type: PackageType) => {
    if (type === "fullpackage") {
      // Full package: automatically include ALL styles with ALL angles
      const allAngles: Angle[] = ["front", "back", "left", "right"];
      const fullCart: CartItem[] = ECOMMERCE_STYLES.map(style => ({
        style: style.id,
        angles: allAngles,
        pricePerAngle: style.pricePerAngle || PRICES.ecommerce.perAngle,
      }));

      setOrder(prev => ({
        ...prev,
        packageType: type,
        lifestyleIncluded: true,
        cart: fullCart,
      }));
      setSelectedPackage(type);
      setStep(4); // Go directly to checkout
      setCheckoutStep("information");
    } else {
      setOrder(prev => ({
        ...prev,
        packageType: type,
        lifestyleIncluded: type === "lifestyle",
        cart: [], // Reset cart for other package types
      }));
      setSelectedPackage(type);
      if (type === "lifestyle") {
        setStep(4);
      } else {
        setStep(2);
      }
    }
  };

  const selectStyle = (style: EcommerceStyle) => {
    // If clicking the same style, deselect it
    if (currentStyle === style) {
      setCurrentStyle(null);
      setSelectedAngles([]);
    } else {
      setCurrentStyle(style);
      setSelectedAngles([]);
    }
    // Stay on step 2, show angles inline
  };

  const toggleAngle = (angle: Angle) => {
    setSelectedAngles(prev =>
      prev.includes(angle)
        ? prev.filter(a => a !== angle)
        : [...prev, angle]
    );
  };

  const addToCart = () => {
    if (currentStyle && selectedAngles.length > 0) {
      const styleConfig = ECOMMERCE_STYLES.find(s => s.id === currentStyle);
      const pricePerAngle = styleConfig?.pricePerAngle || PRICES.ecommerce.perAngle;

      const existingIndex = order.cart.findIndex(item => item.style === currentStyle);
      if (existingIndex >= 0) {
        const newCart = [...order.cart];
        newCart[existingIndex].angles = selectedAngles;
        newCart[existingIndex].pricePerAngle = pricePerAngle;
        setOrder(prev => ({ ...prev, cart: newCart }));
      } else {
        setOrder(prev => ({
          ...prev,
          cart: [...prev.cart, {
            style: currentStyle,
            angles: selectedAngles,
            pricePerAngle: pricePerAngle,
          }],
        }));
      }
      setCurrentStyle(null);
      setSelectedAngles([]);
      setStep(2);
      setShowMiniCart(true);
      setTimeout(() => setShowMiniCart(false), 3000);
    }
  };

  const removeFromCart = (style: EcommerceStyle) => {
    setOrder(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.style !== style),
    }));
  };

  const updateFormData = (field: keyof OrderState["formData"], value: string) => {
    setOrder(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  };

  const getStyleName = (id: EcommerceStyle) => {
    return ECOMMERCE_STYLES.find(s => s.id === id)?.name || id;
  };

  const validateCheckoutStep = (step: CheckoutStep) => {
    const newErrors: Record<string, string> = {};

    if (step === "information") {
      if (!order.formData.email.trim()) newErrors.email = "Required";
      else if (!/\S+@\S+\.\S+/.test(order.formData.email)) newErrors.email = "Invalid email";
      if (!order.formData.productName.trim()) newErrors.productName = "Required";
    }

    if (step === "shipping") {
      if (!order.formData.firstName.trim()) newErrors.firstName = "Required";
      if (!order.formData.lastName.trim()) newErrors.lastName = "Required";
      if (!order.formData.address.trim()) newErrors.address = "Required";
      if (!order.formData.city.trim()) newErrors.city = "Required";
      if (!order.formData.state.trim()) newErrors.state = "Required";
      if (!order.formData.zipCode.trim()) newErrors.zipCode = "Required";
    }
    // Payment step uses a secure hosted checkout (no card fields collected here).

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutContinue = () => {
    if (checkoutStep === "information" && validateCheckoutStep("information")) {
      setCheckoutStep("shipping");
    } else if (checkoutStep === "shipping" && validateCheckoutStep("shipping")) {
      setCheckoutStep("payment");
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) return v.substring(0, 2) + "/" + v.substring(2, 4);
    return v;
  };

  const placeInvoiceOrder = async () => {
    setPaymentError("");
    setIsSubmitting(true);
    try {
      if (!order.packageType) throw new Error("Missing package");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: order.packageType,
          cart: order.cart.map(({ style, angles }) => ({ style, angles })),
          lifestyleIncluded: order.lifestyleIncluded,
          discountCode: appliedPromo?.code || discountCode,
          email: order.formData.email,
          name: `${order.formData.firstName} ${order.formData.lastName}`.trim(),
          phone: order.formData.phone,
          company: order.formData.company,
          productName: order.formData.productName,
          notes: order.formData.notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to place order");
      const created = data?.order;
      if (!created?.trackingNumber) throw new Error("Order created, but missing order number");
      setTrackingNumber(created.trackingNumber);
      if (typeof created.total === "number") setConfirmedTotal(created.total);
      setOrderComplete(true);
      setStep(5);
      setIsSubmitting(false);
    } catch (e: any) {
      setPaymentError(e?.message || "Unable to place order");
      setIsSubmitting(false);
    }
  };

  const startStripeCheckout = async () => {
    setPaymentError("");
    setIsSubmitting(true);
    try {
      if (!order.packageType) throw new Error("Missing package");
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: order.packageType,
          cart: order.cart.map(({ style, angles }) => ({ style, angles })),
          lifestyleIncluded: order.lifestyleIncluded,
          discountCode: appliedPromo?.code || discountCode,
          email: order.formData.email,
          name: `${order.formData.firstName} ${order.formData.lastName}`.trim(),
          phone: order.formData.phone,
          company: order.formData.company,
          productName: order.formData.productName,
          notes: order.formData.notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to start checkout");
      const url = data?.url;
      if (!url) throw new Error("Missing checkout URL");
      window.location.href = url;
    } catch (e: any) {
      setPaymentError(e?.message || "Unable to start checkout");
      setIsSubmitting(false);
    }
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumber);
  };

  const resetOrder = () => {
    setOrder({
      packageType: null,
      cart: [],
      lifestyleIncluded: false,
      formData: {
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
      },
    });
    setStep(1);
    setCheckoutStep("information");
    setOrderComplete(false);
    setTrackingNumber("");
    setConfirmedTotal(null);
    setSelectedPackage(null);
    setAppliedPromo(null);
    setDiscountCode("");
    setDiscountError("");
    setPaymentError("");
  };

  const checkoutSteps: { key: CheckoutStep; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  const stepIndex = checkoutSteps.findIndex(s => s.key === checkoutStep);

  // Calculate wizard progress
  const getWizardProgress = () => {
    if (step === 1) return 1;
    if (step === 2) return 2;
    if (step === 3) return 2;
    if (step === 4) {
      if (checkoutStep === "information") return 3;
      if (checkoutStep === "shipping") return 4;
      if (checkoutStep === "payment") return 5;
    }
    if (step === 5) return 6;
    return 1;
  };

  return (
    <div className="min-h-screen bg-ink relative">
      {/* Background effects */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_50%)] pointer-events-none" />
      <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none" />
      {/* Global Progress Bar */}
      <StepProgress currentStep={getWizardProgress()} totalSteps={6} />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-white/10 shadow-sm pt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-honey to-honey/80 flex items-center justify-center shadow-lg shadow-honey/20">
                <Camera className="w-6 h-6 text-black" />
              </div>
              <span className="font-bold text-xl text-white">Rush Photos</span>
            </Link>

            {step > 1 && step < 5 && (
              <div className="relative">
                <button
                  onClick={() => setShowMiniCart(!showMiniCart)}
                  className="flex items-center gap-3 px-5 py-2.5 bg-charcoal border-2 border-white/10 hover:border-honey rounded-full transition-all group"
                >
                  <ShoppingCart className="w-5 h-5 text-white/70 group-hover:text-honey transition-colors" />
                  <span className="text-base font-semibold text-white">
                    ${calculateTotal()}
                  </span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-honey text-black text-xs font-bold rounded-full flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Mini Cart Dropdown */}
                {showMiniCart && getTotalItems() > 0 && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-charcoal rounded-2xl shadow-2xl border border-white/10 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/10 bg-gradient-to-r from-honey/10 to-transparent">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Your Cart
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {order.cart.map((item) => (
                        <div key={item.style} className="flex items-center justify-between p-4 hover:bg-charcoal/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={ECOMMERCE_STYLES.find(s => s.id === item.style)?.image}
                              alt={getStyleName(item.style)}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-white text-sm">{getStyleName(item.style)}</p>
                              <p className="text-xs text-white/50">{item.angles.length} angles</p>
                            </div>
                          </div>
                          <span className="font-semibold text-honey">${item.angles.length * item.pricePerAngle}</span>
                        </div>
                      ))}
                      {order.lifestyleIncluded && (
                        <div className="flex items-center justify-between p-4 hover:bg-charcoal/5 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white text-sm">Lifestyle</p>
                              <p className="text-xs text-white/50">Styled shoot</p>
                            </div>
                          </div>
                          <span className="font-semibold text-honey">${PRICES.lifestyle.flatRate}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-white/10 bg-[#0d0d0d]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white/60">Total</span>
                        <span className="text-xl font-bold text-honey">${calculateTotal()}</span>
                      </div>
                      <button
                        onClick={() => {
                          setShowMiniCart(false);
                          setStep(4);
                          setCheckoutStep("information");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-honey to-honey/80 text-black font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-20">
        <AnimatePresence mode="wait">
          {/* Step 1: Package Selection - with Images */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-10 sm:py-20"
            >
              <div className="text-center mb-12 sm:mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-honey/10 text-honey font-medium text-sm mb-6">
                  <Zap className="w-4 h-4" />
                  Professional Product Photography
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Choose Your Package
                </h1>
                <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
                  Select the type of photography that best fits your brand and product needs
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                {/* E-commerce Package */}
                <button
                  onClick={() => selectPackageType("ecommerce")}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${selectedPackage === "ecommerce"
                    ? "ring-4 ring-honey scale-[1.02]"
                    : selectedPackage ? "opacity-40 blur-[2px]" : "hover:scale-[1.02]"
                    }`}
                >
                  <div className="aspect-[4/5] relative">
                    <img
                      src={PACKAGE_IMAGES.ecommerce}
                      alt="E-commerce Photography"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                      <div className="w-14 h-14 rounded-2xl bg-charcoal/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
                        <Camera className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">E-commerce</h3>
                      <p className="text-white/80 text-sm sm:text-base mb-4">
                        Clean, consistent product shots on white background
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">From $25/angle</span>
                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Lifestyle Package */}
                <button
                  onClick={() => selectPackageType("lifestyle")}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${selectedPackage === "lifestyle"
                    ? "ring-4 ring-purple-500 scale-[1.02]"
                    : selectedPackage ? "opacity-40 blur-[2px]" : "hover:scale-[1.02]"
                    }`}
                >
                  <div className="aspect-[4/5] relative">
                    <img
                      src={PACKAGE_IMAGES.lifestyle}
                      alt="Lifestyle Photography"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent" />

                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                      <div className="w-14 h-14 rounded-2xl bg-charcoal/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
                        <Sparkles className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Lifestyle</h3>
                      <p className="text-white/80 text-sm sm:text-base mb-4">
                        Styled scenes with props and creative direction
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">$149 flat rate</span>
                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>

                {/* Full Package */}
                <button
                  onClick={() => selectPackageType("fullpackage")}
                  className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${selectedPackage === "fullpackage"
                    ? "ring-4 ring-amber-500 scale-[1.02]"
                    : selectedPackage ? "opacity-40 blur-[2px]" : "hover:scale-[1.02]"
                    }`}
                >
                  <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    SAVE 10%
                  </div>
                  <div className="aspect-[4/5] relative">
                    <img
                      src={PACKAGE_IMAGES.fullpackage}
                      alt="Full Package Photography"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-900/40 to-transparent" />

                    <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                      <div className="w-14 h-14 rounded-2xl bg-charcoal/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
                        <Package className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Full Package</h3>
                      <p className="text-white/80 text-sm sm:text-base mb-4">
                        E-commerce + Lifestyle with 10% discount
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white font-bold text-xl">Best Value</span>
                        <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-white/50">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-sm">Satisfaction Guaranteed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">3-5 Day Delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  <span className="text-sm">500+ Happy Customers</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Style Selection - Clean Design */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-6"
            >
              {/* Back Button */}
              <button
                onClick={() => { setStep(1); setSelectedPackage(null); }}
                className="flex items-center gap-2 text-white/50 hover:text-honey transition-colors mb-6 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to packages
              </button>

              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {order.packageType === "fullpackage" ? "Build Your Full Package" : "Select Photography Style"}
                </h1>
                <p className="text-white/50">
                  {order.packageType === "fullpackage"
                    ? "Choose styles and angles for your complete package"
                    : "Pick a style and add angles to your cart"
                  }
                </p>
              </div>

              {/* Full Package Badge */}
              {order.packageType === "fullpackage" && (
                <div className="mb-8 p-4 bg-gradient-to-r from-amber-50 to-purple-50 rounded-xl border border-amber-200">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-purple-500 flex items-center justify-center">
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Full Package Deal</p>
                        <p className="text-sm text-white/600">E-commerce + Lifestyle included</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <Zap className="w-4 h-4" />
                      {Math.round(PRICES.fullPackageDiscount * 100)}% Savings Applied
                    </div>
                  </div>
                </div>
              )}

              {/* Floating Cart Bar */}
              <AnimatePresence>
                {(order.cart.length > 0 || order.lifestyleIncluded) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="sticky top-16 z-30 mb-6"
                  >
                    <div className="bg-charcoal rounded-xl p-4 text-white shadow-xl">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-5 h-5" />
                          <div>
                            <p className="font-medium text-sm">
                              {order.cart.length} style{order.cart.length !== 1 ? 's' : ''}
                              {order.lifestyleIncluded && ' + Lifestyle'}
                            </p>
                            <p className="text-xs text-white/60">{getTotalAngles()} angles</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-xl font-bold">${calculateTotal()}</span>
                          <button
                            onClick={() => { setStep(4); setCheckoutStep("information"); }}
                            className="px-5 py-2.5 bg-honey text-white font-semibold rounded-lg hover:bg-[#d43d3d] transition-colors flex items-center gap-2"
                          >
                            Checkout <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Style Cards - Clean Grid */}
              <div className="grid gap-4">
                {ECOMMERCE_STYLES.map((style) => {
                  const inCart = order.cart.find(item => item.style === style.id);
                  const isSelected = currentStyle === style.id;
                  const stylePrice = style.pricePerAngle || PRICES.ecommerce.perAngle;

                  return (
                    <div key={style.id} className="bg-charcoal rounded-xl border border-white/20 overflow-hidden transition-all hover:border-white/30">
                      {/* Style Header - Clickable */}
                      <button
                        onClick={() => selectStyle(style.id)}
                        className="w-full p-4 flex items-center gap-4 text-left hover:bg-white/5 transition-colors"
                      >
                        <img src={style.image} alt={style.name} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{style.name}</h3>
                            {inCart && (
                              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                                {inCart.angles.length} angles
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-white/50 truncate">{style.description}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="text-honey font-bold">${stylePrice}/angle</span>
                          <ChevronDown className={`w-5 h-5 text-white/40 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {/* Angle Selection - Expandable */}
                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-t border-white/100 overflow-hidden"
                          >
                            <div className="p-4 bg-white/5">
                              <p className="text-sm font-medium text-white/700 mb-3">Select angles:</p>
                              <div className="grid grid-cols-4 gap-2 mb-4">
                                {ANGLES.map((angle) => {
                                  const isAngleSelected = selectedAngles.includes(angle.id);
                                  return (
                                    <button
                                      key={angle.id}
                                      onClick={(e) => { e.stopPropagation(); toggleAngle(angle.id); }}
                                      className={`relative aspect-square rounded-lg overflow-hidden transition-all ${isAngleSelected ? 'ring-2 ring-honey' : 'hover:opacity-80'
                                        }`}
                                    >
                                      <img src={angle.image} alt={angle.name} className="w-full h-full object-cover" />
                                      <div className={`absolute inset-0 ${isAngleSelected ? 'bg-honey/30' : 'bg-black/30'}`} />
                                      {isAngleSelected && (
                                        <div className="absolute top-1 right-1 w-5 h-5 bg-honey rounded-full flex items-center justify-center">
                                          <Check className="w-3 h-3 text-white" strokeWidth={3} />
                                        </div>
                                      )}
                                      <span className="absolute bottom-1 left-1 right-1 text-white text-[10px] font-medium text-center">{angle.name}</span>
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Add Button */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-sm text-white/50">{selectedAngles.length} selected = </span>
                                  <span className="font-bold text-white">${selectedAngles.length * stylePrice}</span>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); addToCart(); }}
                                  disabled={selectedAngles.length === 0}
                                  className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${selectedAngles.length > 0
                                    ? 'bg-honey text-white hover:bg-[#d43d3d]'
                                    : 'bg-neutral-200 text-white/40 cursor-not-allowed'
                                    }`}
                                >
                                  <Check className="w-4 h-4" />
                                  {inCart ? 'Update' : 'Add'}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* Cart Summary */}
              {order.cart.length > 0 && (
                <div className="mt-8 p-4 bg-charcoal rounded-xl border border-white/20">
                  <h3 className="text-sm font-semibold text-white/700 mb-3">Your selections:</h3>
                  <div className="space-y-2">
                    {order.cart.map((item) => {
                      const styleInfo = ECOMMERCE_STYLES.find(s => s.id === item.style);
                      return (
                        <div key={item.style} className="flex items-center justify-between py-2 border-b border-white/100 last:border-0">
                          <div className="flex items-center gap-3">
                            <img src={styleInfo?.image} alt="" className="w-10 h-10 rounded object-cover" />
                            <div>
                              <p className="font-medium text-sm text-white">{getStyleName(item.style)}</p>
                              <p className="text-xs text-white/50">{item.angles.map(a => ANGLES.find(x => x.id === a)?.name).join(', ')}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">${item.angles.length * item.pricePerAngle}</span>
                            <button onClick={() => removeFromCart(item.style)} className="text-white/40 hover:text-red-500 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {order.lifestyleIncluded && (
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-purple-100 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm text-white">Lifestyle Photography</p>
                            <p className="text-xs text-white/50">Included in package</p>
                          </div>
                        </div>
                        <span className="font-semibold text-white">${PRICES.lifestyle.flatRate}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Angle Selection */}
          {step === 3 && currentStyle && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="py-8"
            >
              <div className="max-w-3xl mx-auto">
                <button
                  onClick={() => {
                    setCurrentStyle(null);
                    setStep(2);
                  }}
                  className="flex items-center gap-2 text-white/60 hover:text-honey transition-colors mb-8 group"
                >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  Back to styles
                </button>

                <div className="bg-charcoal rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                  {/* Style Header */}
                  <div className="relative h-48 sm:h-64">
                    <img
                      src={ECOMMERCE_STYLES.find(s => s.id === currentStyle)?.image}
                      alt={getStyleName(currentStyle)}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                        {getStyleName(currentStyle)}
                      </h1>
                      <p className="text-white/70">
                        Select the angles you need (1-4 angles)
                      </p>
                    </div>
                  </div>

                  {/* Angles Grid */}
                  <div className="p-6 sm:p-8">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                      {ANGLES.map((angle) => {
                        const isSelected = selectedAngles.includes(angle.id);
                        return (
                          <button
                            key={angle.id}
                            onClick={() => toggleAngle(angle.id)}
                            className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${isSelected
                              ? 'ring-4 ring-honey scale-[0.98]'
                              : 'hover:scale-[1.02] hover:shadow-xl'
                              }`}
                          >
                            <img
                              src={angle.image}
                              alt={angle.name}
                              className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'brightness-90' : ''}`}
                            />
                            <div className={`absolute inset-0 transition-all duration-300 ${isSelected ? 'bg-honey/20' : 'bg-black/20 hover:bg-black/10'
                              }`} />

                            {/* Selection Indicator */}
                            <div className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${isSelected
                              ? 'border-honey bg-honey'
                              : 'border-white bg-charcoal/20'
                              }`}>
                              {isSelected && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </div>

                            {/* Label */}
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                              <p className="text-white font-semibold text-sm text-center">{angle.name}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Pricing Summary */}
                    <div className="bg-[#0d0d0d] rounded-2xl p-6">
                      {(() => {
                        const styleConfig = ECOMMERCE_STYLES.find(s => s.id === currentStyle);
                        const pricePerAngle = styleConfig?.pricePerAngle || PRICES.ecommerce.perAngle;
                        return (
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-honey to-honey/80 flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="font-bold text-white">{selectedAngles.length} angle{selectedAngles.length !== 1 ? 's' : ''} selected</p>
                                <p className="text-sm text-white/50">${pricePerAngle} each</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-white/50">Subtotal</p>
                              <p className="text-3xl font-bold text-honey">
                                ${selectedAngles.length * pricePerAngle}
                              </p>
                            </div>
                          </div>
                        );
                      })()}

                      <button
                        onClick={addToCart}
                        disabled={selectedAngles.length === 0}
                        className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${selectedAngles.length > 0
                          ? 'bg-gradient-to-r from-honey to-honey/80 text-black hover:shadow-xl hover:shadow-honey/30'
                          : 'bg-charcoal/10 text-white/30 cursor-not-allowed'
                          }`}
                      >
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Premium Checkout (minimal, brand-like) */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="-mx-4 sm:-mx-6"
            >
              <div className="max-w-7xl mx-auto grid lg:grid-cols-12 min-h-[calc(100vh-80px)]">
                {/* Left: Form */}
                <div className="lg:col-span-7 xl:col-span-8 bg-ink px-6 sm:px-10 lg:px-14 py-8 sm:py-12 order-2 lg:order-1">
                  {/* Back */}
                  <div className="mb-8">
                    {order.packageType !== "lifestyle" ? (
                      <button
                        onClick={() => setStep(2)}
                        className="inline-flex items-center gap-2 text-sm text-white/600 hover:text-white/90 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <button
                        onClick={() => setStep(1)}
                        className="inline-flex items-center gap-2 text-sm text-white/600 hover:text-white/90 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    )}
                  </div>

                  {/* Stepper */}
                  <div className="mb-10">
                    <div className="flex items-center justify-between gap-3">
                      {checkoutSteps.map((s, index) => (
                        <button
                          key={s.key}
                          onClick={() => index <= stepIndex && setCheckoutStep(s.key)}
                          disabled={index > stepIndex}
                          className={`flex-1 rounded-xl border px-3 py-3 text-left transition-colors ${index === stepIndex
                            ? "border-white/90 bg-charcoal"
                            : index < stepIndex
                              ? "border-white/20 bg-charcoal hover:border-white/40"
                              : "border-white/20 bg-white/5 text-white/40 cursor-not-allowed"
                            }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${index < stepIndex
                                ? "bg-neutral-900 text-white"
                                : index === stepIndex
                                  ? "bg-neutral-900 text-white"
                                  : "bg-neutral-200 text-white/600"
                                }`}
                            >
                              {index < stepIndex ? <Check className="w-4 h-4" /> : index + 1}
                            </span>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold text-white/90 truncate">{s.label}</div>
                              <div className="text-xs text-white/50 truncate">
                                {s.key === "information"
                                  ? "Contact + product"
                                  : s.key === "shipping"
                                    ? "Billing details"
                                    : "Payment"}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  {checkoutStep === "information" && (
                    <div className="space-y-10">
                      {/* Login */}
                      {!isLoggedIn ? (
                        <div className="rounded-2xl border border-white/20 bg-white/5 p-5">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-charcoal border border-white/20 flex items-center justify-center">
                                <User className="w-5 h-5 text-white/700" />
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-white/90">Have an account?</div>
                                <div className="text-sm text-white/600">Login for faster checkout.</div>
                              </div>
                            </div>
                            <button
                              onClick={handleLoginRedirect}
                              className="inline-flex items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors"
                            >
                              <User className="w-4 h-4" />
                              Login
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-white/20 bg-charcoal p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                              <Check className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-white/90">
                                Welcome back, {user?.name || user?.email?.split("@")[0]}!
                              </div>
                              <div className="text-sm text-white/600">We pre-filled what we could.</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Contact */}
                      <section>
                        <h2 className="text-xl font-bold text-white/90 mb-5">Contact</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Email</label>
                            <input
                              type="email"
                              value={order.formData.email}
                              onChange={(e) => updateFormData("email", e.target.value)}
                              className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/90 ${errors.email ? "border-red-500" : "border-white/20"
                                }`}
                              placeholder="you@company.com"
                            />
                            {errors.email && (
                              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <Info className="w-4 h-4" />
                                {errors.email}
                              </p>
                            )}
                          </div>

                          <label className="flex items-center gap-3 cursor-pointer select-none">
                            <button
                              type="button"
                              onClick={() => setEmailUpdates(!emailUpdates)}
                              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${emailUpdates ? "bg-neutral-900 border-white/90" : "border-white/30 hover:border-white/50"
                                }`}
                              aria-pressed={emailUpdates}
                            >
                              {emailUpdates && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                            </button>
                            <span className="text-sm text-white/700">Email me updates and offers</span>
                          </label>
                        </div>
                      </section>

                      {/* Product */}
                      <section>
                        <h2 className="text-xl font-bold text-white/90 mb-5">Product</h2>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Product name *</label>
                            <input
                              type="text"
                              value={order.formData.productName}
                              onChange={(e) => updateFormData("productName", e.target.value)}
                              className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/90 ${errors.productName ? "border-red-500" : "border-white/20"
                                }`}
                              placeholder="e.g. Leather wallet"
                            />
                            {errors.productName && (
                              <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
                                <Info className="w-4 h-4" />
                                {errors.productName}
                              </p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Notes (optional)</label>
                            <textarea
                              value={order.formData.notes}
                              onChange={(e) => updateFormData("notes", e.target.value)}
                              rows={4}
                              className="w-full rounded-xl border border-white/20 bg-charcoal px-4 py-3 text-[15px] text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/90 resize-none"
                              placeholder="Any preferences, references, or constraints?"
                            />
                          </div>
                        </div>
                      </section>

                      <button
                        onClick={handleCheckoutContinue}
                        className="w-full rounded-xl bg-neutral-900 px-5 py-4 text-white font-semibold hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {checkoutStep === "shipping" && (
                    <div className="space-y-10">
                      {/* Delivery */}
                      <section>
                        <h2 className="text-xl font-bold text-white/90 mb-5">Delivery</h2>
                        <div className="rounded-2xl border border-white/20 bg-charcoal p-5">
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white/90">Digital delivery</div>
                              <div className="text-sm text-white/600">Final files delivered via email.</div>
                            </div>
                            <div className="text-sm font-semibold text-white/90">Free</div>
                          </div>
                        </div>
                      </section>

                      {/* Billing */}
                      <section>
                        <h2 className="text-xl font-bold text-white/90 mb-5">Billing details</h2>
                        <div className="space-y-4">
                          <div className="relative">
                            <label className="block text-sm font-medium text-white/700 mb-2">Country/Region</label>
                            <select
                              value={order.formData.country}
                              onChange={(e) => updateFormData("country", e.target.value)}
                              className="w-full appearance-none rounded-xl border border-white/20 bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90"
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-[46px] w-5 h-5 text-white/40 pointer-events-none" />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white/700 mb-2">First name</label>
                              <input
                                type="text"
                                value={order.formData.firstName}
                                onChange={(e) => updateFormData("firstName", e.target.value)}
                                className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.firstName ? "border-red-500" : "border-white/20"
                                  }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white/700 mb-2">Last name</label>
                              <input
                                type="text"
                                value={order.formData.lastName}
                                onChange={(e) => updateFormData("lastName", e.target.value)}
                                className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.lastName ? "border-red-500" : "border-white/20"
                                  }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Company (optional)</label>
                            <input
                              type="text"
                              value={order.formData.company}
                              onChange={(e) => updateFormData("company", e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Address</label>
                            <input
                              type="text"
                              value={order.formData.address}
                              onChange={(e) => updateFormData("address", e.target.value)}
                              className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.address ? "border-red-500" : "border-white/20"
                                }`}
                            />
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-white/700 mb-2">City</label>
                              <input
                                type="text"
                                value={order.formData.city}
                                onChange={(e) => updateFormData("city", e.target.value)}
                                className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.city ? "border-red-500" : "border-white/20"
                                  }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white/700 mb-2">State</label>
                              <input
                                type="text"
                                value={order.formData.state}
                                onChange={(e) => updateFormData("state", e.target.value)}
                                className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.state ? "border-red-500" : "border-white/20"
                                  }`}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-white/700 mb-2">ZIP</label>
                              <input
                                type="text"
                                value={order.formData.zipCode}
                                onChange={(e) => updateFormData("zipCode", e.target.value)}
                                className={`w-full rounded-xl border bg-charcoal px-4 py-3 text-[15px] text-white/90 focus:outline-none focus:border-white/90 ${errors.zipCode ? "border-red-500" : "border-white/20"
                                  }`}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-white/700 mb-2">Phone (optional)</label>
                            <input
                              type="tel"
                              value={order.formData.phone}
                              onChange={(e) => updateFormData("phone", e.target.value)}
                              className="w-full rounded-xl border border-white/20 bg-charcoal px-4 py-3 text-[15px] text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/90"
                              placeholder="For updates"
                            />
                          </div>
                        </div>
                      </section>

                      <button
                        onClick={handleCheckoutContinue}
                        className="w-full rounded-xl bg-neutral-900 px-5 py-4 text-white font-semibold hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCheckoutStep("information")}
                        className="w-full text-sm text-white/600 hover:text-white/90 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to information
                      </button>
                    </div>
                  )}

                  {checkoutStep === "payment" && (
                    <div className="space-y-10">
                      <section>
                        <h2 className="text-xl font-bold text-white/90 mb-2">Payment</h2>
                        <p className="text-sm text-white/600">
                          Pay securely via hosted checkout. Apple Pay / Google Pay may be available depending on your device.
                        </p>
                      </section>

                      {paymentError && (
                        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                          {paymentError}
                        </div>
                      )}

                      <section className="space-y-4">
                        {/* Card (hosted) */}
                        <div className="rounded-2xl border border-white/20 bg-charcoal p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center">
                              <CreditCard className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white/90">Pay by card</div>
                              <div className="text-sm text-white/600">
                                You’ll be redirected to a secure checkout to complete payment.
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={startStripeCheckout}
                            disabled={isSubmitting}
                            className="mt-4 w-full rounded-xl bg-neutral-900 px-5 py-4 text-white font-semibold hover:bg-neutral-800 transition-colors disabled:opacity-70 inline-flex items-center justify-center gap-2"
                          >
                            {isSubmitting ? (
                              <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Redirecting…
                              </>
                            ) : (
                              <>
                                <Lock className="w-4 h-4" />
                                Continue to payment
                              </>
                            )}
                          </button>
                        </div>

                        {/* Invoice */}
                        <div className="rounded-2xl border border-white/20 bg-charcoal p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-white/800" />
                            </div>
                            <div className="flex-1">
                              <div className="text-sm font-semibold text-white/90">Request invoice</div>
                              <div className="text-sm text-white/600">Place the order now and we’ll email payment details.</div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={placeInvoiceOrder}
                            disabled={isSubmitting}
                            className="mt-4 w-full rounded-xl border border-white/90 bg-charcoal px-5 py-4 text-white/90 font-semibold hover:bg-white/5 transition-colors disabled:opacity-70 inline-flex items-center justify-center gap-2"
                          >
                            <Send className="w-4 h-4" />
                            Request invoice
                          </button>
                        </div>
                      </section>

                      <div className="rounded-2xl border border-white/20 bg-white/5 p-4 flex items-start gap-3">
                        <Shield className="w-5 h-5 text-white/800 mt-0.5" />
                        <p className="text-sm text-white/700">
                          Secure checkout. We do not collect or store your card details on this site.
                        </p>
                      </div>

                      <button
                        onClick={() => setCheckoutStep("shipping")}
                        className="w-full text-sm text-white/600 hover:text-white/90 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back to billing
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: Summary */}
                <aside className="lg:col-span-5 xl:col-span-4 border-t lg:border-t-0 lg:border-l border-white/5 bg-charcoal order-1 lg:order-2">
                  <div className="lg:sticky lg:top-20 px-6 sm:px-10 py-6 sm:py-10">
                    {/* Mobile toggle */}
                    <button
                      type="button"
                      onClick={() => setShowOrderSummary((v) => !v)}
                      className="lg:hidden w-full flex items-center justify-between rounded-xl border border-white/20 bg-charcoal px-4 py-3"
                    >
                      <div className="text-left">
                        <div className="text-sm font-semibold text-white/90">Order summary</div>
                        <div className="text-sm text-white/600">${calculateTotal()}</div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-white/50 transition-transform ${showOrderSummary ? "rotate-180" : ""}`}
                      />
                    </button>

                    <div className={`${showOrderSummary ? "block" : "hidden"} lg:block mt-4 lg:mt-0`}>
                      <div className="order-summary-card p-5">
                        <div className="flex items-center justify-between mb-4">
                          <h2 className="text-sm font-semibold text-white/90">Summary</h2>
                          <span className="text-sm font-semibold text-white/90">${calculateTotal()}</span>
                        </div>

                        <div className="space-y-4 pb-4 border-b border-white/20">
                          {order.cart.map((item) => (
                            <div key={item.style} className="flex items-start gap-3">
                              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 border border-white/20 flex-shrink-0">
                                <img
                                  src={ECOMMERCE_STYLES.find((s) => s.id === item.style)?.image}
                                  alt={getStyleName(item.style)}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 rounded-full flex items-center justify-center text-[11px] font-bold text-white">
                                  {item.angles.length}
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white/90 truncate">{getStyleName(item.style)}</div>
                                <div className="text-xs text-white/50">
                                  {item.angles.length} angles × ${item.pricePerAngle}
                                </div>
                              </div>
                              <div className="text-sm font-semibold text-white/90">
                                ${item.angles.length * item.pricePerAngle}
                              </div>
                            </div>
                          ))}

                          {order.lifestyleIncluded && (
                            <div className="flex items-start gap-3">
                              <div className="w-14 h-14 rounded-xl bg-neutral-900 flex items-center justify-center flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-semibold text-white/90">Lifestyle</div>
                                <div className="text-xs text-white/50">Styled shoot</div>
                              </div>
                              <div className="text-sm font-semibold text-white/90">${PRICES.lifestyle.flatRate}</div>
                            </div>
                          )}
                        </div>

                        {/* Discount + breakdown */}
                        <div className="pt-4 space-y-3">
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                              <input
                                type="text"
                                value={discountCode}
                                onChange={(e) => {
                                  setDiscountError("");
                                  setDiscountCode(e.target.value);
                                }}
                                disabled={!!appliedPromo}
                                className="w-full pl-10 pr-3 py-3 rounded-xl border border-white/20 bg-charcoal text-sm text-white/90 placeholder:text-white/40 focus:outline-none focus:border-white/90 disabled:bg-white/5 disabled:text-white/50"
                                placeholder="Discount code"
                              />
                            </div>
                            {appliedPromo ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setAppliedPromo(null);
                                  setDiscountCode("");
                                  setDiscountError("");
                                }}
                                className="rounded-xl border border-white/90 bg-charcoal px-4 py-3 text-sm font-semibold text-white/90 hover:bg-white/5 transition-colors"
                              >
                                Remove
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={async () => {
                                  setDiscountError("");
                                  const code = discountCode.trim();
                                  if (!code) {
                                    setDiscountError("Enter a code");
                                    return;
                                  }
                                  if (!order.packageType) {
                                    setDiscountError("Select a package first");
                                    return;
                                  }
                                  setIsApplyingDiscount(true);
                                  try {
                                    const res = await fetch("/api/discounts/validate", {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify({
                                        code,
                                        packageType: order.packageType,
                                        cart: order.cart.map(({ style, angles }) => ({ style, angles })),
                                        lifestyleIncluded: order.lifestyleIncluded,
                                      }),
                                    });
                                    const data = await res.json().catch(() => ({}));
                                    if (!res.ok || !data?.ok) {
                                      setAppliedPromo(null);
                                      setDiscountError(data?.error || "Invalid code");
                                      setIsApplyingDiscount(false);
                                      return;
                                    }
                                    setAppliedPromo(data.promo);
                                    setDiscountCode(data.promo.code);
                                    setIsApplyingDiscount(false);
                                  } catch {
                                    setDiscountError("Network error. Please try again.");
                                    setIsApplyingDiscount(false);
                                  }
                                }}
                                disabled={isApplyingDiscount}
                                className="rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition-colors disabled:opacity-60"
                              >
                                {isApplyingDiscount ? "Applying…" : "Apply"}
                              </button>
                            )}
                          </div>

                          {discountError && <div className="text-sm text-red-600">{discountError}</div>}
                          {appliedPromo && (
                            <div className="text-sm text-white/700">
                              Applied <span className="font-semibold">{appliedPromo.code}</span>
                            </div>
                          )}

                          {(() => {
                            const b = calculateBreakdown();
                            return (
                              <div className="space-y-2 pt-2 border-t border-white/20">
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/600">Subtotal</span>
                                  <span className="text-white/90 font-medium">${b.itemsSubtotal}</span>
                                </div>
                                {b.bundleDiscount > 0 && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/600">Bundle discount</span>
                                    <span className="text-white/90 font-medium">-${b.bundleDiscount}</span>
                                  </div>
                                )}
                                {b.promoDiscount > 0 && appliedPromo && (
                                  <div className="flex justify-between text-sm">
                                    <span className="text-white/600">
                                      Promo <span className="font-mono">{appliedPromo.code}</span>
                                    </span>
                                    <span className="text-white/90 font-medium">-${b.promoDiscount}</span>
                                  </div>
                                )}
                                <div className="flex justify-between text-sm">
                                  <span className="text-white/600">Delivery</span>
                                  <span className="text-white/90 font-medium">Free</span>
                                </div>
                              </div>
                            );
                          })()}

                          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                            <span className="font-semibold text-white">Total</span>
                            <span className="text-xl font-bold text-honey">${calculateTotal()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="trust-badge mt-4">
                        <Clock className="w-5 h-5 text-honey" />
                        <div>
                          <div className="text-sm font-semibold text-white">3–5 business days</div>
                          <div className="text-xs text-mist mt-0.5">
                            Delivered digitally. 100% satisfaction guaranteed.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>
            </motion.div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && orderComplete && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="py-16"
            >
              <div className="max-w-lg mx-auto text-center">
                <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                  Order Confirmed!
                </h1>

                <p className="text-lg text-white/60 mb-10">
                  Thank you for your order. We&apos;ll be in touch shortly to confirm details and get started on your project.
                </p>

                <div className="bg-charcoal rounded-3xl p-8 border border-white/10 shadow-xl mb-8">
                  <p className="text-sm text-white/60 mb-3">Tracking Number</p>
                  <div className="flex items-center justify-center gap-4">
                    <code className="text-2xl font-mono font-bold text-honey">
                      {trackingNumber}
                    </code>
                    <button
                      onClick={copyTrackingNumber}
                      className="p-3 rounded-xl bg-charcoal/5 hover:bg-charcoal/10 transition-colors"
                    >
                      <Copy className="w-5 h-5 text-white/60" />
                    </button>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-honey/10 to-honey/80/10 rounded-3xl p-8 mb-8 text-left">
                  <h3 className="font-bold text-white mb-4 text-lg">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/60">Package</span>
                      <span className="font-medium text-white capitalize">{order.packageType}</span>
                    </div>
                    {order.cart.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-white/60">E-commerce Styles</span>
                        <span className="font-medium text-white">{order.cart.length}</span>
                      </div>
                    )}
                    {order.lifestyleIncluded && (
                      <div className="flex justify-between">
                        <span className="text-white/60">Lifestyle</span>
                        <span className="font-medium text-white">Included</span>
                      </div>
                    )}
                    <div className="flex justify-between pt-3 border-t border-white/10">
                      <span className="font-bold text-white">Total</span>
                      <span className="font-bold text-honey text-xl">
                        ${confirmedTotal ?? calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={resetOrder}
                    className="flex-1 py-4 border-2 border-charcoal text-white font-bold rounded-xl hover:bg-charcoal hover:text-white transition-all"
                  >
                    New Order
                  </button>
                  <Link
                    href="/"
                    className="flex-1 py-4 bg-gradient-to-r from-honey to-honey/80 text-black font-bold rounded-xl hover:shadow-xl hover:shadow-honey/30 transition-all text-center"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
