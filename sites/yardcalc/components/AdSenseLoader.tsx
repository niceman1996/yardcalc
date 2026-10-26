"use client";

import Script from "next/script";
import { getAdSensePublisherId } from "@/lib/adsense";

const ADSENSE_READY_EVENT = "yardcalc:adsense-ready";

export default function AdSenseLoader() {
  const publisherId = getAdSensePublisherId();
  if (!publisherId) return null;

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${publisherId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
      onReady={() => {
        window.dispatchEvent(new Event(ADSENSE_READY_EVENT));
      }}
    />
  );
}

export { ADSENSE_READY_EVENT };
