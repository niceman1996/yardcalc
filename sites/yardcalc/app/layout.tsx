import type { Metadata } from "next";
import type { LinkItem } from "@/shared";
import { SiteHeader, SiteFooter } from "@/shared";
import { categories } from "@/lib/registry";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import AdSenseLoader from "@/components/AdSenseLoader";
import { getAdSensePublisherId } from "@/lib/adsense";
import "./globals.css";

const SITE_NAME = "YardCalc";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://yardcalc.pages.dev";
const adsensePublisherId = getAdSensePublisherId();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "YardCalc — Yard & Home Material Calculators",
    template: "%s | YardCalc",
  },
  description:
    "Free DIY material calculators: concrete, mulch, gravel, paint, tile, decking and more. Estimate cubic yards, bags, and 2026 cost in seconds.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  verification: {
    google: "-B9bH2Tq907nNACPq7T4jLKYd_LEZivoeEFX4uDS3dc",
  },
  ...(adsensePublisherId
    ? { other: { "google-adsense-account": adsensePublisherId } }
    : {}),
};

const headerLinks: LinkItem[] = categories.map((c) => ({
  href: `/category/${c.slug}`,
  title: c.name,
}));

const footerLinks: LinkItem[] = [
  ...headerLinks,
  { href: "/about", title: "About" },
  { href: "/privacy", title: "Privacy Policy" },
  { href: "/contact", title: "Contact" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-100 antialiased">
        <GoogleAnalytics />
        <AdSenseLoader />
        <SiteHeader brand={SITE_NAME} links={headerLinks} />
        {children}
        <SiteFooter
          brand={SITE_NAME}
          links={footerLinks}
          note="Cost estimates use national US average prices and are for planning only — always confirm with your supplier."
        />
      </body>
    </html>
  );
}
