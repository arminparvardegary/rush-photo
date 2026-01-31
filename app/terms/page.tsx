import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Rush Photo",
  description: "Terms of service for Rush Photo - rules and conditions for using our photography services.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-rush-light relative overflow-hidden font-sans">
      {/* Background decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E63946]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-2xl sm:text-3xl text-rush-dark">photos</span>
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
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
            <Scale className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-xs font-black text-[#E63946] uppercase tracking-[0.2em] mb-3">Agreement & Policy</p>
          <h1 className="text-4xl sm:text-5xl font-black text-rush-dark mb-4">Terms of Service</h1>
          <p className="text-rush-gray font-medium text-lg leading-relaxed">
            These terms govern your use of Rush Photo services. By placing an order, you agree to these legal conditions.
          </p>
        </div>

        <div className="bg-white rounded-[2rem] border border-rush-border p-8 sm:p-12 shadow-sm space-y-12">
          <section>
            <h2 className="text-xl font-bold text-rush-dark mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-[#E63946] rounded-full"></span>
              1. Service Agreement
            </h2>
            <p className="text-rush-gray font-medium leading-relaxed">
              Rush Photo provides professional product photography services. Our work includes shooting, high-end retouching, and digital delivery of assets. By engaging our services, you grant us the necessary rights to photograph your products.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-rush-dark mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
              2. Shipping & Handling
            </h2>
            <div className="grid gap-4">
              {[
                "Client is responsible for shipping products to our studio",
                "Products must be insured and properly protected",
                "Return shipping is handled after production is complete",
                "Rush Photo is not liable for items lost in transit to us"
              ].map((l, i) => (
                <div key={i} className="flex gap-4 p-4 bg-rush-light/50 rounded-2xl border border-rush-border">
                  <Check className="w-5 h-5 text-teal-600 flex-shrink-0" />
                  <span className="text-sm font-bold text-rush-dark leading-tight">{l}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-rush-dark mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-teal-500 rounded-full"></span>
              3. Image Rights
            </h2>
            <p className="text-rush-gray font-medium leading-relaxed">
              Upon final payment, you receive full commercial rights to use the photographic assets for marketing, social media, and advertising. We retain the right to showcase the work in our portfolio.
            </p>
          </section>

          <section className="pt-8 border-t border-rush-border">
            <div className="bg-[#E63946]/5 rounded-2xl p-6 border border-[#E63946]/10">
              <h3 className="font-bold text-rush-dark mb-1">Last Updated</h3>
              <p className="text-sm text-rush-gray font-bold">December 2026</p>
            </div>
          </section>
        </div>
      </div>

      <footer className="py-12 text-center text-xs font-bold text-rush-gray/40 uppercase tracking-widest border-t border-rush-border bg-white mt-12">
        &copy; 2026 Rush Photo. All Rights Reserved.
      </footer>
    </main>
  );
}
