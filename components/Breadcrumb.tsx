"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

export default function Breadcrumb({ items, showHome = true }: BreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: "Home", href: "/" }, ...items]
    : items;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="mb-6"
    >
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        {allItems.map((item, index) => (
          <motion.li 
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <ChevronRight className="w-4 h-4 text-white/30" />
            )}
            
            {item.current || !item.href ? (
              <span className="text-white font-medium" aria-current={item.current ? "page" : undefined}>
                {index === 0 && showHome ? (
                  <span className="flex items-center gap-1.5">
                    <Home className="w-4 h-4" />
                    <span className="sr-only">{item.label}</span>
                  </span>
                ) : (
                  item.label
                )}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-white/60 hover:text-honey transition-colors flex items-center gap-1.5"
              >
                {index === 0 && showHome ? (
                  <>
                    <Home className="w-4 h-4" />
                    <span className="sr-only">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            )}
          </motion.li>
        ))}
      </ol>
    </nav>
  );
}

