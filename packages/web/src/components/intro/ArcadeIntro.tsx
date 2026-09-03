"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Coins, Volume2, VolumeX } from "lucide-react";
import { CabinetFrame } from "@/components/player/CabinetFrame";
import { isSoundMuted, playCoinSound, playConfirmBlip, playStartupSweep, setSoundMuted } from "@/lib/arcade-sound";

const SESSION_KEY = "arcade.introSeen";

type Phase = "gate" | "coin" | "credit" | "ready" | "transition" | "hidden";

// Timings tuned so the full Insert Coin -> platform sequence lands at ~1.4s,
// matching "short, exciting, not annoying" from the brief.
const COIN_MS = 420;
const CREDIT_MS = 260;
const READY_MS = 260;
const TRANSITION_MS = 480;

export function ArcadeIntro() {
  const [phase, setPhase] = useState<Phase>("gate");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [muted, setMuted] = useState(true);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const timers = useRef<number[]>([]);

  // Decide, before the browser paints, whether this session has already
  // seen the intro — avoids a visible flash of the gate screen on a return
  // visit within the same tab session (see comment below).
  useLayoutEffect(() => {
    const seen = typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "1";
    const prefersReduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReducedMotion(prefersReduced);
    setMuted(isSoundMuted());
    if (seen) setPhase("hidden");
  }, []);

  useLayoutEffect(() => {
    if (phase === "gate") startButtonRef.current?.focus();
  }, [phase]);

  // Only clear pending timers on a real unmount — clearing them on every
  // phase change would wipe out the very timers `insertCoin` just queued,
  // since the sequence advances phase synchronously as it schedules them.
  useEffect(() => {
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  function queue(fn: () => void, ms: number) {
    timers.current.push(window.setTimeout(fn, ms));
  }

  function finish() {
    window.sessionStorage.setItem(SESSION_KEY, "1");
    setPhase("hidden");
  }

  function insertCoin() {
    if (reducedMotion) {
      playConfirmBlip();
      finish();
      return;
    }
    playCoinSound();
    setPhase("coin");
    queue(() => setPhase("credit"), COIN_MS);
    queue(() => {
      playConfirmBlip();
      setPhase("ready");
    }, COIN_MS + CREDIT_MS);
    queue(() => {
      playStartupSweep();
      setPhase("transition");
    }, COIN_MS + CREDIT_MS + READY_MS);
    queue(finish, COIN_MS + CREDIT_MS + READY_MS + TRANSITION_MS);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    setSoundMuted(next);
  }

  if (phase === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Arcade entrance"
      className="fixed inset-0 z-[300] flex items-center justify-center overflow-hidden bg-black px-4"
    >
      {/* Dark room ambience: soft cabinet-light glows + a receding grid floor */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="arcade-grid-bg absolute inset-x-0 bottom-0 h-2/3 opacity-70" />
        <div
          className={`absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-brand-red/25 blur-[90px] ${reducedMotion ? "" : "animate-flicker"}`}
        />
        <div
          className={`absolute -right-24 top-1/3 h-72 w-72 rounded-full bg-brand-purple/25 blur-[90px] ${reducedMotion ? "" : "animate-flicker"}`}
          style={{ animationDelay: "1.4s" }}
        />
        <div
          className={`absolute bottom-0 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-brand-cyan/10 blur-[100px] ${reducedMotion ? "" : "animate-flicker"}`}
          style={{ animationDelay: "2.6s" }}
        />
      </div>

      <div className="relative w-full max-w-lg">
        <CabinetFrame>
          <div className="screen-vignette relative flex min-h-[26rem] flex-col items-center justify-center gap-7 overflow-hidden rounded-lg border border-black/60 bg-gradient-to-b from-[#1a0209] via-[#0b0b10] to-[#05050a] px-6 py-12 text-center sm:min-h-[28rem]">
            {!reducedMotion && (
              <div
                aria-hidden
                className="animate-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"
              />
            )}
            <div className="screen-scanlines pointer-events-none absolute inset-0" aria-hidden />

            <div className="relative">
              <p className="font-pixel text-[9px] tracking-[0.3em] text-brand-cyan/80 sm:text-[10px]">A LIVE CREATOR PLATFORM</p>
              <h1 className="font-pixel mt-3 text-2xl leading-relaxed text-transparent sm:text-4xl">
                <span className="text-gradient-brand drop-shadow-[0_0_18px_rgba(224,51,156,0.45)]">THE ARCADE</span>
              </h1>
            </div>

            <div className="relative flex min-h-[7rem] flex-col items-center justify-center gap-4">
              {phase === "gate" && (
                <>
                  <p className={`font-pixel text-xs text-brand-cyan sm:text-sm ${reducedMotion ? "" : "animate-blink"}`}>PRESS START</p>
                  <button
                    ref={startButtonRef}
                    onClick={insertCoin}
                    className="arcade-button focus-ring pixel-corners flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-brand-red/90"
                  >
                    <Coins size={18} /> Insert Coin
                  </button>
                  <p className="font-pixel text-[9px] text-ink-faint">
                    PLAYER ONE <span className="text-ink-faint/60">· STANDING BY</span>
                  </p>
                </>
              )}

              {phase === "coin" && (
                <div className="relative h-16 w-16" aria-hidden>
                  <div className="animate-coin-drop absolute inset-0 flex items-center justify-center rounded-full border-2 border-amber-300 bg-gradient-to-b from-amber-200 to-amber-500 text-amber-900 shadow-[0_0_18px_rgba(251,191,36,0.6)]">
                    <Coins size={26} />
                  </div>
                  <span className="sr-only">Inserting coin…</span>
                </div>
              )}

              {phase === "credit" && <p className="font-pixel text-lg text-amber-400 sm:text-xl">CREDIT 1</p>}

              {(phase === "ready" || phase === "transition") && (
                <p className="font-pixel flex items-center gap-2 text-xs text-brand-cyan sm:text-sm">
                  <span className="cabinet-light h-2 w-2 rounded-full bg-brand-cyan" style={{ boxShadow: "0 0 0 2px rgba(34,211,238,0.35), 0 0 12px 2px rgba(34,211,238,0.65)" }} />
                  PLAYER ONE READY
                </p>
              )}
            </div>

            <p className="font-pixel relative text-[8px] text-ink-faint/50 sm:text-[9px]">© THE ARCADE — NO QUARTERS REQUIRED</p>
          </div>
        </CabinetFrame>

        {phase === "gate" && (
          <div className="mt-4 flex items-center justify-between px-1">
            <button
              onClick={finish}
              className="focus-ring rounded-md px-2 py-1 text-xs font-medium text-ink-faint hover:text-ink"
            >
              Skip Intro
            </button>
            <button
              onClick={toggleMute}
              aria-pressed={!muted}
              aria-label={muted ? "Unmute arcade sounds" : "Mute arcade sounds"}
              className="focus-ring flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-faint hover:text-ink"
            >
              {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {muted ? "Sound off" : "Sound on"}
            </button>
          </div>
        )}
      </div>

      {phase === "transition" && (
        <>
          <div aria-hidden className="animate-screen-flash pointer-events-none fixed inset-0 bg-white" />
          <div aria-hidden className="animate-zoom-through pointer-events-none fixed inset-0 flex items-center justify-center">
            <div className="h-40 w-40 rounded-full bg-brand-cyan/40 blur-2xl" />
          </div>
        </>
      )}
    </div>
  );
}
