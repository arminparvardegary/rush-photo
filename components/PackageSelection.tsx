"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight,
  Camera,
  Sparkles,
  Package,
  Shield,
  Clock,
  Heart,
  Star,
  Zap
} from "lucide-react";

// Default Pricing
const DEFAULT_PRICES = {
  ecommerce: { perAngle: 25 },
  lifestyle: { flatRate: 149 },
  fullPackageDiscount: 10,
};

// Package images
const PACKAGE_IMAGES = {
  ecommerce: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=400&fit=crop&q=80",
  lifestyle: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop&q=80",
  fullpackage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80",
};

export default function PackageSelection() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [prices, setPrices] = useState(DEFAULT_PRICES);

  useEffect(() => {
    const savedPricing = localStorage.getItem("pricing");
    if (savedPricing) {
      try {
        const pricing = JSON.parse(savedPricing);
        setPrices({
          ecommerce: { perAngle: pricing.ecommerce?.perAngle || 25 },
          lifestyle: { flatRate: pricing.lifestyle?.flatRate || 149 },
          fullPackageDiscount: pricing.fullPackageDiscount || 10,
        });
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    }
  }, []);

  return (
    <section id="packages" className="py-20 sm:py-32 bg-gradient-to-br from-[#FFF8F0] via-white to-[#fff0f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E54A4A]/10 text-[#E54A4A] font-medium text-sm mb-6">
            <Zap className="w-4 h-4" />
            Professional Product Photography
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#1a1a1a] mb-6">
            Choose Your Package
          </h2>
          <p className="text-lg sm:text-xl text-[#1a1a1a]/60 max-w-2xl mx-auto">
            Select the type of photography that best fits your brand and product needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* E-commerce Package */}
          <Link
            href="/order?package=ecommerce"
            onMouseEnter={() => setSelectedPackage("ecommerce")}
            onMouseLeave={() => setSelectedPackage(null)}
            className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
              selectedPackage === "ecommerce" 
                ? "ring-4 ring-[#E54A4A] scale-[1.02]" 
                : selectedPackage ? "opacity-50 blur-[1px]" : "hover:scale-[1.02]"
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
                  <span className="text-white font-bold text-xl">From ${prices.ecommerce.perAngle}/angle</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Lifestyle Package */}
          <Link
            href="/order?package=lifestyle"
            onMouseEnter={() => setSelectedPackage("lifestyle")}
            onMouseLeave={() => setSelectedPackage(null)}
            className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
              selectedPackage === "lifestyle" 
                ? "ring-4 ring-purple-500 scale-[1.02]" 
                : selectedPackage ? "opacity-50 blur-[1px]" : "hover:scale-[1.02]"
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
                  <span className="text-white font-bold text-xl">${prices.lifestyle.flatRate} flat rate</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>

          {/* Full Package */}
          <Link
            href="/order?package=fullpackage"
            onMouseEnter={() => setSelectedPackage("fullpackage")}
            onMouseLeave={() => setSelectedPackage(null)}
            className={`group relative overflow-hidden rounded-3xl transition-all duration-500 ${
              selectedPackage === "fullpackage" 
                ? "ring-4 ring-amber-500 scale-[1.02]" 
                : selectedPackage ? "opacity-50 blur-[1px]" : "hover:scale-[1.02]"
            }`}
          >
            <div className="absolute top-4 right-4 z-10 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4" />
              SAVE {prices.fullPackageDiscount}%
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
                  E-commerce + Lifestyle with {prices.fullPackageDiscount}% discount
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold text-xl">Best Value</span>
                  <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
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
    </section>
  );
}

