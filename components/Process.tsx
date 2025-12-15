"use client";

import { motion } from "framer-motion";
import { Package, Camera, Sparkles, Send, ArrowRight } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    number: "01",
    icon: Package,
    title: "Ship Your Product",
    description:
      "Send your product to our studio with prepaid shipping. We handle everything with care.",
  },
  {
    number: "02",
    icon: Camera,
    title: "We Photograph",
    description:
      "Our team captures your product in your chosen styles with professional studio lighting.",
  },
  {
    number: "03",
    icon: Sparkles,
    title: "Expert Retouching",
    description:
      "Each photo is professionally edited and retouched to ensure magazine-quality results.",
  },
  {
    number: "04",
    icon: Send,
    title: "Receive Your Photos",
    description:
      "Get your high-resolution photos delivered digitally, plus your product shipped back.",
  },
];

export default function Process() {
  return (
    <section id="process" className="relative py-32 bg-ink overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30" />
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[600px] bg-teal/5 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-20"
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-6">
            How it <span className="text-gradient font-serif italic">works</span>
          </h2>
          <p className="text-lg text-mist">
            A simple, streamlined process from shipping your product to receiving
            stunning photos in just days.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-6 mb-16">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+60px)] w-[calc(100%-80px)] h-px bg-gradient-to-r from-honey/30 to-transparent" />
              )}

              <div className="relative">
                {/* Number badge */}
                <div className="text-7xl lg:text-8xl font-bold text-white/[0.03] absolute -top-4 -left-2 select-none">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-charcoal border border-white/10 flex items-center justify-center mb-6 group-hover:border-honey/30 transition-colors">
                  <step.icon className="w-7 h-7 text-honey" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-cloud mb-3">{step.title}</h3>
                <p className="text-mist leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
        >
          <Link
            href="/order"
            className="inline-flex items-center gap-3 px-8 py-4 bg-honey text-ink font-semibold rounded-full hover:bg-honey-light transition-all hover:shadow-[0_20px_50px_rgba(245,166,35,0.25)]"
          >
            Start Your Project
            <ArrowRight className="w-5 h-5" />
          </Link>
          <span className="text-mist text-sm">
            3-5 day turnaround • 100% satisfaction guarantee
          </span>
        </motion.div>
      </div>
    </section>
  );
}
