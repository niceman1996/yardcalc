import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact the YardCalc team — feedback, corrections and suggestions.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Contact</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-stone-600">
        <p>
          Found a calculation that looks wrong? Have a calculator you wish existed? Want
          to report a price that&apos;s out of date?
        </p>
        <p>
          Email us at{" "}
          <a
            className="font-medium text-stone-800 underline"
            href="mailto:niceboyniu@gmail.com"
          >
            niceboyniu@gmail.com
          </a>{" "}
          and we&apos;ll take a look. Correction reports about math or pricing are
          especially welcome — include your project dimensions and what you expected.
        </p>
        <p className="text-sm text-stone-400">
          YardCalc is an independent, ad-supported project. We read everything but may not
          reply individually.
        </p>
      </div>
    </main>
  );
}
