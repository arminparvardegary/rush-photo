"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function GrowthSeparator() {
  return (
    <section className="relative py-20 md:py-24 bg-gray-50 border-y border-gray-200">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Headline */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight"
          >
            From startup to scale
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
          >
            Whether you're launching your first product or scaling to thousands of SKUs, 
            we have the right solution for your business.
          </motion.p>
        </div>

        {/* Visual Growth Steps */}
        <div className="relative">
          {/* Growth Bars Visualization */}
          <div className="grid grid-cols-3 gap-8 items-end mb-12">
            {/* Step 1 */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-[#E63946]/20 h-32 flex items-center justify-center transition-all duration-300 hover:h-36 hover:bg-[#E63946]/30">
                <span className="text-6xl font-bold text-[#E63946] font-mono">1</span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Starter
                </h3>
                <p className="text-gray-600 text-sm">
                  1-10 products, perfect for launching your store
                </p>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="bg-[#E63946]/40 h-48 flex items-center justify-center transition-all duration-300 hover:h-52 hover:bg-[#E63946]/50">
                <span className="text-6xl font-bold text-[#E63946] font-mono">2</span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Growth
                </h3>
                <p className="text-gray-600 text-sm">
                  10-50 products, scaling your catalog efficiently
                </p>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              whileInView={{ opacity: 1, height: "auto" }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-6"
            >
              <div className="bg-[#E63946] h-64 flex items-center justify-center transition-all duration-300 hover:h-72">
                <span className="text-6xl font-bold text-white font-mono">3</span>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  Enterprise
                </h3>
                <p className="text-gray-600 text-sm">
                  Unlimited products with dedicated support
                </p>
              </div>
            </motion.div>
          </div>

          {/* Growth Arrow Indicator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative h-1 bg-gray-200 origin-left"
          >
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex items-center justify-end pr-4">
              <ArrowRight className="w-8 h-8 text-[#E63946]" />
            </div>
          </motion.div>
        </div>

        {/* Bottom Text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600">
            Flexible plans that grow with your business. No long-term contracts.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
