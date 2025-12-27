"use client";

import { motion } from "framer-motion";
import { Camera, Instagram, Twitter, Linkedin, Mail, ArrowRight, Heart } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-ink pt-24 pb-8 border-t border-white/5 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-honey/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-honey flex items-center justify-center text-ink shadow-lg shadow-honey/20">
                <Camera className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Rush Studios</span>
            </Link>
            <p className="text-mist leading-relaxed max-w-sm">
              Premium product photography for brands that refuse to blend in.
              Elevating e-commerce through cinematic visual storytelling.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-mist hover:bg-white hover:text-ink transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-white">Services</h4>
            <ul className="space-y-4">
              {["E-commerce", "Editorial", "Social Media", "360 Spin", "Stop Motion"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-mist hover:text-honey transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="font-bold text-white">Company</h4>
            <ul className="space-y-4">
              {["About Us", "Process", "Pricing", "Careers", "Contact"].map(item => (
                <li key={item}>
                  <Link href="#" className="text-mist hover:text-honey transition-colors text-sm">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-6">
            <h4 className="font-bold text-white">Stay in the loop</h4>
            <p className="text-mist text-sm">Join our newsletter for visual trends and photography tips.</p>
            <form className="relative group">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full bg-charcoal border border-white/10 rounded-full py-3.5 pl-6 pr-14 text-white focus:outline-none focus:border-honey/50 transition-colors"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-honey rounded-full flex items-center justify-center text-ink hover:scale-105 transition-transform"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-honey mt-1" />
              <div>
                <p className="text-white font-bold text-sm">Need help?</p>
                <a href="mailto:hello@rush.photos" className="text-mist text-sm hover:text-white transition-colors">hello@rush.photos</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-smoke text-sm">
            © {new Date().getFullYear()} Rush Photo Studios. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm text-smoke">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
          <p className="text-smoke text-sm flex items-center gap-1">
            Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in NYC
          </p>
        </div>
      </div>
    </footer>
  );
}
