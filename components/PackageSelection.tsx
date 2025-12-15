"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Camera,
  Sparkles,
  Package,
  Check,
  Star,
  Clock,
  Shield,
  Zap,
} from "lucide-react";

// Default Pricing
const DEFAULT_PRICES = {
  ecommerce: { perAngle: 25 },
  lifestyle: { flatRate: 149 },
  fullPackageDiscount: 10,
};

// Package images
const PACKAGE_IMAGES = {
  ecommerce:
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=90",
  lifestyle:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=90",
  fullpackage:
    "https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&h=600&fit=crop&q=90",
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
      accentColor: "honey",
      description: "Clean product shots on white background",
      price: `$${prices.ecommerce.perAngle}`,
      priceLabel: "per angle",
      image: PACKAGE_IMAGES.ecommerce,
      features: [
        "White background shots",
        "Multiple angles available",
        "High-res files",
        "2 revisions included",
      ],
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      icon: Sparkles,
      accentColor: "teal",
      description: "Styled scenes with props and creative direction",
      price: `$${prices.lifestyle.flatRate}`,
      priceLabel: "flat rate",
      image: PACKAGE_IMAGES.lifestyle,
      features: [
        "Creative styling",
        "Props included",
        "Brand storytelling",
        "Social-ready formats",
      ],
    },
    {
      id: "fullpackage",
      name: "Full Package",
      icon: Package,
      accentColor: "honey",
      description: `Everything included with ${prices.fullPackageDiscount}% discount`,
      price: "Best Value",
      priceLabel: "",
      image: PACKAGE_IMAGES.fullpackage,
      features: [
        "All e-commerce styles",
        "Lifestyle included",
        `${prices.fullPackageDiscount}% bundle savings`,
        "Unlimited revisions",
      ],
      badge: `SAVE ${prices.fullPackageDiscount}%`,
      featured: true,
    },
  ];

  return (
    <section id="pricing" className="relative py-32 bg-ink overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-glow-bottom" />
      <div className="absolute inset-0 bg-grid-subtle opacity-50" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-honey/10 border border-honey/20 mb-6">
            <Zap className="w-4 h-4 text-honey" />
            <span className="text-sm font-medium text-honey">Simple Pricing</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-6">
            Choose your <span className="text-gradient font-serif italic">package</span>
          </h2>
          <p className="text-lg sm:text-xl text-mist max-w-2xl mx-auto">
            Professional product photography that converts. Pick the style that fits your brand.
          </p>
        </motion.div>

        {/* Package Cards */}
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {packages.map((pkg, index) => {
            const isHovered = hoveredPackage === pkg.id;
            const isFaded = hoveredPackage !== null && !isHovered;

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <Link
                  href={`/order?package=${pkg.id}`}
                  onMouseEnter={() => setHoveredPackage(pkg.id)}
                  onMouseLeave={() => setHoveredPackage(null)}
                  className={`group relative flex flex-col h-full overflow-hidden rounded-3xl transition-all duration-500 ${
                    pkg.featured
                      ? "bg-gradient-to-b from-charcoal to-graphite ring-2 ring-honey/30"
                      : "bg-charcoal"
                  } ${isFaded ? "opacity-50 scale-[0.98]" : ""} ${
                    isHovered ? "scale-[1.02] shadow-2xl shadow-black/50" : ""
                  }`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-honey text-ink text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Star className="w-3.5 h-3.5" />
                      {pkg.badge}
                    </div>
                  )}

                  {/* Image */}
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.name}
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        isHovered ? "scale-110" : "scale-100"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-transparent" />

                    {/* Icon overlay */}
                    <div className="absolute bottom-4 left-4">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center backdrop-blur-md border transition-colors ${
                          pkg.accentColor === "teal"
                            ? "bg-teal/20 border-teal/30"
                            : "bg-honey/20 border-honey/30"
                        }`}
                      >
                        <pkg.icon
                          className={`w-7 h-7 ${
                            pkg.accentColor === "teal" ? "text-teal" : "text-honey"
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-cloud mb-2">{pkg.name}</h3>
                    <p className="text-mist mb-6">{pkg.description}</p>

                    {/* Features */}
                    <div className="space-y-3 mb-8 flex-grow">
                      {pkg.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                              pkg.accentColor === "teal" ? "bg-teal/20" : "bg-honey/20"
                            }`}
                          >
                            <Check
                              className={`w-3 h-3 ${
                                pkg.accentColor === "teal" ? "text-teal" : "text-honey"
                              }`}
                              strokeWidth={3}
                            />
                          </div>
                          <span className="text-sm text-cloud/80">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                      <div>
                        <span
                          className={`text-2xl font-bold ${
                            pkg.accentColor === "teal" ? "text-teal" : "text-honey"
                          }`}
                        >
                          {pkg.price}
                        </span>
                        {pkg.priceLabel && (
                          <span className="text-sm text-smoke ml-1">{pkg.priceLabel}</span>
                        )}
                      </div>
                      <div
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all group-hover:gap-3 ${
                          isHovered
                            ? pkg.accentColor === "teal"
                              ? "bg-teal text-ink"
                              : "bg-honey text-ink"
                            : "bg-white/10 text-cloud"
                        }`}
                      >
                        Get Started
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-20 flex flex-wrap items-center justify-center gap-8 lg:gap-12"
        >
          {[
            { icon: Shield, label: "100% Satisfaction Guarantee", color: "text-teal" },
            { icon: Clock, label: "3-5 Day Delivery", color: "text-honey" },
            { icon: Star, label: "500+ Happy Brands", color: "text-honey" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-sm text-mist">{item.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
