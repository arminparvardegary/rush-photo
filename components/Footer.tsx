"use client";

import { Instagram, Twitter, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const SERVICES = [
    { name: "E-commerce", href: "/order?package=ecommerce" },
    { name: "Lifestyle", href: "/order?package=lifestyle" },
    { name: "Social Media", href: "/order?package=lifestyle" },
    { name: "360 Spin", href: "mailto:hello@rush.photos?subject=360 Spin Inquiry" },
    { name: "Stop Motion", href: "mailto:hello@rush.photos?subject=Stop Motion Inquiry" },
  ];

  const COMPANY = [
    { name: "About Us", href: "/#about" },
    { name: "Process", href: "/#process" },
    { name: "Pricing", href: "/#packages" },
    { name: "Careers", href: "mailto:hello@rush.photos?subject=Careers" },
    { name: "Contact", href: "mailto:hello@rush.photos" },
  ];

  return (
    <footer className="relative bg-white pt-12 sm:pt-16 md:pt-24 pb-6 sm:pb-8 border-t border-rush-border overflow-hidden">
      <div className="container relative z-10 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-8 mb-12 sm:mb-16 md:mb-20">

          {/* Brand Column */}
          <div className="col-span-2 sm:col-span-2 md:col-span-4 lg:col-span-4 space-y-6 sm:space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#FF6B6B] flex items-center justify-center text-white shadow-lg shadow-[#E63946]/30">
                <span className="font-black text-base sm:text-lg">R</span>
              </div>
              <span className="text-xl sm:text-2xl font-bold text-rush-dark tracking-tight">Rush Photo</span>
            </Link>
            <p className="text-sm sm:text-base text-rush-gray leading-relaxed max-w-sm">
              Professional product photography for brands that refuse to blend in.
              Elevating e-commerce through high-quality visuals.
            </p>
            <div className="flex gap-3 sm:gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rush-light flex items-center justify-center text-rush-gray hover:bg-[#E63946] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services Column */}
          <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
            <h4 className="font-bold text-sm sm:text-base text-rush-dark">Services</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {SERVICES.map(item => (
                <li key={item.name}>
                  <Link href={item.href} className="text-rush-gray hover:text-[#E63946] transition-colors text-xs sm:text-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div className="col-span-1 lg:col-span-2 space-y-4 sm:space-y-6">
            <h4 className="font-bold text-sm sm:text-base text-rush-dark">Company</h4>
            <ul className="space-y-2.5 sm:space-y-3">
              {COMPANY.map(item => (
                <li key={item.name}>
                  {item.href.startsWith("mailto") ? (
                    <a href={item.href} className="text-rush-gray hover:text-[#E63946] transition-colors text-xs sm:text-sm font-medium">
                      {item.name}
                    </a>
                  ) : (
                    <Link href={item.href} className="text-rush-gray hover:text-[#E63946] transition-colors text-xs sm:text-sm font-medium">
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="col-span-2 md:col-span-2 lg:col-span-4 space-y-4 sm:space-y-6">
            <h4 className="font-bold text-sm sm:text-base text-rush-dark">Stay in the loop</h4>
            <p className="text-rush-gray text-xs sm:text-sm">Join our newsletter for visual trends and photography tips.</p>
            <form className="relative group" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-rush-light border border-rush-border rounded-full py-3 sm:py-3.5 pl-4 sm:pl-6 pr-12 sm:pr-14 text-sm text-rush-dark focus:outline-none focus:border-[#E63946] transition-colors font-medium"
                autoComplete="email"
              />
              <button
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-[#E63946] rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-md shadow-[#E63946]/20"
                type="submit"
              >
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            </form>
            <div className="p-3 sm:p-4 rounded-xl bg-rush-light border border-rush-border flex items-start gap-3">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-[#E63946] mt-0.5" />
              <div>
                <p className="text-rush-dark font-bold text-xs sm:text-sm">Need help?</p>
                <a href="mailto:hello@rush.photos" className="text-rush-gray text-xs sm:text-sm hover:text-[#E63946] transition-colors font-medium">hello@rush.photos</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-rush-border flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left">
          <p className="text-rush-gray text-xs sm:text-sm font-medium order-2 sm:order-1">
            © {new Date().getFullYear()} Rush Studios. All rights reserved.
          </p>
          <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm text-rush-gray font-bold order-1 sm:order-2">
            <Link href="/privacy" className="hover:text-rush-dark transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-rush-dark transition-colors">Terms of Service</Link>
          </div>
          <p className="text-rush-gray text-xs sm:text-sm font-medium flex items-center gap-1 order-3">
            Made with <Heart className="w-3 h-3 text-[#E63946] fill-[#E63946]" /> in NYC
          </p>
        </div>
      </div>
    </footer>
  );
}
