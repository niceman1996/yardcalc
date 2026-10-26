"use client";

import { useEffect, useRef } from "react";
import {
  getAdSensePublisherId,
  getToolAdSlotId,
} from "@/lib/adsense";
import { ADSENSE_READY_EVENT } from "@/components/AdSenseLoader";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function AdSenseSlot() {
  const publisherId = getAdSensePublisherId();
  const slotId = getToolAdSlotId();
  const requested = useRef(false);

  useEffect(() => {
    if (!publisherId || !slotId) return;

    const requestAd = () => {
      if (requested.current || !window.adsbygoogle) return;
      try {
        window.adsbygoogle.push({});
        requested.current = true;
      } catch {
        // Ad blockers and unapproved accounts can prevent an ad from loading.
      }
    };

    window.addEventListener(ADSENSE_READY_EVENT, requestAd);
    requestAd();
    return () => window.removeEventListener(ADSENSE_READY_EVENT, requestAd);
  }, [publisherId, slotId]);

  if (!publisherId || !slotId) return null;

  return (
    <aside
      className="mx-auto my-10 min-h-32 max-w-4xl px-4"
      aria-label="Advertisement"
    >
      <p className="mb-2 text-center text-xs uppercase tracking-wide text-stone-500">
        Advertisement
      </p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={publisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
