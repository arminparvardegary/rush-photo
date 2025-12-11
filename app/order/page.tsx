"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  ArrowRight,
  Check,
  ShoppingCart,
  Camera,
  Sparkles,
  Package,
  Info,
  Plus,
  Minus,
  X,
  Mail,
  Phone,
  User,
  Building,
  FileText,
  Send,
  CheckCircle,
  Clock,
  Copy,
  ChevronRight,
  ChevronDown,
  Truck,
  Store,
  Shield,
  Lock,
  Tag,
  CreditCard,
  Heart,
  Star,
  Zap
} from "lucide-react";

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
    cardNumber: string;
    expiry: string;
    cvv: string;
    nameOnCard: string;
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
      cardNumber: "",
      expiry: "",
      cvv: "",
      nameOnCard: "",
    },
  });
  const [selectedPackage, setSelectedPackage] = useState<PackageType>(null);
  const [currentStyle, setCurrentStyle] = useState<EcommerceStyle | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Angle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [discountCode, setDiscountCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showMiniCart, setShowMiniCart] = useState(false);
  
  // User state
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Dynamic pricing state
  const [PRICES, setPRICES] = useState(DEFAULT_PRICES);
  const [ECOMMERCE_STYLES, setECOMMERCE_STYLES] = useState(DEFAULT_ECOMMERCE_STYLES);
  const [ANGLES, setANGLES] = useState(DEFAULT_ANGLES);

  // Load pricing from localStorage on mount
  useEffect(() => {
    const savedPricing = localStorage.getItem("pricing");
    if (savedPricing) {
      try {
        const pricing = JSON.parse(savedPricing);
        setPRICES({
          ecommerce: { perAngle: pricing.ecommerce?.perAngle || 25 },
          lifestyle: { flatRate: pricing.lifestyle?.flatRate || 149 },
          fullPackageDiscount: (pricing.fullPackageDiscount || 10) / 100,
        });
        if (pricing.ecommerce?.styles) {
          setECOMMERCE_STYLES(pricing.ecommerce.styles);
        }
        if (pricing.angles) {
          setANGLES(pricing.angles);
        }
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    }
  }, []);

  // Handle URL package parameter
  useEffect(() => {
    const packageParam = searchParams.get("package");
    if (packageParam && ["ecommerce", "lifestyle", "fullpackage"].includes(packageParam)) {
      selectPackageType(packageParam as PackageType);
    }
  }, [searchParams]);

  // Load user data and pre-fill form
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
        
        // Pre-fill form data from user info
        setOrder(prev => ({
          ...prev,
          formData: {
            ...prev.formData,
            email: parsedUser.email || prev.formData.email,
            firstName: parsedUser.name?.split(' ')[0] || prev.formData.firstName,
            lastName: parsedUser.name?.split(' ').slice(1).join(' ') || prev.formData.lastName,
            phone: parsedUser.phone || prev.formData.phone,
            company: parsedUser.company || prev.formData.company,
          },
        }));
      } catch (e) {
        console.error("Error loading user:", e);
      }
    }
    
    // Check if returning from login
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

  const calculateTotal = () => {
    let total = 0;
    order.cart.forEach(item => {
      total += item.angles.length * item.pricePerAngle;
    });
    if (order.lifestyleIncluded) {
      total += PRICES.lifestyle.flatRate;
    }
    if (order.packageType === "fullpackage" && order.cart.length > 0) {
      total = total * (1 - PRICES.fullPackageDiscount);
    }
    return Math.round(total);
  };

  const getTotalAngles = () => {
    return order.cart.reduce((acc, item) => acc + item.angles.length, 0);
  };

  const getTotalItems = () => {
    let count = order.cart.length;
    if (order.lifestyleIncluded) count++;
    return count;
  };

  const selectPackageType = (type: PackageType) => {
    setOrder(prev => ({
      ...prev,
      packageType: type,
      lifestyleIncluded: type === "lifestyle" || type === "fullpackage",
    }));
    setSelectedPackage(type);
    if (type === "lifestyle") {
      setStep(4);
    } else {
      setStep(2);
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
    
    if (step === "payment") {
      if (!order.formData.cardNumber.trim()) newErrors.cardNumber = "Required";
      else if (order.formData.cardNumber.replace(/\s/g, "").length !== 16) newErrors.cardNumber = "Invalid card";
      if (!order.formData.expiry.trim()) newErrors.expiry = "Required";
      if (!order.formData.cvv.trim()) newErrors.cvv = "Required";
      if (!order.formData.nameOnCard.trim()) newErrors.nameOnCard = "Required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckoutContinue = () => {
    if (checkoutStep === "information" && validateCheckoutStep("information")) {
      setCheckoutStep("shipping");
    } else if (checkoutStep === "shipping" && validateCheckoutStep("shipping")) {
      setCheckoutStep("payment");
    } else if (checkoutStep === "payment" && validateCheckoutStep("payment")) {
      submitOrder();
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

  const submitOrder = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const tracking = `RUSH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setTrackingNumber(tracking);
    setOrderComplete(true);
    setStep(5);
    setIsSubmitting(false);
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
        cardNumber: "",
        expiry: "",
        cvv: "",
        nameOnCard: "",
      },
    });
    setStep(1);
    setCheckoutStep("information");
    setOrderComplete(false);
    setTrackingNumber("");
    setSelectedPackage(null);
  };

  const checkoutSteps: { key: CheckoutStep; label: string }[] = [
    { key: "information", label: "Information" },
    { key: "shipping", label: "Shipping" },
    { key: "payment", label: "Payment" },
  ];

  const stepIndex = checkoutSteps.findIndex(s => s.key === checkoutStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8F0] via-white to-[#fff0f0]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#1a1a1a]/5 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center shadow-lg shadow-[#E54A4A]/20">
                <Camera className="w-6 h-6 text-white" />
            </div>
              <span className="font-bold text-xl text-[#1a1a1a]">Rush Photos</span>
          </Link>
          
              {step > 1 && step < 5 && (
              <div className="relative">
                <button 
                  onClick={() => setShowMiniCart(!showMiniCart)}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] rounded-full transition-all group"
                >
                  <ShoppingCart className="w-5 h-5 text-[#1a1a1a]/70 group-hover:text-[#E54A4A] transition-colors" />
                  <span className="text-base font-semibold text-[#1a1a1a]">
                  ${calculateTotal()}
                    </span>
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#E54A4A] text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>

                {/* Mini Cart Dropdown */}
                {showMiniCart && getTotalItems() > 0 && (
                  <div className="absolute right-0 top-full mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#1a1a1a]/10 overflow-hidden z-50">
                    <div className="p-4 border-b border-[#1a1a1a]/5 bg-gradient-to-r from-[#E54A4A]/5 to-transparent">
                      <h3 className="font-bold text-[#1a1a1a] flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Your Cart
                      </h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {order.cart.map((item) => (
                        <div key={item.style} className="flex items-center justify-between p-4 hover:bg-[#f5f5f5] transition-colors">
                          <div className="flex items-center gap-3">
                            <img
                              src={ECOMMERCE_STYLES.find(s => s.id === item.style)?.image}
                              alt={getStyleName(item.style)}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div>
                              <p className="font-medium text-[#1a1a1a] text-sm">{getStyleName(item.style)}</p>
                              <p className="text-xs text-[#1a1a1a]/50">{item.angles.length} angles</p>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1a1a1a]">${item.angles.length * item.pricePerAngle}</span>
                        </div>
                      ))}
                      {order.lifestyleIncluded && (
                        <div className="flex items-center justify-between p-4 hover:bg-[#f5f5f5] transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-[#1a1a1a] text-sm">Lifestyle</p>
                              <p className="text-xs text-[#1a1a1a]/50">Styled shoot</p>
                            </div>
                          </div>
                          <span className="font-semibold text-[#1a1a1a]">${PRICES.lifestyle.flatRate}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border-t border-[#1a1a1a]/5 bg-[#f9f9f9]">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[#1a1a1a]/60">Total</span>
                        <span className="text-xl font-bold text-[#1a1a1a]">${calculateTotal()}</span>
                      </div>
                      <button 
                        onClick={() => {
                          setShowMiniCart(false);
                          setStep(4);
                          setCheckoutStep("information");
                        }}
                        className="w-full py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
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
        {/* Step 1: Package Selection - with Images */}
            {step === 1 && (
          <div className="py-10 sm:py-20">
            <div className="text-center mb-12 sm:mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E54A4A]/10 text-[#E54A4A] font-medium text-sm mb-6">
                <Zap className="w-4 h-4" />
                Professional Product Photography
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-6">
                Choose Your Package
                  </h1>
              <p className="text-lg sm:text-xl text-[#1a1a1a]/60 max-w-2xl mx-auto">
                Select the type of photography that best fits your brand and product needs
                  </p>
                </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
              {/* E-commerce Package */}
              <button
                onClick={() => selectPackageType("ecommerce")}
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  selectedPackage === "ecommerce" 
                    ? "ring-4 ring-[#E54A4A] scale-[1.02]" 
                    : selectedPackage ? "opacity-40 blur-[2px]" : "hover:scale-[1.02]"
                }`}
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={PACKAGE_IMAGES.ecommerce}
                    alt="E-commerce Photography"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
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
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  selectedPackage === "lifestyle" 
                    ? "ring-4 ring-purple-500 scale-[1.02]" 
                    : selectedPackage ? "opacity-40 blur-[2px]" : "hover:scale-[1.02]"
                }`}
              >
                <div className="aspect-[4/5] relative">
                  <img
                    src={PACKAGE_IMAGES.lifestyle}
                    alt="Lifestyle Photography"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-purple-900/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
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
                className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
                  selectedPackage === "fullpackage" 
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
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 via-amber-900/40 to-transparent" />
                  
                  <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end text-left">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 border border-white/30">
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
            <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-[#1a1a1a]/50">
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
              </div>
            )}

        {/* Step 2: Style Selection with Blur Effect */}
            {step === 2 && (
          <div className="py-8">
                  <button
              onClick={() => {
                setStep(1);
                setSelectedPackage(null);
              }}
              className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-8 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to packages
                  </button>

            <div className="text-center mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-3">
                Select E-commerce Style
                  </h1>
              <p className="text-[#1a1a1a]/60 text-lg">
                Choose the shooting style for your products
                  </p>
                </div>

            {/* Cart Summary - Sticky */}
            {order.cart.length > 0 && (
              <div className="sticky top-20 z-30 mb-8">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-[#1a1a1a]/5 shadow-lg">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                        <p className="font-bold text-[#1a1a1a]">{order.cart.length} style{order.cart.length > 1 ? 's' : ''} selected</p>
                        <p className="text-sm text-[#1a1a1a]/50">{getTotalAngles()} total angles</p>
                        </div>
                      </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-[#1a1a1a]/50">Subtotal</p>
                        <p className="text-2xl font-bold text-[#1a1a1a]">${calculateTotal()}</p>
                      </div>
                        <button
                        onClick={() => {
                          setStep(4);
                          setCheckoutStep("information");
                        }}
                        className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all flex items-center gap-2"
                      >
                        Checkout
                        <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                </div>
              </div>
            )}

            {/* Style Cards with Inline Angle Selection */}
            <div className="space-y-6">
                  {ECOMMERCE_STYLES.map((style) => {
                    const inCart = order.cart.find(item => item.style === style.id);
                const isSelected = currentStyle === style.id;
                const otherStyleSelected = currentStyle && currentStyle !== style.id;
                const stylePrice = style.pricePerAngle || PRICES.ecommerce.perAngle;
                
                    return (
                  <div 
                        key={style.id}
                    className={`transition-all duration-500 ${otherStyleSelected ? 'opacity-30 blur-sm scale-[0.98]' : ''}`}
                  >
                    {/* Style Card */}
                    <button
                        onClick={() => selectStyle(style.id)}
                      disabled={!!otherStyleSelected}
                      className={`group relative w-full rounded-3xl overflow-hidden transition-all duration-300 ${
                        isSelected 
                          ? 'ring-4 ring-[#E54A4A] shadow-2xl' 
                          : inCart 
                            ? 'ring-4 ring-green-500 shadow-xl' 
                            : 'hover:shadow-2xl'
                      }`}
                    >
                      {inCart && !isSelected && (
                        <div className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                          <Check className="w-6 h-6 text-white" />
                      </div>
                    )}
                      
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/3 aspect-video md:aspect-auto relative">
                          <img
                            src={style.image}
                            alt={style.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/60 hidden md:block" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent md:hidden" />
                          </div>
                        
                        <div className="md:w-2/3 p-6 md:p-8 bg-white flex flex-col justify-center">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{style.name}</h3>
                              <p className="text-[#1a1a1a]/60 text-sm mb-4">{style.description}</p>
                            </div>
                            <span className="text-[#E54A4A] font-bold text-xl whitespace-nowrap">${stylePrice}/angle</span>
                          </div>
                          <div className="flex items-center justify-between">
                            {inCart ? (
                              <span className="text-green-600 text-sm font-medium flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full">
                                <Check className="w-4 h-4" />
                                {inCart.angles.length} angles in cart
                              </span>
                            ) : (
                              <span className="text-[#1a1a1a]/40 text-sm">Click to select angles</span>
                            )}
                            <div className={`flex items-center gap-2 text-sm font-medium transition-colors ${isSelected ? 'text-[#E54A4A]' : 'text-[#1a1a1a]/60 group-hover:text-[#E54A4A]'}`}>
                              {isSelected ? 'Click to close' : 'Select angles'}
                              <ChevronDown className={`w-5 h-5 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Inline Angle Selection */}
                    {isSelected && (
                      <div className="mt-4 bg-white rounded-2xl border-2 border-[#E54A4A]/20 overflow-hidden shadow-lg animate-in slide-in-from-top-4 duration-300">
                        <div className="p-6 border-b border-[#1a1a1a]/5 bg-gradient-to-r from-[#E54A4A]/5 to-transparent">
                          <h4 className="font-bold text-[#1a1a1a]">Select Angles for {style.name}</h4>
                          <p className="text-sm text-[#1a1a1a]/50">Choose 1-4 angles for your product shots</p>
                        </div>
                        
                        <div className="p-6">
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                            {ANGLES.map((angle) => {
                              const isAngleSelected = selectedAngles.includes(angle.id);
                              return (
                                <button
                                  key={angle.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleAngle(angle.id);
                                  }}
                                  className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${
                                    isAngleSelected
                                      ? 'ring-4 ring-[#E54A4A] scale-[0.98]'
                                      : 'hover:scale-[1.02] hover:shadow-lg'
                                  }`}
                                >
                                  <img 
                                    src={angle.image} 
                                    alt={angle.name}
                                    className={`w-full h-full object-cover transition-all ${isAngleSelected ? 'brightness-90' : ''}`}
                                  />
                                  <div className={`absolute inset-0 transition-all ${
                                    isAngleSelected ? 'bg-[#E54A4A]/20' : 'bg-black/20 hover:bg-black/10'
                                  }`} />
                                  
                                  <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isAngleSelected
                                      ? 'border-[#E54A4A] bg-[#E54A4A]'
                                      : 'border-white bg-white/30'
                                  }`}>
                                    {isAngleSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                                  </div>
                                  
                                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white font-medium text-xs text-center">{angle.name}</p>
                                  </div>
                      </button>
                    );
                  })}
                </div>

                          {/* Add to Cart Section */}
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-[#f9f9f9] rounded-xl">
                            <div className="flex items-center gap-4">
                              <div className="text-center sm:text-left">
                                <p className="text-sm text-[#1a1a1a]/50">Selected</p>
                                <p className="text-2xl font-bold text-[#1a1a1a]">{selectedAngles.length} angle{selectedAngles.length !== 1 ? 's' : ''}</p>
                              </div>
                              <div className="text-center sm:text-left">
                                <p className="text-sm text-[#1a1a1a]/50">Subtotal</p>
                                <p className="text-2xl font-bold text-[#E54A4A]">${selectedAngles.length * stylePrice}</p>
                              </div>
                            </div>
                  <button
                              onClick={(e) => {
                                e.stopPropagation();
                                addToCart();
                              }}
                              disabled={selectedAngles.length === 0}
                              className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                                selectedAngles.length > 0
                                  ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-xl hover:shadow-[#E54A4A]/30'
                                  : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
                              }`}
                            >
                              <ShoppingCart className="w-5 h-5" />
                              Add to Cart
                  </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Items in Cart */}
            {order.cart.length > 0 && (
              <div className="mt-12">
                <h3 className="text-lg font-bold text-[#1a1a1a] mb-4">Added to Cart</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.cart.map((item) => {
                    const styleInfo = ECOMMERCE_STYLES.find(s => s.id === item.style);
                    return (
                      <div key={item.style} className="bg-white rounded-2xl p-4 border border-[#1a1a1a]/5 flex items-center gap-4">
                        <img 
                          src={styleInfo?.image} 
                          alt={getStyleName(item.style)}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-[#1a1a1a]">{getStyleName(item.style)}</h4>
                          <p className="text-sm text-[#1a1a1a]/50">{item.angles.length} angles</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#1a1a1a]">${item.angles.length * item.pricePerAngle}</p>
                  <button
                            onClick={() => removeFromCart(item.style)}
                            className="text-red-500 hover:text-red-600 text-sm flex items-center gap-1 mt-1"
                          >
                            <X className="w-3 h-3" />
                            Remove
                  </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
                )}
                            </div>
                          )}

        {/* Step 3: Angle Selection */}
        {step === 3 && currentStyle && (
          <div className="py-8">
            <div className="max-w-3xl mx-auto">
              <button
                onClick={() => {
                  setCurrentStyle(null);
                  setStep(2);
                }}
                className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-8 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                Back to styles
              </button>

              <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#1a1a1a]/5">
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
                          className={`relative aspect-square rounded-2xl overflow-hidden transition-all duration-300 ${
                        isSelected
                              ? 'ring-4 ring-[#E54A4A] scale-[0.98]'
                              : 'hover:scale-[1.02] hover:shadow-xl'
                          }`}
                        >
                        <img 
                          src={angle.image} 
                          alt={angle.name}
                            className={`w-full h-full object-cover transition-all duration-300 ${isSelected ? 'brightness-90' : ''}`}
                          />
                          <div className={`absolute inset-0 transition-all duration-300 ${
                            isSelected ? 'bg-[#E54A4A]/20' : 'bg-black/20 hover:bg-black/10'
                          }`} />
                          
                          {/* Selection Indicator */}
                          <div className={`absolute top-3 right-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#E54A4A] bg-[#E54A4A]'
                              : 'border-white bg-white/20'
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
                <div className="bg-[#f9f9f9] rounded-2xl p-6">
                  {(() => {
                    const styleConfig = ECOMMERCE_STYLES.find(s => s.id === currentStyle);
                    const pricePerAngle = styleConfig?.pricePerAngle || PRICES.ecommerce.perAngle;
                    return (
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                            <Camera className="w-6 h-6 text-white" />
                          </div>
                  <div>
                            <p className="font-bold text-[#1a1a1a]">{selectedAngles.length} angle{selectedAngles.length !== 1 ? 's' : ''} selected</p>
                            <p className="text-sm text-[#1a1a1a]/50">${pricePerAngle} each</p>
                          </div>
                    </div>
                  <div className="text-right">
                          <p className="text-sm text-[#1a1a1a]/50">Subtotal</p>
                          <p className="text-3xl font-bold text-[#E54A4A]">
                            ${selectedAngles.length * pricePerAngle}
                    </p>
                  </div>
                </div>
                    );
                  })()}

              <button
                onClick={addToCart}
                disabled={selectedAngles.length === 0}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${
                  selectedAngles.length > 0
                    ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-xl hover:shadow-[#E54A4A]/30'
                    : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
                }`}
              >
                      <ShoppingCart className="w-5 h-5" />
                      Add to Cart
              </button>
                  </div>
                </div>
              </div>
            </div>
                  </div>
                )}

        {/* Step 4: Modern Checkout */}
        {step === 4 && (
          <div className="grid lg:grid-cols-5 gap-0 min-h-[calc(100vh-80px)] -mx-4 sm:-mx-6">
            {/* Left Column - Form (3 cols) */}
            <div className="lg:col-span-3 p-6 md:p-10 lg:p-12 xl:p-16 bg-white order-2 lg:order-1">
              {/* Back Button */}
                {order.packageType !== "lifestyle" && (
                  <button
                    onClick={() => setStep(2)}
                  className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-8 group"
                  >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to styles
                  </button>
                )}
                {order.packageType === "lifestyle" && (
                    <button
                      onClick={() => setStep(1)}
                  className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-8 group"
                    >
                  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      Back to packages
                    </button>
              )}

              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-3 mb-10">
                {checkoutSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center gap-3">
                    <button
                      onClick={() => index <= stepIndex && setCheckoutStep(step.key)}
                      disabled={index > stepIndex}
                      className={`flex items-center gap-2 transition-all ${
                        index === stepIndex 
                          ? "text-[#E54A4A] font-semibold" 
                          : index < stepIndex 
                            ? "text-[#1a1a1a]/60 hover:text-[#E54A4A]" 
                            : "text-[#1a1a1a]/30 cursor-not-allowed"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                        index === stepIndex 
                          ? "bg-[#E54A4A] text-white" 
                          : index < stepIndex 
                            ? "bg-green-500 text-white" 
                            : "bg-[#1a1a1a]/10 text-[#1a1a1a]/30"
                      }`}>
                        {index < stepIndex ? <Check className="w-4 h-4" /> : index + 1}
                      </span>
                      <span className="hidden sm:inline">{step.label}</span>
                    </button>
                    {index < checkoutSteps.length - 1 && (
                      <div className={`w-8 lg:w-12 h-0.5 rounded-full ${
                        index < stepIndex ? "bg-green-500" : "bg-[#1a1a1a]/10"
                      }`} />
                    )}
              </div>
                ))}
                        </div>

              {/* Step Content */}
              {checkoutStep === "information" && (
                <div className="space-y-8">
                  {/* Login Section */}
                  {!isLoggedIn ? (
                    <div className="bg-gradient-to-r from-[#E54A4A]/5 to-[#ff7f7f]/5 rounded-2xl p-6 border border-[#E54A4A]/10">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-[#E54A4A]/10 flex items-center justify-center">
                            <User className="w-6 h-6 text-[#E54A4A]" />
                          </div>
                <div>
                            <h3 className="font-bold text-[#1a1a1a]">Have an account?</h3>
                            <p className="text-sm text-[#1a1a1a]/50">Login for faster checkout</p>
                          </div>
                        </div>
                        <button
                          onClick={handleLoginRedirect}
                          className="px-6 py-2.5 bg-[#1a1a1a] text-white font-medium rounded-xl hover:bg-[#333] transition-colors flex items-center gap-2"
                        >
                          <User className="w-4 h-4" />
                          Login
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1a1a1a]">Welcome back, {user?.name || user?.email?.split('@')[0]}!</h3>
                          <p className="text-sm text-[#1a1a1a]/50">Your information has been pre-filled</p>
                        </div>
                      </div>
                    </div>
                  )}

                <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Contact Information</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Email address</label>
                      <input
                        type="email"
                        value={order.formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                          className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                            errors.email ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                          placeholder="your@email.com"
                      />
                        {errors.email && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><Info className="w-4 h-4" />{errors.email}</p>}
                    </div>

                      <label className="flex items-center gap-3 cursor-pointer py-2">
                      <div 
                        onClick={() => setEmailUpdates(!emailUpdates)}
                          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                            emailUpdates ? "bg-[#E54A4A] border-[#E54A4A]" : "border-[#1a1a1a]/20 hover:border-[#E54A4A]"
                        }`}
                      >
                          {emailUpdates && <Check className="w-4 h-4 text-white" strokeWidth={3} />}
                    </div>
                        <span className="text-[#1a1a1a]/70">Email me with news and exclusive offers</span>
                    </label>
                    </div>
                  </div>
                    
                    <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Product Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Product name *</label>
                      <input
                        type="text"
                        value={order.formData.productName}
                        onChange={(e) => updateFormData("productName", e.target.value)}
                          className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                            errors.productName ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                          placeholder="What product are we photographing?"
                      />
                        {errors.productName && <p className="text-red-500 text-sm mt-2 flex items-center gap-1"><Info className="w-4 h-4" />{errors.productName}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Additional notes (optional)</label>
                    <textarea
                      value={order.formData.notes}
                      onChange={(e) => updateFormData("notes", e.target.value)}
                          rows={4}
                          className="w-full px-5 py-4 bg-[#f7f7f7] border-2 border-transparent rounded-xl text-[#1a1a1a] focus:border-[#E54A4A] focus:bg-white focus:outline-none placeholder-[#1a1a1a]/40 resize-none"
                          placeholder="Any specific requirements or preferences?"
                        />
                      </div>
                    </div>
                    </div>

                  <button
                    onClick={handleCheckoutContinue}
                    className="w-full py-5 bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    Continue to Shipping
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  </div>
              )}

              {checkoutStep === "shipping" && (
                <div className="space-y-8">
                    <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Delivery Method</h2>
                    <div className="border-2 border-[#E54A4A] rounded-xl p-5 bg-[#E54A4A]/5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#E54A4A] flex items-center justify-center">
                          <Mail className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-[#1a1a1a]">Digital Delivery</p>
                          <p className="text-sm text-[#1a1a1a]/60">High-resolution files delivered via email</p>
                      </div>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Billing Address</h2>
                  <div className="space-y-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Country/Region</label>
                      <select
                        value={order.formData.country}
                        onChange={(e) => updateFormData("country", e.target.value)}
                          className="w-full px-5 py-4 bg-[#f7f7f7] border-2 border-transparent rounded-xl text-[#1a1a1a] focus:border-[#E54A4A] focus:bg-white focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                        <ChevronDown className="absolute right-5 top-[52px] w-5 h-5 text-[#1a1a1a]/40 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">First name</label>
                      <input
                        type="text"
                        value={order.formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.firstName ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Last name</label>
                      <input
                        type="text"
                        value={order.formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.lastName ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                    </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Company (optional)</label>
                      <input
                        type="text"
                          value={order.formData.company}
                          onChange={(e) => updateFormData("company", e.target.value)}
                          className="w-full px-5 py-4 bg-[#f7f7f7] border-2 border-transparent rounded-xl text-[#1a1a1a] focus:border-[#E54A4A] focus:bg-white focus:outline-none"
                    />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Address</label>
                    <input
                      type="text"
                      value={order.formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                          className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                            errors.address ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                          } focus:outline-none`}
                        />
                      </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">City</label>
                      <input
                        type="text"
                        value={order.formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.city ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">State</label>
                      <input
                        type="text"
                        value={order.formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.state ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">ZIP code</label>
                      <input
                        type="text"
                        value={order.formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.zipCode ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Phone (optional)</label>
                    <input
                      type="tel"
                      value={order.formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                          className="w-full px-5 py-4 bg-[#f7f7f7] border-2 border-transparent rounded-xl text-[#1a1a1a] focus:border-[#E54A4A] focus:bg-white focus:outline-none"
                          placeholder="For order updates"
                    />
                      </div>
                    </div>
                    </div>

                  <button
                    onClick={handleCheckoutContinue}
                    className="w-full py-5 bg-[#1a1a1a] hover:bg-[#333] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3 text-lg"
                  >
                    Continue to Payment
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => setCheckoutStep("information")}
                    className="w-full text-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return to information
                  </button>
                  </div>
              )}

              {checkoutStep === "payment" && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-6">Payment</h2>
                    <p className="text-[#1a1a1a]/60 mb-6">All transactions are secure and encrypted.</p>
                    
                    <div className="border-2 border-[#1a1a1a]/10 rounded-xl overflow-hidden">
                      <div className="bg-[#f7f7f7] p-5 border-b border-[#1a1a1a]/10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CreditCard className="w-6 h-6 text-[#1a1a1a]/70" />
                            <span className="font-semibold text-[#1a1a1a]">Credit card</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-6 bg-gradient-to-r from-blue-600 to-blue-800 rounded text-white text-xs flex items-center justify-center font-bold">VISA</div>
                            <div className="w-10 h-6 bg-gradient-to-r from-red-500 to-orange-500 rounded text-white text-xs flex items-center justify-center font-bold">MC</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4 bg-white">
                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Card number</label>
                    <input
                      type="text"
                      value={order.formData.cardNumber}
                      onChange={(e) => updateFormData("cardNumber", formatCardNumber(e.target.value))}
                      maxLength={19}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] font-mono transition-all ${
                              errors.cardNumber ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>

                    <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Expiration date</label>
                      <input
                        type="text"
                        value={order.formData.expiry}
                        onChange={(e) => updateFormData("expiry", formatExpiry(e.target.value))}
                        maxLength={5}
                              className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] font-mono transition-all ${
                                errors.expiry ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                              } focus:outline-none`}
                        placeholder="MM/YY"
                      />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Security code</label>
                      <input
                        type="password"
                        value={order.formData.cvv}
                        onChange={(e) => updateFormData("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                              className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] font-mono transition-all ${
                                errors.cvv ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                              } focus:outline-none`}
                        placeholder="CVV"
                      />
                          </div>
                  </div>

                        <div>
                          <label className="block text-sm font-medium text-[#1a1a1a]/70 mb-2">Name on card</label>
                    <input
                      type="text"
                      value={order.formData.nameOnCard}
                      onChange={(e) => updateFormData("nameOnCard", e.target.value)}
                            className={`w-full px-5 py-4 bg-[#f7f7f7] border-2 rounded-xl text-[#1a1a1a] transition-all ${
                              errors.nameOnCard ? "border-red-500 bg-red-50" : "border-transparent focus:border-[#E54A4A] focus:bg-white"
                            } focus:outline-none`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                    <Shield className="w-6 h-6 text-green-600" />
                    <p className="text-sm text-green-800">Your payment information is encrypted and secure. We never store your card details.</p>
                </div>

                  <button
                    onClick={handleCheckoutContinue}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-[#E54A4A] hover:bg-[#d43d3d] text-white font-semibold rounded-xl transition-all disabled:opacity-70 flex items-center justify-center gap-3 text-lg shadow-lg shadow-[#E54A4A]/20"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Lock className="w-5 h-5" />
                        Pay ${calculateTotal()}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCheckoutStep("shipping")}
                    className="w-full text-center text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Return to shipping
                  </button>
                </div>
              )}
                </div>

            {/* Right Column - Order Summary (2 cols) */}
            <div className="lg:col-span-2 bg-[#f9f9f9] border-l border-[#1a1a1a]/5 p-6 md:p-10 lg:p-12 order-1 lg:order-2">
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 pb-6">
                    {order.cart.map((item) => (
                  <div key={item.style} className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white border border-[#1a1a1a]/10 flex-shrink-0 shadow-sm">
                      <img
                        src={ECOMMERCE_STYLES.find(s => s.id === item.style)?.image}
                        alt={getStyleName(item.style)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#E54A4A] rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                        {item.angles.length}
              </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1a1a1a] truncate">{getStyleName(item.style)}</h3>
                      <p className="text-sm text-[#1a1a1a]/50">{item.angles.length} angles × ${item.pricePerAngle}</p>
                    </div>
                    <p className="font-semibold text-[#1a1a1a]">${item.angles.length * item.pricePerAngle}</p>
                      </div>
                    ))}

                    {order.lifestyleIncluded && (
                  <div className="flex items-start gap-4">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Sparkles className="w-8 h-8 text-white" />
                  </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#1a1a1a]">Lifestyle Photography</h3>
                      <p className="text-sm text-[#1a1a1a]/50">Custom styled shoot</p>
                </div>
                    <p className="font-semibold text-[#1a1a1a]">${PRICES.lifestyle.flatRate}</p>
                    </div>
                    )}
              </div>

              {/* Discount Code */}
              <div className="py-6 border-t border-[#1a1a1a]/10">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/40" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border-2 border-[#1a1a1a]/10 rounded-xl text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none placeholder-[#1a1a1a]/40"
                      placeholder="Discount code"
                    />
                  </div>
                  <button className="px-6 py-4 bg-[#1a1a1a] hover:bg-[#333] rounded-xl font-semibold text-white transition-colors">
                    Apply
                  </button>
                </div>
                </div>

              {/* Price Breakdown */}
              <div className="py-6 border-t border-[#1a1a1a]/10 space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/60">Subtotal</span>
                  <span className="text-[#1a1a1a] font-medium">${calculateTotal()}</span>
                      </div>
                {order.packageType === "fullpackage" && order.cart.length > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      Full Package Discount
                    </span>
                    <span className="font-medium">-10%</span>
                      </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#1a1a1a]/60">Delivery</span>
                  <span className="text-green-600 font-medium">Free</span>
                    </div>
                      </div>

              {/* Total */}
              <div className="py-6 border-t border-[#1a1a1a]/10 flex justify-between items-center">
                <span className="text-lg text-[#1a1a1a]">Total</span>
                <div className="text-right">
                  <span className="text-xs text-[#1a1a1a]/40 mr-2">USD</span>
                  <span className="text-3xl font-bold text-[#1a1a1a]">${calculateTotal()}</span>
                      </div>
                    </div>

              {/* Info */}
              <div className="mt-6 p-5 bg-white rounded-xl border border-[#1a1a1a]/5">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#E54A4A] mt-0.5" />
                  <div>
                    <p className="font-medium text-[#1a1a1a]">3-5 Business Days</p>
                    <p className="text-sm text-[#1a1a1a]/50 mt-1">
                      High-resolution photos delivered digitally. 100% satisfaction guaranteed.
                    </p>
                  </div>
                </div>
              </div>
                      </div>
                      </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && orderComplete && (
          <div className="py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-xl shadow-green-500/30">
                <CheckCircle className="w-12 h-12 text-white" />
                </div>

              <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">
                Order Confirmed!
              </h1>
              
              <p className="text-lg text-[#1a1a1a]/60 mb-10">
                Thank you for your order. We'll be in touch shortly to confirm details and get started on your project.
              </p>

              <div className="bg-white rounded-3xl p-8 border border-[#1a1a1a]/5 shadow-xl mb-8">
                <p className="text-sm text-[#1a1a1a]/60 mb-3">Tracking Number</p>
                <div className="flex items-center justify-center gap-4">
                  <code className="text-2xl font-mono font-bold text-[#E54A4A]">
                    {trackingNumber}
                  </code>
                <button
                    onClick={copyTrackingNumber}
                    className="p-3 rounded-xl bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 transition-colors"
                  >
                    <Copy className="w-5 h-5 text-[#1a1a1a]/60" />
                </button>
              </div>
          </div>

              <div className="bg-gradient-to-br from-[#E54A4A]/10 to-[#ff7f7f]/10 rounded-3xl p-8 mb-8 text-left">
                <h3 className="font-bold text-[#1a1a1a] mb-4 text-lg">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#1a1a1a]/60">Package</span>
                    <span className="font-medium text-[#1a1a1a] capitalize">{order.packageType}</span>
              </div>
                  {order.cart.length > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">E-commerce Styles</span>
                      <span className="font-medium text-[#1a1a1a]">{order.cart.length}</span>
                </div>
              )}
                  {order.lifestyleIncluded && (
                    <div className="flex justify-between">
                      <span className="text-[#1a1a1a]/60">Lifestyle</span>
                      <span className="font-medium text-[#1a1a1a]">Included</span>
              </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-[#1a1a1a]/10">
                    <span className="font-bold text-[#1a1a1a]">Total</span>
                    <span className="font-bold text-[#E54A4A] text-xl">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetOrder}
                  className="flex-1 py-4 border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold rounded-xl hover:bg-[#1a1a1a] hover:text-white transition-all"
                >
                  New Order
                </button>
                <Link
                  href="/"
                  className="flex-1 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-xl hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all text-center"
                >
                  Back to Home
                </Link>
                </div>
            </div>
          </div>
          )}
      </main>
    </div>
  );
}
