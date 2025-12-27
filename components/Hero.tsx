"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Play, Star, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=1000&fit=crop&q=90", // Watch
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=1000&fit=crop&q=90", // Headphones
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=1000&fit=crop&q=90", // Sneaker
];

const LOGOS = [
  "Sony", "Samsung", "Adidas", "Nike", "Dyson", "Apple", "Canon", "Bose"
];

const FloatingCard = ({ src, index, mouseX, mouseY }: { src: string; index: number; mouseX: any; mouseY: any }) => {
  const depth = index === 0 ? 30 : index === 1 ? 60 : 90;
  const x = useTransform(mouseX, [-1, 1], [-depth, depth]);
  const y = useTransform(mouseY, [-1, 1], [-depth, depth]);
  
  return (
    <motion.div
      style={{ x, y, zIndex: 3 - index }}
      className={`absolute w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 ${
        index === 0 ? 'right-10 top-20' : 
        index === 1 ? 'right-48 top-10 grayscale-[50%]' : 
        'right-20 top-48 grayscale-[80%]'
      }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
    >
      <img src={src} alt="Product" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
    </motion.div>
  );
};

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  
  // Mouse parallax
  const x = useMotionValue(0);
  const my = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 100, damping: 30 });
  const mouseY = useSpring(my, { stiffness: 100, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    x.set((clientX / innerWidth) * 2 - 1);
    my.set((clientY / innerHeight) * 2 - 1);
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[110vh] flex items-center overflow-hidden bg-ink pt-20"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-dark opacity-90 z-0" />
        <div className="absolute inset-0 bg-grain opacity-20 z-0" />
        
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-honey/10 rounded-full blur-[120px] animate-float-slow mix-blend-screen" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal/10 rounded-full blur-[100px] animate-float-slow animation-delay-2000 mix-blend-screen" />
      </div>

      <motion.div 
        style={{ y, opacity }}
        className="container relative z-10 grid lg:grid-cols-2 gap-12 items-center"
      >
        {/* Left: Content */}
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8"
          >
            <span className="px-3 py-1 rounded-full border border-honey/20 bg-honey/5 text-honey text-xs font-medium tracking-wide uppercase">
              Premium Product Photography
            </span>
            <div className="h-px w-12 bg-honey/20" />
          </motion.div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-white mb-8">
            Products that <br />
            <span className="font-serif italic text-transparent bg-clip-text bg-gradient-warm animate-title">
              demand
            </span> attention.
          </h1>

          <p className="text-lg sm:text-xl text-mist max-w-lg leading-relaxed mb-10">
            We transform simple products into cinematic experiences. 
            Magazine-quality photography delivered in days, not weeks.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              href="/order"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-honey via-honey-light to-honey opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Start Project <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            
            <button className="px-8 py-4 rounded-full border border-white/10 text-white font-medium hover:bg-white/5 transition-colors flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                <Play className="w-3 h-3 fill-current" />
              </div>
              View Showreel
            </button>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 border-t border-white/5">
            <p className="text-sm text-smoke mb-4">Trusted by world-class brands</p>
            <div className="flex gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
               {/* Simplified logos using text for demo */}
               {LOGOS.slice(0, 5).map((logo, i) => (
                 <span key={i} className="text-lg font-bold font-serif">{logo}</span>
               ))}
            </div>
          </div>
        </div>

        {/* Right: Interactive 3D Showcase */}
        <div className="relative h-[600px] w-full hidden lg:block perspective-1000">
             {HERO_IMAGES.map((src, i) => (
               <FloatingCard key={i} src={src} index={i} mouseX={mouseX} mouseY={mouseY} />
             ))}
             
             {/* Floating Badge */}
             <motion.div
               style={{ 
                 x: useTransform(mouseX, [-1, 1], [-20, 20]),
                 y: useTransform(mouseY, [-1, 1], [-20, 20])
               }}
               className="absolute bottom-20 left-10 p-4 rounded-2xl glass-card z-20 flex items-center gap-4"
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 1 }}
             >
               <div className="bg-green-500/20 p-3 rounded-xl">
                 <TrendingUp className="w-5 h-5 text-green-400" />
               </div>
               <div>
                  <p className="text-xs text-mist">Conversion Uplift</p>
                  <p className="text-xl font-bold text-white">+94%</p>
               </div>
             </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
