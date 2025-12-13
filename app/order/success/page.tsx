"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Copy, ArrowLeft } from "lucide-react";

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
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/order" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900">
          <ArrowLeft className="w-4 h-4" />
          Back to order
        </Link>

        <div className="mt-6 bg-white border border-neutral-200 rounded-3xl p-8">
          {isLoading ? (
            <div className="py-12 text-center">
              <div className="w-10 h-10 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-700">Confirming your payment…</p>
            </div>
          ) : error ? (
            <div className="py-10 text-center">
              <p className="text-red-600 font-semibold mb-2">Payment confirmation failed</p>
              <p className="text-neutral-600">{error}</p>
              <div className="mt-6">
                <Link href="/order" className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold hover:bg-neutral-800">
                  Return to checkout
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-900 text-white flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 mt-5">Payment successful</h1>
              <p className="text-neutral-600 mt-2">Thanks—your order is confirmed.</p>

              <div className="mt-8 grid sm:grid-cols-2 gap-4 text-left">
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="text-sm text-neutral-600">Order number</div>
                  <div className="mt-1 flex items-center justify-between gap-3">
                    <code className="text-lg font-mono font-bold text-neutral-900">{orderNumber || "—"}</code>
                    {orderNumber && (
                      <button
                        type="button"
                        onClick={copyOrderNumber}
                        className="rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 inline-flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copied" : "Copy"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
                  <div className="text-sm text-neutral-600">Total</div>
                  <div className="mt-1 text-2xl font-bold text-neutral-900">{typeof total === "number" ? `$${total}` : "—"}</div>
                  <div className="text-sm text-neutral-600 mt-1">USD</div>
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/admin"
                  className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-white font-semibold hover:bg-neutral-800"
                >
                  View dashboard
                </Link>
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center rounded-xl border border-neutral-900 bg-white px-5 py-3 text-neutral-900 font-semibold hover:bg-neutral-50"
                >
                  New order
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


