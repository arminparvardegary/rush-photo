import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Zap, Award, ArrowRight, MapPin, Phone, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Rush Photo",
  description: "Professional product photography studio in Hawthorne, NJ. We help ecommerce brands increase conversion with high-end product photography.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-honey to-honey/80 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-white">Rush<span className="text-honey">.photo</span></span>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            We Make Products Look <span className="text-honey">Irresistible</span>
          </h1>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Rush Photo is a professional product photography studio helping ecommerce brands increase conversion with consistent, high-end imagery.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Happy Brands" },
              { value: "10K+", label: "Photos Delivered" },
              { value: "3-5", label: "Days Turnaround" },
              { value: "100%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-honey">{stat.value}</p>
                <p className="text-sm text-white/50 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">What We Do</h2>
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
              <div key={service.title} className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-honey/30 hover:bg-white/10 transition-all">
                <div className="w-12 h-12 rounded-xl bg-honey/20 flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-honey" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{service.title}</h3>
                <p className="text-white/60 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white/5 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Choose Package", description: "Select the photography style that fits your needs" },
              { step: "2", title: "Place Order", description: "Tell us about your product and complete checkout" },
              { step: "3", title: "Ship Product", description: "Send your product to our studio or drop it off" },
              { step: "4", title: "Get Photos", description: "Receive high-res images within 3-5 business days" },
            ].map((item, i) => (
              <div key={item.step} className="relative">
                <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-white/10 h-full">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-honey to-honey/80 text-black font-bold flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-white/60">{item.description}</p>
                </div>
                {i < 3 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 text-white/30 -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-honey/20 to-teal/10 rounded-3xl p-8 sm:p-12 text-center border border-white/10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/60 mb-8 max-w-lg mx-auto">
              Transform your product images and boost your sales. Our team is ready to help.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                href="/order"
                className="px-6 py-3 bg-gradient-to-r from-honey to-honey/90 text-black font-semibold rounded-lg hover:shadow-lg hover:shadow-honey/20 transition-all flex items-center gap-2"
              >
                Start Your Project <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="tel:973-427-9393"
                className="px-6 py-3 bg-white/10 text-white font-semibold rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2 border border-white/20"
              >
                <Phone className="w-4 h-4" /> Call Us
              </a>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-white/50 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>1122 Goffle Rd, Hawthorne, NJ 07506</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@rush.photos" className="hover:text-honey transition-colors">hello@rush.photos</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/50">© {new Date().getFullYear()} Rush Photos. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/50 hover:text-honey transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-white/50 hover:text-honey transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
