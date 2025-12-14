import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Rush Photo",
  description: "Privacy policy for Rush Photo - how we collect, use, and protect your information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#E54A4A] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="font-bold text-lg text-[#1a1a1a]">Rush<span className="text-[#E54A4A]">.photo</span></span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <p className="text-sm text-neutral-500 mb-2">Last updated: December 2024</p>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">Privacy Policy</h1>
        <p className="text-neutral-600 mb-8">
          At Rush Photo, we take your privacy seriously. This policy explains how we collect, use, and protect your personal information.
        </p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">1. Information We Collect</h2>
            <p className="text-neutral-700 mb-3">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li><strong>Contact Information:</strong> Name, email address, phone number, and shipping address</li>
              <li><strong>Account Information:</strong> Login credentials when you create an account</li>
              <li><strong>Order Information:</strong> Product details, photography preferences, and order history</li>
              <li><strong>Payment Information:</strong> Processed securely through our payment provider (we do not store full card details)</li>
              <li><strong>Communication:</strong> Messages you send to us through email or our website</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">2. How We Use Your Information</h2>
            <p className="text-neutral-700 mb-3">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Process and fulfill your photography orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send you updates about our services (with your consent)</li>
              <li>Improve our services and develop new features</li>
              <li>Prevent fraud and ensure the security of our platform</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">3. Information Sharing</h2>
            <p className="text-neutral-700 mb-3">We do not sell your personal information. We may share your information with:</p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li><strong>Service Providers:</strong> Payment processors, shipping carriers, and cloud hosting providers</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">4. Data Security</h2>
            <p className="text-neutral-700">
              We implement industry-standard security measures to protect your personal information. This includes encryption of data in transit (HTTPS), secure payment processing, and restricted access to personal data.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">5. Your Rights</h2>
            <p className="text-neutral-700 mb-3">You have the right to:</p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal data</li>
              <li>Opt out of marketing communications</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">6. Cookies</h2>
            <p className="text-neutral-700">
              We use essential cookies to operate our website and provide our services. These cookies help us remember your preferences and keep you logged in. We do not use tracking cookies for advertising purposes.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">7. Contact Us</h2>
            <p className="text-neutral-700">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
              <p className="text-neutral-700"><strong>Email:</strong> <a href="mailto:hello@rush.photos" className="text-[#E54A4A] hover:underline">hello@rush.photos</a></p>
              <p className="text-neutral-700"><strong>Phone:</strong> <a href="tel:973-427-9393" className="text-[#E54A4A] hover:underline">973-427-9393</a></p>
              <p className="text-neutral-700"><strong>Address:</strong> 1122 Goffle Rd, Hawthorne, NJ 07506</p>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-200">
          <Link href="/" className="text-[#E54A4A] font-medium hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
