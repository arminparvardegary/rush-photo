import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Zap, Award, Users, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Rush Photo",
  description: "Professional product photography studio in Hawthorne, NJ. We help ecommerce brands increase conversion with high-end product photography.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#E54A4A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-[#1a1a1a]">Rush<span className="text-[#E54A4A]">.photo</span></span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#1a1a1a] mb-6">
            We Make Products Look <span className="text-[#E54A4A]">Irresistible</span>
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Rush Photo is a professional product photography studio helping ecommerce brands increase conversion with consistent, high-end imagery.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Happy Brands" },
              { value: "10K+", label: "Photos Delivered" },
              { value: "3-5", label: "Days Turnaround" },
              { value: "100%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-[#1a1a1a]">{stat.value}</p>
                <p className="text-sm text-neutral-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-12">What We Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "E-commerce Photography",
                description: "Clean, professional product shots on white background. Perfect for Amazon, Shopify, and online marketplaces.",
              },
              {
                icon: Zap,
                title: "Lifestyle Photography",
                description: "Styled scenes with props and creative direction that tell your brand story and connect with customers.",
              },
              {
                icon: Award,
                title: "Full Package",
                description: "Complete coverage with both e-commerce and lifestyle shots at a discounted bundle rate.",
              },
            ].map((service) => (
              <div key={service.title} className="p-6 rounded-2xl border border-neutral-200 hover:border-[#E54A4A]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#E54A4A]/10 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-[#E54A4A]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">{service.title}</h3>
                <p className="text-neutral-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-neutral-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a1a1a] text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Package", description: "Select the photography style that fits your needs" },
              { step: "2", title: "Place Order", description: "Tell us about your product and complete checkout" },
              { step: "3", title: "Ship Product", description: "Send your product to our studio or drop it off" },
              { step: "4", title: "Get Photos", description: "Receive high-res images within 3-5 business days" },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-6 border border-neutral-200 h-full">
                  <div className="w-10 h-10 rounded-full bg-[#E54A4A] text-white font-bold flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-[#1a1a1a] mb-2">{item.title}</h3>
                  <p className="text-sm text-neutral-600">{item.description}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-neutral-300 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-[#1a1a1a] rounded-3xl p-8 sm:p-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/70 mb-8 max-w-lg mx-auto">
              Transform your product images and boost your sales. Our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/order"
                className="px-6 py-3 bg-[#E54A4A] text-white font-semibold rounded-lg hover:bg-[#d43d3d] transition-colors flex items-center gap-2"
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:973-427-9393"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
              >
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/60 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>1122 Goffle Rd, Hawthorne, NJ 07506</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@rush.photos" className="hover:text-white">hello@rush.photos</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-500">© {new Date().getFullYear()} Rush Photos. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-neutral-500 hover:text-[#1a1a1a]">Privacy</Link>
            <Link href="/terms" className="text-sm text-neutral-500 hover:text-[#1a1a1a]">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
