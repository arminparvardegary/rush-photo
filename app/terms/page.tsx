import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Rush Photo",
  description: "Terms of service for Rush Photo - rules and conditions for using our photography services.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-white/60 mb-8">
          These terms govern your use of Rush Photo services. By placing an order, you agree to these terms.
        </p>

        <div className="prose prose-invert max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">1. Services</h2>
            <p className="text-white/70">
              Rush Photo provides professional product photography services including e-commerce photography, lifestyle photography, and bundled packages. Our services include shooting, editing, and delivery of high-resolution digital images.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">2. Orders & Payment</h2>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>All orders must be paid in full before work begins</li>
              <li>Prices are as displayed at the time of checkout</li>
              <li>Payment is processed securely through our payment provider</li>
              <li>Orders are confirmed via email after successful payment</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">3. Product Shipping</h2>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>You are responsible for shipping your products to our studio</li>
              <li>Products should be shipped with appropriate packaging and insurance</li>
              <li>We are not responsible for items damaged or lost during shipping to our studio</li>
              <li>After photography is complete, products will be shipped back to the address provided</li>
              <li>Return shipping costs may apply depending on your package</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">4. Turnaround Time</h2>
            <p className="text-white/70 mb-3">
              Standard turnaround time is 3-5 business days from when we receive your product and confirm the order requirements. This may vary based on:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Order volume and complexity</li>
              <li>Number of products and angles requested</li>
              <li>Revision requests</li>
              <li>Holidays and peak seasons</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">5. Image Rights & Usage</h2>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Upon full payment, you receive full commercial rights to use the images</li>
              <li>We retain the right to use images in our portfolio and marketing (unless otherwise agreed)</li>
              <li>You warrant that you have the right to photograph the products submitted</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">6. Revisions & Satisfaction</h2>
            <p className="text-white/70 mb-3">
              We strive for 100% satisfaction. Our revision policy:
            </p>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Minor adjustments (brightness, cropping) are included at no extra charge</li>
              <li>Major re-shoots may incur additional fees</li>
              <li>Revision requests must be submitted within 7 days of delivery</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">7. Refunds</h2>
            <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
              <li>Refund requests must be made within 14 days of image delivery</li>
              <li>Full refunds are available if work has not yet begun</li>
              <li>Partial refunds may be offered for work in progress</li>
              <li>No refunds after final images are approved</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">8. Liability</h2>
            <p className="text-white/70">
              While we take great care with your products, our liability is limited to the cost of the photography services purchased. We recommend insuring valuable items during shipping.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
            <p className="text-white/70">
              We may update these terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
            <p className="text-white/70">
              Questions about these terms? Contact us:
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
