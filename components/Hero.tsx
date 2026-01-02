"use client";

import { motion } from "framer-motion";
import { ArrowDown, Check } from "lucide-react";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-center items-center overflow-hidden bg-rush-light pt-16 sm:pt-20 pb-8 sm:pb-10">
      {/* Aesthetic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[300px] sm:w-[400px] md:w-[500px] h-[300px] sm:h-[400px] md:h-[500px] bg-[#E63946]/5 rounded-full blur-[80px] sm:blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[250px] sm:w-[300px] md:w-[400px] h-[250px] sm:h-[300px] md:h-[400px] bg-rush-gray/5 rounded-full blur-[60px] sm:blur-[80px]" />
      </div>

      <div className="container relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 rounded-full border border-[#E63946]/20 bg-[#E63946]/5 text-[#E63946] text-xs sm:text-sm font-bold tracking-wide uppercase mb-6 sm:mb-8">
            Professional Product Photography
          </span>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-[1.1] sm:leading-[1.05] text-rush-dark mb-6 sm:mb-8">
            Simple Pricing. <br />
            <span className="text-[#E63946]">Stunning Results.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-rush-gray max-w-2xl mx-auto leading-relaxed font-medium mb-8 sm:mb-10 px-2">
            Choose from 3 clear packages. Ship your products. <br className="hidden sm:block" />
            Get magazine-quality photos in days.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-16">
            <Link
              href="#packages"
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-[#E63946] text-white text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl hover:bg-[#D62839] hover:scale-105 transition-all shadow-xl shadow-[#E63946]/30 flex items-center justify-center gap-2"
            >
              View Packages <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>

            <div className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border border-rush-border bg-white/50 backdrop-blur-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34C759]" strokeWidth={3} />
                <span className="text-xs sm:text-sm font-semibold text-rush-dark">Fast Turnaround</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34C759]" strokeWidth={3} />
                <span className="text-xs sm:text-sm font-semibold text-rush-dark">Unlimited Revisions</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Connection to Pricing */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-rush-gray/50" />
      </div>
    </section>
  );
}
