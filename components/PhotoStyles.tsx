"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Reveal, Magnetic } from "./Motion";

const styles = [
  {
    id: 1,
    name: "Top Down",
    tagline: "Perfect flat-lays",
    description: "Bird's-eye view shots perfect for flat-lay compositions and showcasing product design from above.",
    image: "/images/portfolio/serum-bottle.jpg",
    color: "#E54A4A",
    icon: "↓",
  },
  {
    id: 2,
    name: "Product",
    tagline: "Clean & crisp",
    description: "Clean, professional studio shots with perfect lighting that highlight every detail.",
    image: "/images/portfolio/speakers.jpg",
    color: "#ff7f7f",
    icon: "◆",
  },
  {
    id: 3,
    name: "Diagonal",
    tagline: "Dynamic angles",
    description: "Dynamic angled perspectives that add depth and visual interest to your products.",
    image: "/images/portfolio/sneaker.jpg",
    color: "#ff9966",
    icon: "◇",
  },
  {
    id: 4,
    name: "Lifestyle",
    tagline: "In context",
    description: "In-context shots showing your product in real-world scenarios that connect with customers.",
    image: "/images/portfolio/flowers-table.jpg",
    color: "#E54A4A",
    icon: "✦",
  },
];

// 3D Card Component
function Card3D({ style, index, isActive, onClick }: { 
  style: typeof styles[0]; 
  index: number; 
  isActive: boolean;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);
  const brightness = useTransform(mouseXSpring, [-0.5, 0, 0.5], [0.9, 1, 1.1]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      className="group cursor-pointer perspective-1000"
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${
          isActive 
            ? 'ring-4 ring-[#E54A4A] shadow-2xl shadow-[#E54A4A]/30' 
            : 'hover:shadow-xl'
        }`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ scale: 1.02 }}
      >
        {/* Image */}
        <div className="aspect-[4/5] relative overflow-hidden">
          <motion.img
            src={style.image}
            alt={style.name}
            className="w-full h-full object-cover"
            style={{ filter: `brightness(${brightness})` }}
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.7 }}
          />
          
          {/* Gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
            initial={{ opacity: 0.6 }}
            whileHover={{ opacity: 0.8 }}
          />
          
          {/* Shine effect */}
          <motion.div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 60%)`,
              transform: "translateX(-100%)",
            }}
            animate={{
              transform: ["translateX(-100%)", "translateX(100%)"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatDelay: 3,
            }}
          />
          
          {/* Content */}
          <div 
            className="absolute bottom-0 left-0 right-0 p-6"
            style={{ transform: "translateZ(40px)" }}
          >
            <motion.span 
              className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-2 backdrop-blur-sm"
              style={{ backgroundColor: `${style.color}CC` }}
              whileHover={{ scale: 1.05 }}
            >
              {style.tagline}
            </motion.span>
            <h3 className="text-2xl font-bold text-white mb-2">{style.name}</h3>
            <motion.p 
              className="text-white/80 text-sm line-clamp-2"
              initial={{ opacity: 0.8 }}
              whileHover={{ opacity: 1 }}
            >
              {style.description}
            </motion.p>
          </div>
          
          {/* Number badge */}
          <motion.div 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
            style={{ transform: "translateZ(60px)" }}
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <span className="text-white font-bold">0{style.id}</span>
          </motion.div>
          
          {/* Icon decoration */}
          <motion.div
            className="absolute top-4 left-4 text-4xl text-white/10"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            {style.icon}
          </motion.div>
        </div>
        
        {/* Glow effect on hover */}
        <motion.div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            boxShadow: isActive 
              ? `0 0 60px ${style.color}40, inset 0 0 60px ${style.color}10` 
              : "none",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

export default function PhotoStyles() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="py-24 md:py-32 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#fff5eb] to-transparent" />
      
      {/* Animated background circles */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 rounded-full bg-[#E54A4A]/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-[#ff9966]/5 blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          y: [0, -50, 0],
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      
      <div className="container relative z-10">
        {/* Header */}
        <Reveal>
        <div className="text-center max-w-2xl mx-auto mb-16">
            <motion.span 
              className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
            Our Styles
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Four ways to{" "}
              <span className="relative">
                <span className="gradient-text">shine</span>
                <motion.svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 100 10"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  <motion.path
                    d="M0,5 Q25,0 50,5 T100,5"
                    fill="none"
                    stroke="#E54A4A"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </motion.svg>
          </span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg">
            Each style crafted to perfection. Choose your favorite or get all four!
          </p>
        </div>
        </Reveal>

        {/* Styles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {styles.map((style, index) => (
            <Card3D
              key={style.id}
              style={style}
              index={index}
              isActive={activeIndex === index}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>

        {/* Active style details */}
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex items-center gap-4 px-6 py-3 bg-[#1a1a1a]/5 rounded-full">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: styles[activeIndex].color }}
            />
            <span className="font-semibold text-[#1a1a1a]">
              {styles[activeIndex].name}
            </span>
            <span className="text-[#1a1a1a]/50">
              {styles[activeIndex].description}
            </span>
          </div>
        </motion.div>

        {/* CTA */}
        <Reveal delay={0.3}>
        <div className="text-center mt-12">
            <Magnetic strength={0.15}>
              <motion.a
            href="/order"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-full relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f]"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative">Get All 4 Styles</span>
                <motion.svg 
                  className="w-5 h-5 relative" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  whileHover={{ x: 5 }}
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
