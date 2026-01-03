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
  Zap,
  Loader2
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

// Default Pricing
const DEFAULT_PRICES = {
  ecommerce: { perAngle: 25 },
  lifestyle: { flatRate: 149 },
  fullPackageDiscount: 0.1,
};

// Package images
const PACKAGE_IMAGES = {
  ecommerce: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
  lifestyle: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80",
  fullpackage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
};

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
  { id: "front", name: "Front", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop&q=80", price: 25 },
  { id: "back", name: "Back", image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=300&h=300&fit=crop&q=80", price: 25 },
  { id: "left", name: "Left Side", image: "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=300&h=300&fit=crop&q=80", price: 25 },
  { id: "right", name: "Right Side", image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=300&h=300&fit=crop&q=80", price: 25 },
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
      email: "", firstName: "", lastName: "", phone: "", company: "",
      productName: "", notes: "", address: "", apartment: "", city: "",
      state: "", zipCode: "", country: "United States",
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
  const [appliedPromo, setAppliedPromo] = useState<any>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [discountError, setDiscountError] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMiniCart, setShowMiniCart] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);

  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [PRICES, setPRICES] = useState(DEFAULT_PRICES);
  const [ECOMMERCE_STYLES, setECOMMERCE_STYLES] = useState(DEFAULT_ECOMMERCE_STYLES);
  const [ANGLES, setANGLES] = useState(DEFAULT_ANGLES);

  // Load pricing
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
      } catch (e) { console.error("Error loading pricing:", e); }
    };
    load();
  }, []);

  // Handle URL params
  useEffect(() => {
    const pkgParam = searchParams.get("package");
    if (pkgParam && (pkgParam === "ecommerce" || pkgParam === "lifestyle" || pkgParam === "fullpackage")) {
      selectPackageType(pkgParam as PackageType);
    }
  }, [searchParams]);

  // Sync user
  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) return;
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
          setOrder(prev => ({
            ...prev,
            formData: {
              ...prev.formData,
              email: data.user.email || prev.formData.email,
              firstName: data.user.name?.split(" ")[0] || prev.formData.firstName,
              lastName: data.user.name?.split(" ").slice(1).join(" ") || prev.formData.lastName,
              phone: data.user.phone || prev.formData.phone,
              company: data.user.company || prev.formData.company,
            },
          }));
        }
      } catch (e) { console.error("User load failed", e); }
    };
    loadUser();
  }, []);

  const calculateItemsSubtotal = () => {
    let subtotal = 0;
    order.cart.forEach((item) => { subtotal += item.angles.length * item.pricePerAngle; });
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
    if (appliedPromo.type === "percent") return Math.round(subtotalAfterBundle * (appliedPromo.value / 100));
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
  const getTotalAngles = () => order.cart.reduce((acc, item) => acc + item.angles.length, 0);
  const getTotalItems = () => (order.cart.length + (order.lifestyleIncluded ? 1 : 0));

  const selectPackageType = (type: PackageType) => {
    if (type === "fullpackage") {
      // For Full Package, auto-populate cart with all styles and all angles
      const allStylesCart = ECOMMERCE_STYLES.map(style => ({
        style: style.id,
        angles: ANGLES.map(a => a.id),
        pricePerAngle: style.pricePerAngle || PRICES.ecommerce.perAngle
      }));
      setOrder(prev => ({
        ...prev,
        packageType: type,
        lifestyleIncluded: true,
        cart: allStylesCart
      }));
      setSelectedPackage(type);
      setStep(2);
    } else {
      setOrder(prev => ({
        ...prev,
        packageType: type,
        lifestyleIncluded: type === "lifestyle",
        cart: []
      }));
      setSelectedPackage(type);

      if (type === "lifestyle") {
        setStep(3);
      } else {
        setStep(2);
      }
    }
  };

  const selectStyle = (style: EcommerceStyle) => {
    const newCurrentStyle = currentStyle === style ? null : style;
    setCurrentStyle(newCurrentStyle);

    // If opening a style that's already in cart, load its angles
    if (newCurrentStyle) {
      const existingCartItem = order.cart.find(c => c.style === newCurrentStyle);
      setSelectedAngles(existingCartItem?.angles || []);
    } else {
      setSelectedAngles([]);
    }
  };

  const toggleAngle = (angle: Angle) => {
    setSelectedAngles(prev => prev.includes(angle) ? prev.filter(a => a !== angle) : [...prev, angle]);
  };

  const addToCart = () => {
    if (currentStyle && selectedAngles.length > 0) {
      const styleConfig = ECOMMERCE_STYLES.find(s => s.id === currentStyle);
      const pricePerAngle = styleConfig?.pricePerAngle || PRICES.ecommerce.perAngle;
      const existingIndex = order.cart.findIndex(item => item.style === currentStyle);
      if (existingIndex >= 0) {
        const newCart = [...order.cart];
        newCart[existingIndex].angles = selectedAngles;
        setOrder(prev => ({ ...prev, cart: newCart }));
      } else {
        setOrder(prev => ({
          ...prev,
          cart: [...prev.cart, { style: currentStyle!, angles: selectedAngles, pricePerAngle }],
        }));
      }
      setCurrentStyle(null);
      setSelectedAngles([]);
    }
  };

  const removeFromCart = (style: EcommerceStyle) => {
    setOrder(prev => ({ ...prev, cart: prev.cart.filter(item => item.style !== style) }));
  };

  const updateFormData = (field: keyof OrderState["formData"], value: string) => {
    setOrder(prev => ({ ...prev, formData: { ...prev.formData, [field]: value } }));
  };

  const validateCheckoutStep = (s: CheckoutStep) => {
    const newErrors: Record<string, string> = {};
    if (s === "information") {
      if (!order.formData.email.trim()) newErrors.email = "Required";
      if (!order.formData.productName.trim()) newErrors.productName = "Required";
    }
    if (s === "shipping") {
      if (!order.formData.firstName.trim()) newErrors.firstName = "Required";
      if (!order.formData.lastName.trim()) newErrors.lastName = "Required";
      if (!order.formData.address.trim()) newErrors.address = "Required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutContinue = () => {
    if (checkoutStep === "information" && validateCheckoutStep("information")) setCheckoutStep("shipping");
    else if (checkoutStep === "shipping" && validateCheckoutStep("shipping")) setCheckoutStep("payment");
  };

  const startStripeCheckout = async () => {
    setPaymentError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/checkout/stripe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: order.packageType,
          cart: order.cart,
          lifestyleIncluded: order.lifestyleIncluded,
          discountCode: appliedPromo?.code || discountCode,
          email: order.formData.email,
          name: `${order.formData.firstName} ${order.formData.lastName}`,
          phone: order.formData.phone,
          company: order.formData.company,
          productName: order.formData.productName,
          notes: order.formData.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      window.location.href = data.url;
    } catch (e: any) {
      setPaymentError(e.message);
      setIsSubmitting(false);
    }
  };

  const placeInvoiceOrder = async () => {
    setPaymentError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          packageType: order.packageType,
          cart: order.cart,
          lifestyleIncluded: order.lifestyleIncluded,
          discountCode: appliedPromo?.code || discountCode,
          email: order.formData.email,
          name: `${order.formData.firstName} ${order.formData.lastName}`,
          phone: order.formData.phone,
          company: order.formData.company,
          productName: order.formData.productName,
          notes: order.formData.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTrackingNumber(data.order.trackingNumber);
      setConfirmedTotal(data.order.total);
      setOrderComplete(true);
      setStep(5);
    } catch (e: any) {
      setPaymentError(e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWizardProgress = () => {
    if (step === 1) return 1;
    if (step === 2 || step === 3) return 2;
    if (step === 4) {
      if (checkoutStep === "information") return 3;
      if (checkoutStep === "shipping") return 4;
      return 5;
    }
    return 6;
  };

  return (
    <div className="min-h-screen bg-rush-light text-rush-dark font-sans">
      <StepProgress currentStep={getWizardProgress()} totalSteps={6} />

      <header className="bg-white border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center font-black text-white">R</div>
            <span className="font-bold text-lg">Rush Photo</span>
          </Link>
          {getTotalItems() > 0 && step < 5 && (
            <button onClick={() => setShowMiniCart(!showMiniCart)} className="bg-rush-light border border-rush-border px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm">
              <ShoppingCart className="w-4 h-4" />
              ${calculateTotal()}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">

          {/* STEP 1: PACKAGES */}
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4">Choose Your Package</h1>
                <p className="text-rush-gray font-medium">Select the best fit for your brand imagery.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {[
                  { id: "ecommerce", title: "E-Commerce", desc: "Clean, consistent studio shots.", price: "From $25/angle", img: PACKAGE_IMAGES.ecommerce, color: "text-[#E63946]" },
                  { id: "lifestyle", title: "Lifestyle", desc: "Creative scenes with depth.", price: "$149 flat rate", img: PACKAGE_IMAGES.lifestyle, color: "text-blue-600" },
                  { id: "fullpackage", title: "Full Package", desc: "E-commerce + Lifestyle.", price: "Save 10%", img: PACKAGE_IMAGES.fullpackage, color: "text-amber-600", badge: "Best Value" },
                ].map((pkg) => (
                  <button key={pkg.id} onClick={() => selectPackageType(pkg.id as any)} className="bg-white rounded-3xl overflow-hidden border border-rush-border shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all text-left">
                    <div className="h-48 relative">
                      <img src={pkg.img} className="w-full h-full object-cover" />
                      {pkg.badge && <div className="absolute top-4 right-4 bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{pkg.badge}</div>}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{pkg.title}</h3>
                      <p className="text-sm text-rush-gray mb-6 font-medium">{pkg.desc}</p>
                      <div className="flex items-center justify-between">
                        <span className={`font-black ${pkg.color}`}>{pkg.price}</span>
                        <ArrowRight className="w-4 h-4 text-rush-gray" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: STYLES */}
          {step === 2 && (
            <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-rush-gray font-bold text-sm mb-8 hover:text-rush-dark transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to packages
              </button>

              <h2 className="text-3xl font-extrabold mb-2">Build Your Order</h2>
              <p className="text-rush-gray font-medium mb-8">Select styles and angles to add to your shoot.</p>

              <div className="space-y-4 mb-12">
                {ECOMMERCE_STYLES.map(style => {
                  const inCart = order.cart.find(c => c.style === style.id);
                  const isEx = currentStyle === style.id;
                  return (
                    <div key={style.id} className="bg-white rounded-2xl border border-rush-border overflow-hidden shadow-sm">
                      <button onClick={() => selectStyle(style.id)} className="w-full p-4 flex items-center gap-4 text-left hover:bg-rush-light/50 transition-colors">
                        <img src={style.image} className="w-20 h-20 rounded-xl object-cover" />
                        <div className="flex-1">
                          <h4 className="font-bold">{style.name}</h4>
                          <p className="text-xs text-rush-gray font-medium">{style.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#E63946]">${style.pricePerAngle || PRICES.ecommerce.perAngle}</p>
                          <p className="text-[10px] font-bold text-rush-gray uppercase">per angle</p>
                        </div>
                        <ChevronDown className={`w-5 h-5 transition-transform ${isEx ? 'rotate-180' : 'opacity-30'}`} />
                      </button>

                      {isEx && (
                        <div className="p-6 bg-rush-light/30 border-t border-rush-border">
                          <p className="text-sm font-bold mb-4">Select Angles:</p>
                          <div className="grid grid-cols-4 gap-4 mb-6">
                            {ANGLES.map(a => (
                              <button key={a.id} onClick={() => toggleAngle(a.id)} className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${selectedAngles.includes(a.id) ? 'border-[#E63946] shadow-lg shadow-[#E63946]/10' : 'border-transparent grayscale'}`}>
                                <img src={a.image} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/20" />
                                <span className="absolute bottom-2 left-0 right-0 text-center text-white text-[10px] font-black uppercase tracking-wider">{a.name}</span>
                                {selectedAngles.includes(a.id) && <div className="absolute top-2 right-2 w-5 h-5 bg-[#E63946] rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-rush-gray">{selectedAngles.length} selected: <span className="text-rush-dark font-black">${selectedAngles.length * (style.pricePerAngle || PRICES.ecommerce.perAngle)}</span></p>
                            <button onClick={addToCart} disabled={selectedAngles.length === 0} className="bg-rush-dark text-white px-6 py-2 rounded-xl font-bold text-sm disabled:opacity-30">
                              {inCart ? 'Update Selection' : 'Add to Order'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Remove old cart display - will be shown in sticky bottom bar */}
            </motion.div>
          )}

          {/* STEP 3: LIFESTYLE INFO PAGE */}
          {step === 3 && (
            <motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-rush-gray font-bold text-sm mb-8 hover:text-rush-dark transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to packages
              </button>

              <div className="bg-white rounded-[2.5rem] border border-rush-border shadow-xl overflow-hidden">
                {/* Hero Image */}
                <div className="h-64 relative">
                  <img src={PACKAGE_IMAGES.lifestyle} alt="Lifestyle Photography" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-3">
                      <Sparkles className="w-4 h-4" /> Premium Service
                    </div>
                    <h1 className="text-4xl font-extrabold text-white">Lifestyle Photography</h1>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  <p className="text-lg text-rush-gray font-medium leading-relaxed mb-8">
                    Lifestyle refers to <strong className="text-rush-dark">tabletop styled photography</strong> with props, simple sets, and creative direction. Our team will develop a concept based on your product, get approval from you, then execute the shoot.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-6 mb-10">
                    {[
                      { icon: Camera, title: "Custom Concept", desc: "Tailored creative direction for your brand" },
                      { icon: Sparkles, title: "Styled Props", desc: "Professional prop selection and arrangement" },
                      { icon: CheckCircle, title: "Client Approval", desc: "Concept review before production" },
                    ].map((item, i) => (
                      <div key={i} className="bg-rush-light/50 p-5 rounded-2xl border border-rush-border">
                        <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4">
                          <item.icon className="w-5 h-5 text-[#E63946]" />
                        </div>
                        <h4 className="font-bold text-rush-dark mb-1">{item.title}</h4>
                        <p className="text-xs text-rush-gray font-medium">{item.desc}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-rush-light rounded-2xl p-6 mb-8 border border-rush-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-black text-rush-gray uppercase tracking-widest mb-1">Flat Rate Pricing</p>
                        <p className="text-4xl font-extrabold text-rush-dark">${PRICES.lifestyle.flatRate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-rush-gray">Includes</p>
                        <p className="text-sm font-bold text-rush-dark">Concept + Shoot + Editing</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CHECKOUT */}
          {step === 4 && (
            <motion.div key="4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
              <div className="space-y-8">
                {/* Checkout Header */}
                <div className="flex items-center gap-4 text-sm font-bold text-rush-gray uppercase tracking-widest mb-8">
                  {['Info', 'Shipping', 'Payment'].map((s, idx) => (
                    <div key={s} className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${idx === ['information', 'shipping', 'payment'].indexOf(checkoutStep) ? 'bg-[#E63946] text-white' : 'bg-rush-border'}`}>{idx + 1}</span>
                      <span className={idx === ['information', 'shipping', 'payment'].indexOf(checkoutStep) ? 'text-rush-dark' : ''}>{s}</span>
                      {idx < 2 && <div className="w-8 h-[1px] bg-rush-border mx-2" />}
                    </div>
                  ))}
                </div>

                {checkoutStep === 'information' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black">Contract Information</h2>
                    <div className="grid gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Email Address</label>
                        <input type="email" value={order.formData.email} onChange={(e) => updateFormData('email', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" placeholder="your@email.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Product Name</label>
                        <input type="text" value={order.formData.productName} onChange={(e) => updateFormData('productName', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" placeholder="E.g. Wireless Headphones" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Order Notes (Optional)</label>
                        <textarea value={order.formData.notes} onChange={(e) => updateFormData('notes', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium h-32" placeholder="Tell us about special requests..." />
                      </div>
                    </div>
                    <button onClick={handleCheckoutContinue} className="w-full bg-rush-dark text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-black/10">Continue to Shipping</button>
                  </div>
                )}

                {checkoutStep === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black">Shipping Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">First Name</label>
                        <input type="text" value={order.formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" />
                      </div>
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Last Name</label>
                        <input type="text" value={order.formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Address</label>
                        <input type="text" value={order.formData.address} onChange={(e) => updateFormData('address', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Phone (Optional)</label>
                        <input type="tel" value={order.formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button onClick={() => setCheckoutStep('information')} className="flex-1 bg-rush-light border border-rush-border text-rush-dark py-4 rounded-2xl font-bold">Back</button>
                      <button onClick={handleCheckoutContinue} className="flex-[2] bg-rush-dark text-white py-4 rounded-2xl font-black">Continue to Payment</button>
                    </div>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div className="space-y-8">
                    <h2 className="text-3xl font-black">Complete Payment</h2>
                    <div className="bg-white p-6 rounded-3xl border-2 border-rush-dark shadow-xl">
                      <div className="flex items-start gap-4 mb-6">
                        <div className="w-12 h-12 bg-rush-light rounded-2xl flex items-center justify-center"><CreditCard className="w-6 h-6 text-rush-dark" /></div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">Secure Credit Card</p>
                          <p className="text-sm text-rush-gray font-medium">You will be redirected to Stripe for safe payment.</p>
                        </div>
                      </div>
                      <button onClick={startStripeCheckout} disabled={isSubmitting} className="w-full bg-[#E63946] text-white py-4 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-lg shadow-[#E63946]/20">
                        {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : <><Lock className="w-4 h-4" /> Pay ${calculateTotal()}</>}
                      </button>
                    </div>

                    <div className="text-center font-bold text-rush-gray text-sm">OR</div>

                    <button onClick={placeInvoiceOrder} disabled={isSubmitting} className="w-full bg-white border-2 border-rush-border py-4 rounded-2xl font-bold text-rush-dark hover:border-rush-dark transition-all">
                      Request Invoice via Email
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Sidebar */}
              <div className="bg-white p-8 rounded-[40px] border border-rush-border shadow-sm h-fit sticky top-24">
                <h3 className="text-xl font-black mb-6">Order Summary</h3>
                <div className="space-y-4 mb-8">
                  {order.cart.map(item => (
                    <div key={item.style} className="flex justify-between items-start gap-4">
                      <div className="flex gap-3">
                        <img src={ECOMMERCE_STYLES.find(s => s.id === item.style)?.image} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <p className="font-bold text-sm leading-none mb-1">{ECOMMERCE_STYLES.find(s => s.id === item.style)?.name}</p>
                          <p className="text-[10px] text-rush-gray font-bold uppercase">{item.angles.length} Angles</p>
                        </div>
                      </div>
                      <span className="font-black text-sm">${item.angles.length * item.pricePerAngle}</span>
                    </div>
                  ))}
                  {order.lifestyleIncluded && (
                    <div className="flex justify-between items-center bg-purple-50 p-3 rounded-2xl border border-purple-100">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-purple-600" /></div>
                        <span className="font-bold text-sm">Lifestyle Session</span>
                      </div>
                      <span className="font-black text-sm text-purple-600">${PRICES.lifestyle.flatRate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 pt-6 border-t border-rush-border">
                  <div className="flex justify-between text-rush-gray font-bold text-sm">
                    <span>Subtotal</span>
                    <span>${calculateItemsSubtotal()}</span>
                  </div>
                  {calculateBundleDiscount(calculateItemsSubtotal()) > 0 && (
                    <div className="flex justify-between text-teal-600 font-bold text-sm">
                      <span>Bundle Discount (10%)</span>
                      <span>-${calculateBundleDiscount(calculateItemsSubtotal())}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-rush-dark font-black pt-4 border-t border-rush-border text-2xl">
                    <span>Total</span>
                    <span>${calculateTotal()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: SUCCESS */}
          {step === 5 && (
            <motion.div key="5" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md mx-auto text-center py-20">
              <div className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-teal-500/20">
                <Check className="w-12 h-12 text-white" strokeWidth={4} />
              </div>
              <h1 className="text-4xl font-black mb-4">Order Received!</h1>
              <p className="text-rush-gray font-medium mb-12">Thank you! Your production has been initialized. We&apos;ll be in touch within 24 hours.</p>

              <div className="bg-white p-6 rounded-3xl border border-rush-border mb-8 shadow-sm">
                <p className="text-[10px] font-black uppercase text-rush-gray tracking-widest mb-2">Tracking Number</p>
                <p className="text-2xl font-black text-rush-dark font-mono">{trackingNumber}</p>
              </div>

              <Link href="/admin" className="block w-full bg-[#E63946] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#E63946]/20 hover:scale-105 transition-all">Go to My Dashboard</Link>
              <button onClick={() => window.location.href = '/'} className="mt-4 text-rush-gray font-bold hover:text-rush-dark">Back to Homepage</button>
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Bottom Bar - Sticky (Show in step 2 and 3 when there are items) */}
      {(step === 2 || step === 3) && getTotalItems() > 0 && (
        <div className="sticky bottom-0 z-40">
          <div className="mx-3 sm:mx-6 mb-2 sm:mb-3">
            <div className="max-w-5xl mx-auto bg-white border border-rush-border rounded-xl sm:rounded-2xl px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                {/* Back Button */}
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-rush-dark hover:bg-rush-light transition-colors font-medium border border-rush-border text-sm"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Back</span>
                </button>

                {/* Price */}
                <div className="text-center flex-1">
                  <p className="text-[10px] sm:text-xs text-rush-gray font-bold uppercase tracking-wider">Estimated Total</p>
                  <p className="text-lg sm:text-2xl font-black text-rush-dark">
                    ${calculateTotal()}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setStep(4); setCheckoutStep('information'); }}
                  className="flex items-center gap-1.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold transition-all text-sm bg-[#E63946] text-white shadow-lg shadow-[#E63946]/25 hover:shadow-[#E63946]/40"
                >
                  <span>Add to Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}
