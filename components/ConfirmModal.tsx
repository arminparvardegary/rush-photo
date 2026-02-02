"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Trash2, Check, Info } from "lucide-react";
import { ReactNode } from "react";

type ModalVariant = "danger" | "warning" | "success" | "info";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  icon?: ReactNode;
}

const variantStyles: Record<ModalVariant, { bg: string; iconBg: string; button: string }> = {
  danger: {
    bg: "bg-red-100",
    iconBg: "text-red-600",
    button: "bg-red-600 hover:bg-red-700",
  },
  warning: {
    bg: "bg-amber-100",
    iconBg: "text-amber-600",
    button: "bg-amber-600 hover:bg-amber-700",
  },
  success: {
    bg: "bg-emerald-100",
    iconBg: "text-emerald-600",
    button: "bg-emerald-600 hover:bg-emerald-700",
  },
  info: {
    bg: "bg-blue-100",
    iconBg: "text-blue-600",
    button: "bg-blue-600 hover:bg-blue-700",
  },
};

const defaultIcons: Record<ModalVariant, ReactNode> = {
  danger: <Trash2 className="w-7 h-7" />,
  warning: <AlertTriangle className="w-7 h-7" />,
  success: <Check className="w-7 h-7" />,
  info: <Info className="w-7 h-7" />,
};

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  icon,
}: ConfirmModalProps) {
  const styles = variantStyles[variant];
  const displayIcon = icon || defaultIcons[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className={`w-14 h-14 ${styles.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <span className={styles.iconBg}>{displayIcon}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
              <div className="text-gray-500 text-sm mb-6">{message}</div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 px-4 py-3 text-white font-bold rounded-xl transition-colors ${styles.button}`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
