"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Menu, User, LogOut, Camera } from "lucide-react";
import Link from "next/link";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

const NAV_LINKS = [
  { name: "Work", href: "#portfolio" },
  { name: "Pricing", href: "#pricing" },
  { name: "Process", href: "#process" },
  { name: "FAQ", href: "#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) setUser(data.user);
        }
      } catch {
        // Not logged in
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setShowUserMenu(false);
      window.location.href = "/";
    } catch {}
  };

  return (
    <>
      {/* Promo Banner */}
      <AnimatePresence>
      {showPromo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-gradient-to-r from-honey via-honey-light to-honey text-ink text-center overflow-hidden"
          >
            <div className="py-2.5 px-4 relative flex items-center justify-center gap-2 text-sm font-medium">
              <span className="opacity-80">Limited time:</span>
              <span className="font-bold">30% OFF</span>
              <span className="opacity-80">on Full Package</span>
              <Link
                href="/order?package=fullpackage"
                className="ml-2 inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:no-underline"
              >
                Shop now
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
          <button 
            onClick={() => setShowPromo(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Close"
          >
                <X className="w-4 h-4" />
          </button>
        </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-ink/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/10"
            : "bg-transparent"
        }`}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-honey rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5 text-ink" />
              </div>
              <div className="flex items-baseline gap-0.5">
                <span className="font-bold text-xl text-cloud tracking-tight">Rush</span>
                <span className="font-bold text-xl text-honey tracking-tight">.photo</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-5 py-2.5 text-sm font-medium text-mist hover:text-cloud transition-colors rounded-full hover:bg-white/5"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* Auth */}
              {!isLoading && (
                <>
                  {user ? (
                    <div className="relative hidden md:block">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-white/5 transition-colors"
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-honey/30"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-honey flex items-center justify-center">
                            <span className="text-ink text-sm font-bold">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )}
                        <span className="text-sm font-medium text-cloud hidden lg:inline">
                          {user.name?.split(" ")[0] || "Account"}
                        </span>
                      </button>

                      <AnimatePresence>
                      {showUserMenu && (
                        <>
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setShowUserMenu(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute right-0 top-full mt-2 w-56 bg-charcoal rounded-2xl shadow-xl border border-white/10 py-2 z-50 overflow-hidden"
                            >
                              <div className="px-4 py-3 border-b border-white/10">
                                <p className="font-semibold text-sm text-cloud truncate">
                                  {user.name}
                                </p>
                                <p className="text-xs text-smoke truncate">{user.email}</p>
                            </div>
                              <div className="py-1">
                                <Link
                                  href="/admin"
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-mist hover:text-cloud hover:bg-white/5 transition-colors"
                                  onClick={() => setShowUserMenu(false)}
                                >
                                  <User className="w-4 h-4" />
                                  Dashboard
                                </Link>
                                <button
                                  onClick={handleLogout}
                                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full transition-colors"
                                >
                                  <LogOut className="w-4 h-4" />
                                  Logout
                            </button>
                          </div>
                            </motion.div>
                        </>
                      )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="hidden md:block text-sm font-medium text-mist hover:text-cloud transition-colors px-4 py-2"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}

              {/* CTA Button */}
              <Link
                href="/order" 
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 bg-honey text-ink text-sm font-semibold rounded-full hover:bg-honey-light transition-all hover:shadow-[0_10px_30px_rgba(245,166,35,0.25)]"
              >
                Start Project
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-cloud" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
      {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-80 max-w-full bg-charcoal z-50 lg:hidden flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-white/10">
                <span className="font-bold text-cloud">Menu</span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-cloud" />
              </button>
            </div>

              {/* User info */}
            {user && (
                <div className="p-5 border-b border-white/10">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-honey flex items-center justify-center">
                        <span className="text-ink font-bold">{user.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                      <p className="font-semibold text-cloud">{user.name}</p>
                      <p className="text-sm text-smoke">{user.email}</p>
                    </div>
                </div>
              </div>
            )}

              {/* Nav Links */}
              <nav className="flex-1 p-5">
                <div className="space-y-1">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                  onClick={() => setMenuOpen(false)}
                      className="block py-3 px-4 text-cloud font-medium hover:bg-white/5 rounded-xl transition-colors"
                >
                      {link.name}
                </a>
              ))}
                </div>
            </nav>

              {/* Bottom Actions */}
              <div className="p-5 space-y-3 border-t border-white/10">
              {user ? (
                <>
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-cloud hover:bg-white/5 rounded-xl transition-colors"
                    >
                      <User className="w-4 h-4" />
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        handleLogout();
                      }}
                      className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                  </button>
                </>
              ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block text-center py-3 text-sm font-medium text-cloud hover:bg-white/5 rounded-xl transition-colors"
                  >
                  Login
                  </Link>
              )}
                <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3.5 bg-honey text-ink font-semibold rounded-xl hover:bg-honey-light transition-colors"
              >
                Start Project
                <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
            </motion.div>
          </>
      )}
      </AnimatePresence>
    </>
  );
}
