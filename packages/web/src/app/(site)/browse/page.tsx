import { Suspense } from "react";
import { BrowseContent } from "./BrowseContent";

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10 text-sm text-ink-muted sm:px-6 lg:px-8">Loading…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
