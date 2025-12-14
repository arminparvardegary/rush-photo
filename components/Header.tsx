"use client";

import { useState, useEffect } from "react";
import { X, ArrowRight, Menu, User, LogOut } from "lucide-react";

interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: string;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(true);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
      {/* Promo Banner - Minimal */}
      {showPromo && (
        <div className="bg-[#1a1a1a] text-white py-2 text-center text-sm">
          <span className="text-white/70">Limited offer: </span>
          <span className="font-semibold">30% OFF</span>
          <span className="text-white/70"> on Complete Package </span>
          <a href="/order" className="text-[#E54A4A] font-semibold hover:underline ml-1">
            Shop now →
          </a>
          <button 
            onClick={() => setShowPromo(false)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Clean Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-100">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Simple */}
            <a href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-[#E54A4A] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="font-bold text-lg text-[#1a1a1a]">Rush<span className="text-[#E54A4A]">.photo</span></span>
            </a>

            {/* Desktop Nav - Clean */}
            <nav className="hidden md:flex items-center gap-8">
              {['Portfolio', 'Pricing', 'FAQ'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm text-neutral-600 hover:text-[#1a1a1a] transition-colors"
                >
                  {item}
                </a>
              ))}
            </nav>

            {/* Right Side - Minimal */}
            <div className="flex items-center gap-3">
              {/* Auth */}
              {!isLoading && (
                <>
                  {user ? (
                    <div className="relative hidden md:block">
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                      >
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-[#E54A4A] flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                              {user.name?.charAt(0)?.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </button>

                      {showUserMenu && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 py-1 z-50">
                            <div className="px-3 py-2 border-b border-neutral-100">
                              <p className="font-medium text-sm text-[#1a1a1a] truncate">{user.name}</p>
                              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                            </div>
                            <a href="/admin" className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-neutral-50" onClick={() => setShowUserMenu(false)}>
                              <User className="w-4 h-4" /> Dashboard
                            </a>
                            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full">
                              <LogOut className="w-4 h-4" /> Logout
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <a href="/login" className="hidden md:block text-sm text-neutral-600 hover:text-[#1a1a1a] transition-colors">
                      Login
                    </a>
                  )}
                </>
              )}

              {/* CTA Button */}
              <a 
                href="/order" 
                className="px-4 py-2 bg-[#1a1a1a] text-white text-sm font-medium rounded-lg hover:bg-[#E54A4A] transition-colors flex items-center gap-1.5"
              >
                Start Project
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile Menu */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Clean Slide */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <span className="font-bold text-[#1a1a1a]">Menu</span>
              <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-neutral-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {user && (
              <div className="p-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E54A4A] flex items-center justify-center">
                      <span className="text-white font-semibold">{user.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-neutral-500">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            <nav className="p-4 space-y-1">
              {['Portfolio', 'Pricing', 'FAQ', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  className="block py-3 px-3 text-[#1a1a1a] font-medium hover:bg-neutral-50 rounded-lg"
                >
                  {item}
                </a>
              ))}
            </nav>

            <div className="p-4 mt-auto space-y-2 border-t border-neutral-100">
              {user ? (
                <>
                  <a href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center justify-center gap-2 w-full py-3 text-sm font-medium hover:bg-neutral-50 rounded-lg">
                    <User className="w-4 h-4" /> Dashboard
                  </a>
                  <button onClick={() => { setMenuOpen(false); handleLogout(); }} className="flex items-center justify-center gap-2 w-full py-3 text-sm text-red-600 font-medium hover:bg-red-50 rounded-lg">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <a href="/login" onClick={() => setMenuOpen(false)} className="block text-center py-3 text-sm font-medium hover:bg-neutral-50 rounded-lg">
                  Login
                </a>
              )}
              <a 
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#E54A4A] text-white font-semibold rounded-lg"
              >
                Start Project
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
