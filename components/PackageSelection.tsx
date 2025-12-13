"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight,
  Camera,
  Sparkles,
  Package,
  Star
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
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  const [prices, setPrices] = useState(DEFAULT_PRICES);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/pricing");
        if (!res.ok) return;
        const data = await res.json();
        const pricing = data?.pricing;
        if (!pricing) return;
        setPrices({
          ecommerce: { perAngle: pricing.ecommerce?.perAngle || 25 },
          lifestyle: { flatRate: pricing.lifestyle?.flatRate || 149 },
          fullPackageDiscount: pricing.fullPackageDiscount || 10,
        });
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    };
    load();
  }, []);

  return (
    <section className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#FAFAFA] py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        {/* Minimal Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-semibold text-[#1a1a1a] mb-3 tracking-tight">
            Choose Your Package
          </h1>
          <p className="text-[#666] text-base">
            Professional product photography for your brand
          </p>
        </div>

        {/* Package Cards */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* E-commerce Package */}
          <Link
            href="/order?package=ecommerce"
            onMouseEnter={() => setHoveredPackage("ecommerce")}
            onMouseLeave={() => setHoveredPackage(null)}
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[#E5E5E5] transition-all duration-300 ${
              hoveredPackage === "ecommerce" 
                ? "border-[#E54A4A] shadow-lg shadow-[#E54A4A]/10 scale-[1.02]" 
                : hoveredPackage ? "opacity-60" : "hover:border-[#CCC]"
            }`}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={PACKAGE_IMAGES.ecommerce}
                alt="E-commerce Photography"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-[#E54A4A]" />
                <h3 className="text-lg font-semibold text-[#1a1a1a]">E-commerce</h3>
              </div>
              <p className="text-[#666] text-sm mb-4">
                Clean product shots on white background
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[#E54A4A] font-semibold">From ${prices.ecommerce.perAngle}/angle</span>
                <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-[#E54A4A] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Lifestyle Package */}
          <Link
            href="/order?package=lifestyle"
            onMouseEnter={() => setHoveredPackage("lifestyle")}
            onMouseLeave={() => setHoveredPackage(null)}
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[#E5E5E5] transition-all duration-300 ${
              hoveredPackage === "lifestyle" 
                ? "border-purple-500 shadow-lg shadow-purple-500/10 scale-[1.02]" 
                : hoveredPackage ? "opacity-60" : "hover:border-[#CCC]"
            }`}
          >
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={PACKAGE_IMAGES.lifestyle}
                alt="Lifestyle Photography"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <h3 className="text-lg font-semibold text-[#1a1a1a]">Lifestyle</h3>
              </div>
              <p className="text-[#666] text-sm mb-4">
                Styled scenes with props and creative direction
              </p>
              <div className="flex items-center justify-between">
                <span className="text-purple-600 font-semibold">${prices.lifestyle.flatRate} flat rate</span>
                <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>

          {/* Full Package */}
          <Link
            href="/order?package=fullpackage"
            onMouseEnter={() => setHoveredPackage("fullpackage")}
            onMouseLeave={() => setHoveredPackage(null)}
            className={`group relative overflow-hidden rounded-2xl bg-white border border-[#E5E5E5] transition-all duration-300 ${
              hoveredPackage === "fullpackage" 
                ? "border-amber-500 shadow-lg shadow-amber-500/10 scale-[1.02]" 
                : hoveredPackage ? "opacity-60" : "hover:border-[#CCC]"
            }`}
          >
            <div className="absolute top-3 right-3 z-10 bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
              <Star className="w-3 h-3" />
              SAVE {prices.fullPackageDiscount}%
            </div>
            <div className="aspect-[4/3] relative overflow-hidden">
              <img
                src={PACKAGE_IMAGES.fullpackage}
                alt="Full Package Photography"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-amber-500" />
                <h3 className="text-lg font-semibold text-[#1a1a1a]">Full Package</h3>
              </div>
              <p className="text-[#666] text-sm mb-4">
                E-commerce + Lifestyle with {prices.fullPackageDiscount}% discount
              </p>
              <div className="flex items-center justify-between">
                <span className="text-amber-600 font-semibold">Best Value</span>
                <ArrowRight className="w-4 h-4 text-[#999] group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
