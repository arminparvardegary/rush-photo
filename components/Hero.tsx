"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, Star, Sparkles } from "lucide-react";
import Link from "next/link";

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=800&fit=crop&q=90",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=800&fit=crop&q=90",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=800&fit=crop&q=90",
];

const STATS = [
  { value: "500+", label: "Brands" },
  { value: "15K+", label: "Photos" },
  { value: "4.9", label: "Rating", icon: Star },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ink">
      {/* Background effects */}
      <div className="absolute inset-0 bg-radial-glow" />
      <div className="absolute inset-0 bg-grid-subtle" />
      <div className="absolute inset-0 bg-grain" />
      
      {/* Floating accent elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-honey/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />

      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left: Content */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-honey/10 border border-honey/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-honey" />
              <span className="text-sm font-medium text-honey">Professional Product Photography</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight mb-6"
            >
              <span className="text-cloud">Photos that</span>
              <br />
              <span className="text-gradient font-serif italic">sell</span>
              <span className="text-cloud"> your</span>
              <br />
              <span className="text-cloud">products</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg sm:text-xl text-mist max-w-lg mb-10"
            >
              Ship your product, get magazine-quality photos in 3-5 days. 
              Multiple styles, unlimited revisions, 100% satisfaction guaranteed.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Link
                href="/order"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-honey text-ink font-semibold rounded-full hover:bg-honey-light transition-all duration-300 hover:shadow-[0_20px_50px_rgba(245,166,35,0.3)]"
              >
                Start Your Shoot
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group inline-flex items-center gap-3 px-6 py-4 text-cloud font-medium rounded-full border border-white/10 hover:border-honey/50 hover:bg-honey/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-honey/20 transition-colors">
                  <Play className="w-4 h-4 text-honey ml-0.5" />
                </div>
                Watch How It Works
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex items-center gap-8 sm:gap-12"
            >
              {STATS.map((stat, index) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <div className="flex items-center gap-1.5 justify-center sm:justify-start">
                    <span className="text-3xl sm:text-4xl font-bold text-cloud">{stat.value}</span>
                    {stat.icon && <stat.icon className="w-5 h-5 text-honey fill-honey" />}
                  </div>
                  <span className="text-sm text-smoke">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Images */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative flex justify-center lg:justify-end gap-4">
              {/* Main image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative z-20"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-black/50">
                  <img
                    src={HERO_IMAGES[0]}
                    alt="Product photography example"
                    className="w-48 sm:w-56 lg:w-72 h-64 sm:h-72 lg:h-96 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
                </div>
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="absolute -left-4 bottom-8 px-4 py-3 bg-charcoal/90 backdrop-blur-lg rounded-2xl border border-white/10 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-honey flex items-center justify-center">
                      <Star className="w-5 h-5 text-ink" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-cloud">Premium Quality</p>
                      <p className="text-xs text-smoke">Studio-grade photos</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Secondary images */}
              <div className="flex flex-col gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 60 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="relative z-10"
                >
                  <div className="overflow-hidden rounded-2xl shadow-xl shadow-black/30">
                    <img
                      src={HERO_IMAGES[1]}
                      alt="Product photography example"
                      className="w-36 sm:w-44 lg:w-52 h-44 sm:h-52 lg:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 80 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative"
                >
                  <div className="overflow-hidden rounded-2xl shadow-xl shadow-black/30">
                    <img
                      src={HERO_IMAGES[2]}
                      alt="Product photography example"
                      className="w-36 sm:w-44 lg:w-52 h-32 sm:h-40 lg:h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
                  </div>
                </motion.div>
              </div>

              {/* Decorative ring */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/5 hidden xl:block" />
              <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/[0.03] hidden xl:block" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ink to-transparent" />
    </section>
  );
}
