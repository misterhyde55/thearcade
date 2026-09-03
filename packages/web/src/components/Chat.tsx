"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getSocket } from "@/lib/socket";
import type { ChatMessageData } from "@/lib/types";

export function Chat({ channel }: { channel: string }) {
  const { user, token } = useAuth();
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [viewers, setViewers] = useState(0);
  const [draft, setDraft] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api<{ messages: ChatMessageData[] }>(`/api/chat/${channel}/history`)
      .then((data) => setMessages(data.messages))
      .catch(() => undefined);
  }, [channel]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("auth", token ?? undefined);
    socket.emit("join", channel);

    const onMessage = (msg: ChatMessageData) => setMessages((prev) => [...prev.slice(-99), msg]);
    const onViewers = ({ count }: { count: number }) => setViewers(count);

    socket.on("chat:message", onMessage);
    socket.on("viewers", onViewers);

    return () => {
      socket.off("chat:message", onMessage);
      socket.off("viewers", onViewers);
    };
  }, [channel, token]);

  useEffect(() => {
    const socket = getSocket();
    socket.emit("auth", token ?? undefined);
  }, [token]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  function send() {
    const trimmed = draft.trim();
    if (!trimmed || !user) return;
    getSocket().emit("chat:message", trimmed);
    setDraft("");
  }

  return (
    <div className="flex h-full flex-col border-2 border-arcade-border bg-arcade-panel">
      <div className="flex items-center justify-between border-b-2 border-arcade-border px-3 py-2">
        <span className="font-pixel text-xs text-neon-magenta">CHAT</span>
        <span className="font-mono text-xs text-arcade-cyan/70">{viewers} in the room</span>
      </div>

      <div ref={listRef} className="arcade-scrollbar flex-1 space-y-2 overflow-y-auto px-3 py-2">
        {messages.length === 0 && (
          <p className="font-mono text-xs text-arcade-cyan/40">No messages yet. Be the first credit in!</p>
        )}
        {messages.map((m) => (
          <p key={m.id} className="break-words font-mono text-sm leading-snug">
            <span className="mr-1 text-[10px] text-arcade-magenta">Lv.{m.user.level}</span>
            <span className="font-semibold" style={{ color: m.user.avatarColor }}>
              {m.user.displayName}
            </span>
            <span className="text-arcade-cyan/50">: </span>
            <span className="text-white/90">{m.body}</span>
          </p>
        ))}
      </div>

      <div className="border-t-2 border-arcade-border p-2">
        {user ? (
          <div className="flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              maxLength={300}
              placeholder="Send a message"
              className="flex-1 rounded border-2 border-arcade-border bg-arcade-bg px-2 py-1.5 font-mono text-sm text-white outline-none focus:border-arcade-cyan"
            />
            <button
              onClick={send}
              className="rounded border-2 border-arcade-cyan bg-arcade-cyan/10 px-3 font-pixel text-[10px] text-neon-cyan hover:bg-arcade-cyan/20"
            >
              GO
            </button>
          </div>
        ) : (
          <p className="text-center font-mono text-xs text-arcade-cyan/60">
            <a href="/login" className="text-neon-cyan underline">
              Log in
            </a>{" "}
            to chat and earn XP.
          </p>
        )}
      </div>
    </div>
  );
}
