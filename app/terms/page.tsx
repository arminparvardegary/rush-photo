import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for Rush Photo.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">Terms of Service</h1>
        <p className="mt-3 text-neutral-600">
          These terms describe the rules and conditions for using Rush Photo and placing orders.
        </p>

        <div className="mt-10 space-y-8 text-neutral-800">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Orders</h2>
            <p className="text-neutral-700">
              By placing an order, you confirm the information provided is accurate and you have the right to submit the
              product/content for photography.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Turnaround</h2>
            <p className="text-neutral-700">
              Typical delivery is 3–5 business days after we receive the product and confirm the requirements (unless
              otherwise agreed).
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Payments & refunds</h2>
            <p className="text-neutral-700">
              Payments are processed securely. Refunds and re-shoots are handled according to our satisfaction policy.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Contact</h2>
            <p className="text-neutral-700">
              Questions? Email{" "}
              <a className="font-medium text-neutral-900 underline" href="mailto:hello@rush.photos">
                hello@rush.photos
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}


