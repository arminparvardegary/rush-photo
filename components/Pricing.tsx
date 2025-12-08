"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, X, Star, Zap, Sparkles } from "lucide-react";
import { Reveal, Magnetic, Counter } from "./Motion";

const packages = [
  {
    id: 1,
    name: "Single",
    subtitle: "1 Style",
    price: 89,
    description: "Perfect for testing our service",
    features: {
      styles: 1,
      resolution: "4K",
      revisions: 2,
      turnaround: "5 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
    color: "#E54A4A",
  },
  {
    id: 2,
    name: "Double",
    subtitle: "2 Styles",
    price: 159,
    description: "Great for variety",
    features: {
      styles: 2,
      resolution: "4K",
      revisions: 2,
      turnaround: "4 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
    color: "#ff7f7f",
  },
  {
    id: 3,
    name: "Triple",
    subtitle: "3 Styles",
    price: 219,
    description: "Best value combo",
    features: {
      styles: 3,
      resolution: "4K+",
      revisions: 5,
      turnaround: "3 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: true,
    },
    popular: false,
    color: "#ff9966",
  },
  {
    id: 4,
    name: "Lifestyle",
    subtitle: "In Context",
    price: 149,
    description: "Real-world product shots",
    features: {
      styles: 1,
      resolution: "4K",
      revisions: 3,
      turnaround: "4 days",
      rawFiles: false,
      socialOptimized: true,
      prioritySupport: false,
    },
    popular: false,
    lifestyle: true,
    color: "#E54A4A",
  },
  {
    id: 5,
    name: "Complete",
    subtitle: "All 4 Styles",
    price: 280,
    originalPrice: 400,
    description: "Everything you need",
    features: {
      styles: 4,
      resolution: "4K+",
      revisions: "Unlimited",
      turnaround: "3 days",
      rawFiles: true,
      socialOptimized: true,
      prioritySupport: true,
    },
    popular: true,
    featured: true,
    color: "#E54A4A",
  },
];

const comparisonFeatures = [
  { key: "styles", label: "Photo Styles" },
  { key: "resolution", label: "Resolution" },
  { key: "revisions", label: "Revisions" },
  { key: "turnaround", label: "Turnaround" },
  { key: "socialOptimized", label: "Social Optimized" },
  { key: "rawFiles", label: "RAW Files" },
  { key: "prioritySupport", label: "Priority Support" },
];

// 3D Pricing Card
function PricingCard3D({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

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
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1000 ${pkg.featured ? 'z-10 md:scale-105' : ''}`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <motion.div
        className={`relative rounded-3xl p-6 h-full ${
          pkg.featured
            ? 'bg-gradient-to-br from-[#1a1a1a] to-[#2a2a2a] text-white shadow-2xl'
            : 'bg-white border border-gray-100 shadow-lg'
        }`}
        style={{
          rotateX: pkg.featured ? rotateX : 0,
          rotateY: pkg.featured ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        whileHover={{ 
          y: -10,
          boxShadow: pkg.featured 
            ? "0 30px 60px -10px rgba(229, 74, 74, 0.4)" 
            : "0 30px 60px -10px rgba(0, 0, 0, 0.15)"
        }}
        transition={{ duration: 0.3 }}
      >
        {/* Animated border for featured */}
        {pkg.featured && (
          <motion.div
            className="absolute -inset-[2px] rounded-3xl bg-gradient-to-r from-[#E54A4A] via-[#ff7f7f] to-[#ff9966] -z-10"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ backgroundSize: "200% 200%" }}
          />
        )}
        
        {/* Popular/Featured badge */}
        {(pkg.popular || pkg.featured) && (
          <motion.div 
            className="absolute -top-3 left-1/2 -translate-x-1/2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <motion.div 
              className="px-4 py-1 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] rounded-full flex items-center gap-1 shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(229, 74, 74, 0.3)",
                  "0 0 40px rgba(229, 74, 74, 0.5)",
                  "0 0 20px rgba(229, 74, 74, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {pkg.featured ? (
                <Zap className="w-3 h-3 text-white fill-white" />
              ) : (
                <Star className="w-3 h-3 text-white fill-white" />
              )}
              <span className="text-white text-xs font-semibold">
                {pkg.featured ? 'Best Value' : 'Popular'}
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* Package info */}
        <div className="text-center mb-5 pt-2">
          <motion.h3 
            className={`text-xl font-bold mb-1 ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}
            whileHover={{ scale: 1.05 }}
          >
            {pkg.name}
          </motion.h3>
          <span className={`text-sm ${pkg.featured ? 'text-white/60' : 'text-[#1a1a1a]/50'}`}>
            {pkg.subtitle}
          </span>
        </div>

        {/* Price */}
        <div className="text-center mb-5">
          <div className="flex items-baseline justify-center gap-1">
            <span className={`text-4xl font-bold ${pkg.featured ? 'text-white' : 'text-[#1a1a1a]'}`}>
              $<Counter to={pkg.price} duration={1.5} />
            </span>
          </div>
          {pkg.originalPrice && (
            <motion.div 
              className="flex items-center justify-center gap-2 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className={`text-sm line-through ${pkg.featured ? 'text-white/40' : 'text-[#1a1a1a]/40'}`}>
                ${pkg.originalPrice}
              </span>
              <motion.span 
                className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                Save ${pkg.originalPrice - pkg.price}
              </motion.span>
            </motion.div>
          )}
          <p className={`text-xs mt-2 ${pkg.featured ? 'text-white/50' : 'text-[#1a1a1a]/50'}`}>
            {pkg.description}
          </p>
        </div>

        {/* Quick Features */}
        <div className="space-y-2 mb-5">
          {[
            { text: `${pkg.features.styles} photo style${pkg.features.styles > 1 ? 's' : ''}`, show: true },
            { text: `${pkg.features.turnaround} turnaround`, show: true },
            { text: `${pkg.features.revisions} revision${typeof pkg.features.revisions === 'number' && pkg.features.revisions > 1 ? 's' : ''}`, show: true },
            { text: 'RAW files included', show: pkg.features.rawFiles },
          ].filter(f => f.show).map((feature, i) => (
            <motion.div 
              key={i}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
            >
              <motion.div 
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  pkg.featured 
                    ? 'bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f]' 
                    : 'bg-[#E54A4A]/10'
                }`}
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.3 }}
              >
                <Check className={`w-3 h-3 ${pkg.featured ? 'text-white' : 'text-[#E54A4A]'}`} />
              </motion.div>
              <span className={`text-sm ${pkg.featured ? 'text-white/80' : 'text-[#1a1a1a]/70'}`}>
                {feature.text}
              </span>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <Magnetic strength={0.1}>
          <motion.a
            href="/order"
            className={`block w-full py-3 rounded-full text-center font-semibold relative overflow-hidden group ${
              pkg.featured
                ? 'bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white'
                : 'bg-[#1a1a1a] text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shine effect */}
            <motion.span
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Hover background */}
            {!pkg.featured && (
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f]"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
            
            <span className="relative flex items-center justify-center gap-2">
              Get Started
              {pkg.featured && <Sparkles className="w-4 h-4" />}
            </span>
          </motion.a>
        </Magnetic>
        
        {/* Floating particles for featured */}
        {pkg.featured && (
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-[#E54A4A]/30 rounded-full"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${10 + i * 20}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Pricing() {
  const [showComparison, setShowComparison] = useState(false);

  return (
    <section 
      id="pricing" 
      className="py-24 md:py-32 bg-white relative overflow-hidden"
    >
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-[#E54A4A]/5 via-transparent to-[#ff9966]/5"
        animate={{
          backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />
      
      {/* Floating decorations */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 border-2 border-[#E54A4A]/10 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 border-2 border-[#ff9966]/10 rounded-full"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />
      
      <div className="container relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.span 
              className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4"
              whileHover={{ scale: 1.05 }}
            >
              Pricing
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Choose your{" "}
              <span className="relative inline-block">
                <span className="gradient-text">package</span>
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-[#E54A4A] to-[#ff9966] rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </span>
            </h2>
            <p className="text-[#1a1a1a]/60 text-lg mb-6">
              Flexible options for every need. No hidden fees.
            </p>
            
            {/* Toggle comparison */}
            <motion.button
              onClick={() => setShowComparison(!showComparison)}
              className="text-[#E54A4A] font-medium hover:underline inline-flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span
                animate={{ rotate: showComparison ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                ↓
              </motion.span>
              {showComparison ? 'Hide comparison' : 'Compare all packages'}
            </motion.button>
          </div>
        </Reveal>

        {/* Comparison Table */}
        <motion.div
          initial={false}
          animate={{ 
            height: showComparison ? "auto" : 0,
            opacity: showComparison ? 1 : 0,
            marginBottom: showComparison ? 64 : 0,
          }}
          transition={{ duration: 0.4 }}
          className="overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] bg-white rounded-2xl shadow-xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-[#1a1a1a] to-[#2a2a2a]">
                  <th className="px-6 py-4 text-left text-white font-semibold">Feature</th>
                  {packages.map((pkg) => (
                    <th key={pkg.id} className="px-4 py-4 text-center">
                      <div className="text-white font-semibold">{pkg.name}</div>
                      <div className="text-white/60 text-sm">${pkg.price}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonFeatures.map((feature, index) => (
                  <motion.tr 
                    key={feature.key} 
                    className={index % 2 === 0 ? 'bg-[#FFFAF5]' : 'bg-white'}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td className="px-6 py-4 font-medium text-[#1a1a1a]">{feature.label}</td>
                    {packages.map((pkg) => {
                      const value = pkg.features[feature.key as keyof typeof pkg.features];
                      return (
                        <td key={pkg.id} className="px-4 py-4 text-center">
                          {typeof value === 'boolean' ? (
                            value ? (
                              <motion.div whileHover={{ scale: 1.3 }}>
                                <Check className="w-5 h-5 text-green-500 mx-auto" />
                              </motion.div>
                            ) : (
                              <X className="w-5 h-5 text-[#1a1a1a]/20 mx-auto" />
                            )
                          ) : (
                            <span className={`font-medium ${pkg.featured ? 'text-[#E54A4A]' : 'text-[#1a1a1a]'}`}>
                              {value}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {packages.map((pkg, index) => (
            <PricingCard3D key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>

        {/* Trust badge */}
        <Reveal delay={0.5}>
          <motion.div 
            className="text-center mt-12"
            whileHover={{ scale: 1.02 }}
          >
            <p className="text-[#1a1a1a]/40 text-sm inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              100% satisfaction guaranteed · Full refund if not happy · Secure payment
            </p>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
