"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Search, MessageCircle } from "lucide-react";

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
  }
];

const CATEGORIES = ["All", "Service", "Delivery", "Pricing", "Revisions"];

export default function FAQ() {
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
    <section id="faq" className="relative py-32 bg-ink overflow-hidden opacity-100">
      <div className="container max-w-4xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Common <span className="text-honey font-serif italic">Questions</span>
          </h2>
          <p className="text-mist">Everything you need to know about our process.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mist" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-charcoal border border-white/10 rounded-full py-3 pl-12 pr-6 text-white placeholder-mist focus:outline-none focus:border-honey/50 transition-colors"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat
                    ? "bg-white text-ink"
                    : "bg-white/5 text-mist hover:bg-white/10"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {filteredFAQs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${openIndex === index
                      ? "bg-charcoal border border-honey/20"
                      : "bg-transparent border border-white/5 hover:border-white/10"
                    }`}
                >
                  <div className="flex justify-between items-center gap-4">
                    <span className={`font-medium text-lg ${openIndex === index ? "text-white" : "text-cloud"}`}>
                      {item.question}
                    </span>
                    <span className={`p-2 rounded-full ${openIndex === index ? "bg-honey text-ink" : "bg-white/5 text-mist"}`}>
                      {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </div>
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="pt-4 text-mist leading-relaxed pr-8">
                          {item.answer}
                        </p>
                        <div className="pt-6 mt-4 border-t border-white/5 flex items-center gap-4">
                          <span className="text-xs text-smoke">Was this helpful?</span>
                          <div className="flex gap-2">
                            <button className="px-3 py-1 rounded-full bg-white/5 text-xs hover:bg-white/10 text-mist transition-colors">Yes</button>
                            <button className="px-3 py-1 rounded-full bg-white/5 text-xs hover:bg-white/10 text-mist transition-colors">No</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-mist mb-4">No matching questions found.</p>
              <button className="inline-flex items-center gap-2 text-honey font-medium hover:underline">
                <MessageCircle className="w-4 h-4" /> Chat with us
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
