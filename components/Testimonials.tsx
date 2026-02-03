"use client";

import { motion } from "framer-motion";
import { Star, Quote, ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Alex Morrison",
    role: "CEO",
    company: "UrbanWear Co.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80",
    content: "Rush Photos transformed our product catalog. Sales increased 65% in the first month after implementing their imagery across our site.",
    rating: 5,
    type: "text",
    metric: "+65% sales"
  },
  {
    id: 2,
    name: "Priya Sharma",
    role: "Marketing Lead",
    company: "EcoStyle",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&q=80",
    content: "Working with Rush was seamless from start to finish. They captured our brand essence perfectly and delivered ahead of schedule.",
    rating: 5,
    type: "text",
    metric: "5-day delivery"
  },
  {
    id: 3,
    name: "Marcus Chen",
    role: "Founder",
    company: "TechLux",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&q=80",
    content: "The quality is unmatched. Every single shot exceeded our expectations. Our products have never looked this premium.",
    rating: 5,
    type: "featured",
    metric: "Premium quality"
  },
  {
    id: 4,
    name: "Sofia Rodriguez",
    role: "Brand Director",
    company: "Lumina Beauty",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&q=80",
    content: "Rush Photos is our secret weapon. Their attention to lighting and composition makes every product look irresistible.",
    rating: 5,
    type: "text",
    metric: "Repeat client"
  },
  {
    id: 5,
    name: "James Taylor",
    role: "E-commerce Manager",
    company: "ActiveGear",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&q=80",
    content: "Three different photographers couldn't get it right. Rush nailed it on the first shoot. Professional, fast, and worth every penny.",
    rating: 5,
    type: "text",
    metric: "First attempt"
  },
  {
    id: 6,
    name: "Nina Patel",
    role: "Creative Director",
    company: "Artisan Home",
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop&q=80",
    content: "I've worked with product photographers for 15 years. Rush Photos sets a new standard. The turnaround speed is incredible.",
    rating: 5,
    type: "text",
    metric: "15 yrs experience"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#E63946]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rush-gray/5 rounded-full blur-[120px]" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 max-w-7xl 3xl:max-w-[1600px] mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-3 sm:px-4 py-1.5 rounded-full border border-[#E63946]/20 bg-[#E63946]/5 text-[#E63946] text-xs sm:text-sm font-bold tracking-wide uppercase mb-4 sm:mb-6">
              Trusted Worldwide
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-rush-dark mb-4 sm:mb-6 tracking-tight">
              Client <span className="text-[#E63946]">Love</span>
            </h2>
            <p className="text-base sm:text-lg text-rush-gray font-medium mb-6">
              Join 500+ brands who&apos;ve transformed their product imagery with Rush Photos
            </p>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mb-8">
              {[
                { value: "500+", label: "Happy Clients" },
                { value: "50K+", label: "Photos Delivered" },
                { value: "4.9/5", label: "Average Rating" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-2xl sm:text-3xl font-black text-[#E63946] mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-rush-gray font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 3xl:gap-10 mb-12">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className={`relative h-full p-6 sm:p-8 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${item.type === 'featured'
                ? 'bg-white border-2 border-[#E63946] shadow-lg'
                : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                }`}>
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(item.rating)].map((_, idx) => (
                    <Star
                      key={idx}
                      className={`w-4 h-4 text-[#E63946] fill-[#E63946]`}
                    />
                  ))}
                </div>

                {/* Quote icon */}
                <Quote className={`w-8 h-8 mb-4 text-gray-100`} />

                {/* Content */}
                <p className={`text-sm sm:text-base leading-relaxed mb-6 font-medium text-gray-600`}>
                  &quot;{item.content}&quot;
                </p>

                {/* Metric badge */}
                {item.metric && (
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold mb-6 bg-[#E63946]/10 text-[#E63946]`}>
                    {item.metric}
                  </div>
                )}

                {/* Author */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/10">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm text-gray-900`}>
                      {item.name}
                    </h4>
                    <p className={`text-xs text-gray-500`}>
                      {item.role}, {item.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-br from-rush-light to-white rounded-3xl border border-rush-border p-8 sm:p-12 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-rush-dark mb-4">
              Ready to Join Them?
            </h3>
            <p className="text-rush-gray font-medium mb-8 max-w-2xl mx-auto">
              Start creating stunning product photography that converts browsers into buyers
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/order"
                className="w-full sm:w-auto bg-[#E63946] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-[#E63946]/20 hover:scale-105 transition-all flex items-center justify-center gap-2"
              >
                Get Started Now
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="mailto:hello@rush.photos"
                className="w-full sm:w-auto bg-white border-2 border-rush-border text-rush-dark px-8 py-4 rounded-2xl font-bold text-lg hover:border-rush-dark transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Talk to Us
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
