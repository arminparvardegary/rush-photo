"use client";

import { useState } from "react";
import { Phone, X, ArrowRight, Sparkles } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);

  return (
    <>
      {/* Promo Banner */}
      {showPromo && (
        <div className="relative bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white py-2.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <div className="container flex items-center justify-center gap-3 text-sm relative">
            <Sparkles className="w-4 h-4 text-[#E54A4A]" />
            <span className="font-medium">Limited Time Offer:</span>
            <span className="px-2 py-0.5 bg-[#E54A4A] rounded-full text-xs font-bold">30% OFF</span>
            <span className="hidden sm:inline text-white/80">Complete Package</span>
            <a 
              href="/order" 
              className="hidden sm:inline-flex items-center gap-1 ml-2 text-[#E54A4A] hover:text-[#ff7f7f] font-semibold transition-colors"
            >
              Claim Now
              <ArrowRight className="w-3 h-3" />
            </a>
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close promotion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Static Header */}
      <header className="relative bg-transparent">
        <div className="container">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E54A4A]/25 group-hover:shadow-[#E54A4A]/40 group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                <span className="text-white font-black text-2xl lg:text-3xl relative">R</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-baseline">
                  <span className="font-black text-xl lg:text-2xl text-[#1a1a1a] tracking-tight">Rush</span>
                  <span className="font-black text-xl lg:text-2xl text-[#E54A4A] tracking-tight">.photo</span>
                </div>
                <span className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/50">
                  Professional Photography
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
              {[
                { name: 'Styles', href: '#work' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Process', href: '#process' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'FAQ', href: '#faq' },
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="relative px-4 py-2 text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-all font-medium text-sm rounded-full hover:bg-white group"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="tel:973-427-9393" 
                className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#E54A4A]/10 flex items-center justify-center group-hover:bg-[#E54A4A]/20 transition-colors">
                  <Phone className="w-4 h-4 text-[#E54A4A]" />
                </div>
                <span className="hidden xl:inline text-sm font-medium">973-427-9393</span>
              </a>
              
              <a 
                href="/order" 
                className="relative group overflow-hidden px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/30 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Start Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                menuOpen 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-[#1a1a1a] shadow-sm hover:bg-[#E54A4A]/10'
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-0' : ''
                }`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full screen overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        menuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-24 pb-8 px-6">
            {/* Nav Links */}
            <nav className="flex-1 space-y-1">
              {[
                { name: 'Styles', href: '#work' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Process', href: '#process' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'FAQ', href: '#faq' },
                { name: 'Contact', href: '#contact' },
              ].map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-4 px-4 text-2xl font-bold text-[#1a1a1a] hover:text-[#E54A4A] hover:bg-[#E54A4A]/5 rounded-xl transition-all duration-300 ${
                    menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${index * 50 + 100}ms` : '0ms' }}
                >
                  {item.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </nav>
            
            {/* Bottom CTA */}
            <div className={`space-y-3 transition-all duration-500 ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}>
              <a 
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-2xl shadow-lg shadow-[#E54A4A]/25"
              >
                <Sparkles className="w-5 h-5" />
                Start Project
              </a>
              <a 
                href="tel:973-427-9393"
                className="flex items-center justify-center gap-3 py-4 border-2 border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] font-medium hover:border-[#E54A4A] hover:text-[#E54A4A] transition-colors"
              >
                <Phone className="w-5 h-5" />
                973-427-9393
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
