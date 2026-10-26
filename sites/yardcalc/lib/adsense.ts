const publisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID?.trim() ?? "";
const toolSlotId = process.env.NEXT_PUBLIC_ADSENSE_TOOL_SLOT?.trim() ?? "";

export function getAdSensePublisherId(): string | null {
  return /^ca-pub-\d{16}$/.test(publisherId) ? publisherId : null;
}

export function getToolAdSlotId(): string | null {
  return getAdSensePublisherId() && /^\d+$/.test(toolSlotId) ? toolSlotId : null;
}
