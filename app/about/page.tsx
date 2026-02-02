import type { Metadata } from "next";
import Link from "next/link";
import { Camera, Zap, Award, ArrowRight, MapPin, Phone, Mail, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Rush Photo",
  description: "Professional product photography studio in Hawthorne, NJ. We help ecommerce brands increase conversion with high-end product photography.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-rush-light relative overflow-hidden font-sans">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E63946]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rush-gray/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-xl sm:text-2xl text-rush-dark">photos</span>
          </Link>
          <Link href="/order" className="bg-[#E63946] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#E63946]/20 hover:scale-105 transition-all">Start Your Shoot</Link>
        </div>
      </header>

      {/* Hero */}
      <section className="py-20 sm:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-black text-[#E63946] uppercase tracking-[0.2em] mb-4">Born in the Studio</p>
          <h1 className="text-5xl sm:text-7xl font-black text-rush-dark mb-6 leading-[1.1]">
            We Make Products Look <span className="text-[#E63946]">Irresistible.</span>
          </h1>
          <p className="text-lg text-rush-gray font-medium max-w-2xl mx-auto leading-relaxed">
            Rush Photo is a professional product photography studio helping ecommerce brands increase conversion with cinema-quality, high-speed production.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-y border-rush-border relative z-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { value: "500+", label: "Happy Brands" },
              { value: "10K+", label: "Photos Delivered" },
              { value: "3-5", label: "Days Turnaround" },
              { value: "100%", label: "Satisfaction Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-black text-rush-dark mb-2">{stat.value}</p>
                <div className="w-8 h-1 bg-[#E63946] mx-auto mb-3" />
                <p className="text-xs font-bold text-rush-gray uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-rush-dark mb-4">Crafting Visual Excellence</h2>
            <div className="w-20 h-1.5 bg-rush-border mx-auto rounded-full" />
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "E-commerce Mastery",
                description: "Clean, consistent studio shots on high-white background. Optimized for Amazon, Shopify, and global marketplaces.",
              },
              {
                icon: Zap,
                title: "Lifestyle Concepts",
                description: "Cinematic, high-conversion scenes with professional propping and creative direction that tells your story.",
              },
              {
                icon: Award,
                title: "Premium Content",
                description: "End-to-end production support for high-growth brands needing hundreds of consistent assets weekly.",
              },
            ].map((service) => (
              <div key={service.title} className="p-10 rounded-[2.5rem] bg-white border border-rush-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-rush-light group-hover:bg-[#E63946]/10 flex items-center justify-center mb-6 transition-colors">
                  <service.icon className="w-7 h-7 text-rush-dark group-hover:text-[#E63946] transition-colors" />
                </div>
                <h3 className="text-xl font-black text-rush-dark mb-4">{service.title}</h3>
                <p className="text-rush-gray font-medium text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-rush-dark relative z-10 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-white text-center mb-16">The Rush Workflow</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Select Package", description: "Pick the style and number of angles that fit your brand goals." },
              { step: "02", title: "Instant Booking", description: "Complete checkout in seconds and get your production tracking ID." },
              { step: "03", title: "Studio Arrival", description: "Ship your products to our Hawthorne studio for staging and shoot." },
              { step: "04", title: "Digital Delivery", description: "Review and download your high-res, retouched assets within days." },
            ].map((item, i) => (
              <div key={item.step} className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 flex flex-col justify-between h-full hover:bg-white/10 transition-colors">
                <div>
                  <span className="text-sm font-black text-[#E63946] tracking-[0.3em] mb-4 block">{item.step}</span>
                  <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-sm text-white/50 font-medium leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24 relative z-10 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-[3rem] p-8 sm:p-16 border border-rush-border shadow-2xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E63946]/5 rounded-full -mr-32 -mt-32 blur-[60px]" />

            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-rush-dark mb-4">Visit Our Studio</h2>
              <p className="text-rush-gray font-medium">Have questions? We&apos;re here to help you scale your visual content.</p>
            </div>

            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <div className="flex items-center gap-5 p-6 bg-rush-light rounded-2xl border border-rush-border">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center"><MapPin className="w-5 h-5 text-[#E63946]" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-rush-gray tracking-widest mb-1">Our Location</p>
                  <p className="text-sm font-bold text-rush-dark">1122 Goffle Rd, Hawthorne, NJ</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-6 bg-rush-light rounded-2xl border border-rush-border">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center"><Mail className="w-5 h-5 text-[#E63946]" /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-rush-gray tracking-widest mb-1">Email Us</p>
                  <p className="text-sm font-bold text-rush-dark">hello@rush.photos</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/order" className="flex-1 bg-[#E63946] text-white py-4 rounded-2xl font-black text-center shadow-lg shadow-[#E63946]/20 hover:scale-[1.02] transition-all">Book Your Shoot</Link>
              <a href="tel:973-427-9393" className="flex-1 bg-rush-dark text-white py-4 rounded-2xl font-black text-center hover:bg-rush-dark/90 transition-all flex items-center justify-center gap-2"><Phone className="w-4 h-4" /> 973-427-9393</a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center text-[10px] font-black text-rush-gray uppercase tracking-[0.4em] border-t border-rush-border bg-white mt-12">
        &copy; {new Date().getFullYear()} Rush Photo &bull; Made with passion.
      </footer>
    </main>
  );
}
