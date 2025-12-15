import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Rush Photo",
  description: "Privacy policy for Rush Photo - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#0d0d0d] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,166,35,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      {/* Header */}
      <header className="border-b border-white/10 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-honey to-honey/80 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-white">Rush<span className="text-honey">.photo</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-white/60 hover:text-honey transition-colors text-sm mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        
        <p className="text-sm text-white/50 mb-2">Last updated: December 2024</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-white/60 mb-8">
          At Rush Photo, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
        </p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
            <p className="text-white/70 mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong className="text-white">Contact Information:</strong> Name, email address, phone number, and shipping address</li>
              <li><strong className="text-white">Account Information:</strong> Login credentials when you create an account</li>
              <li><strong className="text-white">Order Information:</strong> Product details, photography preferences, and order history</li>
              <li><strong className="text-white">Payment Information:</strong> Processed securely through our payment provider (we do not store full card details)</li>
              <li><strong className="text-white">Communication:</strong> Messages you send to us through email or our website</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-white/70 mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Process and fulfill your photography orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you updates about our services (with your consent)</li>
              <li>Improve our services and develop new features</li>
              <li>Prevent fraud and ensure the security of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
            <p className="text-white/70 mb-3">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li><strong className="text-white">Service Providers:</strong> Payment processors, shipping carriers, and cloud hosting providers</li>
              <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
            <p className="text-white/70">
              We implement industry-standard security measures to protect your personal information. This includes encryption of data in transit (HTTPS), secure payment processing, and restricted access to personal data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
            <p className="text-white/70 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">6. Cookies</h2>
            <p className="text-white/70">
              We use essential cookies to operate our website and provide our services. These cookies help us remember your preferences and keep you logged in. We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact Us</h2>
            <p className="text-white/70">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-white/70"><strong className="text-white">Email:</strong> <a href="mailto:hello@rush.photos" className="text-honey hover:underline">hello@rush.photos</a></p>
              <p className="text-white/70"><strong className="text-white">Phone:</strong> <a href="tel:973-427-9393" className="text-honey hover:underline">973-427-9393</a></p>
              <p className="text-white/70"><strong className="text-white">Address:</strong> 1122 Goffle Rd, Hawthorne, NJ 07506</p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
