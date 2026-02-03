"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle, Copy, ArrowLeft, Check, Sparkles, Package, Mail, Clock } from "lucide-react";
import SuccessConfetti from "@/components/SuccessConfetti";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const sessionId = useMemo(() => searchParams.get("session_id") || "", [searchParams]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const run = async () => {
      if (!sessionId) {
        setError("Missing session id.");
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/checkout/stripe/confirm?session_id=${encodeURIComponent(sessionId)}`);
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error || "Unable to confirm payment.");
          setIsLoading(false);
          return;
        }
        setOrder(data.order);
        setIsLoading(false);
      } catch {
        setError("Network error. Please try again.");
        setIsLoading(false);
      }
    };
    run();
  }, [sessionId]);

  const orderNumber = order?.trackingNumber || order?.trackingNumber || "";
  const total = order?.totals?.total ?? order?.total;

  const copyOrderNumber = async () => {
    if (!orderNumber) return;
    try {
      await navigator.clipboard.writeText(orderNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,212,191,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      
      <div className="max-w-3xl 3xl:max-w-4xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <Link href="/order" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to order
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-[#1a1a1a] border border-white/10 rounded-3xl p-8"
        >
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-4 border-honey border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/70">Confirming your payment…</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-red-400 font-semibold mb-2">Payment confirmation failed</p>
              <p className="text-white/60">{error}</p>
              <div className="mt-6">
                <Link href="/order" className="inline-flex items-center justify-center rounded-xl bg-honey px-5 py-3 text-black font-semibold hover:bg-honey/90 transition-colors">
                  Return to checkout
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <SuccessConfetti />
              
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-teal to-teal/80 text-black flex items-center justify-center mx-auto ring-4 ring-teal/20"
              >
                <CheckCircle className="w-12 h-12" />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-white mt-6">Payment successful!</h1>
                <p className="text-white/60 mt-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-honey" />
                  Thanks—your order is confirmed.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 grid sm:grid-cols-2 gap-4 text-left"
              >
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="text-sm text-white/60 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Order number
                  </div>
                  <div className="mt-2 flex items-center justify-between gap-3">
                    <code className="text-lg font-mono font-bold text-white">{orderNumber || "—"}</code>
                    {orderNumber && (
                      <button
                        type="button"
                        onClick={copyOrderNumber}
                        className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 inline-flex items-center gap-2 transition-colors"
                      >
                        {copied ? <Check className="w-4 h-4 text-teal" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-honey/10 border border-honey/30 p-5">
                  <div className="text-sm text-honey/80">Total paid</div>
                  <div className="mt-1 text-2xl font-bold text-honey">{typeof total === "number" ? `$${total}` : "—"}</div>
                  <div className="text-sm text-white/60 mt-1">USD</div>
                </div>
              </motion.div>

              {/* Next Steps */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 text-left"
              >
                <h3 className="font-semibold text-white mb-4">What happens next?</h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-honey/20 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-honey" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Check your email</p>
                      <p className="text-white/60 text-sm">We&apos;ve sent you a confirmation with shipping instructions.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-teal" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Ship your product</p>
                      <p className="text-white/60 text-sm">Send your product to our studio using the provided label.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Receive your photos</p>
                      <p className="text-white/60 text-sm">Your professional photos will be ready in 3-5 business days.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
              >
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-honey to-honey/90 px-6 py-3.5 text-black font-semibold hover:shadow-lg hover:shadow-honey/20 transition-all"
                >
                  View dashboard
                </Link>
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-white font-semibold hover:bg-white/10 transition-colors"
                >
                  Place another order
                </Link>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
