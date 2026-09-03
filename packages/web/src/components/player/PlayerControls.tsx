"use client";

import { useState } from "react";
import { Captions, Maximize, Minimize, Pause, Play, Settings, Volume1, Volume2, VolumeX } from "lucide-react";

const QUALITIES = ["Auto", "1080p60", "720p60", "480p", "160p"];

export function PlayerControls({
  playing,
  onTogglePlay,
  muted,
  volume,
  onVolumeChange,
  onToggleMute,
  captionsOn,
  onToggleCaptions,
  theaterMode,
  onToggleTheater,
  fullscreen,
  onToggleFullscreen
}: {
  playing: boolean;
  onTogglePlay: () => void;
  muted: boolean;
  volume: number;
  onVolumeChange: (v: number) => void;
  onToggleMute: () => void;
  captionsOn: boolean;
  onToggleCaptions: () => void;
  theaterMode: boolean;
  onToggleTheater: () => void;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const [qualityOpen, setQualityOpen] = useState(false);
  const [quality, setQuality] = useState("Auto");
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 bg-gradient-to-t from-black/85 to-transparent px-3 py-2.5">
      <button onClick={onTogglePlay} aria-label={playing ? "Pause" : "Play"} className="focus-ring rounded p-1.5 text-white hover:bg-white/10">
        {playing ? <Pause size={17} /> : <Play size={17} />}
      </button>

      <div className="group flex items-center">
        <button onClick={onToggleMute} aria-label={muted ? "Unmute" : "Mute"} className="focus-ring rounded p-1.5 text-white hover:bg-white/10">
          <VolumeIcon size={17} />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={muted ? 0 : volume}
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          aria-label="Volume"
          className="w-0 accent-brand-magenta opacity-0 transition-all duration-150 group-hover:w-20 group-hover:opacity-100 focus:w-20 focus:opacity-100"
        />
      </div>

      <span className="ml-1 rounded border border-brand-cyan/40 bg-brand-cyan/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-cyan">
        Low latency
      </span>

      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onToggleCaptions}
          aria-pressed={captionsOn}
          aria-label="Toggle captions"
          className={`focus-ring rounded p-1.5 hover:bg-white/10 ${captionsOn ? "text-brand-cyan" : "text-white"}`}
        >
          <Captions size={17} />
        </button>

        <div className="relative">
          <button
            onClick={() => setQualityOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={qualityOpen}
            aria-label="Video quality"
            className="focus-ring flex items-center gap-1 rounded p-1.5 text-white hover:bg-white/10"
          >
            <Settings size={16} />
          </button>
          {qualityOpen && (
            <>
              <button aria-hidden tabIndex={-1} className="fixed inset-0 z-10" onClick={() => setQualityOpen(false)} />
              <div className="absolute bottom-9 right-0 z-20 w-32 rounded-md border border-surface-border bg-surface-panel py-1 shadow-card">
                <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-ink-faint">Quality</p>
                {QUALITIES.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setQuality(q);
                      setQualityOpen(false);
                    }}
                    className={`block w-full px-3 py-1.5 text-left text-xs ${quality === q ? "text-brand-cyan" : "text-ink-muted hover:text-ink"}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <button
          onClick={onToggleTheater}
          aria-pressed={theaterMode}
          aria-label="Toggle theater mode"
          className={`focus-ring hidden rounded p-1.5 hover:bg-white/10 sm:block ${theaterMode ? "text-brand-cyan" : "text-white"}`}
        >
          <TheaterIcon />
        </button>

        <button onClick={onToggleFullscreen} aria-pressed={fullscreen} aria-label="Toggle fullscreen" className="focus-ring rounded p-1.5 text-white hover:bg-white/10">
          {fullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
        </button>
      </div>
    </div>
  );
}

function TheaterIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <rect x="6" y="9" width="12" height="6" rx="1" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  );
}
