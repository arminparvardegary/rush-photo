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
    <section id="faq" className="relative py-16 sm:py-24 md:py-32 bg-white overflow-hidden">
      <div className="container max-w-4xl relative z-10 px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-rush-dark mb-4 sm:mb-6 tracking-tight">
            Common <span className="text-[#E63946]">Questions</span>
          </h2>
          <p className="text-rush-gray text-sm sm:text-base">Everything you need to know about our process.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-rush-gray" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-rush-light border border-rush-border rounded-full py-3 pl-11 sm:pl-12 pr-4 sm:pr-6 text-sm sm:text-base text-rush-dark placeholder-rush-gray focus:outline-none focus:border-[#E63946] transition-colors font-medium"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${activeCategory === cat
                  ? "bg-[#E63946] text-white"
                  : "bg-rush-light text-rush-gray hover:bg-rush-border"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-3 sm:space-y-4">
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
                  className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 ${openIndex === index
                    ? "bg-rush-light border border-[#E63946]/20"
                    : "bg-white border border-rush-border hover:border-rush-gray-light"
                    }`}
                >
                  <div className="flex justify-between items-start sm:items-center gap-3 sm:gap-4">
                    <span className="font-bold text-base sm:text-lg text-rush-dark leading-snug">
                      {item.question}
                    </span>
                    <span className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${openIndex === index ? "bg-[#E63946] text-white" : "bg-rush-light text-rush-gray"}`}>
                      {openIndex === index ? <Minus className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
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
                        <p className="pt-3 sm:pt-4 text-sm sm:text-base text-rush-gray leading-relaxed pr-6 sm:pr-8 font-medium">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <p className="text-rush-gray mb-4 text-sm sm:text-base">No matching questions found.</p>
              <button className="inline-flex items-center gap-2 text-[#E63946] font-bold hover:underline text-sm sm:text-base">
                <MessageCircle className="w-4 h-4" /> Chat with us
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
