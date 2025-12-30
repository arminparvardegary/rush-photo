"use client";

import { motion } from "framer-motion";
import { Camera, Instagram, Twitter, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-white pt-24 pb-8 border-t border-rush-border overflow-hidden">
      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E63946] to-[#FF6B6B] flex items-center justify-center text-white shadow-lg shadow-[#E63946]/30">
                <span className="font-black text-lg">R</span>
              </div>
              <span className="text-2xl font-bold text-rush-dark tracking-tight">Rush Photo</span>
            </Link>
            <p className="text-rush-gray leading-relaxed max-w-sm">
              Professional product photography for brands that refuse to blend in.
              Elevating e-commerce through high-quality visuals.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-rush-light flex items-center justify-center text-rush-gray hover:bg-[#E63946] hover:text-white transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-rush-dark">Services</h4>
            <ul className="space-y-4">
              {["E-commerce", "Editorial", "Social Media", "360 Spin", "Stop Motion"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-rush-gray hover:text-[#E63946] transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-rush-dark">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Process", "Pricing", "Careers", "Contact"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-rush-gray hover:text-[#E63946] transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-bold text-rush-dark">Stay in the loop</h4>
            <p className="text-rush-gray text-sm">Join our newsletter for visual trends and photography tips.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-rush-light border border-rush-border rounded-full py-3.5 pl-6 pr-14 text-rush-dark focus:outline-none focus:border-[#E63946] transition-colors"
                autoComplete="email"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform"
                type="button"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="p-4 rounded-xl bg-rush-light border border-rush-border flex items-start gap-3">
              <Mail className="w-5 h-5 text-[#E63946] mt-1" />
              <div>
                <p className="text-rush-dark font-bold text-sm">Need help?</p>
                <a href="mailto:hello@rush.photos" className="text-rush-gray text-sm hover:text-[#E63946] transition-colors">hello@rush.photos</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-rush-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-rush-gray text-sm">
            © {new Date().getFullYear()} Rush Studios. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-rush-gray">
            <Link href="#" className="hover:text-rush-dark transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-rush-dark transition-colors">Terms of Service</Link>
          </div>
          <p className="text-rush-gray text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-[#E63946] fill-[#E63946]" /> in NYC
          </p>
        </div>
      </div>
    </footer>
  );
}
