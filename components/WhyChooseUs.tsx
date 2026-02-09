"use client";

import { motion } from "framer-motion";
import { Award, Clock, Shield, TrendingUp } from "lucide-react";

const BENEFITS = [
  {
    number: "1",
    icon: Award,
    title: "Studio-Quality Results",
    description: "Professional photography equipment and expert lighting techniques ensure your products look their absolute best. Every shot is meticulously composed and edited to magazine-quality standards.",
    highlights: ["Phase One Camera Systems", "Professional Lighting Setup", "Expert Retouching"]
  },
  {
    number: "2",
    icon: Clock,
    title: "Lightning-Fast Turnaround",
    description: "We understand the fast-paced nature of e-commerce. Get your professional photos back in 3-5 days, with rush options available for urgent needs. No compromises on quality.",
    highlights: ["3-5 Day Standard", "24hr Rush Available", "Real-Time Progress Updates"]
  },
  {
    number: "3",
    icon: Shield,
    title: "Risk-Free Process",
    description: "Your satisfaction is our priority. We offer unlimited revisions until you're completely happy with the results. Full insurance coverage for your products while in our care.",
    highlights: ["Unlimited Revisions", "Insured Shipping", "Money-Back Guarantee"]
  },
  {
    number: "4",
    icon: TrendingUp,
    title: "Proven to Boost Sales",
    description: "High-quality product photography directly impacts conversion rates. Our clients see an average 45% increase in sales after upgrading their product images.",
    highlights: ["+45% Average Sales Lift", "Higher AOV", "Reduced Returns"]
  }
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 md:py-32 bg-white border-t border-gray-200">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
              Why choose Rush Photo?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl leading-relaxed">
              We combine speed, quality, and reliability to deliver product photography 
              that drives real business results. Here's what sets us apart.
            </p>
          </motion.div>
        </div>

        {/* Benefits */}
        <div className="space-y-12">
          {BENEFITS.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col md:flex-row gap-8 pb-12 border-b border-gray-200 last:border-b-0"
            >
              {/* Number & Icon */}
              <div className="flex-shrink-0 flex items-start gap-4">
                <div className="w-20 h-20 bg-[#E63946] flex items-center justify-center">
                  <span className="text-4xl font-bold text-white font-mono">
                    {benefit.number}
                  </span>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-[#E63946] mt-2">
                  <benefit.icon className="w-8 h-8" />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>

                {/* Highlights */}
                <div className="flex flex-wrap gap-3">
                  {benefit.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="inline-block px-4 py-2 bg-gray-50 text-gray-700 text-sm font-medium border border-gray-200 rounded-lg"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16 pt-16 border-t border-gray-200"
        >
          <p className="text-lg text-gray-700 mb-6">
            Ready to see the difference professional photography can make?
          </p>
          <a
            href="/order"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-[#E63946] rounded-full hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </section>
  );
}
