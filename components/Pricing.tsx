"use client";

import { Check, Star } from "lucide-react";

const packages = [
  {
    id: 1,
    name: "Single",
    subtitle: "1 Style",
    price: 89,
    description: "Perfect for testing our service",
    features: [
      "1 photography style",
      "High-resolution files",
      "Professional retouching",
      "5-day turnaround",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Double",
    subtitle: "2 Styles",
    price: 159,
    description: "Great for variety",
    features: [
      "2 photography styles",
      "High-resolution files",
      "Professional retouching",
      "4-day turnaround",
    ],
    popular: false,
  },
  {
    id: 3,
    name: "Triple",
    subtitle: "3 Styles",
    price: 219,
    description: "Best value combo",
    features: [
      "3 photography styles",
      "High-resolution files",
      "Professional retouching",
      "3-day turnaround",
      "Priority support",
    ],
    popular: true,
  },
  {
    id: 4,
    name: "Lifestyle",
    subtitle: "In Context",
    price: 149,
    description: "Real-world product shots",
    features: [
      "Lifestyle photography",
      "Multiple angles",
      "High-resolution files",
      "Professional retouching",
      "4-day turnaround",
    ],
    popular: false,
  },
  {
    id: 5,
    name: "Complete",
    subtitle: "All 4 Styles",
    price: 280,
    originalPrice: 400,
    description: "Everything you need",
    features: [
      "All 4 photography styles",
      "High-resolution 4K+ files",
      "Web & social optimized",
      "Professional retouching",
      "Unlimited revisions",
      "3-day turnaround",
      "RAW files included",
    ],
    popular: false,
    featured: true,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E54A4A]/5 via-transparent to-[#ff9966]/5" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            Choose your <span className="gradient-text">package</span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg">
            Flexible options for every need. No hidden fees.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 ${
                pkg.featured
                  ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white shadow-2xl shadow-[#E54A4A]/20'
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
                    <Star className="w-3 h-3 text-white fill-white" />
                    <span className="text-white text-xs font-semibold">Best Value</span>
                  </div>
                </div>
              )}

              {/* Package info */}
              <div className="text-center mb-6 pt-2">
                <h3 className={`text-xl font-bold mb-1 ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}>
                  {pkg.name}
                </h3>
                <span className={`text-sm ${pkg.featured ? 'text-white/60' : 'text-[#1a1a1a]/50'}`}>
                  {pkg.subtitle}
                </span>
              </div>

              {/* Price */}
              <div className="text-center mb-6">
                <div className="flex items-baseline justify-center gap-1">
                  <span className={`text-4xl font-bold ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}>
                    ${pkg.price}
                  </span>
                </div>
                {pkg.originalPrice && (
                  <span className={`text-sm line-through ${pkg.featured ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
                    ${pkg.originalPrice}
                  </span>
                )}
                <p className={`text-xs mt-2 ${pkg.featured ? 'text-white/50' : 'text-[#1a1a1a]/50'}`}>
                  {pkg.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-6">
                {pkg.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      pkg.featured 
                        ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                        : 'bg-[#E54A4A]/10'
                    }`}>
                      <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
                    </div>
                    <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
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
                Select
              </a>
            </div>
          ))}
        </div>

        {/* Trust badge */}
        <div className="text-center mt-12">
          <p className="text-[#1a1a1a]/40 text-sm">
            100% satisfaction guaranteed · Full refund if not happy
          </p>
        </div>
      </div>
    </section>
  );
}
