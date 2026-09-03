# The Arcade

A live-streaming platform with a retro arcade soul — think Twitch, minus the ads,
minus the 30-second delay, plus a pixel-art skin and an XP system for your chat.

Real RTMP ingest, real HLS playback, real-time chat, accounts, follows, and stream
discovery by "cabinet" (category). Broadcast from OBS, watch in the browser.

## What makes it different from Twitch

- **No ads, no subs paywall.** Chat and clips aren't gated behind a subscription tier.
- **Lower latency.** 2-second HLS segments with a 3-segment playlist target ~6-8s
  glass-to-glass instead of Twitch's typical 15-30s+.
- **XP-powered chat.** Every chat message earns XP; your level badge shows next to
  your name everywhere you post. No purchased badges — just participation.
- **Cabinets, not just "categories."** Browse by arcade cabinet (Speedrunning,
  Fighting Games, Shmups, the "Coin-Op Lounge" for just-chatting, etc).
- **Open stack.** Self-hostable end to end — Node/Express API, SQLite via Prisma,
  Socket.IO chat, node-media-server for RTMP→HLS, Next.js frontend. No vendor lock-in.

## Architecture

```
packages/
  server/   Express API + Socket.IO chat + RTMP→HLS ingest (node-media-server)
            Prisma/SQLite: users, streams, categories, chat messages, follows, clips
  web/      Next.js 14 (App Router) + Tailwind, retro CRT-themed UI
            hls.js video playback, socket.io-client for live chat
```

Streamers broadcast RTMP to the server; node-media-server (backed by ffmpeg) transcodes
that into HLS segments served over HTTP, which the web player consumes with hls.js.
Chat, viewer counts, and XP all flow over a single Socket.IO connection per viewer.

## Requirements

- Node.js 20+
- **ffmpeg** on the server host (required for RTMP→HLS transcoding; install via your
  package manager, e.g. `apt install ffmpeg` / `brew install ffmpeg`)
- An RTMP encoder to actually go live — [OBS Studio](https://obsproject.com) is free

## Setup

```bash
npm install

# Server: copy env, create the SQLite db, seed categories
cp packages/server/.env.example packages/server/.env
npm run prisma:migrate     # creates dev.db + tables
npx tsx packages/server/prisma/seed.ts

# Web: copy env
cp packages/web/.env.example packages/web/.env.local
```

Edit `packages/server/.env` and set `JWT_SECRET` to a long random string before
running anything beyond local dev.

## Running locally

In two terminals:

```bash
npm run dev:server   # API on :4000, RTMP ingest on :1935, HLS output on :8000
npm run dev:web       # Next.js on :3000
```

Open http://localhost:3000, register an account ("Insert Coin"), then go to
**Dashboard** to get your RTMP server URL + stream key.

### Going live with OBS

1. OBS → Settings → Stream → Service: *Custom*
2. Server: `rtmp://localhost:1935/live`
3. Stream Key: paste the key from your Dashboard
4. Start Streaming — your channel page at `http://localhost:3000/<your-username>`
   goes live within a few seconds once the first HLS segments are written.

If ffmpeg isn't installed, the API and chat still run fine — the RTMP/HLS piece
just logs a warning and stays off (set `DISABLE_RTMP=true` to silence it during
frontend-only work).

## Notable implementation details

- **Auth**: JWT (30-day expiry), bcrypt-hashed passwords, stream keys are random
  32-char hex tokens regenerable from the dashboard.
- **XP/levels**: `packages/server/src/lib/xp.ts` — cheap early levels, steeper
  curve later. Awarded per chat message, computed server-side so it can't be spoofed
  from the client.
- **Viewer counts**: tracked via Socket.IO room membership (not naive HLS request
  counting), broadcast live to everyone in a channel's room and persisted to the
  stream's `viewerCount`/`peakViewers`.
- **Retro UI**: CRT scanline + vignette overlay (`CrtOverlay.tsx`), pixel font
  (Press Start 2P) for headings, VT323 monospace for body text, neon glow utility
  classes in `globals.css`.

## What's stubbed / next steps

- **Clips**: the `Clip` Prisma model exists but there's no capture UI yet — the
  natural next step is snapshotting the last N seconds of the live HLS buffer.
- **VOD/replays**: streams currently aren't archived after `donePublish`; wiring
  ffmpeg to also write an mp4 alongside the HLS segments would enable this.
- **Production media delivery**: for real-world scale, replace node-media-server's
  bundled HTTP static serving with segments pushed to S3/R2 behind a CDN.
- **Password reset / email verification**: not implemented — registration only
  checks for username/email uniqueness today.
