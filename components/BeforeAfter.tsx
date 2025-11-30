"use client";

import { useState } from "react";
import { X, Check, TrendingUp, ShoppingCart, Eye, Heart, ChevronLeft, ChevronRight } from "lucide-react";

const comparisons = [
  {
    id: 1,
    amateur: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=60",
    professional: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=95",
    product: "Premium Headphones",
  },
  {
    id: 2,
    amateur: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=60",
    professional: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=95",
    product: "Beauty Products",
  },
  {
    id: 3,
    amateur: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=60",
    professional: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=95",
    product: "Sunglasses",
  },
];

const amateurProblems = [
  { icon: X, text: "Poor lighting & shadows" },
  { icon: X, text: "Distracting backgrounds" },
  { icon: X, text: "Inconsistent colors" },
  { icon: X, text: "Low resolution images" },
  { icon: X, text: "Unprofessional angles" },
];

const rushBenefits = [
  { icon: Check, text: "Studio-quality lighting" },
  { icon: Check, text: "Clean, focused backgrounds" },
  { icon: Check, text: "True-to-life colors" },
  { icon: Check, text: "4K+ high resolution" },
  { icon: Check, text: "Expert compositions" },
];

const stats = [
  { icon: TrendingUp, value: "+94%", label: "Conversion Rate" },
  { icon: ShoppingCart, value: "+67%", label: "Add to Cart" },
  { icon: Eye, value: "+156%", label: "Time on Page" },
  { icon: Heart, value: "+82%", label: "Customer Trust" },
];

export default function BeforeAfter() {
  const [position, setPosition] = useState(50);
  const [activeComparison, setActiveComparison] = useState(0);

  const nextComparison = () => {
    setActiveComparison((prev) => (prev + 1) % comparisons.length);
    setPosition(50);
  };

  const prevComparison = () => {
    setActiveComparison((prev) => (prev - 1 + comparisons.length) % comparisons.length);
    setPosition(50);
  };

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-[#0a0a0a] to-[#1a1a1a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-[#E54A4A]/20 to-transparent blur-[100px] rounded-full" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#E54A4A]/20 text-[#E54A4A] text-sm font-bold rounded-full mb-6 border border-[#E54A4A]/30">
            <span className="w-2 h-2 bg-[#E54A4A] rounded-full animate-pulse" />
            The Rush Difference
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6">
            Stop Losing Sales to
            <span className="block gradient-text mt-2">Bad Product Photos</span>
          </h2>
          <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
            Your customers judge your product in <span className="text-white font-semibold">0.05 seconds</span>. 
            Make every millisecond count with professional photography.
          </p>
        </div>

        {/* Main comparison section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Before/After Slider */}
          <div className="relative">
            <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              {/* Before Image (Amateur) - with degraded quality effect */}
              <div className="absolute inset-0">
                <img
                  src={comparisons[activeComparison].amateur}
                  alt="Amateur photo"
                  className="w-full h-full object-cover"
                  style={{
                    filter: 'brightness(0.7) contrast(0.85) saturate(0.7)',
                  }}
                />
                {/* Amateur overlay effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-900/30 to-transparent" />
                <div className="absolute inset-0" style={{
                  background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)'
                }} />
              </div>

              {/* After Image (Professional) */}
              <div 
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
              >
                <img
                  src={comparisons[activeComparison].professional}
                  alt="Rush Photo professional"
                  className="w-full h-full object-cover"
                />
                {/* Professional glow effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />
              </div>

              {/* Slider Handle */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20"
                style={{ left: `${position}%` }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-[#E54A4A]">
                  <span className="text-[#E54A4A] text-xl font-bold">↔</span>
                </div>
              </div>

              {/* Labels */}
              <div className="absolute top-6 left-6 z-10">
                <div className="px-4 py-2 bg-black/70 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="flex items-center gap-2">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="text-white/90 text-sm font-bold">Amateur</span>
                  </div>
                  <p className="text-white/50 text-xs mt-1">iPhone photo, no editing</p>
                </div>
              </div>
              
              <div className="absolute top-6 right-6 z-10">
                <div className="px-4 py-2 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-xl shadow-lg shadow-[#E54A4A]/30">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-white text-sm font-bold">Rush Photo</span>
                  </div>
                  <p className="text-white/80 text-xs mt-1">Professional studio quality</p>
                </div>
              </div>

              {/* Product name */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
                <div className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-white font-semibold">{comparisons[activeComparison].product}</span>
                </div>
              </div>

              {/* Invisible range input */}
              <input
                type="range"
                min="0"
                max="100"
                value={position}
                onChange={(e) => setPosition(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
              />
            </div>

            {/* Navigation arrows */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={prevComparison}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <div className="flex items-center gap-2">
                {comparisons.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveComparison(i); setPosition(50); }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === activeComparison ? 'w-8 bg-[#E54A4A]' : 'bg-white/30'
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextComparison}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>

            <p className="text-center text-white/40 text-sm mt-4">
              Drag the slider to see the difference
            </p>
          </div>

          {/* Comparison Lists */}
          <div className="space-y-8">
            {/* Amateur problems */}
            <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
                Amateur Photography Problems
              </h3>
              <ul className="space-y-3">
                {amateurProblems.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/70">
                    <item.icon className="w-5 h-5 text-red-500 flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-red-500/20">
                <p className="text-red-400 text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 rotate-180" />
                  Results in 73% lower conversion rates
                </p>
              </div>
            </div>

            {/* Rush benefits */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#E54A4A]/20 to-[#ff9966]/10 border border-[#E54A4A]/30">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E54A4A] flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                Rush Photo Advantage
              </h3>
              <ul className="space-y-3">
                {rushBenefits.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-white/90">
                    <item.icon className="w-5 h-5 text-[#E54A4A] flex-shrink-0" />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-4 border-t border-[#E54A4A]/30">
                <p className="text-[#E54A4A] text-sm font-semibold flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Average 94% increase in conversions
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-white">
              The Impact of <span className="gradient-text">Professional Photos</span>
            </h3>
            <p className="text-white/50 mt-2">Based on data from 500+ brands using Rush Photo</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center group hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-[#E54A4A]/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-6 h-6 text-[#E54A4A]" />
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-[#E54A4A] mb-1">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/order"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold text-lg rounded-full hover:shadow-2xl hover:shadow-[#E54A4A]/40 transition-all hover:-translate-y-1"
          >
            Upgrade Your Product Photos
            <TrendingUp className="w-5 h-5" />
          </a>
          <p className="text-white/40 text-sm mt-4">
            Join 500+ brands seeing real results
          </p>
        </div>
      </div>
    </section>
  );
}
