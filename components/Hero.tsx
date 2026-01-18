"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Star } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-white pt-24 sm:pt-28 pb-16 sm:pb-20">
      {/* Subtle Background - Only Red Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-[#E63946]/5 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 text-center max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-8">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span>Trusted by 500+ brands</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-gray-900 mb-6">
            Professional Product
            <br />
            <span className="text-[#E63946]">Photography</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-gray-500 max-w-xl mx-auto leading-relaxed mb-10">
            Ship your products, get magazine-quality photos in 3-5 days.
            <br className="hidden sm:block" />
            Simple pricing, stunning results.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="#packages"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63946] text-white text-base font-semibold rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
            >
              View Packages
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-700 text-base font-semibold rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Get Started
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>3-5 day turnaround</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Unlimited revisions</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>Free return shipping</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
