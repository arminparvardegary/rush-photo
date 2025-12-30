import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rush Photo",
  description: "Privacy policy for Rush Photo - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-rush-light relative overflow-hidden font-sans">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63946]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#E63946] rounded-lg flex items-center justify-center font-black text-white text-sm">R</div>
            <span className="font-bold text-lg text-rush-dark">Rush Photo</span>
          </Link>
          <Link href="/signup" className="bg-rush-dark text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rush-dark/90 transition-all">Get Started</Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16 relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-rush-gray hover:text-rush-dark font-bold transition-colors text-sm mb-12 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="mb-12">
          <div className="w-12 h-12 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Shield className="w-6 h-6 text-teal-600" />
          </div>
          <p className="text-xs font-black text-[#E63946] uppercase tracking-[0.2em] mb-3">Compliance & Trust</p>
          <h1 className="text-4xl sm:text-5xl font-black text-rush-dark mb-4">Privacy Policy</h1>
          <p className="text-rush-gray font-medium text-lg leading-relaxed">
            At Rush Photo, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-rush-border p-8 sm:p-12 shadow-sm space-y-12">
          <section>
            <h2 className="text-xl font-bold text-rush-dark mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#E63946] rounded-full"></span>
              1. Information We Collect
            </h2>
            <p className="text-rush-gray font-medium mb-6 leading-relaxed">We collect information that you provide directly to us, including:</p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {[
                { t: "Contact Info", d: "Name, email, phone, and address" },
                { t: "Account Info", d: "Login credentials and profile details" },
                { t: "Order Info", d: "Product details and preferences" },
                { t: "Payment Data", d: "Processed securely via Stripe" }
              ].map((item, i) => (
                <li key={i} className="bg-rush-light/50 p-4 rounded-2xl border border-rush-border">
                  <p className="font-bold text-rush-dark mb-1">{item.t}</p>
                  <p className="text-xs text-rush-gray font-medium">{item.d}</p>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-rush-dark mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              2. How We Use It
            </h2>
            <p className="text-rush-gray font-medium leading-relaxed mb-6">We use your information to provide cinema-quality photography services and manage your orders effectively.</p>
            <ul className="space-y-3">
              {[
                "Process and fulfill your photography orders",
                "Communicate about order status and account updates",
                "Improve our studio workflows and technology",
                "Ensure platform security and prevent fraud"
              ].map((l, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium text-rush-gray">
                  <Check className="w-4 h-4 text-teal-500 flex-shrink-0" />
                  {l}
                </li>
              ))}
            </ul>
          </section>

          <section className="pt-8 border-t border-rush-border">
            <div className="bg-rush-light rounded-2xl p-6">
              <h3 className="font-bold text-rush-dark mb-2">Questions?</h3>
              <p className="text-sm text-rush-gray font-medium mb-4">Contact our data protection team anytime.</p>
              <div className="flex flex-wrap gap-4">
                <a href="mailto:hello@rush.photos" className="text-[#E63946] font-bold text-sm hover:underline">hello@rush.photos</a>
                <span className="text-rush-border">|</span>
                <a href="tel:973-427-9393" className="text-[#E63946] font-bold text-sm hover:underline">973-427-9393</a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <footer className="py-12 text-center text-xs font-bold text-rush-gray/40 uppercase tracking-widest border-t border-rush-border bg-white mt-12">
        &copy; 2024 Rush Photo. All Rights Reserved.
      </footer>
    </main>
  );
}
