const measurementId = process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "";

export const analyticsEnabled = /^G-[A-Z0-9]+$/.test(measurementId);

type AffiliateClickDetails = {
  toolSlug: string;
  partner: string;
  placement: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function sendEvent(
  name: string,
  params: Record<string, string>,
): void {
  if (!analyticsEnabled || typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}

export function trackPageView(path: string, title: string): void {
  sendEvent("page_view", { page_path: path, page_title: title });
}

export function trackCalculatorStart(toolSlug: string): void {
  sendEvent("calculator_start", { tool_slug: toolSlug });
}

export function trackCalculatorResult(toolSlug: string): void {
  sendEvent("calculator_result", { tool_slug: toolSlug });
}

export function trackAffiliateClick({
  toolSlug,
  partner,
  placement,
}: AffiliateClickDetails): void {
  sendEvent("affiliate_click", {
    tool_slug: toolSlug,
    partner,
    placement,
  });
}

export function getAnalyticsMeasurementId(): string | null {
  return analyticsEnabled ? measurementId : null;
}
