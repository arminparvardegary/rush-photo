"use client";

import { Instagram, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-black text-white">rush</span>
              <span className="text-lg font-bold text-white">photos</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional product photography for e-commerce brands.
            </p>
            {/* Social Links */}
            <div className="flex gap-2 pt-1">
              {[
                { icon: Instagram, href: "#", label: "Instagram" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#E63946] hover:text-white transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Quick Links</h4>
            <ul className="space-y-2.5">
              {LINKS.map(item => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Start Order CTA */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-4">Get Started</h4>
            <p className="text-gray-400 text-sm mb-4">
              Ready for professional product photos?
            </p>
            <Link
              href="/order"
              className="inline-flex items-center px-5 py-2.5 bg-[#E63946] text-white font-semibold rounded-lg hover:bg-[#D62839] transition-colors text-sm"
            >
              Start Your Order
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
            <p className="text-gray-500">
              © {new Date().getFullYear()} Rush Studios
            </p>
            <div className="flex items-center gap-5">
              <Link href="/privacy" className="text-gray-500 hover:text-white transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-gray-500 hover:text-white transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
