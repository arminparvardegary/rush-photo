"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Camera,
  ImageDown,
  ArrowRight,
  Check,
  Clock,
  Shield,
  Sparkles,
  Star,
  Truck,
  CreditCard,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const steps = [
  {
    number: "01",
    title: "Place Your Order",
    description: "Select your package, customize options, and checkout securely.",
    icon: ShoppingCart,
    image: "/images/portfolio/serum-bottle.jpg",
    details: [
      "Choose E-Commerce, Lifestyle, or Full Package",
      "Select photo angles and aspect ratios",
      "Specify number of product SKUs",
      "Secure payment processing",
    ],
  },
  {
    number: "02",
    title: "Ship Your Products",
    description: "Send your products to our studio with any carrier you prefer.",
    icon: Package,
    image: "/images/portfolio/sandal.jpg",
    details: [
      "Receive shipping instructions via email",
      "Use FedEx, UPS, USPS, or any carrier",
      "Products fully insured during transit",
      "Track your shipment status",
    ],
  },
  {
    number: "03",
    title: "We Photograph",
    description: "Our experts capture stunning images with professional equipment.",
    icon: Camera,
    image: "/images/portfolio/proccess3.jpg",
    details: [
      "Professional studio lighting",
      "Multiple angles per your specs",
      "High-resolution capture",
      "Expert editing & retouching",
    ],
  },
  {
    number: "04",
    title: "Get Your Photos",
    description: "Download ready-to-use images. Products shipped back to you.",
    icon: ImageDown,
    image: "/images/portfolio/flowers-table.jpg",
    details: [
      "Photos delivered to your dashboard",
      "Web & print-ready formats",
      "Products returned insured",
      "100% satisfaction guaranteed",
    ],
  },
];

const benefits = [
  {
    icon: Clock,
    title: "3-5 Day Turnaround",
    description: "Fast delivery without compromising on quality",
  },
  {
    icon: Shield,
    title: "Fully Insured",
    description: "Your products are protected throughout the process",
  },
  {
    icon: Sparkles,
    title: "Studio Quality",
    description: "Professional photos that convert browsers to buyers",
  },
  {
    icon: CreditCard,
    title: "Simple Pricing",
    description: "No hidden fees, no surprises. What you see is what you pay",
  },
];

export default function ProcessPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="pt-28 pb-12 sm:pt-36 sm:pb-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#E63946]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gray-100 rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold mb-6">
              <Sparkles className="w-4 h-4" />
              Simple & Transparent
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-6 leading-tight">
              How It <span className="text-[#E63946]">Works</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Professional product photography in 4 simple steps. No studio visits required.
            </p>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-8 sm:gap-12 mt-12"
          >
            {[
              { value: "3-5", label: "Day Turnaround" },
              { value: "$29", label: "Starting Price" },
              { value: "100%", label: "Satisfaction" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-black text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline Steps Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl 3xl:max-w-[1400px] mx-auto px-4 sm:px-6">
          <div className="relative">
            {/* Vertical Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#E63946] via-gray-200 to-gray-200" />

            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-16 mb-16 sm:mb-24 last:mb-0 ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                {/* Step Number Circle (Center on desktop) */}
                <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-16 h-16 bg-white border-4 border-[#E63946] rounded-full items-center justify-center z-10">
                  <span className="text-xl font-black text-[#E63946]">{step.number}</span>
                </div>

                {/* Image Side */}
                <div className={`w-full lg:w-[calc(50%-4rem)] ${index % 2 === 1 ? "lg:pl-8" : "lg:pr-8"}`}>
                  <div className="relative group">
                    <div className="aspect-[4/3] rounded-2xl sm:rounded-3xl overflow-hidden bg-gray-100">
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    {/* Mobile Step Badge */}
                    <div className="lg:hidden absolute -top-3 -left-3 w-12 h-12 bg-[#E63946] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63946]/30">
                      <span className="text-lg font-black text-white">{step.number}</span>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className={`w-full lg:w-[calc(50%-4rem)] ${index % 2 === 1 ? "lg:pr-8 lg:text-right" : "lg:pl-8"}`}>
                  <div className={`flex items-center gap-3 mb-4 ${index % 2 === 1 ? "lg:justify-end" : ""}`}>
                    <div className="w-10 h-10 bg-[#E63946]/10 rounded-xl flex items-center justify-center">
                      <step.icon className="w-5 h-5 text-[#E63946]" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black text-gray-900">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-lg mb-6">
                    {step.description}
                  </p>
                  <ul className={`space-y-3 ${index % 2 === 1 ? "lg:ml-auto" : ""}`}>
                    {step.details.map((detail, i) => (
                      <li
                        key={i}
                        className={`flex items-center gap-3 ${index % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-emerald-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
              Why Brands <span className="text-[#E63946]">Love</span> Us
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">
              We've simplified professional product photography so you can focus on what matters - growing your business.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-[#E63946]/20 hover:shadow-lg transition-all group"
              >
                <div className="w-12 h-12 bg-[#E63946]/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#E63946] transition-colors">
                  <benefit.icon className="w-6 h-6 text-[#E63946] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial/Trust Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl 3xl:max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-center gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <blockquote className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
              "The easiest way to get professional product photos. Ship your products, get stunning images back. It's that simple."
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E63946] to-[#D62839] rounded-full flex items-center justify-center text-white font-bold">
                J
              </div>
              <div className="text-left">
                <p className="font-bold text-gray-900">Jessica M.</p>
                <p className="text-sm text-gray-500">E-commerce Brand Owner</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gray-900">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Ready to Elevate Your Brand?
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of brands that trust Rush Photos for their product photography needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/order"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/30 text-lg"
              >
                Start Your Order
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#packages"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors text-lg"
              >
                View Pricing
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6 sm:gap-10 mt-12 pt-12 border-t border-white/10">
              {[
                { icon: Truck, text: "Free Return Shipping" },
                { icon: Shield, text: "Fully Insured" },
                { icon: Clock, text: "3-5 Day Delivery" },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2 text-gray-400">
                  <badge.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
