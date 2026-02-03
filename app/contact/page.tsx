"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import Footer from "@/components/Footer";
import { useModal } from "@/hooks/useModal";

export default function ContactPage() {
  const { items, getCartTotal } = useCartStore();
  const { showModal, ModalComponent } = useModal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const cartTotal = getCartTotal();
  const hasCartItems = items.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: hasCartItems ? `Order Inquiry - Cart Total: $${cartTotal}` : "General Inquiry",
          message: hasCartItems
            ? `${formData.message}\n\n[Cart Items: ${items.length} | Total: $${cartTotal}]`
            : formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setIsSubmitted(true);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: "", email: "", phone: "", message: "" });
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Contact form error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to send message. Please try again.";
      showModal({
        title: "Message Failed",
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <>
      <ModalComponent />
      <div className="min-h-screen bg-rush-light">
      {/* Header */}
      <header className="bg-white border-b border-rush-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/rushlogo.png" alt="Rush" className="h-6 sm:h-7 w-auto object-contain" />
            <span className="font-bold text-xl sm:text-2xl">photos</span>
          </Link>
          <Link href="/cart" className="text-rush-gray hover:text-rush-dark font-medium flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Cart Summary Banner */}
        {hasCartItems && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-rush-border p-6 mb-8 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-rush-dark mb-1">Your Order Summary</h3>
                <p className="text-sm text-rush-gray">
                  {items.length} item{items.length !== 1 ? 's' : ''} • Total: ${cartTotal}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[#E63946]">${cartTotal}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl border border-rush-border p-8 shadow-sm"
          >
            <h1 className="text-4xl font-black text-rush-dark mb-2">Get in Touch</h1>
            <p className="text-rush-gray mb-8">
              {hasCartItems
                ? "Complete your order details and we'll get back to you shortly."
                : "Have questions? We'd love to hear from you."}
            </p>

            {isSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 bg-[#34C759] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-rush-dark mb-2">Message Sent!</h3>
                <p className="text-rush-gray">We'll get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-bold text-rush-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-rush-border bg-rush-light focus:outline-none focus:border-[#E63946] transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-bold text-rush-dark mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-rush-border bg-rush-light focus:outline-none focus:border-[#E63946] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-bold text-rush-dark mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-rush-border bg-rush-light focus:outline-none focus:border-[#E63946] transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-bold text-rush-dark mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-rush-border bg-rush-light focus:outline-none focus:border-[#E63946] transition-colors resize-none"
                    placeholder={hasCartItems
                      ? "Tell us about your project and any special requirements..."
                      : "How can we help you?"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 bg-[#E63946] text-white font-bold rounded-xl hover:bg-[#D62839] transition-all shadow-lg shadow-[#E63946]/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {hasCartItems ? "Submit Order Request" : "Send Message"}
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl border border-rush-border p-8 shadow-sm">
              <h2 className="text-2xl font-black text-rush-dark mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E63946]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#E63946]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rush-dark mb-1">Email</h3>
                    <a href="mailto:hello@rush.photos" className="text-rush-gray hover:text-[#E63946] transition-colors">
                      hello@rush.photos
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E63946]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#E63946]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rush-dark mb-1">Phone</h3>
                    <a href="tel:+19734279393" className="text-rush-gray hover:text-[#E63946] transition-colors">
                      +1 (973) 427-9393
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#E63946]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#E63946]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rush-dark mb-1">Address</h3>
                    <p className="text-rush-gray">
                      1122 Goffle Rd.<br />
                      Hawthorne, NJ 07506<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-rush-border p-8 shadow-sm">
              <h3 className="font-bold text-rush-dark mb-4">Business Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-rush-gray">Monday - Friday</span>
                  <span className="font-medium text-rush-dark">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rush-gray">Saturday - Sunday</span>
                  <span className="font-medium text-rush-dark">Closed</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#E63946] to-[#D62839] rounded-2xl p-8 text-white shadow-lg">
              <h3 className="text-xl font-bold mb-2">Need Immediate Help?</h3>
              <p className="text-white/90 mb-4 text-sm">
                Call us directly for urgent inquiries or rush orders.
              </p>
              <a
                href="tel:+19734279393"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#E63946] font-bold rounded-xl hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4" />
                Call Now
              </a>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
      </div>
    </>
  );
}
