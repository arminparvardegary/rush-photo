"use client";

import Link from "next/link";
import { Camera, ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  services: [
    { name: "E-commerce Photos", href: "/order?package=ecommerce" },
    { name: "Lifestyle Shoots", href: "/order?package=lifestyle" },
    { name: "Full Package", href: "/order?package=fullpackage" },
    { name: "Custom Projects", href: "#contact" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Process", href: "#process" },
    { name: "Pricing", href: "#pricing" },
    { name: "FAQ", href: "#faq" },
  ],
  rushFamily: [
    { name: "Rush.graphics", href: "https://rushgraphics.com", external: true },
    { name: "Rush.photos", href: "/", active: true },
    { name: "Rush.vision", href: null, soon: true },
    { name: "Rush.videos", href: null, soon: true },
  ],
};

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com/rushgraphics",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/rushgraphics",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/rushgraphics",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-charcoal overflow-hidden">
      {/* Top divider */}
      <div className="divider-gradient" />

      {/* Main content */}
      <div className="container py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-12 h-12 bg-honey rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-6 h-6 text-ink" />
              </div>
              <div>
                <span className="text-cloud font-bold text-xl">Rush</span>
                <span className="text-honey font-bold text-xl">.photo</span>
              </div>
            </Link>
            <p className="text-smoke text-sm mb-6 max-w-xs leading-relaxed">
              Professional product photography for brands that want to stand out.
              Studio-quality photos delivered in days, not weeks.
            </p>

            {/* Contact info */}
            <div className="space-y-3">
              <a
                href="mailto:hello@rush.photos"
                className="flex items-center gap-3 text-sm text-mist hover:text-honey transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@rush.photos
              </a>
              <a
                href="tel:973-427-9393"
                className="flex items-center gap-3 text-sm text-mist hover:text-honey transition-colors"
              >
                <Phone className="w-4 h-4" />
                973-427-9393
              </a>
              <div className="flex items-start gap-3 text-sm text-smoke">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>
                  1122 Goffle Rd.
                  <br />
                  Hawthorne, NJ 07506
                </span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-cloud font-semibold mb-5 text-sm uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-smoke text-sm hover:text-honey transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-cloud font-semibold mb-5 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-smoke text-sm hover:text-honey transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rush Family */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-cloud font-semibold mb-5 text-sm uppercase tracking-wider">
              Rush Family
            </h4>
            <ul className="space-y-3">
              {footerLinks.rushFamily.map((link) => (
                <li key={link.name}>
                  {link.href ? (
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className={`text-sm transition-colors inline-flex items-center gap-1 group ${
                        link.active
                          ? "text-honey font-medium"
                          : "text-smoke hover:text-honey"
                      }`}
                    >
                      {link.name}
                      {link.external && (
                        <ArrowUpRight className="w-3 h-3 opacity-50" />
                      )}
                    </a>
                  ) : (
                    <span className="text-smoke/50 text-sm flex items-center gap-2">
                      {link.name}
                      <span className="text-[10px] uppercase tracking-wider text-smoke/40 px-1.5 py-0.5 bg-white/5 rounded">
                        Soon
                      </span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter/Social - spans remaining space on larger screens */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-cloud font-semibold mb-5 text-sm uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-mist hover:text-honey hover:bg-honey/10 transition-all"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-smoke/60 text-sm">
              © {new Date().getFullYear()} Rush Photos. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-smoke/60 text-sm hover:text-mist transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-smoke/60 text-sm hover:text-mist transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative gradient */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-honey/5 rounded-full blur-[100px] pointer-events-none" />
    </footer>
  );
}
