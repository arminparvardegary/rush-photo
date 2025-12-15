"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const toggleVisibility = () => {
      const scrolled = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / height) * 100;
      
      setScrollProgress(progress);
      setIsVisible(scrolled > 400);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 group"
          aria-label="Scroll to top"
        >
          {/* Progress ring */}
          <svg className="w-14 h-14 -rotate-90 absolute inset-0">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-white/10"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="3"
              fill="none"
              className="text-honey"
              strokeDasharray={150.8}
              strokeDashoffset={150.8 - (scrollProgress / 100) * 150.8}
              strokeLinecap="round"
            />
          </svg>
          
          {/* Button */}
          <div className="w-14 h-14 bg-[#1a1a1a] border border-white/20 rounded-full flex items-center justify-center shadow-lg shadow-black/20 group-hover:bg-honey group-hover:border-honey transition-all duration-300">
            <ArrowUp className="w-5 h-5 text-white group-hover:text-black transition-colors" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

