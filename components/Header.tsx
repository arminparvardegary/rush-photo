"use client";

import { useState, useEffect } from "react";
import { Phone, X, ArrowRight, Sparkles, User, LogOut, ShoppingCart } from "lucide-react";

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

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setUser(data.user);
          }
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
    } catch {
      // Error logging out
    }
  };

  return (
    <>
      {/* Promo Banner */}
      {showPromo && (
        <div className="relative bg-gradient-to-r from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white py-2.5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_3s_infinite]" />
          
          <div className="container flex items-center justify-center gap-3 text-sm relative">
            <Sparkles className="w-4 h-4 text-[#E54A4A]" />
            <span className="font-medium">Limited Time Offer:</span>
            <span className="px-2 py-0.5 bg-[#E54A4A] rounded-full text-xs font-bold">30% OFF</span>
            <span className="hidden sm:inline text-white/80">Complete Package</span>
            <a 
              href="/order" 
              className="hidden sm:inline-flex items-center gap-1 ml-2 text-[#E54A4A] hover:text-[#ff7f7f] font-semibold transition-colors"
            >
              Claim Now
              <ArrowRight className="w-3 h-3" />
            </a>
            <button 
              onClick={() => setShowPromo(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close promotion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Static Header */}
      <header className="relative bg-transparent">
        <div className="container">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3 group">
              <div className="relative w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E54A4A]/25 group-hover:shadow-[#E54A4A]/40 group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                <span className="text-white font-black text-2xl lg:text-3xl relative">R</span>
              </div>
              <div className="hidden sm:flex flex-col">
                <div className="flex items-baseline">
                  <span className="font-black text-xl lg:text-2xl text-[#1a1a1a] tracking-tight">Rush</span>
                  <span className="font-black text-xl lg:text-2xl text-[#E54A4A] tracking-tight">.photo</span>
                </div>
                <span className="text-[10px] lg:text-xs uppercase tracking-[0.2em] text-[#1a1a1a]/50">
                  Professional Photography
                </span>
              </div>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 px-3 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-white/50 shadow-sm">
              {[
                { name: 'Styles', href: '#work' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Process', href: '#process' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'FAQ', href: '#faq' },
              ].map((item) => (
                <a 
                  key={item.name}
                  href={item.href} 
                  className="relative px-4 py-2 text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-all font-medium text-sm rounded-full hover:bg-white group"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <a 
                href="tel:973-427-9393" 
                className="flex items-center gap-2 text-[#1a1a1a]/60 hover:text-[#E54A4A] transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-[#E54A4A]/10 flex items-center justify-center group-hover:bg-[#E54A4A]/20 transition-colors">
                  <Phone className="w-4 h-4 text-[#E54A4A]" />
                </div>
                <span className="hidden xl:inline text-sm font-medium">973-427-9393</span>
              </a>

              {/* Cart Icon */}
              <a 
                href="/order" 
                className="relative w-10 h-10 rounded-full bg-[#1a1a1a]/5 flex items-center justify-center hover:bg-[#E54A4A]/10 transition-colors group"
                title="Start Order"
              >
                <ShoppingCart className="w-5 h-5 text-[#1a1a1a]/70 group-hover:text-[#E54A4A] transition-colors" />
              </a>
              
              {/* Auth Section */}
              {isLoading ? (
                <div className="w-20 h-8 bg-neutral-200 animate-pulse rounded-lg" />
              ) : user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-[#E54A4A]/10 transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#E54A4A]/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="text-sm font-medium text-[#1a1a1a] hidden xl:block">
                      {user.name?.split(" ")[0] || "Account"}
                    </span>
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setShowUserMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-neutral-100">
                          <p className="font-medium text-[#1a1a1a] text-sm">{user.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                        </div>
                        <a
                          href="/admin"
                          className="flex items-center gap-3 px-4 py-3 text-sm text-[#1a1a1a] hover:bg-[#E54A4A]/5 transition-colors"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </a>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <a 
                  href="/login" 
                  className="px-4 py-2 text-[#1a1a1a]/70 hover:text-[#E54A4A] transition-colors font-medium text-sm"
                >
                  Login
                </a>
              )}
              
              <a 
                href="/order" 
                className="relative group overflow-hidden px-6 py-3 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-semibold rounded-full transition-all duration-300 hover:shadow-xl hover:shadow-[#E54A4A]/30 hover:-translate-y-0.5"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative flex items-center gap-2">
                  Start Project
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`lg:hidden relative z-50 w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300 ${
                menuOpen 
                  ? 'bg-[#1a1a1a] text-white' 
                  : 'bg-white/80 backdrop-blur-sm text-[#1a1a1a] shadow-sm hover:bg-[#E54A4A]/10'
              }`}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-4 flex flex-col justify-between">
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? 'rotate-45 translate-y-[7px]' : ''
                }`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 ${
                  menuOpen ? 'opacity-0 scale-0' : ''
                }`} />
                <span className={`w-full h-0.5 bg-current rounded-full transition-all duration-300 origin-center ${
                  menuOpen ? '-rotate-45 -translate-y-[7px]' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full screen overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
        menuOpen ? 'visible' : 'invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-[#1a1a1a]/20 backdrop-blur-sm transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        
        {/* Menu Panel */}
        <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transition-transform duration-500 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-24 pb-8 px-6">
            {/* User Info (Mobile) */}
            {user && (
              <div className="mb-6 pb-6 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  {user.avatarUrl ? (
                    <img 
                      src={user.avatarUrl} 
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#E54A4A]/20"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#E54A4A] to-[#ff7f7f] flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-[#1a1a1a]">{user.name}</p>
                    <p className="text-sm text-neutral-500 truncate">{user.email}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nav Links */}
            <nav className="flex-1 space-y-1">
              {[
                { name: 'Styles', href: '#work' },
                { name: 'Portfolio', href: '#portfolio' },
                { name: 'Process', href: '#process' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'FAQ', href: '#faq' },
                { name: 'Contact', href: '#contact' },
              ].map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center justify-between py-4 px-4 text-2xl font-bold text-[#1a1a1a] hover:text-[#E54A4A] hover:bg-[#E54A4A]/5 rounded-xl transition-all duration-300 ${
                    menuOpen ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                  }`}
                  style={{ transitionDelay: menuOpen ? `${index * 50 + 100}ms` : '0ms' }}
                >
                  {item.name}
                  <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </nav>
            
            {/* Bottom CTA */}
            <div className={`space-y-3 transition-all duration-500 ${
              menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`} style={{ transitionDelay: menuOpen ? '400ms' : '0ms' }}>
              {user ? (
                <>
                  <a 
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-3 text-[#1a1a1a] font-medium hover:text-[#E54A4A] transition-colors"
                  >
                    <User className="w-5 h-5" />
                    Dashboard
                  </a>
                  <button 
                    onClick={() => {
                      setMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <a 
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 text-[#1a1a1a] font-medium hover:text-[#E54A4A] transition-colors"
                >
                  Login
                </a>
              )}
              <a 
                href="/order"
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-[#E54A4A] to-[#ff7f7f] text-white font-bold rounded-2xl shadow-lg shadow-[#E54A4A]/25"
              >
                <ShoppingCart className="w-5 h-5" />
                Start Project
              </a>
              <a 
                href="tel:973-427-9393"
                className="flex items-center justify-center gap-3 py-4 border-2 border-[#1a1a1a]/10 rounded-2xl text-[#1a1a1a] font-medium hover:border-[#E54A4A] hover:text-[#E54A4A] transition-colors"
              >
                <Phone className="w-5 h-5" />
                973-427-9393
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
