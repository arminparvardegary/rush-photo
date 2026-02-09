"use client";

import { motion } from "framer-motion";
import { Calendar, MessageCircle, Camera, CheckCircle } from "lucide-react";
import Image from "next/image";

const CONSULTATION_STEPS = [
  {
    icon: MessageCircle,
    title: "Tell us about your products",
    description: "Share your vision, target audience, and desired photography style"
  },
  {
    icon: Calendar,
    title: "Schedule your shoot",
    description: "Pick a date that works for you, with flexible options available"
  },
  {
    icon: Camera,
    title: "We create magic",
    description: "Our team brings your products to life with professional photography"
  },
  {
    icon: CheckCircle,
    title: "Review & deliver",
    description: "Approve final images and download your high-res files"
  }
];

export default function ConsultationFlow() {
  return (
    <section className="relative py-24 md:py-32 bg-gradient-to-b from-white to-gray-50">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold tracking-wider uppercase mb-6">
              <span>•</span>
              <span>How it works</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              From consultation to delivery
            </h2>
            
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Our streamlined process makes professional product photography simple 
              and stress-free. Here's what to expect when you work with us.
            </p>

            {/* Steps */}
            <div className="space-y-6">
              {CONSULTATION_STEPS.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#E63946]/10 flex items-center justify-center text-[#E63946] group-hover:bg-[#E63946] group-hover:text-white transition-colors duration-300">
                    <step.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="mt-12 flex flex-col sm:flex-row gap-4"
            >
              <a
                href="/order"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E63946] rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
              >
                Get Started Now
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white rounded-full border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                Schedule a Call
              </a>
            </motion.div>
          </motion.div>

          {/* Right - Visual Discovery Board */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/5] bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-2xl">
              {/* Grid of product photos - Discovery board style */}
              <div className="absolute inset-0 grid grid-cols-2 gap-4 p-6">
                {/* Polaroid-style image cards */}
                <motion.div
                  initial={{ rotate: -5, y: 20 }}
                  whileInView={{ rotate: -3, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative bg-white p-3 shadow-lg rounded-lg"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image
                      src="/images/portfolio/sneaker.jpg"
                      alt="Product"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-handwriting">
                    Clean white background ✓
                  </div>
                </motion.div>

                <motion.div
                  initial={{ rotate: 5, y: 20 }}
                  whileInView={{ rotate: 4, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="relative bg-white p-3 shadow-lg rounded-lg mt-8"
                  style={{ transform: 'rotate(4deg)' }}
                >
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image
                      src="/images/portfolio/pink-bottle.jpg"
                      alt="Product"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-handwriting">
                    Lifestyle shot 📸
                  </div>
                </motion.div>

                <motion.div
                  initial={{ rotate: -4, y: 20 }}
                  whileInView={{ rotate: -2, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="relative bg-white p-3 shadow-lg rounded-lg"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image
                      src="/images/portfolio/serum-bottle.jpg"
                      alt="Product"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-handwriting">
                    Detail macro ✨
                  </div>
                </motion.div>

                <motion.div
                  initial={{ rotate: 3, y: 20 }}
                  whileInView={{ rotate: 2, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="relative bg-white p-3 shadow-lg rounded-lg mt-4"
                  style={{ transform: 'rotate(2deg)' }}
                >
                  <div className="relative aspect-square rounded overflow-hidden">
                    <Image
                      src="/images/portfolio/speakers.jpg"
                      alt="Product"
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-600 font-handwriting">
                    Hero angle 🎯
                  </div>
                </motion.div>
              </div>

              {/* Sticky notes overlay */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: -5 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute top-8 right-8 w-32 h-32 bg-yellow-300 shadow-lg rounded-sm p-4 flex items-center justify-center text-center"
                style={{ transform: 'rotate(-5deg)' }}
              >
                <p className="text-sm font-handwriting text-gray-800">
                  "Show every angle" 📝
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
