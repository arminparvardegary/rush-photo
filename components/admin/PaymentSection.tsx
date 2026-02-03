"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentTransaction {
  id: string;
  transactionType: string;
  amountCents: number;
  currency: string;
  status: string;
  providerTransactionId?: string;
  refundReason?: string;
  createdAt: string;
}

interface PaymentSectionProps {
  orderId: string;
  orderNumber: string;
}

export default function PaymentSection({ orderId, orderNumber }: PaymentSectionProps) {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [showRefundForm, setShowRefundForm] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundReason, setRefundReason] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadTransactions();
  }, [orderId]);

  const loadTransactions = async () => {
    try {
      const res = await fetch(`/api/admin/transactions?orderId=${orderId}`);
      if (!res.ok) throw new Error("Failed to load transactions");
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (err: any) {
      console.error("Error loading transactions:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setRefunding(true);

    try {
      const amountInCents = refundAmount
        ? Math.round(parseFloat(refundAmount) * 100)
        : undefined;

      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          amountCents: amountInCents,
          reason: refundReason,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Refund failed");
      }

      setSuccess(
        `Refund of $${((data.refundAmount || 0) / 100).toFixed(2)} processed successfully!`
      );
      setShowRefundForm(false);
      setRefundAmount("");
      setRefundReason("");

      // Reload transactions
      await loadTransactions();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefunding(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  const chargeTransaction = transactions.find((t) => t.transactionType === "charge");
  const refundTransactions = transactions.filter((t) =>
    ["refund", "partial_refund"].includes(t.transactionType)
  );

  const totalCharged = chargeTransaction ? chargeTransaction.amountCents : 0;
  const totalRefunded = refundTransactions.reduce((sum, t) => sum + t.amountCents, 0);
  const availableToRefund = totalCharged - totalRefunded;

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment & Refunds
        </h3>
      </div>

      {/* Alert Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-start gap-2 text-sm"
          >
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-green-800">{success}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Summary */}
      {chargeTransaction && (
        <div className="space-y-3 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-600">Total Charged</span>
            <span className="text-lg font-bold text-gray-900">
              ${(totalCharged / 100).toFixed(2)}
            </span>
          </div>
          {totalRefunded > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">Total Refunded</span>
              <span className="text-lg font-bold text-red-600">
                -${(totalRefunded / 100).toFixed(2)}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-bold text-gray-900">Available to Refund</span>
            <span className="text-lg font-bold text-green-600">
              ${(availableToRefund / 100).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Refund Button */}
      {availableToRefund > 0 && !showRefundForm && (
        <button
          onClick={() => setShowRefundForm(true)}
          className="w-full mb-6 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
        >
          <DollarSign className="w-5 h-5" />
          Issue Refund
        </button>
      )}

      {/* Refund Form */}
      <AnimatePresence>
        {showRefundForm && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleRefund}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Refund Amount ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={(availableToRefund / 100).toFixed(2)}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder={`Max: $${(availableToRefund / 100).toFixed(2)}`}
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500"
              />
              <p className="mt-1 text-xs text-gray-600">
                Leave empty to refund full amount
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                Reason
              </label>
              <textarea
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                rows={3}
                placeholder="Reason for refund..."
                className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={refunding}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {refunding ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                    Processing...
                  </>
                ) : (
                  "Process Refund"
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowRefundForm(false);
                  setRefundAmount("");
                  setRefundReason("");
                  setError("");
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">
            Transaction History
          </h4>
          <div className="space-y-2">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl text-sm"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                        transaction.transactionType === "charge"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.transactionType}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        transaction.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </div>
                  {transaction.refundReason && (
                    <div className="text-xs text-gray-600 mt-1">
                      Reason: {transaction.refundReason}
                    </div>
                  )}
                  {transaction.providerTransactionId && (
                    <div className="text-xs text-gray-400 font-mono mt-1">
                      ID: {transaction.providerTransactionId}
                    </div>
                  )}
                </div>
                <div
                  className={`font-bold ${
                    transaction.transactionType === "charge"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.transactionType === "charge" ? "+" : "-"}$
                  {(transaction.amountCents / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {transactions.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No payment transactions found for this order.
        </div>
      )}
    </div>
  );
}
