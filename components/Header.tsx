"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ArrowRight, Menu, User, LogOut, Camera, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
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
  { name: "Work", href: "/#portfolio" },
  { name: "Process", href: "/#process" },
  { name: "Pricing", href: "/#pricing" },
  { name: "FAQ", href: "/#faq" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 50], [0, 1]);
  const headerY = useTransform(scrollY, [0, 50], [-20, 0]);
  const backdropBlur = useTransform(scrollY, [0, 50], ["blur(0px)", "blur(12px)"]);

  const pathname = usePathname();

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
    <>
      {/* Promo Banner with shimmer effect */}
      <AnimatePresence>
        {showPromo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative overflow-hidden bg-[#FFB84C] text-ink z-[60]"
          >
            <div className="absolute inset-0 bg-white/20 skew-x-12 animate-shimmer" />
            <div className="container relative py-2 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium tracking-wide">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-ink/70" />
              <span>Limited Offer: <span className="font-bold">30% OFF</span> Full Package</span>
              <div className="h-4 w-px bg-black/10 mx-2" />
              <Link
                href="/order?package=fullpackage"
                className="inline-flex items-center gap-1 font-bold hover:underline decoration-black/50 underline-offset-2 transition-all"
              >
                Claim Now
                <ArrowRight className="w-3 h-3" />
              </Link>
              <button
                onClick={() => setShowPromo(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Header */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-colors duration-500"
        style={{
          backdropFilter: backdropBlur,
          backgroundColor: useTransform(scrollY, [0, 100], ["rgba(5,5,5,0)", "rgba(5,5,5,0.8)"]),
          borderBottom: useTransform(scrollY, [0, 100], ["1px solid rgba(255,255,255,0)", "1px solid rgba(255,255,255,0.05)"])
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between h-20 sm:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-50">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-warm rounded-xl opacity-20 group-hover:opacity-100 transition-opacity duration-500 blur-md" />
                <div className="relative w-full h-full bg-honey rounded-xl flex items-center justify-center shadow-lg shadow-honey/20 group-hover:scale-105 transition-transform duration-300">
                  <Camera className="w-5 h-5 text-ink" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl text-white tracking-tight leading-none group-hover:text-honey transition-colors duration-300">Rush</span>
                <span className="text-[10px] font-medium text-mist tracking-[0.2em] group-hover:tracking-[0.3em] transition-all duration-300">STUDIOS</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 p-1 rounded-full border border-white/5 bg-white/5 backdrop-blur-md">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-6 py-2.5 text-sm font-medium text-mist hover:text-white transition-colors rounded-full group overflow-hidden"
                >
                  <span className="relative z-10">{link.name}</span>
                  <motion.div
                    className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    layoutId="navbar-hover"
                  />
                </Link>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              {/* Auth */}
              {!isLoading && (
                <div className="hidden md:block">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 transition-all group"
                      >
                        {user.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-honey/50 transition-all"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-honey to-honey-dark flex items-center justify-center text-ink font-bold shadow-lg shadow-honey/20">
                            {user.name?.charAt(0)?.toUpperCase()}
                          </div>
                        )}
                        <span className="text-sm font-medium text-white group-hover:text-honey transition-colors">
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
                              className="absolute right-0 top-full mt-4 w-64 glass-panel rounded-2xl p-2 z-50 overflow-hidden"
                            >
                              <div className="px-4 py-3 border-b border-white/5 mb-2">
                                <p className="font-medium text-sm text-white truncate">{user.name}</p>
                                <p className="text-xs text-mist truncate">{user.email}</p>
                              </div>
                              <Link
                                href="/admin"
                                className="flex items-center gap-3 px-4 py-3 text-sm text-mist hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                              >
                                <User className="w-4 h-4" />
                                Dashboard
                              </Link>
                              <button
                                onClick={handleLogout}
                                className="flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl w-full transition-colors"
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
                      className="text-sm font-medium text-mist hover:text-white transition-colors px-4 py-2"
                    >
                      Login
                    </Link>
                  )}
                </div>
              )}

              {/* Enhanced CTA Button */}
              <Link
                href="/order"
                className="hidden sm:inline-flex relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-honey/50 focus:ring-offset-2 focus:ring-offset-ink"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-honey px-5 py-2.5 text-sm font-bold text-ink backdrop-blur-3xl transition-all group-hover:bg-honey-light">
                  Start Project <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-white/10 hover:bg-white/10 transition-colors z-50 relative"
                aria-label="Menu"
              >
                <motion.div
                  animate={{ rotate: menuOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {menuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
                </motion.div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Full Screen Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink/95 backdrop-blur-xl lg:hidden flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-8 mb-12">
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
                    className="text-4xl font-bold text-white hover:text-honey transition-colors tracking-tight"
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
              className="flex flex-col items-center gap-6"
            >
              {!user && (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-lg font-medium text-mist hover:text-white"
                >
                  Login
                </Link>
              )}
              <Link
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="px-8 py-4 bg-honey text-ink text-lg font-bold rounded-full hover:bg-honey-light transition-colors"
              >
                Start Your Project
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
