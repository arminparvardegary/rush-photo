"use client";

import { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, X, Star, Zap, Sparkles, Gem } from "lucide-react";
import Link from "next/link";

interface PackageFeatures {
  [key: string]: string | number;
}

interface Package {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: PackageFeatures;
  popular: boolean;
  gradient: string;
  isPro?: boolean;
}

const packages: Package[] = [
  {
    id: 1,
    name: "Starter",
    subtitle: "Essential",
    price: 89,
    description: "Perfect for testing our service with a single product style.",
    features: {
      styles: 1,
      resolution: "4K",
      revisions: 2,
      turnaround: "5 days",
    },
    popular: false,
    gradient: "from-white/10 to-white/5",
  },
  {
    id: 2,
    name: "Growth",
    subtitle: "Most Popular",
    price: 159,
    description: "Ideal for social media and product listings with variety.",
    features: {
      styles: 2,
      resolution: "4K",
      revisions: 2,
      turnaround: "4 days",
    },
    popular: true,
    gradient: "from-honey/20 to-honey/5",
  },
  {
    id: 3,
    name: "Pro",
    subtitle: "Full Suite",
    price: 280,
    originalPrice: 400,
    description: "The complete package for brands that demand perfection.",
    features: {
      styles: 4,
      resolution: "4K+",
      revisions: "Unlimited",
      turnaround: "3 days",
    },
    popular: false,
    gradient: "from-teal/20 to-teal/5",
    isPro: true,
  },
];

const PricingCard = ({ pkg, index }: { pkg: Package; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXStart = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYStart = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYStart, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXStart, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="perspective-1000 relative h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`relative h-full rounded-3xl border border-white/10 bg-charcoal p-8 overflow-hidden group ${pkg.popular ? "shadow-2xl shadow-honey/10 ring-1 ring-honey/30" : "hover:shadow-xl hover:shadow-white/5"
          }`}
      >
        {/* Ambient Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${pkg.gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />

        {/* Content */}
        <div className="relative z-10 transform-gpu translate-z-20 h-full flex flex-col">
          {pkg.popular && (
            <div className="absolute top-0 right-0">
              <span className="bg-honey text-ink text-xs font-bold px-3 py-1.5 rounded-bl-xl">POPULAR</span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-medium text-white mb-2">{pkg.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">${pkg.price}</span>
              <span className="text-mist text-sm">/ product</span>
            </div>
            {pkg.originalPrice && (
              <div className="mt-2 text-sm text-mist line-through opacity-60">
                ${pkg.originalPrice}
              </div>
            )}
          </div>

          <p className="text-mist text-sm mb-8 leading-relaxed">
            {pkg.description}
          </p>

          <div className="space-y-4 mb-8 flex-grow">
            {Object.entries(pkg.features).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pkg.popular ? "bg-honey text-ink" : "bg-white/10 text-white"}`}>
                  <Check className="w-3 h-3" />
                </div>
                <span className="text-sm text-cloud">
                  <strong className="text-white">{value}</strong> {key}
                </span>
              </div>
            ))}
            {pkg.isPro && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-teal text-ink flex items-center justify-center">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-sm text-cloud">
                  <strong className="text-white">RAW</strong> Files Included
                </span>
              </div>
            )}
          </div>

          <Link
            href="/order"
            className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all duration-300 transform translate-z-30 ${pkg.popular
                ? "bg-honey text-ink hover:bg-honey-light hover:shadow-lg hover:shadow-honey/20"
                : "bg-white/10 text-white hover:bg-white hover:text-ink"
              }`}
          >
            Choose {pkg.name}
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Pricing() {
  return (
    <section id="pricing" className="relative py-32 bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-grid-subtle opacity-20 pointer-events-none" />

      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tighter">
              Transparent <br />
              <span className="text-transparent bg-clip-text bg-gradient-warm font-serif italic">Pricing</span>
            </h2>
            <p className="text-lg text-mist">
              Simple packages for every stage of your brand.
              No hidden fees, no surprise charges.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, i) => (
            <PricingCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 p-4 rounded-full bg-charcoal border border-white/5">
            <span className="text-sm text-mist">Need more than 10 products?</span>
            <a href="#contact" className="text-sm font-bold text-white hover:text-honey transition-colors">
              Get a bulk quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
