"use client";

import { motion } from "framer-motion";
import { Shield, Clock, Award, Users, Star, CheckCircle } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Happy Brands", color: "text-honey" },
  { icon: Star, value: "4.9/5", label: "Rating", color: "text-honey" },
  { icon: Clock, value: "3-5 Days", label: "Delivery", color: "text-teal" },
  { icon: Shield, value: "100%", label: "Guarantee", color: "text-teal" },
];

const logos = [
  { name: "Shopify", src: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
  { name: "Amazon", src: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Etsy", src: "https://cdn.worldvectorlogo.com/logos/etsy-1.svg" },
  { name: "eBay", src: "https://cdn.worldvectorlogo.com/logos/ebay-1.svg" },
];

export function TrustBadges() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap items-center justify-center gap-6 text-sm"
    >
      <div className="flex items-center gap-2 text-white/60">
        <Shield className="w-4 h-4 text-teal" />
        <span>Secure checkout</span>
      </div>
      <div className="flex items-center gap-2 text-white/60">
        <CheckCircle className="w-4 h-4 text-teal" />
        <span>100% satisfaction guarantee</span>
      </div>
      <div className="flex items-center gap-2 text-white/60">
        <Clock className="w-4 h-4 text-honey" />
        <span>3-5 day turnaround</span>
      </div>
    </motion.div>
  );
}

export function StatsBar() {
  return (
    <div className="py-8 border-y border-white/10">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                <span className="text-2xl font-bold text-white">{stat.value}</span>
              </div>
              <p className="text-sm text-white/60">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrandLogos() {
  return (
    <div className="py-12 border-b border-white/10">
      <div className="container">
        <p className="text-center text-sm text-white/40 mb-8">
          Trusted by brands selling on
        </p>
        <div className="flex items-center justify-center gap-12 flex-wrap opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {logos.map((logo) => (
            <div 
              key={logo.name}
              className="h-8 flex items-center"
              title={logo.name}
            >
              <img 
                src={logo.src} 
                alt={logo.name}
                className="h-full w-auto object-contain brightness-0 invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SocialProof() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="flex items-center gap-4"
    >
      {/* Stacked avatars */}
      <div className="flex -space-x-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-honey/30 to-teal/30 border-2 border-[#0d0d0d] flex items-center justify-center"
          >
            <span className="text-xs font-medium text-white/80">
              {String.fromCharCode(64 + i)}
            </span>
          </div>
        ))}
      </div>
      
      <div>
        <div className="flex items-center gap-1 mb-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-4 h-4 fill-honey text-honey" />
          ))}
          <span className="text-sm font-semibold text-white ml-1">4.9</span>
        </div>
        <p className="text-xs text-white/60">
          from 500+ happy brands
        </p>
      </div>
    </motion.div>
  );
}

export default function TrustIndicators() {
  return (
    <>
      <StatsBar />
      <BrandLogos />
    </>
  );
}

