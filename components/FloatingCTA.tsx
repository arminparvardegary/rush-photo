"use client";

import { useState, useEffect } from "react";

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {/* Scroll to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform border border-gray-100"
      >
        <span className="text-lg">↑</span>
      </button>
      
      {/* Start Project CTA */}
      <a
        href="/order"
        className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
      >
        <span className="hidden sm:inline">Start Project</span>
        <span className="sm:hidden">→</span>
      </a>
    </div>
  );
}
