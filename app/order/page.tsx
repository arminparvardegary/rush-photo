"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore, CartItem as StoreCartItem } from "@/lib/store";
import { useCartSync } from "@/hooks/useCartSync";
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
type EcommerceStyle = "straight-on" | "angled";
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
  ecommerce: "/images/portfolio/speakers.jpg?v=3",
  lifestyle: "/images/portfolio/flowers-table.jpg?v=3",
  fullpackage: "/images/portfolio/pink-bottle.jpg?v=3",
};

const DEFAULT_ECOMMERCE_STYLES: { id: EcommerceStyle; name: string; description: string; image: string; pricePerAngle: number }[] = [
  {
    id: "straight-on",
    name: "Straight On",
    description: "Direct front-facing shots, perfect for showcasing product details",
    image: "/images/portfolio/speakers.jpg?v=5",
    pricePerAngle: 25,
  },
  {
    id: "angled",
    name: "Angled",
    description: "Dynamic 45° angle shots that add depth and dimension",
    image: "/images/portfolio/sneaker.jpg?v=5",
    pricePerAngle: 25,
  },
];

const DEFAULT_ANGLES: { id: Angle; name: string; image: string; price: number }[] = [
  { id: "front", name: "Front", image: "/images/portfolio/speakers.jpg?v=5", price: 25 },
  { id: "back", name: "Back", image: "/images/portfolio/pink-bottle.jpg?v=5", price: 25 },
  { id: "left", name: "Left Side", image: "/images/portfolio/serum-bottle.jpg?v=5", price: 25 },
  { id: "right", name: "Right Side", image: "/images/portfolio/black-sprayer.jpg?v=5", price: 25 },
];

export default function OrderPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addItem } = useCartStore();

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
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

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

  const handleAddAllToCart = async () => {
    if (order.cart.length === 0) return;

    setIsAddingToCart(true);

    // Add each style as a separate cart item
    for (const item of order.cart) {
      const styleConfig = ECOMMERCE_STYLES.find(s => s.id === item.style);
      const pricePerAngle = item.pricePerAngle || PRICES.ecommerce.perAngle;
      const totalPrice = item.angles.length * pricePerAngle;

      const cartItem: StoreCartItem = {
        id: `cart_${Date.now()}_${item.style}`,
        orderId: `order_${Date.now()}`,
        packageType: "ecommerce",
        photoStyle: item.style,
        selectedAngles: item.angles,
        aspectRatios: ["16:9"],
        skuCount: 1,
        productNotes: "",
        price: totalPrice,
        addedAt: new Date().toISOString(),
      };

      await addItem(cartItem);
    }

    // Show success animation
    setAddedToCart(true);

    // Navigate to cart after 1 second
    setTimeout(() => {
      router.push("/cart");
    }, 1000);
  };

  // Add lifestyle/fullpackage to cart
  const handleAddPackageToCart = async () => {
    setIsAddingToCart(true);

    if (order.packageType === "lifestyle") {
      const cartItem: StoreCartItem = {
        id: `cart_${Date.now()}`,
        orderId: `order_${Date.now()}`,
        packageType: "lifestyle",
        photoStyle: undefined,
        selectedAngles: [],
        aspectRatios: ["16:9"],
        skuCount: 1,
        productNotes: "",
        price: PRICES.lifestyle.flatRate,
        addedAt: new Date().toISOString(),
      };
      await addItem(cartItem);
    } else if (order.packageType === "fullpackage") {
      // Add all ecommerce styles + lifestyle as one package
      const totalEcommerce = order.cart.reduce((sum, item) => sum + (item.angles.length * item.pricePerAngle), 0);
      const lifestylePrice = PRICES.lifestyle.flatRate;
      const subtotal = totalEcommerce + lifestylePrice;
      const discount = Math.round(subtotal * PRICES.fullPackageDiscount);
      const totalPrice = subtotal - discount;

      const cartItem: StoreCartItem = {
        id: `cart_${Date.now()}`,
        orderId: `order_${Date.now()}`,
        packageType: "fullpackage",
        photoStyle: undefined,
        selectedAngles: ["front", "back", "left", "right"],
        aspectRatios: ["16:9"],
        skuCount: order.cart.length,
        productNotes: `Includes ${order.cart.length} e-commerce styles + lifestyle session`,
        price: totalPrice,
        addedAt: new Date().toISOString(),
      };
      await addItem(cartItem);
    }

    // Show success animation
    setAddedToCart(true);

    // Navigate to cart after 1 second
    setTimeout(() => {
      router.push("/cart");
    }, 1000);
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

  // Success popup after adding to cart
  if (addedToCart) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rush-light">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-2xl font-bold text-rush-dark mb-2">
            Added to Cart!
          </h2>
          <p className="text-rush-gray">Redirecting to your cart...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rush-light text-rush-dark font-sans">
      <StepProgress currentStep={getWizardProgress()} totalSteps={6} />

      <header className="bg-white border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 w-auto object-contain" />
            <span className="font-bold text-xl sm:text-2xl">photos</span>
          </Link>
          {getTotalItems() > 0 && step < 5 && (
            <button onClick={() => setShowMiniCart(!showMiniCart)} className="bg-rush-light border border-rush-border px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm">
              <ShoppingCart className="w-4 h-4" />
              ${calculateTotal()}
            </button>
          )}
        </div>
      </header>

      <main className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        <AnimatePresence mode="wait">

          {/* STEP 1: PACKAGES */}
          {step === 1 && (
            <motion.div key="1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold mb-4">Choose Your Package</h1>
                <p className="text-rush-gray font-medium">Select the best fit for your brand imagery.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 md:gap-8 3xl:gap-10 max-w-5xl 3xl:max-w-6xl mx-auto">
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
            <motion.div key="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl 3xl:max-w-5xl mx-auto pb-24">
              <button onClick={() => setStep(1)} className="flex items-center gap-2 text-rush-gray font-bold text-sm mb-8 hover:text-rush-dark transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to packages
              </button>

              <h2 className="text-3xl font-extrabold mb-2">Build Your Order</h2>
              <p className="text-rush-gray font-medium mb-8">Select styles and angles to add to your shoot.</p>

              <div className="space-y-6 mb-12">
                {ECOMMERCE_STYLES.map(style => {
                  const inCart = order.cart.find(c => c.style === style.id);
                  const isEx = currentStyle === style.id;
                  return (
                    <div key={style.id} className={`bg-white rounded-3xl border-2 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${isEx ? 'border-[#E63946]/50 shadow-[#E63946]/10' : 'border-rush-border'}`}>
                      <button onClick={() => selectStyle(style.id)} className="w-full p-6 flex items-center gap-6 text-left hover:bg-rush-light/30 transition-colors">
                        <div className="relative">
                          <img src={style.image} className="w-28 h-28 rounded-2xl object-cover shadow-md" />
                          {inCart && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#34C759] rounded-full flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4 text-white" strokeWidth={3} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-black text-xl text-rush-dark mb-1">{style.name}</h4>
                          <p className="text-sm text-rush-gray font-medium leading-relaxed">{style.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-2xl text-[#E63946]">${style.pricePerAngle || PRICES.ecommerce.perAngle}</p>
                          <p className="text-xs font-bold text-rush-gray uppercase tracking-wider">per angle</p>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isEx ? 'bg-[#E63946] text-white' : 'bg-rush-light text-rush-gray'}`}>
                          <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isEx ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isEx && (
                        <div className="p-8 bg-gradient-to-b from-rush-light/50 to-white border-t border-rush-border">
                          <p className="text-base font-bold mb-6 text-rush-dark">Select Angles:</p>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-8">
                            {ANGLES.map(a => (
                              <button key={a.id} onClick={() => toggleAngle(a.id)} className={`relative aspect-square rounded-2xl overflow-hidden border-3 transition-all duration-300 group ${selectedAngles.includes(a.id) ? 'border-[#E63946] shadow-xl shadow-[#E63946]/20 scale-[1.02]' : 'border-transparent grayscale hover:grayscale-0 hover:scale-[1.02]'}`}>
                                <img src={a.image} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                                <div className={`absolute inset-0 transition-all duration-300 ${selectedAngles.includes(a.id) ? 'bg-[#E63946]/20' : 'bg-black/30 group-hover:bg-black/20'}`} />
                                <span className="absolute bottom-3 left-0 right-0 text-center text-white text-sm font-black uppercase tracking-wider drop-shadow-lg">{a.name}</span>
                                {selectedAngles.includes(a.id) && (
                                  <div className="absolute top-3 right-3 w-7 h-7 bg-[#E63946] rounded-full flex items-center justify-center shadow-lg">
                                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                                  </div>
                                )}
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center justify-between bg-white rounded-2xl p-5 border border-rush-border shadow-sm">
                            <div>
                              <p className="text-sm text-rush-gray font-medium">{selectedAngles.length} angle{selectedAngles.length !== 1 ? 's' : ''} selected</p>
                              <p className="text-2xl font-black text-rush-dark">${selectedAngles.length * (style.pricePerAngle || PRICES.ecommerce.perAngle)}</p>
                            </div>
                            <button
                              onClick={addToCart}
                              disabled={selectedAngles.length === 0}
                              className="bg-[#E63946] text-white px-8 py-4 rounded-2xl font-bold text-base disabled:opacity-30 hover:bg-[#D62839] hover:scale-[1.02] transition-all flex items-center gap-3 shadow-lg shadow-[#E63946]/25"
                            >
                              <Check className="w-5 h-5" />
                              Save Selection
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
            <motion.div key="3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="max-w-3xl mx-auto pb-24">
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
                    <div className="flex items-center gap-2 mb-6">
                      <Mail className="w-5 h-5 text-[#E63946]" />
                      <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                    </div>

                    {isLoggedIn && user ? (
                      // Authenticated View - Show user info
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500 mb-1">Signed in as</p>
                            <p className="font-medium text-gray-900 flex items-center gap-2">
                              {user.name || 'User'}
                              <span className="text-gray-400">•</span>
                              {user.email}
                            </p>
                          </div>
                          <button
                            onClick={async () => {
                              try {
                                // Clear local state first
                                setUser(null);
                                setIsLoggedIn(false);
                                setOrder(prev => ({
                                  ...prev,
                                  formData: { ...prev.formData, email: '', firstName: '', lastName: '' }
                                }));

                                // Call logout endpoint
                                await fetch('/api/auth/logout', { method: 'POST' });

                                // Redirect to home
                                window.location.href = "/";
                              } catch (error) {
                                console.error("Logout error:", error);
                                window.location.href = "/";
                              }
                            }}
                            className="text-sm text-[#E63946] hover:text-[#D62839] transition-colors font-medium"
                          >
                            Sign out
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Guest Checkout - Email + Sign In Button
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-2">Email <span className="text-[#E63946]">*</span></label>
                          <input
                            type="email"
                            value={order.formData.email}
                            onChange={(e) => updateFormData('email', e.target.value)}
                            className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#E63946] transition-colors hover:border-gray-300"
                            placeholder="your@email.com"
                            required
                          />
                          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>

                        {/* Sign In Button */}
                        <div className="pt-2">
                          <Link
                            href="/login?redirect=/order"
                            className="w-full bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <Lock className="w-4 h-4" />
                            Already have an account? Sign In
                          </Link>
                        </div>

                        {/* Email Updates Checkbox */}
                        <div className="pt-4 border-t border-gray-200">
                          <label className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={emailUpdates}
                              onChange={() => setEmailUpdates(!emailUpdates)}
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded border-2 ${emailUpdates ? "bg-[#E63946] border-[#E63946]" : "border-gray-300"} flex items-center justify-center transition-colors`}>
                              {emailUpdates && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                            </div>
                            <span className="text-sm text-gray-600">Email me with news and offers</span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Product Info - Always Show */}
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Product Name <span className="text-[#E63946]">*</span></label>
                        <input
                          type="text"
                          value={order.formData.productName}
                          onChange={(e) => updateFormData('productName', e.target.value)}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#E63946] transition-colors hover:border-gray-300"
                          placeholder="E.g. Wireless Headphones"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">What product will you be sending for photography?</p>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-600 mb-2">Order Notes <span className="text-gray-400">(Optional)</span></label>
                        <textarea
                          value={order.formData.notes}
                          onChange={(e) => updateFormData('notes', e.target.value)}
                          className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-[#E63946] transition-colors hover:border-gray-300 h-24 resize-none"
                          placeholder="Tell us about special requests..."
                        />
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleCheckoutContinue}
                      className="w-full mt-4 bg-gradient-to-r from-[#E63946] to-[#FF6B6B] hover:from-[#D62839] hover:to-[#E63946] text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-[#E63946]/25 hover:shadow-[#E63946]/40"
                    >
                      Continue to Shipping
                    </motion.button>
                  </div>
                )}

                {checkoutStep === 'shipping' && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-black">Shipping Details</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">First Name <span className="text-[#E63946]">*</span></label>
                        <input type="text" value={order.formData.firstName} onChange={(e) => updateFormData('firstName', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" required />
                      </div>
                      <div className="space-y-1.5 col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Last Name <span className="text-[#E63946]">*</span></label>
                        <input type="text" value={order.formData.lastName} onChange={(e) => updateFormData('lastName', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" required />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Address <span className="text-[#E63946]">*</span></label>
                        <input type="text" value={order.formData.address} onChange={(e) => updateFormData('address', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" placeholder="Street address" required />
                      </div>
                      <div className="space-y-1.5 col-span-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-rush-gray">Phone <span className="text-gray-400 normal-case">(Optional)</span></label>
                        <input type="tel" value={order.formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} className="w-full p-4 rounded-xl border border-rush-border bg-white focus:border-[#E63946] outline-none font-medium" placeholder="+1 (555) 000-0000" />
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
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-3xl border border-purple-100 shadow-lg">
                      <div className="flex items-start gap-4 mb-5">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                            <path d="M3 8.5L12 3L21 8.5V15.5L12 21L3 15.5V8.5Z" stroke="#635BFF" strokeWidth="2"/>
                            <path d="M12 12L21 8.5" stroke="#635BFF" strokeWidth="2"/>
                            <path d="M12 12L3 8.5" stroke="#635BFF" strokeWidth="2"/>
                            <path d="M12 12V21" stroke="#635BFF" strokeWidth="2"/>
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg">Stripe Secure Checkout</p>
                          <p className="text-sm text-gray-600">Multiple payment options available</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                          <CreditCard className="w-3.5 h-3.5" />
                          Credit Card
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                          Stripe Link
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                          Apple Pay
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-gray-700 shadow-sm">
                          Google Pay
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

      {/* Bottom Bar - Sticky for E-commerce (step 2) */}
      {step === 2 && order.cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rush-border shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Cart Summary */}
              <div className="flex-1">
                <p className="text-xs text-rush-gray font-medium mb-0.5">{order.cart.length} style{order.cart.length !== 1 ? 's' : ''} • {getTotalAngles()} angle{getTotalAngles() !== 1 ? 's' : ''}</p>
                <p className="text-xl sm:text-2xl font-black text-rush-dark">${calculateTotal()}</p>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddAllToCart}
                disabled={isAddingToCart}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all text-base bg-[#E63946] text-white shadow-lg shadow-[#E63946]/25 hover:bg-[#D62839] disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar - Sticky for Lifestyle/Full Package (step 3) */}
      {step === 3 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rush-border shadow-2xl">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Price */}
              <div className="flex-1">
                <p className="text-xs text-rush-gray font-medium mb-0.5">Lifestyle Photography</p>
                <p className="text-xl sm:text-2xl font-black text-rush-dark">${PRICES.lifestyle.flatRate}</p>
              </div>

              {/* Add to Cart Button */}
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddPackageToCart}
                disabled={isAddingToCart}
                className="flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold transition-all text-base bg-[#E63946] text-white shadow-lg shadow-[#E63946]/25 hover:bg-[#D62839] disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
}
