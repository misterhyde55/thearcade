import Link from "next/link";
import { Cable, Database, MessageSquareText, ShieldCheck, Video, Wallet } from "lucide-react";

const REAL_ITEMS = [
  "A real Express + Prisma API (packages/server) already handles account creation, login, category listing, chat persistence, and a Socket.IO realtime chat transport with server-computed XP/levels.",
  "RTMP ingest → HLS transcoding is wired with node-media-server; it needs ffmpeg on the host to actually transcode a broadcast.",
  "That backend isn't yet connected to this prototype's mock creators — see 'Needed for production' for what wiring it up fully requires."
];

const SIMULATED_ITEMS = [
  "Creator profiles, streams, VODs, clips, analytics, moderation cases, and payouts are typed mock data in lib/mock-data.ts.",
  "The video player renders simulated states (live, starting soon, offline, interrupted, subscriber-only, mature-content gate) rather than a real HLS feed.",
  "Chat is simulated with realistic seeded messages and local interactivity (send, reply, mod actions) — not a live multi-user connection yet.",
  "Subscriptions, tips, gifted subs, and payouts do not move real money — no payment processor is connected.",
  "Sign-in uses a demo session (viewer or creator identity) so every dashboard screen is explorable without a full account system wired to every feature."
];

const SERVICES = [
  { icon: Video, label: "Live video", detail: "Cloudflare Stream, Mux, or Amazon IVS for RTMP/SRT ingest, transcoding, and HLS/LL-HLS delivery." },
  { icon: Wallet, label: "Payments", detail: "Stripe Connect for creator payouts, subscriptions, tips, and platform-fee accounting." },
  { icon: MessageSquareText, label: "Realtime chat", detail: "A WebSocket service (Socket.IO is already wired) fronted by moderation and rate-limiting at scale." },
  { icon: ShieldCheck, label: "Trust & Safety", detail: "Automated moderation signals plus a human review queue feeding the appeals center." },
  { icon: Database, label: "Structured data", detail: "PostgreSQL (Prisma already targets it) for users, channels, subscriptions, and moderation cases." },
  { icon: Cable, label: "Object storage", detail: "S3-compatible storage (e.g. Cloudflare R2) for VODs, clips, thumbnails, and uploads." }
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-surface-border bg-surface-raised">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <Link href="/" className="font-display text-lg font-bold tracking-tight text-ink">
            THE <span className="text-gradient-brand">ARCADE</span>
          </Link>
          <p className="text-xs text-ink-faint">Prototype build — not a production service. No real payments are processed.</p>
        </div>

        <div id="implementation-notes" className="mt-8 scroll-mt-24 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-ink">What&apos;s actually working</h3>
            <ul className="mt-3 space-y-2">
              {REAL_ITEMS.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-cyan" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">What&apos;s simulated for this pass</h3>
            <ul className="mt-3 space-y-2">
              {SIMULATED_ITEMS.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink-muted">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-magenta" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Needed for production</h3>
            <ul className="mt-3 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.label} className="flex gap-2.5 text-sm text-ink-muted">
                  <s.icon size={16} className="mt-0.5 shrink-0 text-ink-faint" aria-hidden />
                  <span>
                    <span className="font-medium text-ink">{s.label}:</span> {s.detail}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
