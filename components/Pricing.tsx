"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
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
    isPro: true,
  },
];

const PricingCard = ({ pkg, index }: { pkg: Package; index: number }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXStart = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYStart = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYStart, [-0.5, 0.5], ["3deg", "-3deg"]);
  const rotateY = useTransform(mouseXStart, [-0.5, 0.5], ["-3deg", "3deg"]);

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
        className={`relative h-full rounded-3xl p-8 overflow-hidden group transition-all duration-300 ${pkg.popular
          ? "bg-white border-2 border-[#E63946] shadow-2xl shadow-[#E63946]/10"
          : "bg-white border border-rush-border hover:border-[#E63946]/50 hover:shadow-xl hover:shadow-black/5"
          }`}
      >
        {/* Content */}
        <div className="relative z-10 transform-gpu translate-z-20 h-full flex flex-col">
          {pkg.popular && (
            <div className="absolute top-0 right-0">
              <span className="bg-[#E63946] text-white text-xs font-bold px-3 py-1.5 rounded-bl-xl shadow-sm">MOST POPULAR</span>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-xl font-bold text-rush-dark mb-2">{pkg.name}</h3>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl md:text-5xl font-black text-rush-dark tracking-tight">${pkg.price}</span>
              <span className="text-rush-gray text-sm font-medium">/ product</span>
            </div>
            {pkg.originalPrice && (
              <div className="mt-2 text-sm text-rush-gray line-through opacity-60 font-medium">
                ${pkg.originalPrice}
              </div>
            )}
          </div>

          <p className="text-rush-gray text-sm mb-8 leading-relaxed font-medium">
            {pkg.description}
          </p>

          <div className="space-y-4 mb-8 flex-grow">
            {Object.entries(pkg.features).map(([key, value]) => (
              <div key={key} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${pkg.popular ? "bg-[#E63946]/10 text-[#E63946]" : "bg-rush-light text-rush-dark"}`}>
                  <Check className="w-3 h-3" strokeWidth={3} />
                </div>
                <span className="text-sm text-rush-gray">
                  <strong className="text-rush-dark">{value}</strong> {key}
                </span>
              </div>
            ))}
            {pkg.isPro && (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span className="text-sm text-rush-gray">
                  <strong className="text-rush-dark">RAW</strong> Files Included
                </span>
              </div>
            )}
          </div>

          <Link
            href="/order"
            className={`w-full py-4 rounded-xl font-bold text-sm text-center transition-all duration-300 transform translate-z-30 ${pkg.popular
              ? "bg-[#E63946] text-white hover:bg-[#D62839] shadow-lg shadow-[#E63946]/20"
              : "bg-rush-light text-rush-dark hover:bg-rush-gray/10"
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
    <section id="pricing" className="relative py-32 bg-rush-light overflow-hidden">
      <div className="container relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-5xl md:text-7xl font-black text-rush-dark mb-6 tracking-tighter">
              Transparent <br />
              <span className="text-[#E63946]">Pricing</span>
            </h2>
            <p className="text-lg text-rush-gray font-medium">
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
          <div className="inline-flex items-center gap-4 p-4 rounded-full bg-white border border-rush-border shadow-sm">
            <span className="text-sm text-rush-gray font-medium">Need more than 10 products?</span>
            <a href="#contact" className="text-sm font-bold text-[#E63946] hover:text-[#D62839] transition-colors">
              Get a bulk quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
