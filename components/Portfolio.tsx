"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal, Magnetic } from "./Motion";

const categories = ["All", "Top Down", "Product", "Diagonal", "Lifestyle"];

const images = [
  // Top Down - Clean flat lay shots
  { src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=90", category: "Top Down", alt: "Skincare products flat lay" },
  { src: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=90", category: "Top Down", alt: "Cosmetics flat lay" },
  { src: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=90", category: "Top Down", alt: "Beauty products arrangement" },
  // Product - Studio white background
  { src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=90", category: "Product", alt: "Watch on white background" },
  { src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=90", category: "Product", alt: "Headphones studio shot" },
  { src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=90", category: "Product", alt: "Nike sneaker product" },
  // Diagonal - Dynamic angles
  { src: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=90", category: "Diagonal", alt: "Sunglasses angled shot" },
  { src: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600&q=90", category: "Diagonal", alt: "Sneaker diagonal angle" },
  { src: "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=600&q=90", category: "Diagonal", alt: "Perfume bottle angle" },
  // Lifestyle - In-context shots
  { src: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=90", category: "Lifestyle", alt: "Coffee with products" },
  { src: "https://images.unsplash.com/photo-1491553895911-0055uj6352d5?w=600&q=90", category: "Lifestyle", alt: "Skincare lifestyle" },
  { src: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=90", category: "Lifestyle", alt: "Retail lifestyle shot" },
];

// 3D Image Card
function ImageCard3D({ image, index }: { image: typeof images[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-square cursor-pointer perspective-1000"
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className="relative w-full h-full rounded-2xl overflow-hidden"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
      >
        <motion.img
          src={image.src}
          alt={image.alt}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.15 : 1 }}
          transition={{ duration: 0.6 }}
        />
        
        {/* Gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-[#E54A4A] via-[#E54A4A]/50 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.85 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 45%, transparent 50%)`,
          }}
          animate={{
            x: isHovered ? ["0%", "200%"] : "0%",
          }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Category label */}
        <motion.div 
          className="absolute bottom-4 left-4 right-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            y: isHovered ? 0 : 20,
          }}
          transition={{ duration: 0.3 }}
          style={{ transform: "translateZ(30px)" }}
        >
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-medium border border-white/20">
            {image.category}
          </span>
        </motion.div>
        
        {/* View icon */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHovered ? 1 : 0, 
            scale: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3, type: "spring" }}
          style={{ transform: "translateZ(50px)" }}
        >
          <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredImages = activeCategory === "All" 
    ? images 
    : images.filter(img => img.category === activeCategory);

  return (
    <section className="py-24 md:py-32 bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-10"
        style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, #E54A4A 1px, transparent 0)`,
        backgroundSize: '40px 40px'
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E54A4A]/20 rounded-full blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff9966]/20 rounded-full blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      
      <div className="container relative z-10">
        {/* Header */}
        <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.span 
              className="inline-block px-4 py-2 bg-[#E54A4A]/20 text-[#E54A4A] text-sm font-semibold rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
            Our Work
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Portfolio{" "}
              <span className="relative inline-block">
                <span className="gradient-text">showcase</span>
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-[#E54A4A]/20 to-[#ff9966]/20 blur-lg rounded-lg"
                  animate={{
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
          </span>
          </h2>
          <p className="text-white/50 text-lg">
            Browse our recent work and see the quality you can expect
          </p>
        </div>
        </Reveal>

        {/* Filter Tabs */}
        <Reveal delay={0.2}>
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
              <Magnetic key={category} strength={0.1}>
                <motion.button
              onClick={() => setActiveCategory(category)}
                  className={`relative px-5 py-2.5 rounded-full text-sm font-medium transition-all overflow-hidden ${
                activeCategory === category
                      ? 'text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20 hover:text-white'
              }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeCategory === category && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f]"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{category}</span>
                </motion.button>
              </Magnetic>
          ))}
        </div>
        </Reveal>

        {/* Gallery Grid */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          layout
        >
          <AnimatePresence mode="popLayout">
          {filteredImages.map((image, index) => (
              <ImageCard3D key={image.src} image={image} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* CTA */}
        <Reveal delay={0.3}>
        <div className="text-center mt-12">
            <Magnetic strength={0.15}>
              <motion.a
            href="/order"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Animated shine */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative">Get Photos Like These</span>
                <motion.svg 
                  className="w-5 h-5 relative" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </motion.a>
            </Magnetic>
        </div>
        </Reveal>
      </div>
    </section>
  );
}
