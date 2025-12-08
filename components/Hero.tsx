"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Star, Sparkles } from "lucide-react";
import { TiltCard, Magnetic, Float, MorphingBlob, Counter, Reveal, TextReveal, Parallax } from "./Motion";

const words = ["sell", "convert", "shine", "dominate"];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-br from-[#FFFAF5] via-[#fff5eb] to-[#ffe8d6] min-h-screen">
      {/* Animated morphing blobs */}
      <MorphingBlob className="w-[600px] h-[600px] bg-gradient-to-br from-[#E54A4A]/20 to-[#ff9966]/10 top-10 right-[-10%]" />
      <MorphingBlob className="w-[400px] h-[400px] bg-gradient-to-br from-[#ff7f7f]/15 to-[#E54A4A]/10 bottom-20 left-[-5%]" />
      
      {/* Animated grid pattern */}
      <motion.div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: 'linear-gradient(#E54A4A 1px, transparent 1px), linear-gradient(90deg, #E54A4A 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          y: useTransform(scrollYProgress, [0, 1], [0, 50]),
        }} 
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <Float key={i} duration={4 + i % 3} distance={15 + i % 10} delay={i * 0.2}>
            <motion.div
              className="absolute w-2 h-2 rounded-full bg-[#E54A4A]/20"
              style={{
                left: `${10 + (i * 4.5) % 80}%`,
                top: `${10 + (i * 7) % 80}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
            />
          </Float>
        ))}
      </div>

      <motion.div style={{ y, opacity }} className="container relative z-10 pt-8 sm:pt-12 lg:pt-20 pb-16 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <Reveal delay={0.1}>
              <Magnetic strength={0.2}>
                <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#E54A4A]/20 rounded-full mb-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex -space-x-1.5 sm:-space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <motion.div 
                        key={i} 
                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] border-2 border-white flex items-center justify-center text-white text-[10px] sm:text-xs font-bold"
                        initial={{ scale: 0, x: -20 }}
                        animate={{ scale: 1, x: 0 }}
                        transition={{ delay: 0.3 + i * 0.1, type: "spring" }}
                      >
                        {i === 4 ? '+' : ''}
                      </motion.div>
                    ))}
                  </div>
                  <div className="h-4 sm:h-5 w-px bg-[#1a1a1a]/20" />
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-500 fill-yellow-500" />
                      </motion.div>
                    ))}
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]/70">500+ Brands</span>
                </div>
              </Magnetic>
            </Reveal>

            {/* Headline */}
            <Reveal delay={0.2}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-4 sm:mb-6 tracking-tight">
                <span className="text-[#1a1a1a]">Photos that</span>
                <br />
                <motion.span 
                  key={wordIndex}
                  className="bg-gradient-to-r from-[#E54A4A] via-[#ff7f7f] to-[#ff9966] bg-clip-text text-transparent inline-block"
                  initial={{ opacity: 0, y: 40, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  exit={{ opacity: 0, y: -40, rotateX: 90 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  {words[wordIndex]}
                </motion.span>
              </h1>
            </Reveal>

            {/* Description */}
            <Reveal delay={0.3}>
              <p className="text-base sm:text-lg md:text-xl text-[#1a1a1a]/60 max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 leading-relaxed">
                Four stunning photography styles. Ship your product, receive 
                <span className="text-[#E54A4A] font-semibold"> magazine-quality </span> 
                photos in days.
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-10">
                <Magnetic strength={0.15}>
                  <motion.a
                    href="/order"
                    className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-full overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-[#ff7f7f] to-[#ff9966]"
                      initial={{ x: "100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    <span className="relative flex items-center gap-2">
                      Start Your Project
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                  </motion.a>
                </Magnetic>
                
                <Magnetic strength={0.15}>
                  <motion.a
                    href="#work"
                    className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-[#1a1a1a] font-semibold rounded-full border-2 border-[#1a1a1a]/10 hover:border-[#E54A4A] hover:text-[#E54A4A] transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Play className="w-4 h-4" />
                    View Our Work
                  </motion.a>
                </Magnetic>
              </div>
            </Reveal>

            {/* Stats */}
            <Reveal delay={0.5}>
              <div className="flex flex-wrap gap-6 sm:gap-8 md:gap-12 justify-center lg:justify-start">
                {[
                  { value: 3, suffix: '-5', label: 'Day Turnaround' },
                  { value: 4, suffix: '', label: 'Photo Styles' },
                  { value: 100, suffix: '%', label: 'Satisfaction' },
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    className="text-center group cursor-default"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#E54A4A]">
                      <Counter to={stat.value} suffix={stat.suffix} duration={2 + i * 0.3} />
                    </div>
                    <div className="text-xs sm:text-sm text-[#1a1a1a]/50 mt-1">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right - 3D Image Grid */}
          <Parallax speed={0.2} direction="down">
            <div className="relative mt-8 lg:mt-0 perspective-1000">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:max-w-none">
                <div className="space-y-3 sm:space-y-4">
                  <TiltCard intensity={10} className="group">
                    <motion.div 
                      className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10"
                      initial={{ opacity: 0, y: 60, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.3, duration: 0.8 }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80" 
                        alt="Top down flat-lay photography"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#E54A4A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  </TiltCard>
                  
                  <TiltCard intensity={10} className="group">
                    <motion.div 
                      className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
                      initial={{ opacity: 0, y: 60, rotateY: -15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80" 
                        alt="Product studio photography"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                  </TiltCard>
                </div>
                
                <div className="space-y-3 sm:space-y-4 pt-6 sm:pt-8">
                  <TiltCard intensity={10} className="group">
                    <motion.div 
                      className="aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl"
                      initial={{ opacity: 0, y: 60, rotateY: 15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.4, duration: 0.8 }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80" 
                        alt="Diagonal product photography"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                  </TiltCard>
                  
                  <TiltCard intensity={10} className="group">
                    <motion.div 
                      className="aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-[#E54A4A]/10"
                      initial={{ opacity: 0, y: 60, rotateY: 15 }}
                      animate={{ opacity: 1, y: 0, rotateY: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80" 
                        alt="Lifestyle product photography"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </motion.div>
                  </TiltCard>
                </div>
              </div>
              
              {/* Floating badges with 3D effect */}
              <Float duration={4} distance={10}>
                <motion.div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white rounded-full shadow-xl border border-[#E54A4A]/10 whitespace-nowrap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    100% Satisfaction Guaranteed
                  </span>
                </motion.div>
              </Float>
              
              <Float duration={3} distance={8} delay={0.5}>
                <motion.div 
                  className="absolute -top-2 -right-2 sm:top-0 sm:right-0 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full shadow-lg"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2, type: "spring" }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                >
                  <span className="text-xs sm:text-sm font-bold text-white">-30% OFF</span>
                </motion.div>
              </Float>
              
              {/* 3D Ring decoration */}
              <motion.div
                className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full border border-[#E54A4A]/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </Parallax>
        </div>
      </motion.div>

      {/* Scroll indicator with animation */}
      <motion.div 
        className="pb-8 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.span 
          className="text-[#1a1a1a]/40 text-xs font-medium uppercase tracking-widest"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Scroll
        </motion.span>
        <motion.div 
          className="w-5 h-8 border-2 border-[#1a1a1a]/20 rounded-full flex justify-center pt-1.5"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
        >
          <motion.div 
            className="w-1 h-2 bg-[#E54A4A] rounded-full"
            animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
