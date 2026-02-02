"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertTriangle, Info } from "lucide-react";
import { useEffect } from "react";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantStyles: Record<ToastVariant, { bg: string; icon: React.ReactNode; border: string }> = {
  success: {
    bg: "bg-emerald-50",
    icon: <Check className="w-5 h-5 text-emerald-600" />,
    border: "border-emerald-200",
  },
  error: {
    bg: "bg-red-50",
    icon: <X className="w-5 h-5 text-red-600" />,
    border: "border-red-200",
  },
  warning: {
    bg: "bg-amber-50",
    icon: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    border: "border-amber-200",
  },
  info: {
    bg: "bg-blue-50",
    icon: <Info className="w-5 h-5 text-blue-600" />,
    border: "border-blue-200",
  },
};

export default function Toast({
  isOpen,
  onClose,
  message,
  variant = "success",
  duration = 3000,
}: ToastProps) {
  const styles = variantStyles[variant];

  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg border ${styles.bg} ${styles.border}`}
          >
            <div className="flex-shrink-0">{styles.icon}</div>
            <p className="text-sm font-medium text-gray-900">{message}</p>
            <button
              onClick={onClose}
              className="flex-shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
