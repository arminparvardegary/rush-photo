"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, MessageCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const FAQ_DATA = [
  {
    category: "Service",
    question: "Do I need to be present for the photoshoot?",
    answer: "No, you don't! Most of our clients ship their products to us. We handle everything efficiently and keep you updated throughout the process."
  },
  {
    category: "Service",
    question: "How long does the entire process take?",
    answer: "Standard turnaround is 3-5 business days from when we receive your products. We also offer a 24-hour rush service for urgent deadlines."
  },
  {
    category: "Delivery",
    question: "What file formats will I receive?",
    answer: "We deliver high-resolution JPEGs for web use and TIFFs for print. If you choose our Pro package, we also include the RAW files."
  },
  {
    category: "Pricing",
    question: "Are there any hidden fees?",
    answer: "Absolutely not. Our pricing is all-inclusive covering studio time, equipment, photographer, styling, and retouching. Return shipping is calculated at checkout."
  },
  {
    category: "Revisions",
    question: "What if I don't like the photos?",
    answer: "We offer a 100% satisfaction guarantee. If the photos don't match your approved moodboard, we'll reshoot them for free. We also include revisions for retouching."
  },
  {
    category: "Service",
    question: "What products do you photograph?",
    answer: "We photograph all types of products including electronics, cosmetics, fashion, food, jewelry, and home goods. If it fits in a box, we can photograph it."
  },
  {
    category: "Pricing",
    question: "Do you offer bulk discounts?",
    answer: "Yes! Contact us for custom pricing on orders of 10+ products. We also offer ongoing partnership rates for brands with regular photography needs."
  },
  {
    category: "Delivery",
    question: "How will I receive my photos?",
    answer: "Photos are delivered via a secure online gallery where you can download, share, and organize your images. You'll receive an email notification when they're ready."
  }
];

const CATEGORIES = ["All", "Service", "Delivery", "Pricing", "Revisions"];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFAQs = FAQ_DATA.filter(item => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-2xl sm:text-3xl">photos</span>
          </Link>
          <Link href="/" className="flex items-center gap-2 text-rush-gray hover:text-rush-dark font-medium">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E63946]/10 text-[#E63946] text-sm font-bold mb-6"
          >
            <MessageCircle className="w-4 h-4" />
            Common Questions
          </motion.div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-rush-dark mb-6">
            How can we help you?
          </h1>
          <p className="text-lg text-rush-gray mb-8">
            Find answers to commonly asked questions about our services
          </p>

          {/* Search */}
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rush-gray" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-rush-border focus:border-[#E63946] outline-none text-rush-dark font-medium"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-rush-border">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#E63946] text-white shadow-lg shadow-[#E63946]/20"
                    : "bg-gray-100 text-rush-gray hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border-2 border-rush-border rounded-2xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full p-6 flex items-center justify-between text-left"
                >
                  <div className="flex-1">
                    <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider mb-2 block">
                      {item.category}
                    </span>
                    <h3 className="text-lg font-bold text-rush-dark pr-4">
                      {item.question}
                    </h3>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    openIndex === index ? "bg-[#E63946] text-white" : "bg-gray-100 text-rush-dark"
                  }`}>
                    {openIndex === index ? (
                      <Minus className="w-4 h-4" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                  </div>
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-rush-gray leading-relaxed">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-rush-gray font-medium">
                No questions found matching your search.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-rush-dark mb-4">
            Still have questions?
          </h2>
          <p className="text-rush-gray mb-8">
            Our team is here to help you get started
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:hello@rush.photos"
              className="px-8 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
            >
              Contact Support
            </a>
            <Link
              href="/order"
              className="px-8 py-4 bg-white border-2 border-rush-border text-rush-dark font-bold rounded-xl hover:border-gray-300 transition-colors"
            >
              Start Your Project
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
