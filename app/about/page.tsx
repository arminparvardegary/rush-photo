import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "About Rush Photo.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/" className="text-sm text-neutral-600 hover:text-neutral-900">
          Back to home
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">About Rush Photo</h1>
        <p className="mt-3 text-neutral-600">
          We help ecommerce brands increase conversion with consistent, high-end product photography.
        </p>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-neutral-900">What we do</h2>
            <p className="mt-2 text-neutral-700">
              Studio-style ecommerce photography, lifestyle shots, and consistent angles—delivered fast and ready for
              Shopify/Amazon.
            </p>
          </div>
          <div className="rounded-3xl border border-neutral-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-neutral-900">How it works</h2>
            <p className="mt-2 text-neutral-700">
              Choose a package, tell us about your product, and complete checkout. We’ll confirm details and start the
              shoot.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


