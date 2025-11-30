"use client";

import { useState } from "react";
import { Check, X, Star, Zap } from "lucide-react";

const packages = [
  {
    id: 1,
    name: "Single",
    subtitle: "1 Style",
    price: 89,
    description: "Perfect for testing our service",
    features: {
      styles: 1,
      resolution: "4K",
      revisions: 2,
      turnaround: "5 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
  },
  {
    id: 2,
    name: "Double",
    subtitle: "2 Styles",
    price: 159,
    description: "Great for variety",
    features: {
      styles: 2,
      resolution: "4K",
      revisions: 2,
      turnaround: "4 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
  },
  {
    id: 3,
    name: "Triple",
    subtitle: "3 Styles",
    price: 219,
    description: "Best value combo",
    features: {
      styles: 3,
      resolution: "4K+",
      revisions: 5,
      turnaround: "3 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: true,
    },
    popular: false,
  },
  {
    id: 4,
    name: "Lifestyle",
    subtitle: "In Context",
    price: 149,
    description: "Real-world product shots",
    features: {
      styles: 1,
      resolution: "4K",
      revisions: 3,
      turnaround: "4 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
    lifestyle: true,
  },
  {
    id: 5,
    name: "Complete",
    subtitle: "All 4 Styles",
    price: 280,
    originalPrice: 400,
    description: "Everything you need",
    features: {
      styles: 4,
      resolution: "4K+",
      revisions: "Unlimited",
      turnaround: "3 days",
      rawFiles: true,
      socialOptimized: true,
      prioritySupport: true,
    },
    popular: true,
    featured: true,
  },
];

const comparisonFeatures = [
  { key: "styles", label: "Photo Styles" },
  { key: "resolution", label: "Resolution" },
  { key: "revisions", label: "Revisions" },
  { key: "turnaround", label: "Turnaround" },
  { key: "socialOptimized", label: "Social Optimized" },
  { key: "rawFiles", label: "RAW Files" },
  { key: "prioritySupport", label: "Priority Support" },
];

export default function Pricing() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section 
      id="pricing" 
      className="py-24 md:py-32 bg-white relative overflow-hidden"
      aria-labelledby="pricing-heading"
      itemScope
      itemType="https://schema.org/Product"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E54A4A]/5 via-transparent to-[#ff9966]/5" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Choose your <span className="gradient-text">package</span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg mb-6">
            Flexible options for every need. No hidden fees.
          </p>
          
          {/* Toggle comparison */}
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="text-[#E54A4A] font-medium hover:underline"
          >
            {showComparison ? 'Hide comparison' : 'Compare all packages'}
          </button>
        </div>

        {/* Comparison Table */}
        {showComparison && (
          <div className="mb-16 overflow-x-auto animate-fadeIn">
            <table className="w-full min-w-[800px] bg-white rounded-2xl shadow-lg overflow-hidden">
              <thead>
                <tr className="bg-[#1a1a1a]">
                  <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="px-4 py-4 text-center">
                      <div className="text-white font-semibold">{pkg.name}</div>
                      <div className="text-white/60 text-sm">${pkg.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <tr key={feature.key} className={index % 2 === 0 ? 'bg-[#FFFAF5]' : 'bg-white'}>
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">{feature.label}</td>
                    {packages.map((pkg) => {
                      const value = pkg.features[feature.key as keyof typeof pkg.features];
                      return (
                        <td key={pkg.id} className="px-4 py-4 text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <Check className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-[#1a1a1a]/20 mx-auto" />
                            )
                          ) : (
                            <span className={`font-medium ${pkg.featured ? 'text-[#E54A4A]' : 'text-[#1a1a1a]'}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 ${
                pkg.featured
                  ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white shadow-2xl shadow-[#E54A4A]/20 scale-105 z-10'
                  : 'bg-white border border-gray-100 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Popular/Featured badge */}
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-[#E54A4A] rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-white text-xs font-semibold">Popular</span>
                  </div>
                </div>
              )}
              {pkg.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full flex items-center gap-1">
                    <Zap className="w-3 h-3 text-white fill-white" />
                    <span className="text-white text-xs font-semibold">Best Value</span>
                  </div>
                </div>
              )}

              {/* Package info */}
              <div className="text-center mb-5 pt-2">
                <h3 className={`text-xl font-bold mb-1 ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {pkg.name}
                </h3>
                <span className={`text-sm ${pkg.featured ? 'text-white/60' : 'text-[#1a1a1a]/50'}`}>
                  {pkg.subtitle}
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-5">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    ${pkg.price}
                  </span>
                </div>
                {pkg.originalPrice && (
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className={`text-sm line-through ${pkg.featured ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
                      ${pkg.originalPrice}
                    </span>
                    <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium">
                      Save ${pkg.originalPrice - pkg.price}
                    </span>
                  </div>
                )}
                <p className={`text-xs mt-2 ${pkg.featured ? 'text-white/50' : 'text-[#1a1a1a]/50'}`}>
                  {pkg.description}
                </p>
              </div>

              {/* Quick Features */}
              <div className="space-y-2 mb-5">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    pkg.featured 
                      ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                      : 'bg-[#E54A4A]/10'
                  }`}>
                    <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
                  </div>
                  <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                    {pkg.features.styles} photo style{pkg.features.styles > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    pkg.featured 
                      ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                      : 'bg-[#E54A4A]/10'
                  }`}>
                    <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
                  </div>
                  <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                    {pkg.features.turnaround} turnaround
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                    pkg.featured 
                      ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                      : 'bg-[#E54A4A]/10'
                  }`}>
                    <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
                  </div>
                  <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                    {pkg.features.revisions} revision{typeof pkg.features.revisions === 'number' && pkg.features.revisions > 1 ? 's' : ''}
                  </span>
                </div>
                {pkg.features.rawFiles && (
                  <div className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      pkg.featured 
                        ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                        : 'bg-[#E54A4A]/10'
                    }`}>
                      <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
                    </div>
                    <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                      RAW files included
                    </span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
              <a
                href="/order"
                className={`block w-full py-3 rounded-full text-center font-semibold transition-all ${
                  pkg.featured
                    ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white hover:shadow-lg hover:shadow-[#E54A4A]/30'
                    : 'bg-[#1a1a1a] text-white hover:bg-[#E54A4A]'
                }`}
              >
                Get Started
              </a>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="text-center mt-12">
          <p className="text-[#1a1a1a]/40 text-sm">
            100% satisfaction guaranteed · Full refund if not happy · Secure payment
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}
