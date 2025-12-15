"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, MessageCircle, HelpCircle, Mail, Phone } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to receive my product photos?",
    answer:
      "Standard turnaround is 3-5 business days from when we receive your product. Rush delivery (24-48 hours) is available for an additional fee. Most clients receive their professional product photos within one week of shipping their items to us.",
  },
  {
    question: "What happens to my product after the photo shoot?",
    answer:
      "We carefully package and ship your product back to you within 24 hours of completing the shoot. Return shipping is included in all packages at no extra cost. We treat every product with the utmost care and use professional packaging materials.",
  },
  {
    question: "Can I request revisions on my product photos?",
    answer:
      "Yes! Our Full Package includes unlimited revisions until you're 100% satisfied. E-commerce and Lifestyle packages include 2 revisions each. We want you to be completely happy with your professional product photography.",
  },
  {
    question: "What file formats do I receive for my product photos?",
    answer:
      "You'll receive high-resolution JPG files (4K+) optimized for both web and print use. Files are delivered via secure download link. RAW files are included with the Full Package for maximum editing flexibility.",
  },
  {
    question: "Do you offer bulk discounts for multiple products?",
    answer:
      "Yes! Contact us for custom pricing on orders of 10+ products. We also offer ongoing partnership rates for brands with regular photography needs, including monthly retainer packages for ecommerce businesses.",
  },
  {
    question: "What if I'm not satisfied with my product photos?",
    answer:
      "We offer a 100% satisfaction guarantee on all packages. If you're not happy with the results, we'll reshoot for free or provide a full refund. Your satisfaction is our top priority, and we've maintained a 4.9/5 rating from over 500 brands.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      id="faq" 
      className="relative py-32 bg-ink overflow-hidden"
      aria-labelledby="faq-heading"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:sticky lg:top-32"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/10 border border-teal/20 mb-6">
              <HelpCircle className="w-4 h-4 text-teal" />
              <span className="text-sm font-medium text-teal">FAQ</span>
            </div>
            <h2
              id="faq-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-cloud mb-6"
            >
              Common{" "}
              <span className="text-gradient-cool font-serif italic">questions</span>
            </h2>
            <p className="text-lg text-mist mb-10 max-w-md">
              Everything you need to know about our professional product photography
              service. Can&apos;t find what you&apos;re looking for?
            </p>

            <a
              href="#contact"
              className="inline-flex items-center gap-3 px-6 py-3 bg-teal text-ink font-semibold rounded-full hover:bg-teal-light transition-all hover:shadow-[0_10px_30px_rgba(45,212,191,0.25)]"
              aria-label="Contact us for more questions"
            >
              <MessageCircle className="w-5 h-5" aria-hidden="true" />
              Contact Us
            </a>
            
            {/* Contact info */}
            <div className="mt-10 p-6 rounded-2xl bg-charcoal border border-white/10">
              <p className="font-semibold text-cloud mb-4">Need quick answers?</p>
              <div className="space-y-3">
                <a
                  href="tel:+19734279393"
                  className="flex items-center gap-3 text-mist hover:text-teal transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  973-427-9393
                </a>
                <a
                  href="mailto:hello@rush.photos"
                  className="flex items-center gap-3 text-mist hover:text-teal transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  hello@rush.photos
                </a>
              </div>
              <p className="mt-4 text-sm text-smoke">Mon-Fri, 9am-6pm EST</p>
            </div>
          </motion.header>

          {/* Right - Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-4"
            role="list"
            aria-label="Frequently asked questions"
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
              <article
                key={index}
                  className={`rounded-2xl overflow-hidden transition-all duration-300 ${
                    isOpen
                      ? "bg-charcoal border border-teal/20"
                      : "bg-charcoal border border-white/5 hover:border-white/10"
                }`}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                role="listitem"
              >
                <h3>
                  <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                      aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                      <span className="font-semibold text-cloud pr-4" itemProp="name">
                      {faq.question}
                    </span>
                    <ChevronDown 
                        className={`w-5 h-5 text-teal flex-shrink-0 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                  id={`faq-answer-${index}`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                      >
                        <p
                          className="px-6 pb-5 text-mist leading-relaxed"
                          itemProp="text"
                >
                    {faq.answer}
                  </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
              </article>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
