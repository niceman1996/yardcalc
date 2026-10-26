import { getAdSensePublisherId } from "@/lib/adsense";

export const dynamic = "force-static";

export function GET() {
  const publisherId = getAdSensePublisherId();
  const adsTxt = publisherId
    ? "google.com, " + publisherId.replace(/^ca-/, "") + ", DIRECT, f08c47fec0942fa0\n"
    : "";

  return new Response(adsTxt, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
