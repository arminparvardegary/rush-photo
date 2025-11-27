"use client";

import { useState } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FFFAF5]/80 backdrop-blur-md border-b border-[#E54A4A]/10">
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="/" className="relative z-50 flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-xl flex items-center justify-center shadow-lg shadow-[#E54A4A]/20 group-hover:scale-105 transition-transform">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-[#1a1a1a] font-bold text-lg">Rush</span>
                <span className="text-[#E54A4A] font-bold text-lg">.photo</span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              <a href="#work" className="text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-colors font-medium">Styles</a>
              <a href="#process" className="text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-colors font-medium">Process</a>
              <a href="#pricing" className="text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-colors font-medium">Pricing</a>
              <a href="/order" className="px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full hover:shadow-lg hover:shadow-[#E54A4A]/30 transition-all hover:-translate-y-0.5">
                Start Project →
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center"
            >
              <div className="flex flex-col gap-1.5">
                <span className={`w-6 h-0.5 bg-[#1a1a1a] transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`w-6 h-0.5 bg-[#1a1a1a] transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                <span className={`w-6 h-0.5 bg-[#1a1a1a] transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#FFFAF5] lg:hidden">
          <div className="container h-full flex flex-col justify-center">
            <nav className="space-y-6">
              {['Styles', 'Process', 'Pricing', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block text-4xl font-bold text-[#1a1a1a] hover:text-[#E54A4A] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
