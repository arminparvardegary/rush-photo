"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Trash2, Edit, ArrowRight, Package, X } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { useCartSync } from "@/hooks/useCartSync";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default function CartPage() {
  useCartSync();
  const { items, removeItem, getCartTotal, clearCart } = useCartStore();

  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-rush-light flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-24 h-24 mx-auto text-rush-gray/30 mb-6" />
          <h1 className="text-3xl font-bold text-rush-dark mb-4">Your cart is empty</h1>
          <p className="text-rush-gray mb-8">Add some photography packages to get started!</p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20"
          >
            Start Creating
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rush-light py-12">
      {/* Header */}
      <header className="bg-white border-b border-rush-border sticky top-0 z-50 mb-8">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-2xl sm:text-3xl">photos</span>
          </Link>
          <Link href="/" className="text-rush-gray hover:text-rush-dark font-medium flex items-center gap-2">
            <X className="w-4 h-4" />
            Close
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-black text-rush-dark mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
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
                  className="bg-white rounded-2xl border border-rush-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-4">
                    {/* Thumbnail */}
                    <div className="w-24 h-24 bg-rush-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-10 h-10 text-rush-gray" />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-rush-dark mb-1">
                        {item.packageType === "ecommerce" && "E-Commerce Photography"}
                        {item.packageType === "lifestyle" && "Lifestyle Photography"}
                        {item.packageType === "fullpackage" && "Full Package"}
                      </h3>
                      <div className="text-sm text-rush-gray space-y-1">
                        {item.photoStyle && (
                          <p>Style: <span className="font-medium">{item.photoStyle}</span></p>
                        )}
                        {item.selectedAngles && item.selectedAngles.length > 0 && (
                          <p>Angles: <span className="font-medium">{item.selectedAngles.join(", ")}</span></p>
                        )}
                        <p>SKU Count: <span className="font-medium">{item.skuCount}</span></p>
                        <p>Aspect Ratios: <span className="font-medium">{item.aspectRatios.join(", ")}</span></p>
                      </div>
                      {item.productNotes && (
                        <p className="text-xs text-rush-gray mt-2 italic">"{item.productNotes}"</p>
                      )}
                    </div>

                    {/* Price & Actions */}
                    <div className="text-right flex flex-col justify-between">
                      <p className="text-2xl font-black text-rush-dark">${item.price}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4 text-rush-gray group-hover:text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Continue Shopping */}
            <Link
              href="/order"
              className="flex items-center justify-center gap-2 py-4 text-rush-gray hover:text-rush-dark font-bold transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              Add Another Package
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-rush-border p-6 sticky top-24">
              <h2 className="text-xl font-black text-rush-dark mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-rush-border">
                <div className="flex justify-between text-sm">
                  <span className="text-rush-gray">Subtotal ({items.length} item{items.length !== 1 ? 's' : ''})</span>
                  <span className="font-bold text-rush-dark">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-rush-gray">Shipping</span>
                  <span className="font-bold text-emerald-600">Free</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-black mb-6">
                <span className="text-rush-dark">Total</span>
                <span className="text-rush-dark">${total}</span>
              </div>

              <Link
                href="/contact"
                className="block w-full text-center px-6 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20 mb-3"
              >
                Proceed to Checkout
              </Link>

              {items.length > 1 && (
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your cart?")) {
                      clearCart();
                    }
                  }}
                  className="w-full text-sm text-rush-gray hover:text-red-500 font-medium transition-colors"
                >
                  Clear Cart
                </button>
              )}

              {/* Trust Badges */}
              <div className="mt-8 pt-6 border-t border-rush-border space-y-3 text-xs text-rush-gray">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  Secure checkout
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  3-5 day turnaround
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  100% satisfaction guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
