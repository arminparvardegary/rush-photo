"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  Tag
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

// Pricing
const PRICES = {
  ecommerce: {
    perAngle: 25,
  },
  lifestyle: {
    flatRate: 149,
  },
  fullPackageDiscount: 0.1,
};

// Style info
const ECOMMERCE_STYLES: { id: EcommerceStyle; name: string; description: string; image: string }[] = [
  {
    id: "straight-on",
    name: "Straight On",
    description: "Direct front-facing shots, perfect for showcasing product details",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  },
  {
    id: "top-down",
    name: "Top Down",
    description: "Bird's eye view photography, ideal for flat-lay compositions",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  },
  {
    id: "angled",
    name: "Angled",
    description: "Dynamic 45° angle shots that add depth and dimension",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  },
];

const ANGLES: { id: Angle; name: string; image: string }[] = [
  { id: "front", name: "Front", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" },
  { id: "back", name: "Back", image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=300&h=300&fit=crop" },
  { id: "left", name: "Left Side", image: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=300&h=300&fit=crop" },
  { id: "right", name: "Right Side", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=300&h=300&fit=crop" },
];

export default function OrderPage() {
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
  const [currentStyle, setCurrentStyle] = useState<EcommerceStyle | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Angle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [createAccount, setCreateAccount] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState<"ship" | "pickup">("ship");
  const [discountCode, setDiscountCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const selectPackageType = (type: PackageType) => {
    setOrder(prev => ({
      ...prev,
      packageType: type,
      lifestyleIncluded: type === "lifestyle" || type === "fullpackage",
    }));
    if (type === "lifestyle") {
      setStep(4);
    } else {
      setStep(2);
    }
  };

  const selectStyle = (style: EcommerceStyle) => {
    setCurrentStyle(style);
    setSelectedAngles([]);
    setStep(3);
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
      const existingIndex = order.cart.findIndex(item => item.style === currentStyle);
      if (existingIndex >= 0) {
        const newCart = [...order.cart];
        newCart[existingIndex].angles = selectedAngles;
        setOrder(prev => ({ ...prev, cart: newCart }));
      } else {
        setOrder(prev => ({
          ...prev,
          cart: [...prev.cart, {
            style: currentStyle,
            angles: selectedAngles,
            pricePerAngle: PRICES.ecommerce.perAngle,
          }],
        }));
      }
      setCurrentStyle(null);
      setSelectedAngles([]);
      setStep(2);
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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-[#1a1a1a]/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
            </div>
              <span className="font-bold text-xl text-[#1a1a1a]">Rush Photos</span>
          </Link>
          
              {step > 1 && step < 5 && (
              <div className="flex items-center gap-2 bg-[#E54A4A]/5 px-4 py-2 rounded-full">
                <ShoppingCart className="w-4 h-4 text-[#E54A4A]" />
                <span className="text-sm font-medium text-[#1a1a1a]">
                  ${calculateTotal()}
                    </span>
                  </div>
              )}
            </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
        {/* Steps 1-3 remain the same */}
        {/* Step 1: Package Selection */}
            {step === 1 && (
          <div className="py-8 sm:py-16">
            <div className="text-center mb-10 sm:mb-16">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-4">
                Choose Your Package
                  </h1>
              <p className="text-lg text-[#1a1a1a]/60 max-w-xl mx-auto">
                Select the type of photography that best fits your needs
                  </p>
                </div>

            <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* E-commerce Package */}
              <button
                onClick={() => selectPackageType("ecommerce")}
                className="group p-6 sm:p-8 rounded-3xl border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] bg-white hover:bg-[#E54A4A]/5 transition-all duration-300 text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="w-7 h-7 text-white" />
                        </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">E-commerce</h3>
                  <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  Clean, consistent product shots on white background
                </p>
                <p className="text-[#E54A4A] font-bold text-lg">
                  From $25/angle
                </p>
              </button>

              {/* Lifestyle Package */}
              <button
                onClick={() => selectPackageType("lifestyle")}
                className="group p-6 sm:p-8 rounded-3xl border-2 border-[#1a1a1a]/10 hover:border-purple-500 bg-white hover:bg-purple-50 transition-all duration-300 text-left"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-7 h-7 text-white" />
                      </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Lifestyle</h3>
                  <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  Styled scenes with props and creative direction
                </p>
                <p className="text-purple-500 font-bold text-lg">
                  $149 flat rate
                </p>
              </button>

              {/* Full Package */}
              <button
                onClick={() => selectPackageType("fullpackage")}
                className="group p-6 sm:p-8 rounded-3xl border-2 border-[#1a1a1a]/10 hover:border-amber-500 bg-white hover:bg-amber-50 transition-all duration-300 text-left relative overflow-hidden"
              >
                <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SAVE 10%
                      </div>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7 text-white" />
                    </div>
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Full Package</h3>
                  <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  E-commerce + Lifestyle with 10% discount
                </p>
                <p className="text-amber-500 font-bold text-lg">
                  Best Value
                </p>
              </button>
                </div>
              </div>
            )}

        {/* Step 2: Style Selection */}
            {step === 2 && (
          <div className="py-8">
                  <button
                    onClick={() => setStep(1)}
              className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to packages
                  </button>

            <div className="text-center mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                Select E-commerce Style
                  </h1>
                  <p className="text-[#1a1a1a]/60">
                Choose the shooting style for your products
                  </p>
                </div>

            {/* Cart Summary */}
            {order.cart.length > 0 && (
              <div className="bg-white rounded-2xl p-4 mb-8 border border-[#1a1a1a]/5">
                <h3 className="font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Your Order
                </h3>
                <div className="space-y-2">
                  {order.cart.map((item) => (
                    <div key={item.style} className="flex items-center justify-between py-2 border-b border-[#1a1a1a]/5 last:border-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#E54A4A]/10 flex items-center justify-center">
                          <Camera className="w-5 h-5 text-[#E54A4A]" />
                        </div>
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{getStyleName(item.style)}</p>
                          <p className="text-xs text-[#1a1a1a]/50">{item.angles.length} angles</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-[#1a1a1a]">${item.angles.length * item.pricePerAngle}</span>
                        <button
                          onClick={() => removeFromCart(item.style)}
                          className="p-1 rounded-full hover:bg-red-50 text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-6 mb-8">
                  {ECOMMERCE_STYLES.map((style) => {
                    const inCart = order.cart.find(item => item.style === style.id);
                    return (
                      <button
                        key={style.id}
                        onClick={() => selectStyle(style.id)}
                    className={`group relative p-6 rounded-3xl border-2 transition-all duration-300 text-left bg-white ${
                          inCart 
                        ? 'border-green-500 bg-green-50'
                        : 'border-[#1a1a1a]/10 hover:border-[#E54A4A]'
                    }`}
                  >
                    {inCart && (
                      <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4">
                          <img
                            src={style.image}
                            alt={style.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                    <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{style.name}</h3>
                    <p className="text-[#1a1a1a]/60 text-sm mb-3">{style.description}</p>
                    <p className="text-[#E54A4A] font-bold">${PRICES.ecommerce.perAngle}/angle</p>
                      </button>
                    );
                  })}
                </div>

            {(order.cart.length > 0 || order.lifestyleIncluded) && (
                  <button
                onClick={() => {
                  setStep(4);
                  setCheckoutStep("information");
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold text-lg hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all flex items-center justify-center gap-2"
              >
                Continue to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                            </div>
                          )}

        {/* Step 3: Angle Selection */}
        {step === 3 && currentStyle && (
          <div className="py-8">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => {
                  setCurrentStyle(null);
                  setStep(2);
                }}
                className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to styles
              </button>

              <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                  {getStyleName(currentStyle)}
                </h1>
                <p className="text-[#1a1a1a]/60">
                  Select the angles you need (1-4 angles)
                </p>
                    </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {ANGLES.map((angle) => {
                  const isSelected = selectedAngles.includes(angle.id);
                  return (
                    <button
                      key={angle.id}
                      onClick={() => toggleAngle(angle.id)}
                      className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                        isSelected
                          ? 'border-[#E54A4A] bg-[#E54A4A]/5'
                          : 'border-[#1a1a1a]/10 hover:border-[#E54A4A]/50'
                      }`}
                    >
                      <div className={`absolute top-3 right-3 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all z-10 ${
                        isSelected
                          ? 'border-[#E54A4A] bg-[#E54A4A]'
                          : 'border-[#1a1a1a]/20 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                      <div className="w-24 h-24 mx-auto mb-4 rounded-xl overflow-hidden">
                        <img 
                          src={angle.image} 
                          alt={angle.name}
                          className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-110' : ''}`}
                      />
                    </div>
                      <h3 className="font-bold text-[#1a1a1a] text-center">{angle.name}</h3>
                      <p className="text-[#E54A4A] text-sm font-medium text-center mt-1">
                        ${PRICES.ecommerce.perAngle}
                      </p>
                    </button>
                    );
                  })}
                </div>

              <div className="bg-white rounded-2xl p-6 border border-[#1a1a1a]/5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#1a1a1a]/60 text-sm">Selected angles</p>
                    <p className="text-2xl font-bold text-[#1a1a1a]">
                      {selectedAngles.length} × ${PRICES.ecommerce.perAngle}
                    </p>
                    </div>
                  <div className="text-right">
                    <p className="text-[#1a1a1a]/60 text-sm">Subtotal</p>
                    <p className="text-2xl font-bold text-[#E54A4A]">
                      ${selectedAngles.length * PRICES.ecommerce.perAngle}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={addToCart}
                disabled={selectedAngles.length === 0}
                className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  selectedAngles.length > 0
                    ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-xl hover:shadow-[#E54A4A]/30'
                    : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
                }`}
              >
                <Plus className="w-5 h-5" />
                Add to Order
              </button>
            </div>
                  </div>
                )}

        {/* Step 4: Alo-Style Checkout */}
        {step === 4 && (
          <div className="grid lg:grid-cols-2 gap-0 min-h-[calc(100vh-80px)] -mx-4 sm:-mx-6">
            {/* Left Column - Form */}
            <div className="p-6 md:p-10 lg:p-16 bg-white">
              {/* Back Button */}
                {order.packageType !== "lifestyle" && (
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to styles
                  </button>
                )}
                {order.packageType === "lifestyle" && (
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to packages
                    </button>
              )}

              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-sm mb-8">
                {checkoutSteps.map((step, index) => (
                  <div key={step.key} className="flex items-center gap-2">
                    <button
                      onClick={() => index <= stepIndex && setCheckoutStep(step.key)}
                      className={`transition-colors ${
                        index === stepIndex 
                          ? "text-[#1a1a1a] font-medium" 
                          : index < stepIndex 
                            ? "text-[#1a1a1a]/60 hover:text-[#1a1a1a] cursor-pointer" 
                            : "text-[#1a1a1a]/30 cursor-not-allowed"
                      }`}
                      disabled={index > stepIndex}
                    >
                      {step.label}
                    </button>
                    {index < checkoutSteps.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-[#1a1a1a]/30" />
                    )}
              </div>
                ))}
                        </div>

              {/* Step Content */}
              {checkoutStep === "information" && (
                <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]/80 mb-6 uppercase tracking-wider">Contact</h2>

                <div className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={order.formData.email}
                        onChange={(e) => updateFormData("email", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.email ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="Email"
                      />
                      {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <div 
                        onClick={() => setEmailUpdates(!emailUpdates)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                          emailUpdates ? "bg-[#E54A4A] border-[#E54A4A]" : "border-[#1a1a1a]/30"
                        }`}
                      >
                        {emailUpdates && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                    </div>
                      <span className="text-sm text-[#1a1a1a]/60">Email me with news and offers</span>
                    </label>
                    
                    <div>
                      <input
                        type="text"
                        value={order.formData.productName}
                        onChange={(e) => updateFormData("productName", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.productName ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="Product name *"
                      />
                      {errors.productName && <p className="text-red-500 text-xs mt-1">{errors.productName}</p>}
                      </div>

                    <textarea
                      value={order.formData.notes}
                      onChange={(e) => updateFormData("notes", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-4 bg-[#f5f5f5] border border-[#1a1a1a]/10 rounded-lg text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none placeholder-[#1a1a1a]/40 resize-none"
                      placeholder="Additional notes (optional)"
                    />
                    </div>

                  <button
                    onClick={handleCheckoutContinue}
                    className="w-full mt-8 bg-[#E54A4A] hover:bg-[#d43d3d] text-white py-4 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Shipping
                  </button>
                  </div>
              )}

              {checkoutStep === "shipping" && (
                    <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]/80 mb-4 uppercase tracking-wider">Delivery Method</h2>
                  
                  <div className="border border-[#1a1a1a]/10 rounded-lg overflow-hidden mb-8">
                    <button
                      onClick={() => setDeliveryMethod("ship")}
                      className={`w-full flex items-center justify-between p-4 transition-colors ${
                        deliveryMethod === "ship" ? "bg-[#E54A4A]/5" : "hover:bg-[#f5f5f5]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          deliveryMethod === "ship" ? "border-[#E54A4A]" : "border-[#1a1a1a]/30"
                        }`}>
                          {deliveryMethod === "ship" && <div className="w-2.5 h-2.5 rounded-full bg-[#E54A4A]" />}
                        </div>
                        <span className="text-[#1a1a1a]">Digital Delivery</span>
                      </div>
                      <Truck className="w-5 h-5 text-[#1a1a1a]/40" />
                    </button>
                  </div>

                  <h2 className="text-lg font-semibold text-[#1a1a1a]/80 mb-4 uppercase tracking-wider">Billing Address</h2>
                  
                  <div className="space-y-4">
                      <div className="relative">
                      <select
                        value={order.formData.country}
                        onChange={(e) => updateFormData("country", e.target.value)}
                        className="w-full px-4 py-4 bg-[#f5f5f5] border border-[#1a1a1a]/10 rounded-lg text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/40 pointer-events-none" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={order.formData.firstName}
                        onChange={(e) => updateFormData("firstName", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.firstName ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="First name"
                      />
                      <input
                        type="text"
                        value={order.formData.lastName}
                        onChange={(e) => updateFormData("lastName", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.lastName ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="Last name"
                      />
                    </div>

                      <input
                        type="text"
                          value={order.formData.company}
                          onChange={(e) => updateFormData("company", e.target.value)}
                      className="w-full px-4 py-4 bg-[#f5f5f5] border border-[#1a1a1a]/10 rounded-lg text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none placeholder-[#1a1a1a]/40"
                      placeholder="Company (optional)"
                    />

                    <input
                      type="text"
                      value={order.formData.address}
                      onChange={(e) => updateFormData("address", e.target.value)}
                      className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                        errors.address ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                      } focus:outline-none placeholder-[#1a1a1a]/40`}
                      placeholder="Address"
                    />

                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={order.formData.city}
                        onChange={(e) => updateFormData("city", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.city ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="City"
                      />
                      <input
                        type="text"
                        value={order.formData.state}
                        onChange={(e) => updateFormData("state", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.state ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="State"
                      />
                      <input
                        type="text"
                        value={order.formData.zipCode}
                        onChange={(e) => updateFormData("zipCode", e.target.value)}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                          errors.zipCode ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="ZIP"
                      />
                      </div>

                    <input
                      type="tel"
                      value={order.formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      className="w-full px-4 py-4 bg-[#f5f5f5] border border-[#1a1a1a]/10 rounded-lg text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none placeholder-[#1a1a1a]/40"
                      placeholder="Phone (optional)"
                    />
                    </div>

                  <button
                    onClick={handleCheckoutContinue}
                    className="w-full mt-8 bg-[#E54A4A] hover:bg-[#d43d3d] text-white py-4 rounded-lg font-semibold transition-colors"
                  >
                    Continue to Payment
                  </button>

                  <button
                    onClick={() => setCheckoutStep("information")}
                    className="w-full mt-4 text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
                  >
                    ← Return to information
                  </button>
                  </div>
              )}

              {checkoutStep === "payment" && (
                  <div>
                  <h2 className="text-lg font-semibold text-[#1a1a1a]/80 mb-6 uppercase tracking-wider">Payment</h2>
                  
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={order.formData.cardNumber}
                      onChange={(e) => updateFormData("cardNumber", formatCardNumber(e.target.value))}
                      maxLength={19}
                      className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] font-mono transition-colors ${
                        errors.cardNumber ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                      } focus:outline-none placeholder-[#1a1a1a]/40`}
                      placeholder="Card number"
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={order.formData.expiry}
                        onChange={(e) => updateFormData("expiry", formatExpiry(e.target.value))}
                        maxLength={5}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] font-mono transition-colors ${
                          errors.expiry ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="MM/YY"
                      />
                      <input
                        type="password"
                        value={order.formData.cvv}
                        onChange={(e) => updateFormData("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] font-mono transition-colors ${
                          errors.cvv ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                        } focus:outline-none placeholder-[#1a1a1a]/40`}
                        placeholder="CVV"
                      />
                  </div>

                    <input
                      type="text"
                      value={order.formData.nameOnCard}
                      onChange={(e) => updateFormData("nameOnCard", e.target.value)}
                      className={`w-full px-4 py-4 bg-[#f5f5f5] border rounded-lg text-[#1a1a1a] transition-colors ${
                        errors.nameOnCard ? "border-red-500" : "border-[#1a1a1a]/10 focus:border-[#E54A4A]"
                      } focus:outline-none placeholder-[#1a1a1a]/40`}
                      placeholder="Name on card"
                    />
                  </div>

                  <div className="mt-6 p-4 bg-[#f5f5f5] rounded-lg flex items-center gap-3">
                    <Shield className="w-5 h-5 text-[#1a1a1a]/40" />
                    <p className="text-sm text-[#1a1a1a]/50">Your payment is encrypted and secure.</p>
                </div>

                  <button
                    onClick={handleCheckoutContinue}
                    disabled={isSubmitting}
                    className="w-full mt-8 bg-[#E54A4A] hover:bg-[#d43d3d] text-white py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Pay ${calculateTotal()}
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setCheckoutStep("shipping")}
                    className="w-full mt-4 text-sm text-[#1a1a1a]/50 hover:text-[#1a1a1a] transition-colors"
                  >
                    ← Return to shipping
                  </button>
                </div>
              )}
                </div>

            {/* Right Column - Order Summary */}
            <div className="bg-[#f9f9f9] border-l border-[#1a1a1a]/5 p-6 md:p-10 lg:p-16">
              {/* Cart Items */}
              <div className="space-y-4 pb-6 border-b border-[#1a1a1a]/10">
                    {order.cart.map((item) => (
                  <div key={item.style} className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-[#1a1a1a]/10 flex-shrink-0">
                      <img
                        src={ECOMMERCE_STYLES.find(s => s.id === item.style)?.image}
                        alt={getStyleName(item.style)}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#E54A4A] rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {item.angles.length}
              </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1a1a1a]">{getStyleName(item.style)}</h3>
                      <p className="text-sm text-[#1a1a1a]/50">{item.angles.length} angles</p>
                    </div>
                    <p className="font-medium text-[#1a1a1a]">${item.angles.length * item.pricePerAngle}</p>
                      </div>
                    ))}

                    {order.lifestyleIncluded && (
                  <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-8 h-8 text-white" />
                  </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-[#1a1a1a]">Lifestyle Photography</h3>
                      <p className="text-sm text-[#1a1a1a]/50">Custom styled shoot</p>
                </div>
                    <p className="font-medium text-[#1a1a1a]">${PRICES.lifestyle.flatRate}</p>
                    </div>
                    )}
              </div>

              {/* Discount Code */}
              <div className="py-6 border-b border-[#1a1a1a]/10">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1a1a1a]/40" />
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-[#1a1a1a]/10 rounded-lg text-[#1a1a1a] focus:border-[#E54A4A] focus:outline-none placeholder-[#1a1a1a]/40 text-sm"
                      placeholder="Discount code"
                    />
                  </div>
                  <button className="px-5 py-3 bg-[#1a1a1a]/5 hover:bg-[#1a1a1a]/10 rounded-lg text-sm font-medium text-[#1a1a1a] transition-colors">
                    Apply
                  </button>
                </div>
                </div>

              {/* Price Breakdown */}
              <div className="py-6 border-b border-[#1a1a1a]/10 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]/60">Subtotal</span>
                  <span className="text-[#1a1a1a]">${calculateTotal()}</span>
                      </div>
                {order.packageType === "fullpackage" && order.cart.length > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Full Package Discount</span>
                    <span>-10%</span>
                      </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a]/60">Delivery</span>
                  <span className="text-[#1a1a1a]/40">Digital</span>
                    </div>
                      </div>

              {/* Total */}
              <div className="py-6 flex justify-between items-center">
                <span className="text-[#1a1a1a]/60">Total</span>
                <div className="text-right">
                  <span className="text-xs text-[#1a1a1a]/40 mr-2">USD</span>
                  <span className="text-2xl font-bold text-[#1a1a1a]">${calculateTotal()}</span>
                      </div>
                    </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-[#1a1a1a]/5">
                <p className="text-xs text-[#1a1a1a]/50 leading-relaxed">
                  <span className="text-[#1a1a1a]/70">ℹ️</span> Your photos will be delivered digitally within 3-5 business days. We guarantee satisfaction.
                </p>
              </div>
                      </div>
                      </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 5 && orderComplete && (
          <div className="py-16">
            <div className="max-w-lg mx-auto text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-white" />
                </div>

              <h1 className="text-3xl font-bold text-[#1a1a1a] mb-4">
                Order Submitted!
              </h1>
              
              <p className="text-[#1a1a1a]/60 mb-8">
                Thank you for your order. We&apos;ll be in touch shortly to confirm details and get started on your project.
              </p>

              <div className="bg-white rounded-2xl p-6 border border-[#1a1a1a]/5 mb-8">
                <p className="text-sm text-[#1a1a1a]/60 mb-2">Tracking Number</p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-xl font-mono font-bold text-[#E54A4A]">
                    {trackingNumber}
                  </code>
                <button
                    onClick={copyTrackingNumber}
                    className="p-2 rounded-lg hover:bg-[#1a1a1a]/5 transition-colors"
                  >
                    <Copy className="w-5 h-5 text-[#1a1a1a]/40" />
                </button>
              </div>
          </div>

              <div className="bg-[#E54A4A]/5 rounded-2xl p-6 mb-8 text-left">
                <h3 className="font-bold text-[#1a1a1a] mb-3">Order Summary</h3>
                <div className="space-y-2 text-sm">
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
                  <div className="flex justify-between pt-2 border-t border-[#1a1a1a]/10">
                    <span className="font-bold text-[#1a1a1a]">Total</span>
                    <span className="font-bold text-[#E54A4A]">${calculateTotal()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={resetOrder}
                  className="flex-1 py-3 border-2 border-[#E54A4A] text-[#E54A4A] font-bold rounded-xl hover:bg-[#E54A4A]/5 transition-colors"
                >
                  New Order
                </button>
                <Link
                  href="/"
                  className="flex-1 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#E54A4A]/30 transition-all text-center"
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
