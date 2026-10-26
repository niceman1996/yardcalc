import type { Metadata } from "next";
import { analyticsEnabled } from "@/lib/analytics";
import { getAdSensePublisherId } from "@/lib/adsense";

const adsenseConnected = Boolean(getAdSensePublisherId());

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "YardCalc privacy policy — what we collect (very little) and why.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 pb-8 pt-6">
      <h1 className="text-3xl font-bold tracking-tight text-stone-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-stone-400">Last updated: October 26, 2026</p>
      <div className="mt-4 space-y-4 leading-relaxed text-stone-600">
        <h2 className="text-xl font-bold text-stone-900">The short version</h2>
        <p>
          YardCalc is a static website. All calculations run in your browser. We do not
          collect, store, or transmit the measurements or numbers you enter into any
          calculator.
        </p>
        <h2 className="text-xl font-bold text-stone-900">What we do not do</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>No user accounts and no login.</li>
          <li>No contact forms that send personal data to servers we control.</li>
          <li>YardCalc does not sell personal information.</li>
        </ul>
        <h2 className="text-xl font-bold text-stone-900">Analytics</h2>
        {analyticsEnabled ? (
          <p>
            We use Google Analytics to measure page views and whether visitors start and
            complete calculators. Analytics events include the page path and calculator
            name, but never the measurements you enter or the results the calculator
            produces. Google may collect usage and device information and use cookies as
            described in the{" "}
            <a
              className="underline"
              href="https://policies.google.com/privacy"
              rel="noreferrer"
              target="_blank"
            >
              Google Privacy Policy
            </a>
            .
          </p>
        ) : (
          <p>Analytics are not currently enabled on this site.</p>
        )}
        <h2 className="text-xl font-bold text-stone-900">Advertising</h2>
        {adsenseConnected ? (
          <p>
            This site uses Google AdSense to serve and measure ads. Google and other
            third-party vendors may use cookies or similar technologies to show ads based
            on your visits to this site or other websites. Google advertising cookies
            allow Google and its partners to show ads based on those visits. You can
            manage personalized advertising in{" "}
            <a
              className="underline"
              href="https://adssettings.google.com/"
              rel="noreferrer"
              target="_blank"
            >
              Google Ads Settings
            </a>{" "}
            or opt out of some vendors&apos; personalized advertising at{" "}
            <a
              className="underline"
              href="https://www.aboutads.info/choices/"
              rel="noreferrer"
              target="_blank"
            >
              aboutads.info
            </a>. For more about Google&apos;s ad technologies, see the{" "}
            <a
              className="underline"
              href="https://policies.google.com/technologies/ads"
              rel="noreferrer"
              target="_blank"
            >
              Google advertising technologies policy
            </a>
            . Ads appear after Google approves the site and the ad unit is configured.
          </p>
        ) : (
          <p>Advertising is not currently enabled on this site.</p>
        )}
        <h2 className="text-xl font-bold text-stone-900">Children&apos;s privacy</h2>
        <p>
          This site is directed at adults planning home improvement projects and is not
          directed at children under 13.
        </p>
        <h2 className="text-xl font-bold text-stone-900">Contact</h2>
        <p>Questions about this policy? See the Contact page.</p>
      </div>
    </main>
  );
}
