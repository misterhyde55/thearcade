"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { MEDIA_URL } from "@/lib/api";

export function VideoPlayer({ username, isLive }: { username: string; isLive: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    if (!isLive) return;
    const video = videoRef.current;
    if (!video) return;
    const src = `${MEDIA_URL}/live/${username}.m3u8`;
    setErrored(false);

    if (Hls.isSupported()) {
      const hls = new Hls({ lowLatencyMode: true, backBufferLength: 30 });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (_evt, data) => {
        if (data.fatal) setErrored(true);
      });
      return () => hls.destroy();
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    } else {
      setErrored(true);
    }
  }, [username, isLive]);

  if (!isLive) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border-2 border-arcade-border bg-black">
        <div className="text-center font-pixel text-arcade-magenta">
          <p className="text-2xl">OFFLINE</p>
          <p className="mt-3 font-mono text-xs text-arcade-cyan/70">Check back when the cabinet lights up.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden border-2 border-arcade-border bg-black">
      <video ref={videoRef} controls autoPlay muted playsInline className="h-full w-full" />
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 font-mono text-sm text-arcade-orange">
          Signal lost — waiting for stream data...
        </div>
      )}
    </div>
  );
}
