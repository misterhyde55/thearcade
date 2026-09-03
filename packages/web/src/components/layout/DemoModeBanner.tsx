"use client";

import { useEffect, useState } from "react";
import { Info, X } from "lucide-react";

const KEY = "arcade.demoBanner.dismissed";

export function DemoModeBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(window.sessionStorage.getItem(KEY) === "1");
  }, []);

  if (dismissed) return null;

  return (
    <div className="flex items-center gap-3 border-b border-surface-border bg-surface-raised px-4 py-2 text-xs text-ink-muted">
      <Info size={14} className="shrink-0 text-brand-cyan" aria-hidden />
      <p className="min-w-0 flex-1">
        This is a functional prototype. Platform content is realistic mock data, and live video/chat are
        simulated where no backend is connected —{" "}
        <a href="#implementation-notes" className="text-brand-cyan underline underline-offset-2">
          see what&apos;s real vs. simulated
        </a>
        .
      </p>
      <button
        onClick={() => {
          window.sessionStorage.setItem(KEY, "1");
          setDismissed(true);
        }}
        aria-label="Dismiss"
        className="focus-ring shrink-0 rounded p-1 hover:bg-surface-panel2 hover:text-ink"
      >
        <X size={14} />
      </button>
    </div>
  );
}
