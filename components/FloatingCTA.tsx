"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Sparkles } from "lucide-react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [showPulse, setShowPulse] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Show pulse animation every 10 seconds to draw attention
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setShowPulse(true);
      setTimeout(() => setShowPulse(false), 1000);
    }, 10000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-100 group"
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-5 h-5 text-[#1a1a1a]/60 group-hover:text-[#E54A4A] transition-colors" />
      </button>
      
      {/* Start Project CTA */}
      <a
        href="/order"
        className={`relative px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 ${
          showPulse ? 'animate-pulse' : ''
        }`}
      >
        {/* Glow effect */}
        <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] blur-lg opacity-50 -z-10" />
        
        <Sparkles className="w-4 h-4" />
        <span className="hidden sm:inline">Start Project</span>
        <span className="sm:hidden">Order</span>
      </a>
    </div>
  );
}
