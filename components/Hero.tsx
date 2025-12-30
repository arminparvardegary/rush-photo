"use client";

import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ArrowRight, Play, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

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
      className={`absolute w-48 sm:w-64 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white ${index === 0 ? 'right-10 top-20' :
          index === 1 ? 'right-48 top-10 grayscale-[20%]' :
            'right-20 top-48 grayscale-[40%]'
        }`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.2, duration: 1 }}
    >
      <img src={src} alt="Product" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
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
      className="relative min-h-[110vh] flex items-center overflow-hidden bg-rush-light pt-20"
    >
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Animated Orbs */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E63946]/5 rounded-full blur-[120px] animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFB4C2]/10 rounded-full blur-[100px] animate-float-slow animation-delay-2000" />
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
            <span className="px-3 py-1 rounded-full border border-[#E63946]/20 bg-[#E63946]/5 text-[#E63946] text-xs font-bold tracking-wide uppercase">
              Premium Product Photography
            </span>
            <div className="h-px w-12 bg-[#E63946]/20" />
          </motion.div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-rush-dark mb-8">
            Products that <br />
            <span className="text-[#E63946]">
              demand
            </span> attention.
          </h1>

          <p className="text-lg sm:text-xl text-rush-gray max-w-lg leading-relaxed mb-10 font-medium">
            We transform simple products into cinematic experiences.
            Magazine-quality photography delivered in days, not weeks.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              href="/order"
              className="group relative px-8 py-4 bg-[#E63946] text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#E63946]/30"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Start Project <ArrowRight className="w-4 h-4" />
              </span>
            </Link>

            <button className="px-8 py-4 rounded-2xl border border-rush-border text-rush-dark font-semibold hover:bg-white transition-all flex items-center gap-3 group shadow-sm hover:shadow-md">
              <div className="w-8 h-8 rounded-full bg-[#E63946]/10 flex items-center justify-center group-hover:bg-[#E63946]/20 transition-colors">
                <Play className="w-3 h-3 fill-[#E63946] text-[#E63946]" />
              </div>
              View Showreel
            </button>
          </div>

          {/* Social Proof Bar */}
          <div className="pt-8 border-t border-rush-border">
            <p className="text-sm text-rush-gray mb-4 font-medium">Trusted by world-class brands</p>
            <div className="flex gap-8 opacity-40 hover:opacity-100 transition-all duration-500 overflow-x-auto pb-2">
              {/* Simplified logos using text for demo */}
              {LOGOS.slice(0, 5).map((logo, i) => (
                <span key={i} className="text-xl font-bold font-sans text-rush-dark whitespace-nowrap">{logo}</span>
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
            className="absolute bottom-20 left-10 p-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-rush-border z-20 flex items-center gap-4 shadow-xl shadow-black/5"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="bg-[#34C759]/10 p-3 rounded-xl">
              <TrendingUp className="w-5 h-5 text-[#34C759]" />
            </div>
            <div>
              <p className="text-xs text-rush-gray font-medium">Conversion Uplift</p>
              <p className="text-xl font-bold text-rush-dark">+94%</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
