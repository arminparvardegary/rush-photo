"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowRight,
  Camera,
  Sparkles,
  Package,
  Star,
  Check,
  Zap
} from "lucide-react";

// Default Pricing
const DEFAULT_PRICES = {
  ecommerce: { perAngle: 25 },
  lifestyle: { flatRate: 149 },
  fullPackageDiscount: 10,
};

// Package images - Professional product photography examples
const PACKAGE_IMAGES = {
  ecommerce: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=500&fit=crop&q=90",
  lifestyle: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=500&fit=crop&q=90",
  fullpackage: "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=500&fit=crop&q=90",
};

export default function PackageSelection() {
  const [hoveredPackage, setHoveredPackage] = useState<string | null>(null);
  const [prices, setPrices] = useState(DEFAULT_PRICES);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/pricing");
        if (!res.ok) return;
        const data = await res.json();
        const pricing = data?.pricing;
        if (!pricing) return;
        setPrices({
          ecommerce: { perAngle: pricing.ecommerce?.perAngle || 25 },
          lifestyle: { flatRate: pricing.lifestyle?.flatRate || 149 },
          fullPackageDiscount: pricing.fullPackageDiscount || 10,
        });
      } catch (e) {
        console.error("Error loading pricing:", e);
      }
    };
    load();
  }, []);

  const packages = [
    {
      id: "ecommerce",
      name: "E-commerce",
      icon: Camera,
      color: "#E54A4A",
      description: "Clean product shots on white background",
      price: `From $${prices.ecommerce.perAngle}/angle`,
      image: PACKAGE_IMAGES.ecommerce,
      features: ["White background", "Multiple angles", "High resolution", "Fast delivery"],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: Sparkles,
      color: "#8B5CF6",
      description: "Styled scenes with props and creative direction",
      price: `$${prices.lifestyle.flatRate} flat rate`,
      image: PACKAGE_IMAGES.lifestyle,
      features: ["Creative styling", "Props included", "Brand storytelling", "Social ready"],
    },
    {
      id: "fullpackage",
      name: "Full Package",
      icon: Package,
      color: "#F59E0B",
      description: `E-commerce + Lifestyle with ${prices.fullPackageDiscount}% discount`,
      price: "Best Value",
      image: PACKAGE_IMAGES.fullpackage,
      features: ["All styles included", `${prices.fullPackageDiscount}% savings`, "Priority support", "Unlimited revisions"],
      badge: `SAVE ${prices.fullPackageDiscount}%`,
    },
  ];

  return (
    <section id="pricing" className="py-24 lg:py-32 bg-gradient-to-b from-white to-[#FAFAFA]">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E54A4A]/10 rounded-full mb-6">
            <Zap className="w-4 h-4 text-[#E54A4A]" />
            <span className="text-sm font-semibold text-[#E54A4A]">Start Your Project</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1a1a1a] mb-6">
            Choose Your Package
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Professional product photography that converts. Pick the style that fits your brand.
          </p>
        </motion.div>

        {/* Package Cards - Bigger */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/order?package=${pkg.id}`}
                onMouseEnter={() => setHoveredPackage(pkg.id)}
                onMouseLeave={() => setHoveredPackage(null)}
                className={`group relative block overflow-hidden rounded-3xl bg-white border-2 transition-all duration-500 ${
                  hoveredPackage === pkg.id 
                    ? "border-current shadow-2xl scale-[1.02]" 
                    : hoveredPackage 
                      ? "opacity-50 scale-[0.98]" 
                      : "border-neutral-200 hover:border-neutral-300 shadow-lg"
                }`}
                style={{ borderColor: hoveredPackage === pkg.id ? pkg.color : undefined }}
              >
                {/* Badge */}
                {pkg.badge && (
                  <div 
                    className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-lg"
                    style={{ backgroundColor: pkg.color }}
                  >
                    <Star className="w-3.5 h-3.5" />
                    {pkg.badge}
                  </div>
                )}

                {/* Image */}
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  
                  {/* Overlay Icon */}
                  <div className="absolute bottom-4 left-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md"
                      style={{ backgroundColor: `${pkg.color}20` }}
                    >
                      <pkg.icon className="w-6 h-6" style={{ color: pkg.color }} />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 lg:p-8">
                  <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{pkg.name}</h3>
                  <p className="text-neutral-600 mb-6">{pkg.description}</p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {pkg.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div 
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${pkg.color}15` }}
                        >
                          <Check className="w-3 h-3" style={{ color: pkg.color }} />
                        </div>
                        <span className="text-sm text-neutral-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA */}
                  <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                    <span className="text-xl font-bold" style={{ color: pkg.color }}>
                      {pkg.price}
                    </span>
                    <div 
                      className="flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all group-hover:gap-3"
                      style={{ 
                        backgroundColor: hoveredPackage === pkg.id ? pkg.color : `${pkg.color}10`,
                        color: hoveredPackage === pkg.id ? 'white' : pkg.color
                      }}
                    >
                      Get Started
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Trust Badges */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-neutral-500"
        >
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            <span className="text-sm">100% Satisfaction Guarantee</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-500" />
            <span className="text-sm">3-5 Day Delivery</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-[#E54A4A]" />
            <span className="text-sm">500+ Happy Brands</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
