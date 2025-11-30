"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, ArrowLeft, ArrowRight, Package, CreditCard, Camera, Shield, Clock, RefreshCw, AlertCircle, Lock, Sparkles, Info, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const photoStyles = [
  {
    id: "topdown",
    name: "Top Down",
    description: "Bird's-eye view shots for flat-lay compositions",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&q=80",
  },
  {
    id: "product",
    name: "Product",
    description: "Clean studio shots with perfect lighting",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80",
  },
  {
    id: "diagonal",
    name: "Diagonal",
    description: "Dynamic angled perspectives",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80",
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    description: "In-context real-world scenarios",
    image: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&q=80",
    premium: true, // Lifestyle is premium - only in Lifestyle or Complete packages
  },
];

const packages = [
  {
    id: "single",
    name: "Single",
    price: 89,
    description: "1 photography style",
    stylesCount: 1,
    turnaround: "5 days",
    revisions: 2,
    allowedStyles: ["topdown", "product", "diagonal"], // No lifestyle
  },
  {
    id: "double",
    name: "Double",
    price: 159,
    description: "2 photography styles",
    stylesCount: 2,
    turnaround: "4 days",
    revisions: 2,
    allowedStyles: ["topdown", "product", "diagonal"], // No lifestyle
  },
  {
    id: "triple",
    name: "Triple",
    price: 219,
    description: "3 photography styles",
    stylesCount: 3,
    turnaround: "3 days",
    revisions: 5,
    allowedStyles: ["topdown", "product", "diagonal"], // No lifestyle
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    price: 149,
    description: "Lifestyle photography only",
    stylesCount: 1,
    fixedStyle: "lifestyle",
    turnaround: "4 days",
    revisions: 3,
    allowedStyles: ["lifestyle"], // Only lifestyle
    badge: "Exclusive",
  },
  {
    id: "complete",
    name: "Complete",
    price: 280,
    originalPrice: 400,
    description: "All 4 photography styles",
    stylesCount: 4,
    turnaround: "3 days",
    revisions: "Unlimited",
    allowedStyles: ["topdown", "product", "diagonal", "lifestyle"], // All styles
    popular: true,
  },
];

// Helper to get estimated delivery date
function getDeliveryDate(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days + 2); // +2 for shipping
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("triple");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    productDescription: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentPackage = packages.find(p => p.id === selectedPackage);
  const maxStyles = currentPackage?.stylesCount || 4;
  const allowedStyles = useMemo(() => currentPackage?.allowedStyles || [], [currentPackage?.allowedStyles]);

  // Load saved data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('rushPhotoOrder');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.selectedPackage) setSelectedPackage(data.selectedPackage);
        if (data.selectedStyles) setSelectedStyles(data.selectedStyles);
        if (data.formData) setFormData(data.formData);
        if (data.step && data.step > 1) setStep(Math.min(data.step, 3));
      } catch {
        // Failed to load saved order, start fresh
        localStorage.removeItem('rushPhotoOrder');
      }
    }
  }, []);

  // Save to localStorage on changes with indicator
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('rushPhotoOrder', JSON.stringify({
        selectedPackage,
        selectedStyles,
        formData,
        step,
      }));
      setShowSavedIndicator(true);
      setTimeout(() => setShowSavedIndicator(false), 2000);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedPackage, selectedStyles, formData, step]);

  // Update selected styles when package changes
  useEffect(() => {
    if (selectedPackage === "complete") {
      setSelectedStyles(photoStyles.map(s => s.id));
    } else if (selectedPackage === "lifestyle") {
      setSelectedStyles(["lifestyle"]);
    } else {
      // Filter out any styles that are not allowed in the new package
      setSelectedStyles(prev => 
        prev.filter(s => allowedStyles.includes(s)).slice(0, maxStyles)
      );
    }
  }, [selectedPackage, maxStyles, allowedStyles]);

  const isStyleAllowed = (styleId: string) => {
    return allowedStyles.includes(styleId);
  };

  const toggleStyle = (styleId: string) => {
    if (selectedPackage === "complete" || selectedPackage === "lifestyle") return;
    if (!isStyleAllowed(styleId)) return;
    
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(prev => prev.filter(s => s !== styleId));
    } else if (selectedStyles.length < maxStyles) {
      setSelectedStyles(prev => [...prev, styleId]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateField(field);
  };

  const validateField = (field: string) => {
    const newErrors: Record<string, string> = {};
    
    if (field === 'name' && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (field === 'email') {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
    }
    if (field === 'productName' && !formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    }
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
    
    setErrors(newErrors);
    setTouched({ name: true, email: true, productName: true });
    return Object.keys(newErrors).length === 0;
  };

  const canProceed = () => {
    if (step === 1) return selectedPackage !== "";
    if (step === 2) {
      if (selectedPackage === "complete") return selectedStyles.length === 4;
      if (selectedPackage === "lifestyle") return selectedStyles.includes("lifestyle");
      return selectedStyles.length === maxStyles;
    }
    if (step === 3) return formData.name && formData.email && formData.productName && Object.keys(errors).every(k => !errors[k]);
    return true;
  };

  const nextStep = () => {
    if (step === 3 && !validateForm()) return;
    if (canProceed() && step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const clearOrder = () => {
    localStorage.removeItem('rushPhotoOrder');
    setStep(1);
    setSelectedPackage("triple");
    setSelectedStyles([]);
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      productName: "",
      productDescription: "",
      notes: "",
    });
    setErrors({});
    setTouched({});
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    localStorage.removeItem('rushPhotoOrder');
    setIsSubmitting(false);
    alert('Order submitted! We will contact you shortly with shipping instructions.');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E54A4A]/10 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">R</span>
            </div>
            <div className="hidden xs:block">
              <span className="text-[#1a1a1a] font-bold">Rush</span>
              <span className="text-[#E54A4A] font-bold">.photo</span>
            </div>
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Auto-save indicator */}
            <div className={`flex items-center gap-1 text-xs text-green-600 transition-opacity duration-300 ${showSavedIndicator ? 'opacity-100' : 'opacity-0'}`}>
              <CheckCircle2 className="w-3 h-3" />
              <span className="hidden sm:inline">Saved</span>
            </div>
            
            <button 
              onClick={clearOrder}
              className="text-[#1a1a1a]/40 hover:text-[#E54A4A] transition-colors text-xs sm:text-sm"
            >
              Clear
            </button>
            <Link href="/" className="flex items-center gap-1 sm:gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors text-xs sm:text-sm">
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 mb-8 sm:mb-12">
          {[
            { num: 1, label: "Package", icon: Package },
            { num: 2, label: "Styles", icon: Camera },
            { num: 3, label: "Details", icon: CreditCard },
            { num: 4, label: "Confirm", icon: Check },
          ].map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button 
                onClick={() => s.num < step && setStep(s.num)}
                disabled={s.num > step}
                className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-full transition-all ${
                  step === s.num 
                    ? 'bg-[#E54A4A] text-white shadow-lg shadow-[#E54A4A]/30' 
                    : step > s.num 
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : 'bg-white text-[#1a1a1a]/40 cursor-not-allowed shadow-sm'
                }`}
              >
                {step > s.num ? (
                  <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                ) : (
                  <s.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                )}
                <span className="text-xs sm:text-sm font-medium hidden sm:inline">{s.label}</span>
              </button>
              {i < 3 && (
                <div className={`w-4 sm:w-8 md:w-12 h-0.5 mx-0.5 sm:mx-1 md:mx-2 transition-colors ${step > s.num ? 'bg-green-500' : 'bg-[#1a1a1a]/10'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Package Selection */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">
                    Choose Your Package
                  </h1>
                  <p className="text-[#1a1a1a]/60 text-sm sm:text-base">
                    Select the package that fits your needs
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {packages.map((pkg) => (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPackage(pkg.id)}
                      className={`relative bg-white p-4 sm:p-5 rounded-2xl cursor-pointer transition-all duration-300 ${
                        selectedPackage === pkg.id
                          ? 'ring-2 ring-[#E54A4A] shadow-xl shadow-[#E54A4A]/10 scale-[1.02]'
                          : 'border border-[#1a1a1a]/5 hover:border-[#E54A4A]/30 hover:shadow-lg'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#E54A4A] text-white text-xs font-semibold rounded-full">
                          Popular
                        </div>
                      )}
                      {pkg.badge && !pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#1a1a1a] text-white text-xs font-semibold rounded-full">
                          {pkg.badge}
                        </div>
                      )}
                      
                      <h3 className="text-base sm:text-lg font-bold text-[#1a1a1a] mb-1">{pkg.name}</h3>
                      <p className="text-[#1a1a1a]/50 text-xs sm:text-sm mb-2 sm:mb-3">{pkg.description}</p>
                      
                      <div className="flex items-baseline gap-2 mb-2 sm:mb-3">
                        <span className="text-xl sm:text-2xl font-bold text-[#E54A4A]">${pkg.price}</span>
                        {pkg.originalPrice && (
                          <span className="text-[#1a1a1a]/40 line-through text-xs sm:text-sm">${pkg.originalPrice}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-[#1a1a1a]/50 mb-2 sm:mb-3">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {pkg.turnaround}
                        </span>
                        <span className="flex items-center gap-1">
                          <RefreshCw className="w-3 h-3" />
                          {pkg.revisions} rev
                        </span>
                      </div>

                      {/* Lifestyle availability indicator */}
                      {pkg.allowedStyles?.includes("lifestyle") ? (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-green-600 mb-2 sm:mb-3">
                          <Sparkles className="w-3 h-3" />
                          <span>Includes Lifestyle</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#1a1a1a]/40 mb-2 sm:mb-3">
                          <Lock className="w-3 h-3" />
                          <span>Standard styles only</span>
                        </div>
                      )}

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPackage === pkg.id
                          ? 'border-[#E54A4A] bg-[#E54A4A]'
                          : 'border-[#1a1a1a]/20'
                      }`}>
                        {selectedPackage === pkg.id && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info box about Lifestyle */}
                <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-amber-800">About Lifestyle Photography</p>
                    <p className="text-amber-700 mt-1">
                      Lifestyle photos show your product in real-world settings. This premium style is only available in the <strong>Lifestyle</strong> or <strong>Complete</strong> packages.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Style Selection */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">
                    {selectedPackage === "complete" 
                      ? "Your 4 Styles" 
                      : selectedPackage === "lifestyle"
                        ? "Lifestyle Photography"
                        : `Select ${maxStyles} Style${maxStyles > 1 ? 's' : ''}`}
                  </h1>
                  <p className="text-[#1a1a1a]/60 text-sm sm:text-base">
                    {selectedPackage === "complete" 
                      ? "You get all 4 photography styles with the Complete Package" 
                      : selectedPackage === "lifestyle"
                        ? "Your product in real-world scenarios"
                        : `Selected: ${selectedStyles.length}/${maxStyles}`}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {photoStyles.map((style) => {
                    const isSelected = selectedStyles.includes(style.id);
                    const isAllowed = isStyleAllowed(style.id);
                    const isDisabled = !isAllowed || 
                      ((selectedPackage === "complete" || selectedPackage === "lifestyle") 
                        ? false 
                        : !isSelected && selectedStyles.length >= maxStyles);
                    const isFixed = selectedPackage === "complete" || selectedPackage === "lifestyle";
                    const isLifestyleLocked = style.id === "lifestyle" && !isAllowed;
                    
                    return (
                      <div
                        key={style.id}
                        onClick={() => !isDisabled && !isFixed && toggleStyle(style.id)}
                        className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                          isLifestyleLocked 
                            ? 'cursor-not-allowed opacity-60'
                            : isFixed 
                              ? 'cursor-default' 
                              : 'cursor-pointer'
                        } ${
                          isSelected
                            ? 'ring-4 ring-[#E54A4A] shadow-xl'
                            : isDisabled && !isLifestyleLocked
                              ? 'opacity-50 cursor-not-allowed'
                              : !isLifestyleLocked ? 'hover:shadow-lg' : ''
                        }`}
                      >
                        <div className="aspect-[3/4]">
                          <img
                            src={style.image}
                            alt={style.name}
                            className={`w-full h-full object-cover ${isLifestyleLocked ? 'grayscale' : ''}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                          
                          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                            <h3 className="text-base sm:text-lg font-bold text-white">{style.name}</h3>
                            <p className="text-white/70 text-[10px] sm:text-xs">{style.description}</p>
                          </div>

                          {/* Lock icon for lifestyle when not allowed */}
                          {isLifestyleLocked && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                              <Lock className="w-8 h-8 text-white mb-2" />
                              <p className="text-white text-xs text-center px-4">
                                Available in Lifestyle or Complete package
                              </p>
                            </div>
                          )}

                          {isSelected && !isLifestyleLocked && (
                            <div className="absolute top-3 right-3 w-7 h-7 sm:w-8 sm:h-8 bg-[#E54A4A] rounded-full flex items-center justify-center">
                              <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                          )}

                          {style.premium && isAllowed && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-white" />
                              <span className="text-[10px] font-semibold text-white">Premium</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selection progress for non-fixed packages */}
                {selectedPackage !== "complete" && selectedPackage !== "lifestyle" && (
                  <div className="mt-6 p-4 bg-white rounded-xl shadow-sm">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-[#1a1a1a]">Selection Progress</span>
                      <span className="text-sm text-[#E54A4A] font-semibold">{selectedStyles.length}/{maxStyles}</span>
                    </div>
                    <div className="h-2 bg-[#1a1a1a]/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full transition-all duration-500"
                        style={{ width: `${(selectedStyles.length / maxStyles) * 100}%` }}
                      />
                    </div>
                    {selectedStyles.length < maxStyles && (
                      <p className="text-xs text-[#1a1a1a]/50 mt-2">
                        Select {maxStyles - selectedStyles.length} more style{maxStyles - selectedStyles.length > 1 ? 's' : ''} to continue
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Details Form */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">
                    Your Details
                  </h1>
                  <p className="text-[#1a1a1a]/60 text-sm sm:text-base">
                    Tell us about yourself and your product
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Full Name <span className="text-[#E54A4A]">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('name')}
                        className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#1a1a1a] text-sm sm:text-base ${
                          errors.name && touched.name 
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20'
                        } outline-none`}
                        placeholder="John Doe"
                      />
                      {errors.name && touched.name && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Email <span className="text-[#E54A4A]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('email')}
                        className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#1a1a1a] text-sm sm:text-base ${
                          errors.email && touched.email 
                            ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                            : 'border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20'
                        } outline-none`}
                        placeholder="john@example.com"
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Phone <span className="text-[#1a1a1a]/40">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a] text-sm sm:text-base"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                        Company <span className="text-[#1a1a1a]/40">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a] text-sm sm:text-base"
                        placeholder="Your Company"
                      />
                    </div>
                  </div>

                  <div className="mb-4 md:mb-6">
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Product Name <span className="text-[#E54A4A]">*</span>
                    </label>
                    <input
                      type="text"
                      name="productName"
                      value={formData.productName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('productName')}
                      className={`w-full px-4 py-3 rounded-xl border transition-all bg-white text-[#1a1a1a] text-sm sm:text-base ${
                        errors.productName && touched.productName 
                          ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20' 
                          : 'border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20'
                      } outline-none`}
                      placeholder="What product are we photographing?"
                    />
                    {errors.productName && touched.productName && (
                      <p className="mt-1 text-xs sm:text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {errors.productName}
                      </p>
                    )}
                  </div>

                  <div className="mb-4 md:mb-6">
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Product Description <span className="text-[#1a1a1a]/40">(optional)</span>
                    </label>
                    <textarea
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all resize-none bg-white text-[#1a1a1a] text-sm sm:text-base"
                      placeholder="Tell us about your product..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                      Special Notes <span className="text-[#1a1a1a]/40">(optional)</span>
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all resize-none bg-white text-[#1a1a1a] text-sm sm:text-base"
                      placeholder="Any special requirements or preferences?"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="animate-fadeIn">
                <div className="mb-6 sm:mb-8">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-2 sm:mb-3">
                    Order Summary
                  </h1>
                  <p className="text-[#1a1a1a]/60 text-sm sm:text-base">
                    Review your order before confirming
                  </p>
                </div>

                <div className="bg-white p-4 sm:p-6 md:p-8 rounded-2xl shadow-lg mb-6">
                  {/* Package */}
                  <div className="flex justify-between items-start pb-4 sm:pb-6 border-b border-[#1a1a1a]/10">
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">{currentPackage?.name} Package</h3>
                      <p className="text-xs sm:text-sm text-[#1a1a1a]/50">{currentPackage?.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl sm:text-2xl font-bold text-[#E54A4A]">${currentPackage?.price}</span>
                      {currentPackage?.originalPrice && (
                        <span className="block text-xs sm:text-sm text-[#1a1a1a]/40 line-through">${currentPackage.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  {/* Selected Styles */}
                  <div className="py-4 sm:py-6 border-b border-[#1a1a1a]/10">
                    <h4 className="font-medium text-[#1a1a1a] mb-3 text-sm sm:text-base">Selected Styles</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedStyles.map((styleId) => {
                        const style = photoStyles.find(s => s.id === styleId);
                        return (
                          <span key={styleId} className="px-3 py-1 bg-[#E54A4A]/10 text-[#E54A4A] rounded-full text-xs sm:text-sm font-medium">
                            {style?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="py-4 sm:py-6 border-b border-[#1a1a1a]/10">
                    <h4 className="font-medium text-[#1a1a1a] mb-3 text-sm sm:text-base">Contact Information</h4>
                    <div className="space-y-1 text-xs sm:text-sm text-[#1a1a1a]/70">
                      <p>{formData.name}</p>
                      <p>{formData.email}</p>
                      {formData.phone && <p>{formData.phone}</p>}
                      {formData.company && <p>{formData.company}</p>}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="pt-4 sm:pt-6">
                    <h4 className="font-medium text-[#1a1a1a] mb-3 text-sm sm:text-base">Product</h4>
                    <p className="text-[#1a1a1a]/70 text-sm sm:text-base">{formData.productName}</p>
                    {formData.productDescription && (
                      <p className="text-xs sm:text-sm text-[#1a1a1a]/50 mt-1">{formData.productDescription}</p>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="bg-[#1a1a1a] p-4 sm:p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="text-center md:text-left">
                    <p className="text-white/60 text-xs sm:text-sm">Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-bold">${currentPackage?.price}</p>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className={`w-full md:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full font-semibold transition-all flex items-center justify-center gap-2 ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Confirm Order
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>

                <p className="text-center text-[#1a1a1a]/40 text-xs sm:text-sm mt-4">
                  You will receive shipping instructions via email after confirmation
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-6 sm:mt-8">
                {step > 1 ? (
                  <button
                    onClick={prevStep}
                    className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors text-sm sm:text-base"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                ) : (
                  <div />
                )}
                
                <button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`flex items-center gap-2 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold transition-all text-sm sm:text-base ${
                    canProceed()
                      ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-lg shadow-[#E54A4A]/30'
                      : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
                  }`}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Sidebar - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg lg:sticky lg:top-24">
              <h3 className="font-bold text-[#1a1a1a] mb-4 text-sm sm:text-base">Order Summary</h3>
              
              {/* Package */}
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/70 text-xs sm:text-sm">Package</span>
                <span className="font-semibold text-[#1a1a1a] text-sm sm:text-base">{currentPackage?.name}</span>
              </div>

              {/* Styles */}
              {selectedStyles.length > 0 && (
                <div className="py-3 border-b border-[#1a1a1a]/10">
                  <span className="text-[#1a1a1a]/70 text-xs sm:text-sm">Styles</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selectedStyles.map((styleId) => {
                      const style = photoStyles.find(s => s.id === styleId);
                      return (
                        <span key={styleId} className="px-2 py-0.5 bg-[#E54A4A]/10 text-[#E54A4A] rounded text-[10px] sm:text-xs">
                          {style?.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Estimated Delivery */}
              <div className="flex justify-between items-center py-3 border-b border-[#1a1a1a]/10">
                <span className="text-[#1a1a1a]/70 text-xs sm:text-sm">Est. Delivery</span>
                <span className="text-xs sm:text-sm font-medium text-[#1a1a1a]">
                  {currentPackage && getDeliveryDate(parseInt(currentPackage.turnaround))}
                </span>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center pt-4">
                <span className="font-semibold text-[#1a1a1a] text-sm sm:text-base">Total</span>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-bold text-[#E54A4A]">${currentPackage?.price}</span>
                  {currentPackage?.originalPrice && (
                    <span className="block text-[10px] sm:text-xs text-green-600 font-medium">
                      Save ${currentPackage.originalPrice - currentPackage.price}
                    </span>
                  )}
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-4 border-t border-[#1a1a1a]/10 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1a1a1a]/60">
                  <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1a1a1a]/60">
                  <RefreshCw className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Free Revisions Included</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-[#1a1a1a]/60">
                  <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{currentPackage?.turnaround} Turnaround</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
