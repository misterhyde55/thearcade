"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Bell,
  Clock,
  Lock,
  Loader2,
  RotateCw,
  ShieldAlert,
  Tv2
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { PlayerControls } from "./PlayerControls";
import { formatScheduleTime, formatUptime } from "@/lib/format";
import { useDemoSession } from "@/lib/demo-session";
import type { Creator, Stream } from "@/lib/types";

// Structured so a real HLS URL can replace the simulated canvas without
// touching the state machine: swap the "live surface" render branch for an
// <video> element wired to stream.playbackSrc via hls.js (see packages/web
// src/components/player legacy implementation for a working reference).
export function VideoPlayer({
  stream,
  creator,
  theaterMode,
  onToggleTheater,
  onRequestSubscribe
}: {
  stream: Stream;
  creator: Creator;
  theaterMode: boolean;
  onToggleTheater: () => void;
  onRequestSubscribe: () => void;
}) {
  const { isSignedIn } = useDemoSession();
  const containerRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(true);
  const [connectionFailed, setConnectionFailed] = useState(false);
  const [matureConfirmed, setMatureConfirmed] = useState(false);
  const [notifyMe, setNotifyMe] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [captionsOn, setCaptionsOn] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const isFlakyDemo = stream.id === "stream_pixel_live";

  useEffect(() => {
    setLoading(true);
    setConnectionFailed(false);
    const t = window.setTimeout(() => {
      setLoading(false);
      if (isFlakyDemo) setConnectionFailed(true);
    }, 750);
    return () => window.clearTimeout(t);
  }, [stream.id, isFlakyDemo]);

  useEffect(() => {
    function onFsChange() {
      setFullscreen(Boolean(document.fullscreenElement));
    }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen().catch(() => undefined);
    }
  }

  function retryConnection() {
    setConnectionFailed(false);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 600);
  }

  const gradient = `linear-gradient(135deg, ${stream.thumbnailAccent[0]}30, ${stream.thumbnailAccent[1]}20)`;

  return (
    <div
      ref={containerRef}
      className="relative aspect-video w-full overflow-hidden rounded-lg border border-surface-border bg-black"
      style={{ background: `#050507` }}
    >
      {loading && <LoadingState />}

      {!loading && connectionFailed && <ConnectionFailedState onRetry={retryConnection} />}

      {!loading && !connectionFailed && stream.status === "starting_soon" && (
        <StartingSoonState creator={creator} stream={stream} notifyMe={notifyMe} onToggleNotify={() => setNotifyMe((v) => !v)} isSignedIn={isSignedIn} />
      )}

      {!loading && !connectionFailed && stream.status === "offline" && <OfflineState creator={creator} />}

      {!loading && !connectionFailed && stream.status === "ended" && <EndedState stream={stream} />}

      {!loading && !connectionFailed && stream.status === "interrupted" && <InterruptedState />}

      {!loading && !connectionFailed && stream.status === "live" && (
        <>
          {stream.matureContent && !matureConfirmed ? (
            <MatureGateState onConfirm={() => setMatureConfirmed(true)} />
          ) : stream.subscriberOnly ? (
            <SubscriberOnlyState creator={creator} onSubscribe={onRequestSubscribe} />
          ) : (
            <>
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: gradient }}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.07),transparent_60%)]" />
                {playing ? (
                  <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={96} />
                ) : (
                  <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={96} />
                )}
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded bg-brand-red px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  <span className="h-1.5 w-1.5 animate-pulse-live rounded-full bg-white" /> Live
                </span>
                <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs text-ink-muted">
                  Simulated playback surface · uptime {formatUptime(stream.startedAt)}
                </span>
                {captionsOn && (
                  <span className="absolute bottom-16 left-1/2 -translate-x-1/2 rounded bg-black/80 px-3 py-1 text-sm text-white">
                    [captions] {creator.displayName} is talking about {stream.category.toLowerCase()}…
                  </span>
                )}
              </div>
              <PlayerControls
                playing={playing}
                onTogglePlay={() => setPlaying((v) => !v)}
                muted={muted}
                volume={volume}
                onVolumeChange={(v) => {
                  setVolume(v);
                  setMuted(false);
                }}
                onToggleMute={() => setMuted((v) => !v)}
                captionsOn={captionsOn}
                onToggleCaptions={() => setCaptionsOn((v) => !v)}
                theaterMode={theaterMode}
                onToggleTheater={onToggleTheater}
                fullscreen={fullscreen}
                onToggleFullscreen={toggleFullscreen}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-raised text-ink-muted">
      <Loader2 size={24} className="animate-spin" aria-hidden />
      <p className="text-sm">Connecting to broadcast…</p>
    </div>
  );
}

function ConnectionFailedState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised px-6 text-center">
      <AlertTriangle size={26} className="text-brand-red" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-ink">Playback connection failed</p>
        <p className="mt-1 text-xs text-ink-muted">We couldn&apos;t reach the video edge server. Check your connection and retry.</p>
      </div>
      <button onClick={onRetry} className="focus-ring flex items-center gap-1.5 rounded-md bg-ink px-3.5 py-2 text-xs font-semibold text-surface hover:bg-ink/90">
        <RotateCw size={13} /> Retry
      </button>
    </div>
  );
}

function StartingSoonState({
  creator,
  stream,
  notifyMe,
  onToggleNotify,
  isSignedIn
}: {
  creator: Creator;
  stream: Stream;
  notifyMe: boolean;
  onToggleNotify: () => void;
  isSignedIn: boolean;
}) {
  const nextEntry = creator.schedule[0];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised px-6 text-center">
      <Avatar color={creator.avatarColor} initials={creator.avatarInitials} size={64} />
      <div>
        <p className="text-base font-semibold text-ink">Starting soon</p>
        <p className="mt-1 text-sm text-ink-muted">{stream.title}</p>
        {nextEntry && <p className="mt-1 text-xs text-ink-faint">Scheduled for {formatScheduleTime(nextEntry.startsAt)}</p>}
      </div>
      <button
        onClick={onToggleNotify}
        disabled={!isSignedIn}
        aria-pressed={notifyMe}
        title={isSignedIn ? undefined : "Sign in to get notified"}
        className={`focus-ring flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
          notifyMe ? "bg-brand-cyan/15 text-brand-cyan" : "bg-ink text-surface hover:bg-ink/90"
        }`}
      >
        <Bell size={13} /> {notifyMe ? "We'll notify you" : "Notify me when live"}
      </button>
    </div>
  );
}

function OfflineState({ creator }: { creator: Creator }) {
  const nextEntry = creator.schedule[0];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-raised px-6 text-center">
      <Tv2 size={26} className="text-ink-faint" aria-hidden />
      <p className="text-base font-semibold text-ink">{creator.displayName} is offline</p>
      {nextEntry ? (
        <p className="flex items-center gap-1.5 text-sm text-ink-muted">
          <Clock size={13} /> Next stream: {formatScheduleTime(nextEntry.startsAt)}
        </p>
      ) : (
        <p className="text-sm text-ink-muted">No upcoming streams scheduled yet — check recent VODs below.</p>
      )}
    </div>
  );
}

function EndedState({ stream }: { stream: Stream }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-raised px-6 text-center">
      <p className="text-base font-semibold text-ink">Stream ended</p>
      <p className="text-sm text-ink-muted">&ldquo;{stream.title}&rdquo; has ended. The full replay will publish as a VOD shortly.</p>
    </div>
  );
}

function InterruptedState() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface-raised px-6 text-center">
      <Loader2 size={22} className="animate-spin text-brand-purple" aria-hidden />
      <p className="text-base font-semibold text-ink">Broadcast interrupted</p>
      <p className="max-w-xs text-sm text-ink-muted">The creator&apos;s connection dropped. The stream will resume automatically if they reconnect.</p>
    </div>
  );
}

function MatureGateState({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised px-6 text-center">
      <ShieldAlert size={26} className="text-amber-400" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-ink">This stream is marked mature</p>
        <p className="mt-1 max-w-xs text-xs text-ink-muted">
          The creator has flagged this broadcast as mature content. Confirm you&apos;re okay viewing content like strong language or intense themes.
        </p>
      </div>
      <button onClick={onConfirm} className="focus-ring rounded-md bg-ink px-4 py-2 text-xs font-semibold text-surface hover:bg-ink/90">
        Continue to stream
      </button>
    </div>
  );
}

function SubscriberOnlyState({ creator, onSubscribe }: { creator: Creator; onSubscribe: () => void }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-raised px-6 text-center">
      <Lock size={24} className="text-brand-purple" aria-hidden />
      <div>
        <p className="text-sm font-semibold text-ink">Subscribers-only broadcast</p>
        <p className="mt-1 max-w-xs text-xs text-ink-muted">{creator.displayName} has limited this stream to subscribers.</p>
      </div>
      <button onClick={onSubscribe} className="focus-ring rounded-md bg-brand-purple px-4 py-2 text-xs font-semibold text-white hover:bg-brand-purple/90">
        Subscribe to watch
      </button>
    </div>
  );
}
