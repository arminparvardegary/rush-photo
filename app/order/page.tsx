"use client";

import { useState, useEffect } from "react";
import { Check, ArrowLeft, ArrowRight, Package, CreditCard, Camera } from "lucide-react";
import Link from "next/link";

const photoStyles = [
  {
    id: "topdown",
    name: "Top Down",
    description: "Bird's-eye view shots for flat-lay compositions",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
  },
  {
    id: "product",
    name: "Product",
    description: "Clean studio shots with perfect lighting",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
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
  },
];

const packages = [
  {
    id: "single",
    name: "Single",
    price: 89,
    description: "1 photography style",
    stylesCount: 1,
  },
  {
    id: "double",
    name: "Double",
    price: 159,
    description: "2 photography styles",
    stylesCount: 2,
  },
  {
    id: "triple",
    name: "Triple",
    price: 219,
    description: "3 photography styles",
    stylesCount: 3,
    popular: true,
  },
  {
    id: "lifestyle",
    name: "Lifestyle",
    price: 149,
    description: "Lifestyle photography only",
    stylesCount: 1,
    fixedStyle: "lifestyle",
  },
  {
    id: "complete",
    name: "Complete",
    price: 280,
    originalPrice: 400,
    description: "All 4 photography styles",
    stylesCount: 4,
  },
];

export default function OrderPage() {
  const [step, setStep] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState("complete");
  const [selectedStyles, setSelectedStyles] = useState<string[]>(photoStyles.map(s => s.id));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    productName: "",
    productDescription: "",
    notes: "",
  });

  const currentPackage = packages.find(p => p.id === selectedPackage);
  const maxStyles = currentPackage?.stylesCount || 4;

  // Update selected styles when package changes
  useEffect(() => {
    if (selectedPackage === "complete") {
      setSelectedStyles(photoStyles.map(s => s.id));
    } else if (selectedPackage === "lifestyle") {
      setSelectedStyles(["lifestyle"]);
    } else {
      // Keep only the allowed number of styles
      setSelectedStyles(prev => prev.slice(0, maxStyles));
    }
  }, [selectedPackage, maxStyles]);

  const toggleStyle = (styleId: string) => {
    if (selectedPackage === "complete" || selectedPackage === "lifestyle") return; // Can't toggle for complete or lifestyle package
    
    if (selectedStyles.includes(styleId)) {
      setSelectedStyles(prev => prev.filter(s => s !== styleId));
    } else if (selectedStyles.length < maxStyles) {
      setSelectedStyles(prev => [...prev, styleId]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canProceed = () => {
    if (step === 1) return selectedPackage !== "";
    if (step === 2) {
      if (selectedPackage === "complete") return selectedStyles.length === 4;
      if (selectedPackage === "lifestyle") return selectedStyles.includes("lifestyle");
      return selectedStyles.length === maxStyles;
    }
    if (step === 3) return formData.name && formData.email && formData.productName;
    return true;
  };

  const nextStep = () => {
    if (canProceed() && step < 4) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-[#E54A4A]/10 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <span className="text-[#1a1a1a] font-bold">Rush</span>
              <span className="text-[#E54A4A] font-bold">.photo</span>
            </div>
          </Link>
          
          <Link href="/" className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-center gap-2 md:gap-4 mb-12">
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
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-full transition-all ${
                  step === s.num 
                    ? 'bg-[#E54A4A] text-white' 
                    : step > s.num 
                      ? 'bg-green-500 text-white cursor-pointer hover:bg-green-600'
                      : 'bg-white text-[#1a1a1a]/40 cursor-not-allowed'
                }`}
              >
                {step > s.num ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <s.icon className="w-4 h-4" />
                )}
                <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
              </button>
              {i < 3 && (
                <div className={`w-6 md:w-12 h-0.5 mx-1 md:mx-2 ${step > s.num ? 'bg-green-500' : 'bg-[#1a1a1a]/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Package Selection */}
        {step === 1 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
                Choose Your Package
              </h1>
              <p className="text-[#1a1a1a]/60">
                Select the package that fits your needs
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => setSelectedPackage(pkg.id)}
                  className={`relative bg-white p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    selectedPackage === pkg.id
                      ? 'ring-2 ring-[#E54A4A] shadow-xl shadow-[#E54A4A]/10 scale-[1.02]'
                      : 'border border-[#1a1a1a]/5 hover:border-[#E54A4A]/30 hover:shadow-lg'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[#E54A4A] text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{pkg.name}</h3>
                  <p className="text-[#1a1a1a]/50 text-sm mb-4">{pkg.description}</p>
                  
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-[#E54A4A]">${pkg.price}</span>
                    {pkg.originalPrice && (
                      <span className="text-[#1a1a1a]/40 line-through">${pkg.originalPrice}</span>
                    )}
                  </div>

                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPackage === pkg.id
                      ? 'border-[#E54A4A] bg-[#E54A4A]'
                      : 'border-[#1a1a1a]/20'
                  }`}>
                    {selectedPackage === pkg.id && <Check className="w-4 h-4 text-white" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Style Selection */}
        {step === 2 && (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
                {selectedPackage === "complete" 
                  ? "Your 4 Styles" 
                  : selectedPackage === "lifestyle"
                    ? "Lifestyle Photography"
                    : `Select ${maxStyles} Style${maxStyles > 1 ? 's' : ''}`}
              </h1>
              <p className="text-[#1a1a1a]/60">
                {selectedPackage === "complete" 
                  ? "You get all 4 photography styles with the Complete Package" 
                  : selectedPackage === "lifestyle"
                    ? "Your product in real-world scenarios"
                    : `Selected: ${selectedStyles.length}/${maxStyles}`}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {photoStyles.map((style) => {
                const isSelected = selectedStyles.includes(style.id);
                const isDisabled = (selectedPackage === "complete" || selectedPackage === "lifestyle") 
                  ? false 
                  : !isSelected && selectedStyles.length >= maxStyles;
                const isFixed = selectedPackage === "complete" || selectedPackage === "lifestyle";
                
                // For lifestyle package, only show the lifestyle style as available
                if (selectedPackage === "lifestyle" && style.id !== "lifestyle") {
                  return (
                    <div
                      key={style.id}
                      className="relative rounded-2xl overflow-hidden opacity-30 cursor-not-allowed"
                    >
                      <div className="aspect-[3/4]">
                        <img
                          src={style.image}
                          alt={style.name}
                          className="w-full h-full object-cover grayscale"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-lg font-bold text-white">{style.name}</h3>
                          <p className="text-white/70 text-xs md:text-sm">{style.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
                
                return (
                  <div
                    key={style.id}
                    onClick={() => !isDisabled && !isFixed && toggleStyle(style.id)}
                    className={`relative rounded-2xl overflow-hidden transition-all duration-300 ${
                      isFixed ? 'cursor-default' : 'cursor-pointer'
                    } ${
                      isSelected
                        ? 'ring-4 ring-[#E54A4A] shadow-xl'
                        : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:shadow-lg'
                    }`}
                  >
                    <div className="aspect-[3/4]">
                      <img
                        src={style.image}
                        alt={style.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="text-lg font-bold text-white">{style.name}</h3>
                        <p className="text-white/70 text-xs md:text-sm">{style.description}</p>
                      </div>

                      {isSelected && (
                        <div className="absolute top-3 right-3 w-8 h-8 bg-[#E54A4A] rounded-full flex items-center justify-center">
                          <Check className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Details Form */}
        {step === 3 && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
                Your Details
              </h1>
              <p className="text-[#1a1a1a]/60">
                Tell us about yourself and your product
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg">
              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a]"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a]"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a]"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a]"
                    placeholder="Your Company"
                  />
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all bg-white text-[#1a1a1a]"
                  placeholder="What product are we photographing?"
                />
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Product Description
                </label>
                <textarea
                  name="productDescription"
                  value={formData.productDescription}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all resize-none bg-white text-[#1a1a1a]"
                  placeholder="Tell us about your product..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                  Special Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-[#1a1a1a]/10 focus:border-[#E54A4A] focus:ring-2 focus:ring-[#E54A4A]/20 outline-none transition-all resize-none bg-white text-[#1a1a1a]"
                  placeholder="Any special requirements or preferences?"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <div className="animate-fadeIn max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
                Order Summary
              </h1>
              <p className="text-[#1a1a1a]/60">
                Review your order before confirming
              </p>
            </div>

            <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg mb-6">
              {/* Package */}
              <div className="flex justify-between items-start pb-6 border-b border-[#1a1a1a]/10">
                <div>
                  <h3 className="font-semibold text-[#1a1a1a]">{currentPackage?.name}</h3>
                  <p className="text-sm text-[#1a1a1a]/50">{currentPackage?.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-[#E54A4A]">${currentPackage?.price}</span>
                  {currentPackage?.originalPrice && (
                    <span className="block text-sm text-[#1a1a1a]/40 line-through">${currentPackage.originalPrice}</span>
                  )}
                </div>
              </div>

              {/* Selected Styles */}
              <div className="py-6 border-b border-[#1a1a1a]/10">
                <h4 className="font-medium text-[#1a1a1a] mb-3">Selected Styles</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedStyles.map((styleId) => {
                    const style = photoStyles.find(s => s.id === styleId);
                    return (
                      <span key={styleId} className="px-3 py-1 bg-[#E54A4A]/10 text-[#E54A4A] rounded-full text-sm font-medium">
                        {style?.name}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className="py-6 border-b border-[#1a1a1a]/10">
                <h4 className="font-medium text-[#1a1a1a] mb-3">Contact Information</h4>
                <div className="space-y-1 text-sm text-[#1a1a1a]/70">
                  <p>{formData.name}</p>
                  <p>{formData.email}</p>
                  {formData.phone && <p>{formData.phone}</p>}
                  {formData.company && <p>{formData.company}</p>}
                </div>
              </div>

              {/* Product Info */}
              <div className="pt-6">
                <h4 className="font-medium text-[#1a1a1a] mb-3">Product</h4>
                <p className="text-[#1a1a1a]/70">{formData.productName}</p>
                {formData.productDescription && (
                  <p className="text-sm text-[#1a1a1a]/50 mt-1">{formData.productDescription}</p>
                )}
              </div>
            </div>

            {/* Total */}
            <div className="bg-[#1a1a1a] p-6 rounded-2xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-white/60 text-sm">Total Amount</p>
                <p className="text-3xl font-bold">${currentPackage?.price}</p>
              </div>
              <button
                onClick={() => {
                  alert('Order submitted! We will contact you shortly with shipping instructions.');
                  window.location.href = '/';
                }}
                className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full font-semibold hover:shadow-lg transition-all"
              >
                Confirm Order
              </button>
            </div>

            <p className="text-center text-[#1a1a1a]/40 text-sm mt-4">
              You will receive shipping instructions via email after confirmation
            </p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between max-w-2xl mx-auto mt-10">
          {step > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 px-6 py-3 text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          
          {step < 4 && (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-semibold transition-all ${
                canProceed()
                  ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-lg'
                  : 'bg-[#1a1a1a]/10 text-[#1a1a1a]/30 cursor-not-allowed'
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
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
