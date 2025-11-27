"use client";

import { Check, Star } from "lucide-react";

const features = [
  "All 4 photography styles",
  "High-resolution 4K+ files",
  "Web & social optimized",
  "Professional retouching",
  "Unlimited revisions",
  "3-5 day turnaround",
  "Commercial rights",
  "RAW files included",
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
            Simple Pricing
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            One price, <span className="gradient-text">everything included</span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg">
            No hidden fees. No surprises. Just amazing photos.
          </p>
        </div>

        {/* Pricing Card */}
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] rounded-[2rem] p-8 md:p-12 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#E54A4A]/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#ff9966]/20 to-transparent rounded-full blur-3xl" />
            
            {/* Popular badge */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <div className="px-6 py-2 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-b-2xl flex items-center gap-2">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-white text-sm font-semibold">Complete Package</span>
              </div>
            </div>

            <div className="relative grid md:grid-cols-2 gap-12 items-center pt-8">
              {/* Left - Price */}
              <div className="text-center md:text-left">
                <div className="mb-6">
                  <span className="text-white/50 text-lg">Per product</span>
                  <div className="flex items-baseline justify-center md:justify-start gap-2 mt-2">
                    <span className="text-6xl md:text-7xl font-bold text-white">$280</span>
                    <span className="text-white/50 line-through">$400</span>
                  </div>
                  <span className="inline-block mt-2 px-3 py-1 bg-[#E54A4A]/20 text-[#ff7f7f] text-sm font-semibold rounded-full">
                    Save 30%
                  </span>
                </div>
                
                <p className="text-white/50 mb-8">
                  Includes all 4 photography styles, professional retouching, and unlimited revisions.
                </p>

                <a
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all hover:-translate-y-1"
                >
                  Start Your Project
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

              {/* Right - Features */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-white/80 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badge */}
            <div className="relative text-center mt-10 pt-8 border-t border-white/10">
              <p className="text-white/40 text-sm">
                100% satisfaction guaranteed · Full refund if not happy
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
