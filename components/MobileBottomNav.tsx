"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Camera, User, ShoppingCart, HelpCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Camera, label: "Work", href: "/#portfolio" },
  { icon: ShoppingCart, label: "Order", href: "/order", highlight: true },
  { icon: HelpCircle, label: "FAQ", href: "/#faq" },
  { icon: User, label: "Account", href: "/admin" },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide on scroll down, show on scroll up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Hide on order page to not conflict with checkout
  if (pathname.startsWith("/order")) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        >
          {/* White solid backdrop with shadow */}
          <div className="absolute inset-0 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]" />

          {/* Safe area padding for notched phones */}
          <div className="relative px-2 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            <div className="flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = pathname === item.href ||
                  (item.href.includes("#") && pathname === "/");

                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center gap-1 py-2 px-4 rounded-xl transition-all ${item.highlight
                        ? "relative"
                        : isActive
                          ? "text-[#E63946]"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {item.highlight ? (
                      <div className="relative -mt-7">
                        <div className="w-14 h-14 bg-[#E63946] rounded-full flex items-center justify-center shadow-lg shadow-[#E63946]/30">
                          <item.icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-medium text-[#E63946] whitespace-nowrap">
                          {item.label}
                        </span>
                      </div>
                    ) : (
                      <>
                        <item.icon className={`w-5 h-5 ${isActive ? "text-[#E63946]" : ""}`} strokeWidth={1.5} />
                        <span className={`text-[10px] font-medium ${isActive ? "text-[#E63946]" : ""}`}>
                          {item.label}
                        </span>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
