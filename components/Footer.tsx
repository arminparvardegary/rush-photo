"use client";

import { Instagram, Twitter, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const LINKS = [
    { name: "How It Works", href: "/process" },
    { name: "Pricing", href: "/#packages" },
    { name: "Portfolio", href: "/#portfolio" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative h-7 w-auto">
                <Image
                  src="/rushlogo.png"
                  alt="Rush"
                  width={120}
                  height={28}
                  className="h-7 w-auto object-contain"
                />
              </div>
              <span className="text-2xl font-bold text-white">photos</span>
            </Link>
            <p className="text-gray-400 leading-relaxed max-w-sm">
              Professional product photography for e-commerce brands. High-quality photos delivered in 3-5 business days.
            </p>
            <div className="flex flex-col gap-3 pt-2">
              <a
                href="mailto:hello@rush.photos"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm">hello@rush.photos</span>
              </a>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {[
                { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E63946] hover:text-white transition-all duration-200"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {LINKS.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white hover:translate-x-1 inline-flex transition-all duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Order CTA */}
          <div>
            <h4 className="font-bold text-white mb-5">Get Started</h4>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Ready for professional product photos? Start your order today and get stunning images in just 3-5 days.
            </p>
            <Link
              href="/order"
              className="inline-flex items-center justify-center px-6 py-3 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] hover:scale-105 transition-all duration-200 shadow-lg shadow-[#E63946]/20"
            >
              Start Your Order
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Rush Studios. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-sm font-medium">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
