"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect } from "react";

export type ModalType = "success" | "error" | "warning" | "info";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  showCancel?: boolean;
}

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const colorMap = {
  success: {
    bg: "bg-emerald-50",
    icon: "text-emerald-500",
    button: "bg-emerald-500 hover:bg-emerald-600",
  },
  error: {
    bg: "bg-red-50",
    icon: "text-red-500",
    button: "bg-red-500 hover:bg-red-600",
  },
  warning: {
    bg: "bg-amber-50",
    icon: "text-amber-500",
    button: "bg-amber-500 hover:bg-amber-600",
  },
  info: {
    bg: "bg-blue-50",
    icon: "text-blue-500",
    button: "bg-blue-500 hover:bg-blue-600",
  },
};

export default function Modal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
  confirmText = "OK",
  cancelText = "Cancel",
  onConfirm,
  showCancel = false,
}: ModalProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 pb-4">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${colors.icon}`} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 pb-6 flex gap-3 justify-end">
                {showCancel && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 rounded-xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {cancelText}
                  </button>
                )}
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2.5 rounded-xl font-semibold text-white transition-colors ${colors.button}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
