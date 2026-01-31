"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, Package, ArrowRight, Check } from "lucide-react";
import Link from "next/link";

const PACKAGE_IMAGES = {
  ecommerce: "/images/portfolio/speakers.jpg",
  lifestyle: "/images/portfolio/flowers-table.jpg",
  fullpackage: "/images/portfolio/pink-bottle.jpg",
};

const packages = [
  {
    id: "ecommerce",
    title: "E-Commerce",
    subtitle: "Studio Shots",
    description: "Clean, consistent product shots on white background. Perfect for Amazon, Shopify, and marketplaces.",
    price: "From $25",
    unit: "per angle",
    img: PACKAGE_IMAGES.ecommerce,
    icon: Camera,
    color: "#E63946",
    features: ["3 styles available", "4 angles per style", "White background", "Fast turnaround"],
  },
  {
    id: "lifestyle",
    title: "Lifestyle",
    subtitle: "Styled Scenes",
    description: "Tabletop styled photography with props, creative direction, and custom concept designed for your brand.",
    price: "$149",
    unit: "flat rate",
    img: PACKAGE_IMAGES.lifestyle,
    icon: Sparkles,
    color: "#D62839",
    features: ["Custom concept", "Styled props", "Creative direction", "Client approval"],
  },
  {
    id: "fullpackage",
    title: "Full Package",
    subtitle: "E-Commerce + Lifestyle",
    description: "The complete solution. Get both studio e-commerce shots and lifestyle imagery at a bundled discount.",
    price: "Save 10%",
    unit: "on bundle",
    img: PACKAGE_IMAGES.fullpackage,
    icon: Package,
    color: "#B91C1C",
    badge: "Best Value",
    features: ["All e-commerce styles", "Lifestyle session included", "10% bundle discount", "Priority delivery"],
  },
];

export default function PackageSelection() {
  return (
    <section id="packages" className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
      {/* Background - Subtle */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-gray-50 to-transparent rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 text-sm font-medium mb-6">
              Choose Your Package
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight leading-[1.1]">
              3 Simple Plans
            </h2>
            <p className="text-base sm:text-lg text-gray-500 font-medium max-w-xl mx-auto">
              Select the photography style that fits your brand. No hidden fees.
            </p>
          </motion.div>
        </div>

        {/* Package Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={index === 2 && packages.length === 3 ? "sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:mx-0 w-full" : ""}
            >
              <Link
                href={`/order?package=${pkg.id}`}
                className={`group flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border-2 transition-all duration-300 h-full ${pkg.badge
                  ? "border-[#B91C1C] shadow-xl shadow-[#B91C1C]/10"
                  : "border-rush-border hover:border-[#E63946]/50 hover:shadow-xl hover:shadow-black/5"
                  }`}
              >
                {/* Image */}
                <div className="h-40 sm:h-48 relative overflow-hidden flex-shrink-0">
                  <img
                    src={pkg.img}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                  {pkg.badge && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-[#B91C1C] text-white text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                      {pkg.badge}
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4">
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: pkg.color }}
                    >
                      <pkg.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6 lg:p-8 flex flex-col flex-1">
                  <div className="mb-4">
                    <p className="text-[10px] sm:text-xs font-bold text-rush-gray uppercase tracking-widest mb-1">
                      {pkg.subtitle}
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-rush-dark mb-2">{pkg.title}</h3>
                    <p className="text-xs sm:text-sm text-rush-gray font-medium leading-relaxed line-clamp-3">
                      {pkg.description}
                    </p>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6 flex-1">
                    {pkg.features.slice(0, 3).map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-[#E63946]/10 flex items-center justify-center flex-shrink-0">
                          <Check className="w-2.5 h-2.5 text-[#E63946]" strokeWidth={3} />
                        </div>
                        <span className="text-xs sm:text-sm text-rush-gray font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & CTA - Always at bottom */}
                  <div className="flex items-center justify-between pt-4 border-t border-rush-border mt-auto">
                    <div>
                      <span className="text-xl sm:text-2xl font-bold text-rush-dark">{pkg.price}</span>
                      <span className="text-xs sm:text-sm text-rush-gray font-medium ml-1">{pkg.unit}</span>
                    </div>
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: pkg.color }}
                    >
                      <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 sm:mt-16 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-rush-light border border-rush-border">
            <span className="text-sm text-rush-gray font-medium">Need a custom solution?</span>
            <a
              href="mailto:hello@rush.photos"
              className="text-sm font-bold text-[#E63946] hover:text-[#D62839] transition-colors flex items-center gap-1"
            >
              Contact us <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
