# The Arcade

A creator-first live-streaming platform prototype — built to fix what creators
consistently flag about existing platforms: opaque moderation, weak discovery
below the top tier, unclear revenue splits, and communities that vanish the
moment a channel is suspended.

This repo has two parts:

- **`packages/web`** — the product: a polished Next.js prototype covering
  discovery, watching, chat, creator channels, and a full creator dashboard
  (stream setup, analytics, moderation/appeals, monetization, community
  tools). Most content is realistic **mock data** with clean seams to swap in
  real services — see [What's real vs. simulated](#whats-real-vs-simulated).
- **`packages/server`** — a real Express + Prisma + Socket.IO + RTMP-ingest
  backend from an earlier pass. It already handles accounts, categories, chat
  persistence/transport, and RTMP→HLS transcoding, but it is **not yet wired
  into the `web` prototype's mock creators** (see below for what that wiring
  requires).

## Quick start

```bash
npm install
cd packages/web && cp .env.example .env.local
npm run dev:web        # http://localhost:3000
```

No database or account is required to explore the product — every screen
works from mock data behind a **demo session** (see below). The optional
real backend (`npm run dev:server`) is documented separately in
[packages/server](packages/server) and covered in the previous implementation
pass; it isn't required to run the `web` prototype.

## Demo session, not full auth

`/login` and `/signup` don't hit a real identity provider in this pass —
there's a real JWT-based auth API in `packages/server`, but it has no
concept of creator profiles, subscription tiers, or moderation cases, so
wiring it in today would only unlock login/logout and nothing else the
dashboard needs. Instead:

- `useDemoSession()` (`packages/web/src/lib/demo-session.tsx`) holds a
  client-side session — **guest**, **viewer**, or **creator** — persisted to
  `localStorage`.
- "Continue as a viewer" gives you a generic signed-in identity that can
  follow, subscribe (simulated), and chat.
- "Continue as creator — MisterHyde55" signs you in as the platform's
  featured demo creator, unlocking the full `/dashboard`.
- The navbar's **Go Live** / **Dashboard** actions auto-offer the creator
  demo if you're signed in only as a viewer, rather than dead-ending.

## What's real vs. simulated

**Actually working, no mocks:**
- Every route below renders, is keyboard-navigable, and has real empty/error/
  loading states — nothing is a static image or a dead button.
- Follow, subscribe (demo), notification read-state, chat send/reply/delete/
  timeout/ban, chat mode toggles, VOD rename/visibility/delete, moderation
  appeals, announcements, and schedule edits all mutate real component/session
  state and persist across navigation (session-scoped, not a database).
- `packages/server` is a real API: JWT auth, category listing, Socket.IO chat
  transport with server-computed XP, and node-media-server RTMP→HLS ingest
  (needs `ffmpeg` on the host). It's independently runnable and documented in
  that package, but isn't wired to the `web` prototype's creators yet.

**Simulated for this pass (see in-app "What's real vs. simulated" panel in
the footer for the always-current list):**
- Creators, streams, VODs, clips, analytics, moderation cases, and payouts
  are typed mock data in `packages/web/src/lib/mock-data.ts`.
- The video player (`components/player/VideoPlayer.tsx`) renders every
  required state — live, starting soon, offline, ended, interrupted,
  subscriber-only gate, mature-content gate, loading, connection failure —
  against a simulated canvas, not a real HLS stream.
- Chat (`components/chat/ChatPanel.tsx`) seeds realistic messages and adds
  simulated incoming chatter; sending, replying, and moderating all work
  locally, but it isn't a live multi-viewer connection.
- Subscriptions, tips, gifted subs, and payouts never touch a real payment
  processor — actions are clearly labeled "demo" and no money moves.

## Routes

| Route | What's there |
|---|---|
| `/` | Featured live broadcast, live grid, categories, continue watching, smaller-creator discovery |
| `/browse` | Search + filters (recommended, viewers, recent, small communities, new, language, mature, followed) |
| `/following` | Followed creators' live/offline status |
| `/category/[slug]` | Category detail + live channels in it |
| `/channel/[username]` | Banner, live/offline player, about, schedule, videos, clips, community posts, subscriber benefits |
| `/watch/[streamId]` | Full watch experience: player, chat, follow/subscribe/clip/share/report, VODs, suggested channels |
| `/login`, `/signup` | Demo sign-in, username/availability check, simulated email verification, creator onboarding prompt |
| `/settings` | Profile, notification preferences, blocked users |
| `/dashboard` | Overview: status, Go Live checklist, stats, recent activity, stream health |
| `/dashboard/stream-manager` | Title/category/tags, mature flag, raid, marker, ad break, chat modes, panic button, moderation queue preview, end stream |
| `/dashboard/setup` | RTMP URL + stream key (copy/show/reset), connection test, encoder recommendations, OBS/Streamlabs steps, production data-flow explainer |
| `/dashboard/content` | Manage broadcasts/clips: rename, visibility, delete (confirmed), download (flagged as needing storage) |
| `/dashboard/analytics` | Viewers, retention curve, discovery sources, device breakdown, stream-by-stream comparison |
| `/dashboard/community` | Followers/subscribers, moderators/VIPs/bans + activity log, automod & rules, announcements, schedule |
| `/dashboard/monetization` | Subscription tiers, founding slots, payouts with itemized platform/processing fees, sponsorship placeholder |
| `/dashboard/moderation` | Moderation & appeals center (rule, evidence, decision-maker, restriction, appeal), safety tools, suspicious-account warnings |
| `/chat-popout/[username]` | Standalone pop-out chat window (real `window.open`, not a fake link) |

## What's required for production

| Area | Service | Why |
|---|---|---|
| Live video | Cloudflare Stream, Mux, or Amazon IVS | RTMP/SRT ingest, transcoding, HLS/LL-HLS delivery. OBS never talks to a normal webpage directly — it streams to that provider's ingest servers, which then feed the player via webhooks/HLS. `packages/server`'s node-media-server is a self-hosted alternative to this. |
| Payments | Stripe Connect | Creator payouts, subscriptions, tips, itemized platform/processing fees. |
| Realtime chat at scale | A managed WebSocket service | `packages/server` already has a working Socket.IO transport; production needs it fronted by rate-limiting and moderation hooks. |
| Trust & Safety | Automated moderation + human review queue | Powers the appeals center with real cases instead of mock ones. |
| Structured data | PostgreSQL | `packages/server`'s Prisma schema already targets Postgres-compatible SQL; swap the SQLite datasource. |
| Object storage | S3-compatible (e.g. Cloudflare R2) | VODs, clips, thumbnails, uploads, and the "download" actions currently flagged as unavailable. |
| Email | Any transactional email provider | Real password reset and email verification (both are simulated in `/login` and `/signup` today). |

## Tech stack

`packages/web`: Next.js 14 (App Router) + TypeScript, Tailwind CSS, Lucide
icons, hls.js (wired for real HLS playback once a `playbackSrc` is supplied),
socket.io-client. No backend calls are required to run it — everything reads
from `lib/mock-data.ts` and `lib/demo-session.tsx`.

`packages/server`: Express, Prisma (SQLite in dev, Postgres-ready), Socket.IO,
node-media-server. See that package for its own setup — it's a separate,
independently-runnable API from an earlier pass.

## Design system

Dark charcoal/near-black surfaces, electric red/magenta/purple/cyan accents,
Inter for body text and Space Grotesk for display type, Lucide for every
icon (no emoji anywhere in the UI). Design tokens live in
`packages/web/tailwind.config.ts` under `surface`, `ink`, and `brand`.
