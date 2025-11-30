"use client";

import { Shield, RefreshCw, Clock, Award, CreditCard, Truck } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "100% Satisfaction",
    description: "Money-back guarantee",
  },
  {
    icon: RefreshCw,
    title: "Free Revisions",
    description: "Until you're happy",
  },
  {
    icon: Clock,
    title: "Fast Turnaround",
    description: "3-5 business days",
  },
  {
    icon: Award,
    title: "Pro Quality",
    description: "Magazine-grade photos",
  },
  {
    icon: CreditCard,
    title: "Secure Payment",
    description: "SSL encrypted",
  },
  {
    icon: Truck,
    title: "Free Shipping",
    description: "Both ways included",
  },
];

export default function TrustBadges() {
  return (
    <section className="py-12 bg-white border-y border-[#1a1a1a]/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {badges.map((badge, index) => (
            <div 
              key={index}
              className="flex flex-col items-center text-center group cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E54A4A]/10 to-[#ff9966]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <badge.icon className="w-5 h-5 text-[#E54A4A]" />
              </div>
              <h4 className="font-semibold text-[#1a1a1a] text-sm mb-1">{badge.title}</h4>
              <p className="text-[#1a1a1a]/50 text-xs">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

