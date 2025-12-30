"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Menu, ShoppingCart, User, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

const NAV_LINKS = [
  { name: "Portfolio", href: "/#portfolio" },
  { name: "Process", href: "/#process" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();

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
    } catch { }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-4 sm:mx-6 mt-4">
        <div className={`max-w-6xl mx-auto transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-xl border border-black/5 shadow-sm" : "bg-white/5 backdrop-blur-xl border border-white/10"} rounded-2xl px-4 sm:px-6 py-3`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="w-10 h-10 bg-gradient-to-br from-[#E63946] to-[#FF6B6B] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63946]/30"
              >
                <span className="text-white font-black text-lg">R</span>
              </motion.div>
              <span className={`font-bold text-lg hidden sm:block ${scrolled ? "text-rush-dark" : "text-rush-dark sm:text-white"}`}>
                Rush Photo
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${scrolled ? "text-rush-gray hover:text-rush-dark hover:bg-black/5" : "text-black/60 hover:text-black hover:bg-white/10"}`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-2 sm:gap-3">
              {!isLoading && (
                <div className="hidden md:block">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className={`flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border transition-all group ${scrolled ? "border-black/10 hover:border-black/20 hover:bg-black/5" : "border-white/10 hover:border-white/20 hover:bg-white/5"}`}
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 bg-gradient-to-br from-[#E63946] to-[#FF6B6B] rounded-full flex items-center justify-center text-xs font-bold text-white">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className={`text-sm font-medium ${scrolled ? "text-rush-dark" : "text-white"}`}>
                          {user.name?.split(" ")[0]}
                        </span>
                      </button>

                      <AnimatePresence>
                        {showUserMenu && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute right-0 top-full mt-4 w-64 bg-white rounded-2xl p-2 z-50 overflow-hidden shadow-xl border border-black/5"
                            >
                              <div className="px-4 py-3 border-b border-black/5 mb-2">
                                <p className="font-medium text-sm text-rush-dark truncate">{user.name}</p>
                                <p className="text-xs text-rush-gray truncate">{user.email}</p>
                              </div>
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-rush-gray hover:text-rush-dark hover:bg-black/5 rounded-xl transition-colors"
                              >
                                <User className="w-4 h-4" />
                                Dashboard
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Logout
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className={`text-sm font-medium transition-colors px-3 py-2 ${scrolled ? "text-rush-gray hover:text-rush-dark" : "text-white/60 hover:text-white"}`}
                    >
                      Log In
                    </Link>
                  )}
                </div>
              )}

              <Link
                href="/order"
                className="bg-[#E63946] text-white text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xl hover:bg-[#D62839] transition-all flex items-center gap-2 shadow-lg shadow-[#E63946]/20"
              >
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Start</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`lg:hidden w-10 h-10 flex items-center justify-center rounded-full border transition-colors z-50 ${scrolled ? "border-black/10 text-rush-dark" : "border-white/10 text-white"}`}
                aria-label="Menu"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center p-4"
          >
            <nav className="flex flex-col items-center gap-6 mb-12 w-full max-w-sm">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-3xl font-bold text-rush-dark hover:text-[#E63946] transition-colors tracking-tight"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col items-center gap-6 w-full max-w-sm"
            >
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-rush-gray hover:text-rush-dark"
                >
                  Login
                </Link>
              )}
              <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="w-full text-center px-8 py-4 bg-[#E63946] text-white text-lg font-bold rounded-2xl hover:bg-[#D62839] transition-colors shadow-lg shadow-[#E63946]/20"
              >
                Start Your Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
