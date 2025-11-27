"use client";

import { Package, Palette, Camera, Zap } from "lucide-react";

const steps = [
  {
    icon: Package,
    title: "Ship It",
    description: "Send your product to us with prepaid return shipping.",
    color: "#E54A4A",
  },
  {
    icon: Palette,
    title: "Pick Styles",
    description: "Choose from 4 unique photography styles.",
    color: "#ff7f7f",
  },
  {
    icon: Camera,
    title: "We Shoot",
    description: "Pro photographers capture stunning images.",
    color: "#ff9966",
  },
  {
    icon: Zap,
    title: "Get Photos",
    description: "Receive high-res photos in 3-5 days.",
    color: "#E54A4A",
  },
];

export default function Process() {
  return (
    <section id="process" className="py-24 md:py-32 bg-gradient-to-b from-[#fff5eb] to-[#FFFAF5] relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-40 h-40 border-2 border-[#E54A4A]/10 rounded-full" />
      <div className="absolute bottom-20 right-10 w-60 h-60 border-2 border-[#ff9966]/10 rounded-full" />
      
      <div className="container relative z-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
            Super Simple
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
            How it <span className="gradient-text">works</span>
          </h2>
          <p className="text-[#1a1a1a]/60 text-lg">
            Four easy steps to amazing product photos
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative group"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#E54A4A]/30 to-transparent" />
              )}
              
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-[#E54A4A]/5">
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${step.color}15` }}
                >
                  <step.icon className="w-8 h-8" style={{ color: step.color }} />
                </div>
                
                {/* Step number */}
                <span 
                  className="text-5xl font-bold opacity-10 absolute top-6 right-6"
                  style={{ color: step.color }}
                >
                  {index + 1}
                </span>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-[#1a1a1a]/50 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
