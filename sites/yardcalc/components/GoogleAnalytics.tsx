"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  getAnalyticsMeasurementId,
  trackPageView,
} from "@/lib/analytics";

const measurementId = getAnalyticsMeasurementId();

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname) trackPageView(pathname, document.title);
  }, [pathname]);

  if (!measurementId) return null;

  return (
    <>
      <Script id="google-analytics-init" strategy="beforeInteractive">
        {`window.dataLayer = window.dataLayer || [];
window.gtag = function(){ window.dataLayer.push(Array.from(arguments)); };
window.gtag('js', new Date());
window.gtag('config', ${JSON.stringify(measurementId)}, { send_page_view: false });`}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
    </>
  );
}
