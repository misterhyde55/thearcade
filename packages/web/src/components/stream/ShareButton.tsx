"use client";

import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

export function ShareButton({ url }: { url: string }) {
  const { push } = useToast();

  async function onShare() {
    const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url;
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ url: fullUrl });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(fullUrl);
      push({ kind: "success", title: "Link copied", description: fullUrl });
    } catch {
      push({ kind: "info", title: "Share link", description: fullUrl });
    }
  }

  return (
    <button
      onClick={onShare}
      aria-label="Share this stream"
      className="focus-ring flex items-center gap-1.5 rounded-md border border-surface-border px-3 py-2 text-sm text-ink-muted hover:border-surface-borderStrong hover:text-ink"
    >
      <Share2 size={15} /> Share
    </button>
  );
}
