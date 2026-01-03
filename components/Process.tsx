"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Package, Camera, Sparkles, Send, ArrowRight, PlayCircle } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

const STEPS = [
  {
    number: "01",
    icon: Package,
    title: "Ship Your Product",
    description: "Send your product to our studio with prepaid shipping. We handle everything with care.",
    time: "Day 1"
  },
  {
    number: "02",
    icon: Camera,
    title: "Production Shoot",
    description: "Our team captures your product in your chosen styles with professional studio lighting and Phase One cameras.",
    time: "Day 2-3"
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Expert Retouching",
    description: "Each photo is professionally edited and retouched to ensure magazine-quality results, removing dust and scratches.",
    time: "Day 4"
  },
  {
    number: "04",
    icon: Send,
    title: "Final Delivery",
    description: "Get your high-resolution photos delivered digitally, plus your product shipped back efficiently.",
    time: "Day 5"
  },
];

export default function Process() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  return (
    <section id="process" className="relative py-32 bg-ink overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-subtle opacity-10 pointer-events-none" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[600px] bg-teal/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Sticky Header */}
          <div className="lg:sticky lg:top-32 h-fit">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
                Simple <br />
                <span className="text-transparent bg-clip-text bg-gradient-cool font-serif italic">Streamlined</span> <br />
                Process
              </h2>
              From your doorstep to your dashboard in under a week.
              We&apos;ve optimized every step for speed without compromising quality.

              <Link
                href="/order"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-ink font-bold rounded-full hover:bg-honey transition-all duration-300 group"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {/* Trust Indicator */}
              <div className="mt-12 flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm max-w-sm">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Current Turnaround</p>
                  <p className="text-mist text-sm">Standard: 3-5 Days • Rush: 24hrs</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timeline */}
          <div ref={containerRef} className="relative pl-8 md:pl-0">
            {/* Connecting Line */}
            <div className="absolute left-0 md:left-[27px] top-0 bottom-0 w-px bg-white/10 hidden md:block">
              <motion.div
                className="w-full bg-gradient-cool"
                style={{ height: useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]) }}
              />
            </div>

            <div className="space-y-16 relative">
              {STEPS.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative md:pl-16 group"
                >
                  {/* Timeline Node */}
                  <div className="absolute left-[-4px] md:left-[19px] top-0 w-4 h-4 rounded-full border-2 border-ink bg-charcoal group-hover:border-teal group-hover:scale-125 transition-all duration-300 hidden md:block" />

                  {/* Mobile Timeline Line */}
                  <div className="absolute left-[-24px] top-0 bottom-[-64px] w-px bg-white/10 md:hidden block" />
                  <div className="absolute left-[-28px] top-0 w-2 h-2 rounded-full bg-teal md:hidden block" />

                  {/* Card Content */}
                  <div className="p-8 rounded-3xl bg-charcoal border border-white/5 hover:border-teal/30 hover:bg-white/[0.02] transition-colors duration-500 group-hover:shadow-2xl hover:shadow-teal/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-white group-hover:bg-teal group-hover:text-ink transition-colors duration-300 shadow-lg">
                        <step.icon className="w-6 h-6" />
                      </div>
                      <span className="text-6xl font-bold text-white/5 font-serif group-hover:text-white/10 transition-colors">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                    <p className="text-mist leading-relaxed mb-6">{step.description}</p>

                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                      <span className="text-xs font-bold uppercase tracking-wider text-teal bg-teal/10 px-3 py-1 rounded-full">
                        {step.time}
                      </span>
                      <button className="text-sm font-medium text-white flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                        Watch Video <PlayCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
