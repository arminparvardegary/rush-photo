"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock, Shield, CheckCircle, AlertTriangle, CreditCard } from "lucide-react";

// Only load Stripe if key is available
const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

interface PaymentFormProps {
  clientSecret: string;
  orderId: string;
  orderNumber: string;
  amount: number;
  onSuccess: (orderId: string, orderNumber: string) => void;
  onError: (error: string) => void;
  onBack?: () => void;
}

function CheckoutForm({
  clientSecret,
  orderId,
  orderNumber,
  amount,
  onSuccess,
  onError,
  onBack,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("processing");

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order/success`,
        },
        redirect: "if_required",
      });

      if (error) {
        console.error("Payment error:", error);
        setPaymentStatus("error");
        onError(error.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Confirm payment on our backend
        const confirmRes = await fetch("/api/checkout/confirm-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            orderId,
          }),
        });

        const confirmData = await confirmRes.json();

        if (!confirmRes.ok) {
          throw new Error(confirmData.error || "Failed to confirm order");
        }

        setPaymentStatus("success");
        onSuccess(orderId, orderNumber);
      } else if (paymentIntent) {
        // Handle other statuses
        setPaymentStatus("error");
        onError(`Payment status: ${paymentIntent.status}`);
      }
    } catch (err: any) {
      console.error("Payment processing error:", err);
      setPaymentStatus("error");
      onError(err.message || "Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-[#635BFF]/10 rounded-xl flex items-center justify-center">
            <Lock className="w-5 h-5 text-[#635BFF]" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Payment Details</h3>
            <p className="text-sm text-gray-500">Secure payment by Stripe</p>
          </div>
        </div>

        <PaymentElement
          options={{
            layout: "accordion",
            defaultCollapsed: false,
            radios: true,
            spacedAccordionItems: true,
            paymentMethodOrder: ["card", "apple_pay", "google_pay", "link", "cashapp", "us_bank_account"],
            wallets: {
              applePay: "auto",
              googlePay: "auto",
            },
            fields: {
              billingDetails: {
                address: {
                  country: "auto",
                  postalCode: "auto",
                },
              },
            },
          }}
        />
      </div>

      {/* Accepted Payment Methods */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-3">
        <span className="text-xs text-gray-500 font-medium">Accepted:</span>
        <div className="flex items-center gap-2">
          {/* Visa */}
          <div className="h-6 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#1A1F71]">VISA</span>
          </div>
          {/* Mastercard */}
          <div className="h-6 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#EB001B]">MC</span>
          </div>
          {/* Amex */}
          <div className="h-6 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-[#006FCF]">AMEX</span>
          </div>
          {/* Apple Pay */}
          <div className="h-6 px-2 bg-black rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Pay</span>
          </div>
          {/* Google Pay */}
          <div className="h-6 px-2 bg-white border border-gray-200 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-gray-700">GPay</span>
          </div>
          {/* Link */}
          <div className="h-6 px-2 bg-[#00D66F] rounded flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Link</span>
          </div>
        </div>
      </div>

      {/* Security Badge */}
      <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
        <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Secure Payment by Stripe</p>
          <p className="text-xs text-green-600">Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 text-gray-900 py-4 rounded-xl font-bold transition-colors"
          >
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className={`${onBack ? 'flex-[2]' : 'w-full'} bg-[#E63946] hover:bg-[#D62839] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#E63946]/25`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === "success" ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Payment Successful!
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              Pay ${(amount / 100).toFixed(2)}
            </>
          )}
        </button>
      </div>
    </form>
  );
}

interface StripePaymentFormProps {
  items: any[];
  email: string;
  name: string;
  phone?: string;
  company?: string;
  productName: string;
  notes?: string;
  onSuccess: (orderId: string, orderNumber: string) => void;
  onError: (error: string) => void;
  onBack?: () => void;
}

export default function StripePaymentForm({
  items,
  email,
  name,
  phone,
  company,
  productName,
  notes,
  onSuccess,
  onError,
  onBack,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string>("");
  const [orderNumber, setOrderNumber] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/checkout/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            email,
            name,
            phone,
            company,
            productName,
            notes,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to initialize payment");
        }

        setClientSecret(data.clientSecret);
        setOrderId(data.orderId);
        setOrderNumber(data.orderNumber);
        setAmount(data.amount);
      } catch (err: any) {
        console.error("Payment initialization error:", err);
        setError(err.message);
        onError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (items.length > 0 && email) {
      createPaymentIntent();
    }
  }, [items, email, name, phone, company, productName, notes]);

  // Check if Stripe is configured
  if (!stripePromise) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 text-center">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
        <p className="text-amber-800 font-medium mb-2">Payment System Not Configured</p>
        <p className="text-amber-600 text-sm mb-4">
          The payment system is currently unavailable. Please contact support or try again later.
        </p>
        {onBack && (
          <button
            onClick={onBack}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#E63946] mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-800 font-medium mb-2">Payment initialization failed</p>
        <p className="text-red-600 text-sm">{error}</p>
        <div className="flex gap-3 justify-center mt-4">
          {onBack && (
            <button
              onClick={onBack}
              className="px-6 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#E63946",
            colorBackground: "#ffffff",
            colorText: "#1a1a1a",
            colorDanger: "#E63946",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "12px",
          },
          rules: {
            ".Input": {
              border: "2px solid #e5e7eb",
              boxShadow: "none",
              padding: "12px 16px",
            },
            ".Input:focus": {
              border: "2px solid #E63946",
              boxShadow: "0 0 0 1px #E63946",
            },
            ".Label": {
              fontWeight: "600",
              color: "#374151",
              marginBottom: "8px",
            },
            ".Tab": {
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            ".Tab:hover": {
              border: "2px solid #d1d5db",
            },
            ".Tab--selected": {
              border: "2px solid #E63946",
              backgroundColor: "#FEF2F2",
            },
            ".AccordionItem": {
              border: "2px solid #e5e7eb",
              borderRadius: "12px",
              marginBottom: "8px",
            },
            ".AccordionItem--selected": {
              border: "2px solid #E63946",
              backgroundColor: "#FAFAFA",
            },
            ".RadioIcon": {
              fill: "#E63946",
            },
            ".RadioIcon--checked": {
              fill: "#E63946",
            },
          },
        },
      }}
    >
      <CheckoutForm
        clientSecret={clientSecret}
        orderId={orderId}
        orderNumber={orderNumber}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        onBack={onBack}
      />
    </Elements>
  );
}
