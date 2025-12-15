"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Founder",
    company: "Bloom Skincare",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&q=90",
    quote:
      "Rush Photo transformed our product images. Our conversion rate increased by 40% after updating our store with their photos. The quality is outstanding.",
    rating: 5,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    role: "Creative Director",
    company: "Altitude Gear",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&q=90",
    quote:
      "We've worked with many photography studios, but Rush delivers consistently exceptional results. Fast turnaround, great communication, and stunning images every time.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "E-commerce Manager",
    company: "Urban Threads",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&q=90",
    quote:
      "The lifestyle shots Rush created for our new collection were exactly what we envisioned. They truly understand brand storytelling through photography.",
    rating: 5,
  },
];

const BRANDS = [
  "Shopify",
  "Amazon",
  "Etsy",
  "WooCommerce",
  "BigCommerce",
  "Squarespace",
];

export default function Testimonials() {
  return (
    <section className="relative py-32 bg-charcoal overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grain" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-honey/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-teal/5 rounded-full blur-[120px]" />

      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-6">
            Loved by <span className="text-gradient font-serif italic">500+</span> brands
          </h2>
          <p className="text-lg text-mist max-w-2xl mx-auto">
            See what our clients say about working with Rush Photo
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto mb-20">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="h-full p-8 rounded-3xl bg-graphite border border-white/5 hover:border-honey/20 transition-all duration-300 hover:shadow-xl hover:shadow-honey/5">
                {/* Quote icon */}
                <Quote className="w-10 h-10 text-honey/20 mb-6" />

                {/* Quote */}
                <p className="text-cloud/90 leading-relaxed mb-8">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-honey fill-honey" />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-honey/20"
                  />
                  <div>
                    <p className="font-semibold text-cloud">{testimonial.name}</p>
                    <p className="text-sm text-smoke">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trusted By Brands */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <p className="text-sm text-smoke uppercase tracking-wider mb-8">
            Photos optimized for all major platforms
          </p>
          <div className="flex flex-wrap justify-center gap-8 lg:gap-12">
            {BRANDS.map((brand) => (
              <div
                key={brand}
                className="text-2xl font-bold text-white/10 hover:text-white/20 transition-colors cursor-default"
              >
                {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
