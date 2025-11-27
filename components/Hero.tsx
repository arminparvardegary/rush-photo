"use client";

import { useEffect, useState } from "react";

const words = ["sell", "convert", "shine", "win"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6]">
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Floating blobs */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-[#E54A4A]/20 to-[#ff9966]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gradient-to-br from-[#ff7f7f]/15 to-[#E54A4A]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#E54A4A 1px, transparent 1px), linear-gradient(90deg, #E54A4A 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="container relative z-10 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-160px)]">
          {/* Left Content */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E54A4A]/20 rounded-full mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E54A4A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E54A4A]"></span>
              </span>
              <span className="text-sm font-medium text-[#1a1a1a]/70">Professional Product Photography</span>
            </div>

            {/* Headline with animated word */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              <span className="text-[#1a1a1a]">Photos that</span>
              <br />
              <span className="gradient-text inline-block min-w-[200px]">
                {words[wordIndex]} products.
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[#1a1a1a]/60 max-w-md mb-10 leading-relaxed">
              Four stunning photography styles. Ship your product, receive magazine-quality photos in days. 
              <span className="text-[#E54A4A] font-semibold"> It&apos;s that simple.</span>
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="/order"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#E54A4A]/30 transition-all duration-300 hover:-translate-y-1"
              >
                Start Your Project
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a
                href="#work"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[#1a1a1a] font-semibold rounded-full border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A]/30 hover:bg-[#E54A4A]/5 transition-all duration-300"
              >
                View Styles
              </a>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 md:gap-12">
              {[
                { value: '500+', label: 'Happy Brands' },
                { value: '4', label: 'Photo Styles' },
                { value: '3 Days', label: 'Turnaround' },
              ].map((stat, i) => (
                <div key={i} className="text-center group cursor-default">
                  <div className="text-3xl md:text-4xl font-bold text-[#E54A4A] group-hover:scale-110 transition-transform">
                    {stat.value}
                  </div>
                  <div className="text-sm text-[#1a1a1a]/50 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10 transform hover:scale-[1.02] hover:rotate-1 transition-all duration-500 group">
                  <img 
                    src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" 
                    alt="Product photography"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 group">
                  <img 
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80" 
                    alt="Product photography"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-3xl overflow-hidden shadow-xl transform hover:scale-[1.02] hover:rotate-1 transition-all duration-500 group">
                  <img 
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" 
                    alt="Product photography"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10 transform hover:scale-[1.02] hover:-rotate-1 transition-all duration-500 group">
                  <img 
                    src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80" 
                    alt="Product photography"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
            
            {/* Floating badges */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-white rounded-full shadow-lg border border-[#E54A4A]/10">
              <span className="text-sm font-semibold text-[#1a1a1a]">100% Satisfaction Guaranteed</span>
            </div>
            
            <div className="absolute -top-2 -right-2 px-4 py-2 bg-[#E54A4A] rounded-full shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
              <span className="text-sm font-bold text-white">-30% OFF</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[#1a1a1a]/40 text-sm">Scroll</span>
        <div className="w-6 h-10 border-2 border-[#1a1a1a]/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#E54A4A] rounded-full animate-pulse" />
        </div>
      </div>
    </section>
  );
}
