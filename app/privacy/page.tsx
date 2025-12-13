import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Rush Photo.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">Privacy Policy</h1>
        <p className="mt-3 text-neutral-600">
          We respect your privacy. This page explains what information we collect and how we use it.
        </p>

        <div className="mt-10 space-y-8 text-neutral-800">
          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Information we collect</h2>
            <p className="text-neutral-700">
              We may collect contact details you provide (such as name, email, phone) and order details needed to deliver
              our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">How we use information</h2>
            <p className="text-neutral-700">
              We use your information to process orders, provide support, communicate updates, and improve our services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl font-semibold text-neutral-900">Payments</h2>
            <p className="text-neutral-700">
              Card payments are processed by a secure payment provider. We do not store your full card details.
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


