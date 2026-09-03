"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import type { StreamCardData } from "@/lib/types";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Chat } from "@/components/Chat";

interface ChannelResponse {
  stream: StreamCardData;
  bio: string;
  followerCount: number;
  isFollowing: boolean;
  isOwner: boolean;
}

export default function ChannelPage() {
  const params = useParams<{ username: string }>();
  const { user, token } = useAuth();
  const [data, setData] = useState<ChannelResponse | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);

  useEffect(() => {
    api<ChannelResponse>(`/api/streams/channel/${params.username}`, { token })
      .then(setData)
      .catch((err) => {
        if (err instanceof ApiError) setNotFound(true);
      });
  }, [params.username, token]);

  async function toggleFollow() {
    if (!data || !user) return;
    setFollowBusy(true);
    try {
      if (data.isFollowing) {
        await api(`/api/streams/follow/${params.username}`, { method: "DELETE", token });
        setData({ ...data, isFollowing: false, followerCount: data.followerCount - 1 });
      } else {
        await api(`/api/streams/follow/${params.username}`, { method: "POST", token });
        setData({ ...data, isFollowing: true, followerCount: data.followerCount + 1 });
      }
    } finally {
      setFollowBusy(false);
    }
  }

  if (notFound) {
    return <p className="font-mono text-arcade-orange">No cabinet found for &ldquo;{params.username}&rdquo;.</p>;
  }
  if (!data) return <p className="font-mono text-arcade-cyan/60">Loading...</p>;

  const { stream } = data;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      <div>
        <VideoPlayer username={params.username} isLive={stream.isLive} />

        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-mono text-xl text-white">{stream.title}</h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ background: stream.channel.avatarColor }} />
              <span className="font-mono text-arcade-cyan">{stream.channel.displayName}</span>
              <span className="font-mono text-xs text-arcade-magenta">Lv.{stream.channel.level}</span>
              <span className="font-mono text-xs text-arcade-cyan/50">
                · {data.followerCount} followers
              </span>
            </div>
            {stream.category && (
              <p className="mt-1 font-mono text-sm text-arcade-yellow/80">
                {stream.category.emoji} {stream.category.name}
              </p>
            )}
            {data.bio && <p className="mt-2 max-w-prose font-mono text-sm text-arcade-cyan/70">{data.bio}</p>}
          </div>

          {user && !data.isOwner && (
            <button
              onClick={toggleFollow}
              disabled={followBusy}
              className={`rounded border-2 px-4 py-2 font-pixel text-[10px] disabled:opacity-50 ${
                data.isFollowing
                  ? "border-arcade-border text-arcade-cyan/70 hover:border-arcade-orange hover:text-arcade-orange"
                  : "border-arcade-magenta bg-arcade-magenta/10 text-neon-magenta hover:bg-arcade-magenta/20"
              }`}
            >
              {data.isFollowing ? "FOLLOWING" : "+ FOLLOW"}
            </button>
          )}
        </div>
      </div>

      <div className="h-[520px] lg:h-auto">
        <Chat channel={params.username} />
      </div>
    </div>
  );
}
