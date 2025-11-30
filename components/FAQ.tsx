"use client";

import { useState } from "react";
import { ChevronDown, MessageCircle, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How long does it take to receive my product photos?",
    answer: "Standard turnaround is 3-5 business days from when we receive your product. Rush delivery (24-48 hours) is available for an additional fee. Most clients receive their professional product photos within one week of shipping their items to us.",
  },
  {
    question: "What happens to my product after the photo shoot?",
    answer: "We carefully package and ship your product back to you within 24 hours of completing the shoot. Return shipping is included in all packages at no extra cost. We treat every product with the utmost care and use professional packaging materials.",
  },
  {
    question: "Can I request revisions on my product photos?",
    answer: "Yes! Our Triple and Complete packages include unlimited revisions until you're 100% satisfied. Single and Double packages include 2 revisions each. We want you to be completely happy with your professional product photography.",
  },
  {
    question: "What file formats do I receive for my product photos?",
    answer: "You'll receive high-resolution JPG files (4K+) optimized for both web and print use. Files are delivered via secure download link. RAW files are included with the Complete package for maximum editing flexibility.",
  },
  {
    question: "Do you offer bulk discounts for multiple products?",
    answer: "Yes! Contact us for custom pricing on orders of 10+ products. We also offer ongoing partnership rates for brands with regular photography needs, including monthly retainer packages for ecommerce businesses.",
  },
  {
    question: "What if I'm not satisfied with my product photos?",
    answer: "We offer a 100% satisfaction guarantee on all packages. If you're not happy with the results, we'll reshoot for free or provide a full refund. Your satisfaction is our top priority, and we've maintained a 4.9/5 rating from over 500 brands.",
  },
  {
    question: "How much does professional product photography cost?",
    answer: "Our packages range from $89 for a single style to $280 for our complete package with all 4 photography styles. This includes professional studio photography, expert retouching, high-resolution files, and free return shipping of your products.",
  },
  {
    question: "What types of products can you photograph?",
    answer: "We photograph all types of products including electronics, cosmetics, fashion accessories, jewelry, home goods, food packaging, supplements, and more. If it fits in a shipping box, we can capture it beautifully. We specialize in ecommerce product photography for Amazon, Shopify, and other platforms.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      id="faq" 
      className="py-24 md:py-32 bg-[#FFFAF5] relative overflow-hidden"
      aria-labelledby="faq-heading"
      itemScope 
      itemType="https://schema.org/FAQPage"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#E54A4A]/5 to-transparent" aria-hidden="true" />
      
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left - Header */}
          <header className="lg:sticky lg:top-32">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#E54A4A]/10 text-[#E54A4A] text-sm font-semibold rounded-full mb-4">
              <HelpCircle className="w-4 h-4" aria-hidden="true" />
              Frequently Asked Questions
            </span>
            <h2 id="faq-heading" className="text-4xl md:text-5xl font-bold text-[#1a1a1a] mb-6">
              Common <span className="gradient-text">questions</span>
            </h2>
            <p className="text-[#1a1a1a]/60 text-lg mb-8">
              Everything you need to know about our professional product photography service. 
              Can&apos;t find what you&apos;re looking for?
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white font-semibold rounded-full hover:bg-[#E54A4A] transition-colors"
              aria-label="Contact us for more questions"
            >
              <MessageCircle className="w-4 h-4" aria-hidden="true" />
              Contact Us
            </a>
            
            {/* Trust signals */}
            <div className="mt-8 p-4 bg-white rounded-xl border border-[#E54A4A]/10">
              <p className="text-sm text-[#1a1a1a]/60">
                <strong className="text-[#1a1a1a]">Need quick answers?</strong>
                <br />
                Call us at <a href="tel:+19734279393" className="text-[#E54A4A] font-semibold hover:underline">973-427-9393</a>
                <br />
                Mon-Fri, 9am-6pm EST
              </p>
            </div>
          </header>

          {/* Right - Accordion (Semantic FAQ markup) */}
          <div className="space-y-4" role="list" aria-label="Frequently asked questions">
            {faqs.map((faq, index) => (
              <article
                key={index}
                className={`bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'shadow-lg shadow-[#E54A4A]/10' : 'shadow-sm'
                }`}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
                role="listitem"
              >
                <h3>
                  <button
                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                    aria-expanded={openIndex === index}
                    aria-controls={`faq-answer-${index}`}
                    id={`faq-question-${index}`}
                  >
                    <span className="font-semibold text-[#1a1a1a] pr-4" itemProp="name">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#E54A4A] flex-shrink-0 transition-transform duration-300 ${
                        openIndex === index ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div 
                  id={`faq-answer-${index}`}
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={openIndex !== index}
                >
                  <p className="px-6 pb-5 text-[#1a1a1a]/60 leading-relaxed" itemProp="text">
                    {faq.answer}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-[#1a1a1a]/60 mb-4">
            Still have questions? We&apos;re here to help!
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@rush.photos"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E54A4A] text-white font-semibold rounded-full hover:bg-[#c93d3d] transition-colors"
            >
              Email Us
            </a>
            <a
              href="https://wa.me/19734279393"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#22c55e] transition-colors"
            >
              WhatsApp Chat
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
