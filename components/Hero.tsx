"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Play, Star } from "lucide-react";

const words = ["sell", "convert", "shine", "dominate"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6]">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 right-[10%] w-[400px] h-[400px] bg-gradient-to-br from-[#E54A4A]/20 to-[#ff9966]/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] bg-gradient-to-br from-[#ff7f7f]/15 to-[#E54A4A]/10 rounded-full blur-[60px]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#E54A4A 1px, transparent 1px), linear-gradient(90deg, #E54A4A 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container relative z-10 pt-8 sm:pt-12 lg:pt-16 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E54A4A]/20 rounded-full mb-6 shadow-sm">
              <div className="flex -space-x-1.5 sm:-space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold">
                    {i === 4 ? '+' : ''}
                  </div>
                ))}
              </div>
              <div className="h-4 sm:h-5 w-px bg-[#1a1a1a]/20" />
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]/70">500+ Brands</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-4 sm:mb-6 tracking-tight">
              <span className="text-[#1a1a1a]">Photos that</span>
              <br />
              <span className="bg-gradient-to-r from-[#E54A4A] via-[#ff7f7f] to-[#ff9966] bg-clip-text text-transparent">
                {words[wordIndex]}
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-[#1a1a1a]/60 max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
              Four stunning photography styles. Ship your product, receive 
              <span className="text-[#E54A4A] font-semibold"> magazine-quality </span> 
              photos in days.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
              <a
                href="/order"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/30 hover:-translate-y-1"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#work"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#1a1a1a] font-semibold rounded-full border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] hover:text-[#E54A4A] transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                View Our Work
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 justify-center lg:justify-start">
              {[
                { value: '3-5', label: 'Day Turnaround' },
                { value: '4', label: 'Photo Styles' },
                { value: '100%', label: 'Satisfaction' },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E54A4A] group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-xs sm:text-sm text-[#1a1a1a]/50 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="relative mt-8 lg:mt-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:max-w-none">
              <div className="space-y-3 sm:space-y-4">
                <div className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10 group">
                  <img 
                    src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" 
                    alt="Top down flat-lay photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80" 
                    alt="Product studio photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                <div className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl group">
                  <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" 
                    alt="Diagonal product photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10 group">
                  <img 
                    src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80" 
                    alt="Lifestyle product photography"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white rounded-full shadow-lg border border-[#E54A4A]/10 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">100% Satisfaction Guaranteed</span>
            </div>
            
            <div className="absolute -top-2 -right-2 sm:top-0 sm:right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#E54A4A] rounded-full shadow-lg">
              <span className="text-xs sm:text-sm font-bold text-white">-30% OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="pb-8 flex flex-col items-center gap-2">
        <span className="text-[#1a1a1a]/40 text-xs font-medium uppercase tracking-widest">Scroll</span>
        <div className="w-5 h-8 border-2 border-[#1a1a1a]/20 rounded-full flex justify-center pt-1.5">
          <div className="w-1 h-2 bg-[#E54A4A] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}
