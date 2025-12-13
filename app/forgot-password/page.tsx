import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Reset your Rush Photo password.",
};

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
        <Link href="/login" className="text-sm text-neutral-600 hover:text-neutral-900">
          Back to login
        </Link>
        <h1 className="mt-4 text-3xl font-bold text-neutral-900">Reset password</h1>
        <p className="mt-3 text-neutral-600">
          For now, password resets are handled manually. Email us and we’ll help you recover access.
        </p>

        <div className="mt-8 rounded-3xl border border-neutral-200 bg-white p-7">
          <p className="text-neutral-700">
            Email{" "}
            <a className="font-semibold text-neutral-900 underline" href="mailto:hello@rush.photos">
              hello@rush.photos
            </a>{" "}
            from your account email address.
          </p>
          <p className="text-neutral-600 mt-3 text-sm">We typically respond within 1 business day.</p>
        </div>
      </div>
    </main>
  );
}


