"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-rush-light pt-20 pb-10">
      {/* Aesthetic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#E63946]/5 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-rush-gray/5 rounded-full blur-[80px]" />
      </div>

      <div className="container relative z-10 text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-[#E63946]/20 bg-[#E63946]/5 text-[#E63946] text-sm font-bold tracking-wide uppercase mb-8">
            Professional Product Photography
          </span>

          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] text-rush-dark mb-8">
            Simple Pricing. <br />
            <span className="text-[#E63946]">Stunning Results.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-rush-gray max-w-2xl mx-auto leading-relaxed font-medium mb-10">
            Choose from 3 clear packages. Ship your products. <br className="hidden sm:block" />
            Get magazine-quality photos in days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="#packages"
              className="px-8 py-4 bg-[#E63946] text-white text-lg font-bold rounded-2xl hover:bg-[#D62839] hover:scale-105 transition-all shadow-xl shadow-[#E63946]/30 flex items-center gap-2"
            >
              View Packages <ArrowDown className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-6 px-6 py-4 rounded-2xl border border-rush-border bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34C759]" strokeWidth={3} />
                <span className="text-sm font-semibold text-rush-dark">Fast Turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#34C759]" strokeWidth={3} />
                <span className="text-sm font-semibold text-rush-dark">Unlimited Revisions</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connection to Pricing */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-rush-gray/50" />
      </div>
    </section>
  );
}
