import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Rush Photo",
  description: "Terms of service for Rush Photo - rules and conditions for using our photography services.",
};

export default function TermsPage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold text-[#1a1a1a] mb-4">Terms of Service</h1>
        <p className="text-neutral-600 mb-8">
          These terms govern your use of Rush Photo services. By placing an order, you agree to these terms.
        </p>

        <div className="prose prose-neutral max-w-none">
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">1. Services</h2>
            <p className="text-neutral-700">
              Rush Photo provides professional product photography services including e-commerce photography, lifestyle photography, and bundled packages. Our services include shooting, editing, and delivery of high-resolution digital images.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">2. Orders & Payment</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>All orders must be paid in full before work begins</li>
              <li>Prices are as displayed at the time of checkout</li>
              <li>Payment is processed securely through our payment provider</li>
              <li>Orders are confirmed via email after successful payment</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">3. Product Shipping</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>You are responsible for shipping your products to our studio</li>
              <li>Products should be shipped with appropriate packaging and insurance</li>
              <li>We are not responsible for items damaged or lost during shipping to our studio</li>
              <li>After photography is complete, products will be shipped back to the address provided</li>
              <li>Return shipping costs may apply depending on your package</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">4. Turnaround Time</h2>
            <p className="text-neutral-700 mb-3">
              Standard turnaround time is 3-5 business days from when we receive your product and confirm the order requirements. This may vary based on:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Order volume and complexity</li>
              <li>Number of products and angles requested</li>
              <li>Revision requests</li>
              <li>Holidays and peak seasons</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">5. Image Rights & Usage</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Upon full payment, you receive full commercial rights to use the images</li>
              <li>We retain the right to use images in our portfolio and marketing (unless otherwise agreed)</li>
              <li>You warrant that you have the right to photograph the products submitted</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">6. Revisions & Satisfaction</h2>
            <p className="text-neutral-700 mb-3">
              We strive for 100% satisfaction. Our revision policy:
            </p>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Minor adjustments (brightness, cropping) are included at no extra charge</li>
              <li>Major re-shoots may incur additional fees</li>
              <li>Revision requests must be submitted within 7 days of delivery</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">7. Refunds</h2>
            <ul className="list-disc list-inside text-neutral-700 space-y-2 ml-4">
              <li>Refund requests must be made within 14 days of image delivery</li>
              <li>Full refunds are available if work has not yet begun</li>
              <li>Partial refunds may be offered for work in progress</li>
              <li>No refunds after final images are approved</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">8. Liability</h2>
            <p className="text-neutral-700">
              While we take great care with your products, our liability is limited to the cost of the photography services purchased. We recommend insuring valuable items during shipping.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">9. Changes to Terms</h2>
            <p className="text-neutral-700">
              We may update these terms from time to time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">10. Contact</h2>
            <p className="text-neutral-700">
              Questions about these terms? Contact us:
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
