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
  Copy
} from "lucide-react";

// Types
type PackageType = "ecommerce" | "lifestyle" | "fullpackage" | null;
type EcommerceStyle = "straight-on" | "top-down" | "angled";
type Angle = "front" | "back" | "left" | "right";

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
    name: string;
    email: string;
    phone: string;
    company: string;
    productName: string;
    notes: string;
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
  fullPackageDiscount: 0.1, // 10% discount
};

// Style info with placeholder images
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
  const [order, setOrder] = useState<OrderState>({
    packageType: null,
    cart: [],
    lifestyleIncluded: false,
    formData: {
    name: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    notes: "",
    },
  });
  const [currentStyle, setCurrentStyle] = useState<EcommerceStyle | null>(null);
  const [selectedAngles, setSelectedAngles] = useState<Angle[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");

  // Calculate totals
  const calculateTotal = () => {
    let total = 0;
    
    // E-commerce items
    order.cart.forEach(item => {
      total += item.angles.length * item.pricePerAngle;
    });
    
    // Lifestyle
    if (order.lifestyleIncluded) {
      total += PRICES.lifestyle.flatRate;
    }
    
    // Full package discount
    if (order.packageType === "fullpackage" && order.cart.length > 0) {
      total = total * (1 - PRICES.fullPackageDiscount);
    }
    
    return Math.round(total);
  };

  const getTotalAngles = () => {
    return order.cart.reduce((acc, item) => acc + item.angles.length, 0);
  };

  // Handlers
  const selectPackageType = (type: PackageType) => {
    setOrder(prev => ({
      ...prev,
      packageType: type,
      lifestyleIncluded: type === "lifestyle" || type === "fullpackage",
    }));
    
    if (type === "lifestyle") {
      setStep(4); // Go directly to form for lifestyle
    } else {
      setStep(2); // Go to style selection for e-commerce/full package
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
      // Check if style already in cart
      const existingIndex = order.cart.findIndex(item => item.style === currentStyle);
      
      if (existingIndex >= 0) {
        // Update existing
        const newCart = [...order.cart];
        newCart[existingIndex].angles = selectedAngles;
        setOrder(prev => ({ ...prev, cart: newCart }));
      } else {
        // Add new
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
      setStep(2); // Back to style selection
    }
  };

  const removeFromCart = (style: EcommerceStyle) => {
    setOrder(prev => ({
      ...prev,
      cart: prev.cart.filter(item => item.style !== style),
    }));
  };

  const proceedToCheckout = () => {
    setStep(4);
  };

  const updateFormData = (field: string, value: string) => {
    setOrder(prev => ({
      ...prev,
      formData: { ...prev.formData, [field]: value },
    }));
  };

  const generateTrackingNumber = () => {
    const prefix = "RP";
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  };

  const submitOrder = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTrackingNumber = generateTrackingNumber();
    setTrackingNumber(newTrackingNumber);
    
    // Save order to localStorage
    const orderData = {
      id: Date.now().toString(),
      trackingNumber: newTrackingNumber,
      packageType: order.packageType,
      cart: order.cart,
      lifestyleIncluded: order.lifestyleIncluded,
      total: calculateTotal(),
      status: "pending",
      createdAt: new Date().toISOString(),
      customerName: order.formData.name,
      customerEmail: order.formData.email,
      productName: order.formData.productName,
    };
    
    const existingOrders = localStorage.getItem("orders");
    const orders = existingOrders ? JSON.parse(existingOrders) : [];
    orders.push(orderData);
    localStorage.setItem("orders", JSON.stringify(orders));
    
    setIsSubmitting(false);
    setOrderComplete(true);
    setStep(5);
  };

  const resetOrder = () => {
    setOrder({
      packageType: null,
      cart: [],
      lifestyleIncluded: false,
      formData: {
      name: "",
      email: "",
      phone: "",
      company: "",
      productName: "",
      notes: "",
      },
    });
    setStep(1);
    setOrderComplete(false);
  };

  const copyTrackingNumber = () => {
    navigator.clipboard.writeText(trackingNumber);
  };

  // Get style name helper
  const getStyleName = (styleId: EcommerceStyle) => {
    return ECOMMERCE_STYLES.find(s => s.id === styleId)?.name || styleId;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDF8F7] via-white to-[#FDF8F7]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-[#1a1a1a]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
            </div>
          </Link>
          
            <div className="flex items-center gap-4">
              {step > 1 && step < 5 && (
            <button 
                  onClick={resetOrder}
                  className="text-[#1a1a1a]/40 hover:text-[#E54A4A] transition-colors text-sm"
            >
              Clear
            </button>
              )}
              <Link 
                href="/" 
                className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors text-sm"
              >
              <ArrowLeft className="w-4 h-4" />
                Back
            </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      {step < 5 && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex items-center justify-between">
            {["Package", "Style", "Angles", "Details"].map((label, index) => {
              const stepNum = index + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              const isLifestyleSkip = order.packageType === "lifestyle" && (stepNum === 2 || stepNum === 3);
              
              return (
                <div key={label} className={`flex items-center ${index < 3 ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      isCompleted || isLifestyleSkip
                        ? 'bg-[#E54A4A] text-white'
                        : isActive
                        ? 'bg-[#E54A4A] text-white ring-4 ring-[#E54A4A]/20'
                        : 'bg-[#1a1a1a]/5 text-[#1a1a1a]/40'
                    }`}>
                      {isCompleted || isLifestyleSkip ? <Check className="w-5 h-5" /> : stepNum}
                    </div>
                    <span className={`mt-2 text-xs font-medium ${
                      isActive ? 'text-[#E54A4A]' : 'text-[#1a1a1a]/40'
                    }`}>
                      {label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`flex-1 h-0.5 mx-2 ${
                      isCompleted || (isLifestyleSkip && step >= stepNum) ? 'bg-[#E54A4A]' : 'bg-[#1a1a1a]/10'
                    }`} />
              )}
            </div>
              );
            })}
        </div>
        </div>
      )}

          {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        
        {/* Step 1: Choose Package Type */}
            {step === 1 && (
          <div className="py-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">
                Choose Your Photography Package
                  </h1>
              <p className="text-[#1a1a1a]/60 max-w-xl mx-auto">
                Select the type of photography that best fits your product needs
                  </p>
                </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* E-commerce */}
              <button
                onClick={() => selectPackageType("ecommerce")}
                className="group relative bg-white rounded-3xl p-8 border-2 border-[#1a1a1a]/5 hover:border-[#E54A4A] transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/10 text-left"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Camera className="w-8 h-8 text-white" />
                        </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">E-commerce</h3>
                <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  Clean, professional product shots with multiple angles and styles
                </p>
                <div className="flex items-center gap-2 text-[#E54A4A] font-medium">
                  <span>From $25/angle</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
              </button>

              {/* Lifestyle */}
              <button
                onClick={() => selectPackageType("lifestyle")}
                className="group relative bg-white rounded-3xl p-8 border-2 border-[#1a1a1a]/5 hover:border-[#E54A4A] transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/10 text-left"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full">
                    Creative
                        </span>
                      </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-white" />
                        </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Lifestyle</h3>
                <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  Styled tabletop photography with props and creative direction
                </p>
                <div className="flex items-center gap-2 text-[#E54A4A] font-medium">
                  <span>$149 flat rate</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
              </button>

              {/* Full Package */}
              <button
                onClick={() => selectPackageType("fullpackage")}
                className="group relative bg-white rounded-3xl p-8 border-2 border-[#E54A4A] transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/10 text-left"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-1 bg-[#E54A4A] text-white text-xs font-bold rounded-full">
                    Best Value
                  </span>
                      </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Package className="w-8 h-8 text-white" />
                    </div>
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">Full Package</h3>
                <p className="text-[#1a1a1a]/60 text-sm mb-4">
                  E-commerce + Lifestyle combined with 10% discount
                </p>
                <div className="flex items-center gap-2 text-[#E54A4A] font-medium">
                  <span>Save 10%</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
              </button>
                </div>
              </div>
            )}

        {/* Step 2: Choose E-commerce Style */}
            {step === 2 && (
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Style Selection */}
              <div className="flex-1">
                <div className="mb-8">
                  <button
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-4"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to packages
                  </button>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                    Choose Photography Style
                  </h1>
                  <p className="text-[#1a1a1a]/60">
                    Select a style to customize angles
                  </p>
                </div>

                <div className="grid gap-4">
                  {ECOMMERCE_STYLES.map((style) => {
                    const inCart = order.cart.find(item => item.style === style.id);
                    
                    return (
                      <button
                        key={style.id}
                        onClick={() => selectStyle(style.id)}
                        className={`group relative bg-white rounded-2xl p-6 border-2 transition-all duration-300 text-left ${
                          inCart 
                            ? 'border-green-500 bg-green-50/50' 
                            : 'border-[#1a1a1a]/5 hover:border-[#E54A4A]'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={style.image}
                            alt={style.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-[#1a1a1a]">{style.name}</h3>
                              {inCart && (
                                <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
                                  <Check className="w-3 h-3" />
                                  {inCart.angles.length} angles
                                </span>
                              )}
                            </div>
                            <p className="text-[#1a1a1a]/60 text-sm mt-1">{style.description}</p>
                            <p className="text-[#E54A4A] font-medium text-sm mt-2">
                              ${PRICES.ecommerce.perAngle} per angle
                            </p>
                          </div>
                          <ArrowRight className="w-5 h-5 text-[#1a1a1a]/30 group-hover:text-[#E54A4A] group-hover:translate-x-1 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>

                {order.cart.length > 0 && (
                  <button
                    onClick={proceedToCheckout}
                    className="w-full mt-6 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all flex items-center justify-center gap-2"
                  >
                    Continue to Details
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}
                          </div>

              {/* Right: Cart Summary */}
              <div className="lg:w-80">
                <div className="bg-white rounded-3xl p-6 border border-[#1a1a1a]/5 sticky top-32">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </h2>

                  {order.cart.length === 0 && !order.lifestyleIncluded ? (
                    <p className="text-[#1a1a1a]/40 text-sm text-center py-8">
                      Select styles and angles to build your order
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {order.cart.map((item) => (
                        <div key={item.style} className="flex items-start justify-between py-3 border-b border-[#1a1a1a]/5">
                          <div>
                            <p className="font-medium text-[#1a1a1a]">{getStyleName(item.style)}</p>
                            <p className="text-xs text-[#1a1a1a]/50">
                              {item.angles.map(a => ANGLES.find(an => an.id === a)?.name).join(", ")}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#1a1a1a]">
                              ${item.angles.length * item.pricePerAngle}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.style)}
                              className="text-[#1a1a1a]/30 hover:text-[#E54A4A]"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {order.lifestyleIncluded && (
                        <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]/5">
                          <div>
                            <p className="font-medium text-[#1a1a1a]">Lifestyle</p>
                            <p className="text-xs text-[#1a1a1a]/50">Flat rate</p>
                          </div>
                          <span className="font-medium text-[#1a1a1a]">
                            ${PRICES.lifestyle.flatRate}
                          </span>
                            </div>
                          )}

                      {order.packageType === "fullpackage" && order.cart.length > 0 && (
                        <div className="flex items-center justify-between py-2 text-green-600">
                          <span className="text-sm">Full Package Discount</span>
                          <span className="font-medium">-10%</span>
                            </div>
                          )}

                      <div className="flex items-center justify-between pt-4">
                        <span className="font-bold text-[#1a1a1a]">Total</span>
                        <span className="text-2xl font-bold text-[#E54A4A]">${calculateTotal()}</span>
                      </div>
                            </div>
                          )}
                        </div>
                      </div>
            </div>
          </div>
        )}

        {/* Step 3: Choose Angles */}
        {step === 3 && currentStyle && (
          <div className="py-8">
            <div className="max-w-2xl mx-auto">
              <button
                onClick={() => { setStep(2); setCurrentStyle(null); }}
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
                          className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
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

        {/* Step 4: Details Form (also for Lifestyle) */}
        {step === 4 && (
          <div className="py-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left: Form */}
              <div className="flex-1 max-w-2xl">
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
                  <>
                    <button
                      onClick={() => setStep(1)}
                      className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors mb-6"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to packages
                    </button>
                    
                    {/* Lifestyle Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 mb-8 border border-purple-200/50">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-6 h-6 text-white" />
              </div>
                        <div>
                          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">About Lifestyle Photography</h2>
                          <p className="text-[#1a1a1a]/70 text-sm leading-relaxed">
                            Lifestyle refers to tabletop styled photography with props, simple sets, and creative direction. 
                            Our team will develop a concept based on the product, get approval from you, then execute the shoot. 
                            This is offered at a flat rate since the scope and styling are customized per project.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="mb-8">
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] mb-2">
                    Your Details
                  </h1>
                  <p className="text-[#1a1a1a]/60">
                    Fill in your information to complete the order
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/30" />
                      <input
                        type="text"
                          value={order.formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/30" />
                      <input
                        type="email"
                          value={order.formData.email}
                          onChange={(e) => updateFormData("email", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all"
                        placeholder="john@example.com"
                      />
                      </div>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/30" />
                      <input
                        type="tel"
                          value={order.formData.phone}
                          onChange={(e) => updateFormData("phone", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all"
                          placeholder="(555) 123-4567"
                      />
                    </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Company
                      </label>
                      <div className="relative">
                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/30" />
                      <input
                        type="text"
                          value={order.formData.company}
                          onChange={(e) => updateFormData("company", e.target.value)}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all"
                        placeholder="Your Company"
                      />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Product Name *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1a1a1a]/30" />
                    <input
                      type="text"
                        value={order.formData.productName}
                        onChange={(e) => updateFormData("productName", e.target.value)}
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all"
                        placeholder="What product are we shooting?"
                      />
                  </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Additional Notes
                    </label>
                    <textarea
                      value={order.formData.notes}
                      onChange={(e) => updateFormData("notes", e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all resize-none"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>
                </div>

                  <button
                  onClick={submitOrder}
                  disabled={!order.formData.name || !order.formData.email || !order.formData.productName || isSubmitting}
                  className={`w-full mt-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                    order.formData.name && order.formData.email && order.formData.productName && !isSubmitting
                      ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-xl hover:shadow-[#E54A4A]/30'
                      : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                      <Send className="w-5 h-5" />
                      Submit Order
                      </>
                    )}
                  </button>
                </div>

              {/* Right: Order Summary */}
              <div className="lg:w-80">
                <div className="bg-white rounded-3xl p-6 border border-[#1a1a1a]/5 sticky top-32">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Order Summary
                  </h2>

                  <div className="space-y-4">
                    {order.cart.map((item) => (
                      <div key={item.style} className="flex items-start justify-between py-3 border-b border-[#1a1a1a]/5">
                        <div>
                          <p className="font-medium text-[#1a1a1a]">{getStyleName(item.style)}</p>
                          <p className="text-xs text-[#1a1a1a]/50">
                            {item.angles.map(a => ANGLES.find(an => an.id === a)?.name).join(", ")}
                </p>
              </div>
                        <span className="font-medium text-[#1a1a1a]">
                          ${item.angles.length * item.pricePerAngle}
                        </span>
                      </div>
                    ))}

                    {order.lifestyleIncluded && (
                      <div className="flex items-start justify-between py-3 border-b border-[#1a1a1a]/5">
                        <div>
                          <p className="font-medium text-[#1a1a1a]">Lifestyle</p>
                          <p className="text-xs text-[#1a1a1a]/50">Flat rate - custom styled shoot</p>
                  </div>
                        <span className="font-medium text-[#1a1a1a]">
                          ${PRICES.lifestyle.flatRate}
                        </span>
                </div>
                    )}

                    {order.packageType === "fullpackage" && order.cart.length > 0 && (
                      <div className="flex items-center justify-between py-2 text-green-600">
                        <span className="text-sm">Full Package Discount</span>
                        <span className="font-medium">-10%</span>
                    </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]/10">
                      <span className="font-bold text-[#1a1a1a]">Total</span>
                      <span className="text-2xl font-bold text-[#E54A4A]">${calculateTotal()}</span>
                </div>

                    <div className="pt-4 space-y-2 text-sm text-[#1a1a1a]/60">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        100% Satisfaction Guarantee
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        3-5 days turnaround
                      </div>
                    </div>
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
