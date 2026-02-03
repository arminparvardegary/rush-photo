"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Pencil, ArrowRight, X, Check } from "lucide-react";
import Link from "next/link";
import { useCartStore, CartItem } from "@/lib/store";
import { useCartSync } from "@/hooks/useCartSync";
import Footer from "@/components/Footer";
import ConfirmModal from "@/components/ConfirmModal";

export const dynamic = "force-dynamic";

const ASPECT_RATIO_OPTIONS = ["1:1", "4:5", "9:16", "16:9", "3:4", "Custom"];

export default function CartPage() {
  useCartSync();
  const { items, removeItem, updateItem, getCartTotal, clearCart } = useCartStore();
  const [editingItem, setEditingItem] = useState<CartItem | null>(null);
  const [editForm, setEditForm] = useState<Partial<CartItem>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const subtotal = getCartTotal();
  const shipping = 0;
  const total = subtotal + shipping;

  const startEditing = (item: CartItem) => {
    setEditingItem(item);
    setEditForm({
      skuCount: item.skuCount,
      aspectRatios: [...item.aspectRatios],
      productNotes: item.productNotes,
    });
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditForm({});
  };

  const saveEditing = async () => {
    if (!editingItem) return;

    let basePrice = 29;
    if (editingItem.packageType === "lifestyle") basePrice = 49;
    if (editingItem.packageType === "fullpackage") basePrice = 99;

    const newPrice = basePrice * (editForm.skuCount || editingItem.skuCount);

    await updateItem(editingItem.id, {
      ...editForm,
      price: newPrice,
    });
    setEditingItem(null);
    setEditForm({});
  };

  const toggleAspectRatio = (ratio: string) => {
    const current = editForm.aspectRatios || [];
    if (current.includes(ratio)) {
      setEditForm({ ...editForm, aspectRatios: current.filter(r => r !== ratio) });
    } else {
      setEditForm({ ...editForm, aspectRatios: [...current, ratio] });
    }
  };

  const getPackageName = (packageType: string | null) => {
    switch (packageType) {
      case "ecommerce": return "E-Commerce Photography";
      case "lifestyle": return "Lifestyle Photography";
      case "fullpackage": return "Full Package";
      default: return "Photography Package";
    }
  };

  const getProductImage = (item: CartItem) => {
    if (item.packageType === "lifestyle") return "/images/portfolio/flowers-table.jpg";
    if (item.packageType === "fullpackage") return "/images/portfolio/pink-bottle.jpg";
    if (item.photoStyle === "straight-on") return "/images/portfolio/speakers.jpg";
    if (item.photoStyle === "angled") return "/images/portfolio/sneaker.jpg";
    return "/images/portfolio/speakers.jpg";
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
              <span className="font-bold text-xl sm:text-2xl text-gray-900">photos</span>
            </Link>
            <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2">
              <X className="w-4 h-4" />
              Close
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <ShoppingCart className="w-20 h-20 mx-auto text-gray-300 mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Your cart is empty</h1>
            <p className="text-gray-500 mb-8">Add some photography packages to get started!</p>
            <Link
              href="/order"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
            >
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-xl sm:text-2xl text-gray-900">photos</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2">
            <X className="w-4 h-4" />
            Close
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 py-8 sm:py-12">
        <div className="max-w-7xl 3xl:max-w-[1600px] mx-auto px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl 3xl:text-4xl font-black text-gray-900 mb-6">Shopping Cart</h1>

          <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 3xl:gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        <img
                          src={getProductImage(item)}
                          alt={item.photoStyle || item.packageType || "Product"}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-gray-900">
                              {getPackageName(item.packageType)}
                            </h3>
                            <div className="text-sm text-gray-500 mt-1 space-y-0.5">
                              {item.photoStyle && (
                                <p>Style: <span className="text-gray-700 capitalize">{item.photoStyle.replace("-", " ")}</span></p>
                              )}
                              <p>SKUs: <span className="text-gray-700">{item.skuCount}</span></p>
                              <p>Ratios: <span className="text-gray-700">{item.aspectRatios.join(", ")}</span></p>
                            </div>
                            {item.productNotes && (
                              <p className="text-xs text-gray-400 mt-1 italic truncate max-w-[200px]">"{item.productNotes}"</p>
                            )}
                          </div>
                          <p className="text-xl font-black text-gray-900">${item.price}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEditing(item)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium text-gray-500 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add More */}
              <Link
                href="/order"
                className="flex items-center justify-center gap-2 py-4 text-gray-500 hover:text-[#E63946] font-medium transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                Add Another Package
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-5 sticky top-24">
                <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>

                <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                    <span className="font-bold text-gray-900">${subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span className="font-bold text-emerald-600">Free</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-black mb-5">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${total}</span>
                </div>

                <Link
                  href="/checkout"
                  className="block w-full text-center px-5 py-3.5 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
                >
                  Proceed to Checkout
                </Link>

                {items.length > 1 && (
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="w-full mt-3 text-sm text-gray-500 hover:text-red-500 font-medium transition-colors"
                  >
                    Clear Cart
                  </button>
                )}

                {/* Trust Badges */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-xs text-gray-500">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    Secure checkout
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    3-5 day turnaround
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    100% satisfaction guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {/* Edit Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={cancelEditing}
              className="absolute inset-0 bg-black/50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
                <h3 className="font-bold text-lg text-gray-900">Edit Package</h3>
                <button
                  onClick={cancelEditing}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-5 space-y-5 overflow-y-auto flex-1">
                {/* Package Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getProductImage(editingItem)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{getPackageName(editingItem.packageType)}</p>
                    {editingItem.photoStyle && (
                      <p className="text-xs text-gray-500 capitalize">{editingItem.photoStyle.replace("-", " ")} Style</p>
                    )}
                  </div>
                </div>

                {/* SKU Count */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Number of Products (SKUs)</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setEditForm({ ...editForm, skuCount: Math.max(1, (editForm.skuCount || 1) - 1) })}
                      className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-xl font-bold w-16 text-center">{editForm.skuCount || 1}</span>
                    <button
                      onClick={() => setEditForm({ ...editForm, skuCount: (editForm.skuCount || 1) + 1 })}
                      className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center text-xl font-bold hover:bg-gray-50 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Aspect Ratios */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Aspect Ratios</label>
                  <div className="flex flex-wrap gap-2">
                    {ASPECT_RATIO_OPTIONS.map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => toggleAspectRatio(ratio)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          (editForm.aspectRatios || []).includes(ratio)
                            ? "bg-[#E63946] text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={editForm.productNotes || ""}
                    onChange={(e) => setEditForm({ ...editForm, productNotes: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none transition-all text-sm resize-none"
                    rows={2}
                    placeholder="Any special instructions..."
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-5 py-4 border-t border-gray-100 bg-gray-50 flex-shrink-0">
                <button
                  onClick={cancelEditing}
                  className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEditing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearCart}
        title="Clear Cart?"
        message={`Are you sure you want to remove all ${items.length} items from your cart? This action cannot be undone.`}
        confirmText="Clear Cart"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
