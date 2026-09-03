"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Info, Send, Smile, Users, WifiOff, X } from "lucide-react";
import { ChatMessageRow } from "./ChatMessageRow";
import { ChatSettingsMenu } from "./ChatSettingsMenu";
import { ViewerListModal } from "./ViewerListModal";
import { GuidelinesModal } from "./GuidelinesModal";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";
import { CHAT_SEED } from "@/lib/mock-data";
import { EMOTES, SIMULATED_INCOMING_POOL, SIMULATED_USERNAMES } from "@/lib/chat-constants";
import type { ChatMessage } from "@/lib/types";

export interface ChatMode {
  followersOnly: boolean;
  subscribersOnly: boolean;
  emoteOnly: boolean;
  slowModeSeconds: number;
  paused: boolean;
}

const DEFAULT_MODE: ChatMode = { followersOnly: false, subscribersOnly: false, emoteOnly: false, slowModeSeconds: 0, paused: false };

type ConnectionState = "connecting" | "connected" | "disconnected" | "reconnecting";

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `local_${Date.now()}_${idCounter}`;
}

export function ChatPanel({
  channelUsername,
  viewerCount,
  standalone = false
}: {
  channelUsername: string;
  viewerCount: number;
  standalone?: boolean;
}) {
  const { viewer, isSignedIn, creator, isFollowing, isSubscribedTo } = useDemoSession();
  const { push } = useToast();
  const isModerator = creator?.username === channelUsername;

  const [connection, setConnection] = useState<ConnectionState>("connecting");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [mode, setMode] = useState<ChatMode>(DEFAULT_MODE);
  const [draft, setDraft] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [emotePickerOpen, setEmotePickerOpen] = useState(false);
  const [viewerListOpen, setViewerListOpen] = useState(false);
  const [guidelinesOpen, setGuidelinesOpen] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [newMessageCount, setNewMessageCount] = useState(0);
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null);
  const [now, setNow] = useState(Date.now());

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setConnection("connecting");
    const seed = CHAT_SEED[channelUsername] ?? [];
    const t = window.setTimeout(() => {
      setMessages(seed);
      setConnection("connected");
    }, 550);
    return () => window.clearTimeout(t);
  }, [channelUsername]);

  useEffect(() => {
    function handleOffline() {
      setConnection("disconnected");
    }
    function handleOnline() {
      setConnection("reconnecting");
      window.setTimeout(() => setConnection("connected"), 1400);
    }
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  useEffect(() => {
    if (connection !== "connected" || mode.paused) return;
    const interval = window.setInterval(() => {
      const sender = SIMULATED_USERNAMES[Math.floor(Math.random() * SIMULATED_USERNAMES.length)];
      const body = SIMULATED_INCOMING_POOL[Math.floor(Math.random() * SIMULATED_INCOMING_POOL.length)];
      appendMessage({
        id: nextId(),
        channelUsername,
        username: sender.username,
        displayName: sender.username,
        color: sender.color,
        badges: Math.random() > 0.8 ? ["subscriber"] : [],
        body,
        sentAt: new Date().toISOString()
      });
    }, 5000 + Math.random() * 3000);
    return () => window.clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, mode.paused, channelUsername]);

  useEffect(() => {
    if (!cooldownUntil) return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [cooldownUntil]);

  function appendMessage(msg: ChatMessage) {
    setMessages((prev) => [...prev.slice(-149), msg]);
    if (listRef.current) {
      const el = listRef.current;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
      if (isAtBottom) {
        window.requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight;
        });
      } else {
        setNewMessageCount((c) => c + 1);
      }
    }
  }

  function onScroll() {
    const el = listRef.current;
    if (!el) return;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 60;
    setAtBottom(isAtBottom);
    if (isAtBottom) setNewMessageCount(0);
  }

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    setNewMessageCount(0);
    setAtBottom(true);
  }

  function insertEmote(code: string) {
    setDraft((d) => `${d}${d.endsWith(" ") || d === "" ? "" : " "}${code} `);
    setEmotePickerOpen(false);
  }

  const cooldownRemaining = cooldownUntil ? Math.max(0, Math.ceil((cooldownUntil - now) / 1000)) : 0;

  function disabledReason(): string | null {
    if (!isSignedIn) return "Sign in to chat";
    if (mode.paused && !isModerator) return "Chat is paused by the broadcaster";
    if (mode.followersOnly && !isModerator && !isFollowing(channelUsername)) return "Follow the channel to chat in followers-only mode";
    if (mode.subscribersOnly && !isModerator && !isSubscribedTo(channelUsername)) return "Subscribe to chat in subscribers-only mode";
    if (cooldownRemaining > 0) return `Slow mode: wait ${cooldownRemaining}s`;
    return null;
  }

  function send() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    const blockedReason = disabledReason();
    if (blockedReason) {
      push({ kind: "warning", title: "Can't send that", description: blockedReason });
      return;
    }
    if (mode.emoteOnly && !isModerator && !/^(\s*:[a-zA-Z]+:\s*)+$/.test(trimmed)) {
      push({ kind: "warning", title: "Emote-only mode", description: "Only emotes are allowed right now." });
      return;
    }

    appendMessage({
      id: nextId(),
      channelUsername,
      username: viewer.username,
      displayName: viewer.displayName,
      color: viewer.avatarColor,
      badges: isModerator ? ["creator"] : [],
      body: trimmed,
      sentAt: new Date().toISOString(),
      replyToId: replyingTo?.id
    });
    setDraft("");
    setReplyingTo(null);
    if (mode.slowModeSeconds > 0 && !isModerator) {
      setCooldownUntil(Date.now() + mode.slowModeSeconds * 1000);
    }
  }

  function deleteMessage(id: string) {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, deleted: true } : m)));
  }

  function timeoutUser(username: string, minutes: number) {
    appendMessage(systemMessage(channelUsername, `${username} was timed out for ${minutes < 60 ? `${minutes}m` : "1h"} by ${viewer.displayName}.`));
    push({ kind: "success", title: `${username} timed out`, description: `${minutes < 60 ? `${minutes} minutes` : "1 hour"} restriction applied.` });
  }

  function banUser(username: string) {
    appendMessage(systemMessage(channelUsername, `${username} was banned by ${viewer.displayName}.`));
    push({ kind: "success", title: `${username} banned`, description: "They can no longer chat in this channel." });
  }

  function openPopout() {
    window.open(`/chat-popout/${channelUsername}`, "arcade-chat-popout", "width=380,height=640,noopener,noreferrer");
  }

  const blocked = disabledReason();

  return (
    <div className={`flex h-full flex-col rounded-lg border border-surface-border bg-surface-panel ${standalone ? "" : ""}`}>
      <div className="flex items-center justify-between border-b border-surface-border px-3 py-2.5">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-ink">Stream chat</p>
          {connection === "connecting" && <span className="text-xs text-ink-faint">Connecting…</span>}
          {connection === "disconnected" && (
            <span className="flex items-center gap-1 text-xs text-brand-red">
              <WifiOff size={12} /> Disconnected
            </span>
          )}
          {connection === "reconnecting" && <span className="text-xs text-amber-400">Reconnecting…</span>}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setViewerListOpen(true)}
            aria-label="View viewer list"
            className="focus-ring flex items-center gap-1 rounded px-1.5 py-1 text-xs text-ink-faint hover:bg-surface-panel2 hover:text-ink"
          >
            <Users size={13} /> {viewerCount.toLocaleString()}
          </button>
          <button onClick={() => setGuidelinesOpen(true)} aria-label="Community guidelines" className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink">
            <Info size={14} />
          </button>
          {isModerator && <ChatSettingsMenu mode={mode} onChange={setMode} />}
          {!standalone && (
            <button onClick={openPopout} aria-label="Pop out chat" className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink">
              <ExternalLink size={14} />
            </button>
          )}
        </div>
      </div>

      {(mode.followersOnly || mode.subscribersOnly || mode.emoteOnly || mode.slowModeSeconds > 0 || mode.paused) && (
        <div className="flex flex-wrap gap-1 border-b border-surface-border px-3 py-1.5">
          {mode.paused && <ModeTag label="Chat paused" />}
          {mode.followersOnly && <ModeTag label="Followers-only" />}
          {mode.subscribersOnly && <ModeTag label="Subscribers-only" />}
          {mode.emoteOnly && <ModeTag label="Emote-only" />}
          {mode.slowModeSeconds > 0 && <ModeTag label={`Slow mode ${mode.slowModeSeconds}s`} />}
        </div>
      )}

      <div ref={listRef} onScroll={onScroll} className="relative flex-1 space-y-0.5 overflow-y-auto py-2">
        {connection === "connecting" && (
          <div className="space-y-2 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-3.5 w-3/4 animate-pulse rounded bg-surface-panel2" />
            ))}
          </div>
        )}
        {connection === "disconnected" && (
          <p className="px-3 py-6 text-center text-sm text-ink-muted">Chat disconnected. It will reconnect automatically when your connection returns.</p>
        )}
        {connection !== "connecting" && connection !== "disconnected" && messages.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-ink-faint">No messages yet. Say hello first.</p>
        )}
        {connection !== "connecting" &&
          connection !== "disconnected" &&
          messages.map((m) =>
            m.username === "system" ? (
              <p key={m.id} className="px-3 py-1 text-center text-xs text-ink-faint">
                {m.body}
              </p>
            ) : (
              <ChatMessageRow
                key={m.id}
                message={m}
                isModerator={isModerator}
                onReply={setReplyingTo}
                onDelete={deleteMessage}
                onTimeout={timeoutUser}
                onBan={banUser}
              />
            )
          )}
      </div>

      {!atBottom && newMessageCount > 0 && (
        <button
          onClick={scrollToBottom}
          className="focus-ring mx-auto mb-1 flex items-center gap-1 rounded-full bg-brand-magenta px-3 py-1 text-xs font-semibold text-white shadow-card"
        >
          {newMessageCount} new message{newMessageCount > 1 ? "s" : ""} ↓
        </button>
      )}

      <div className="border-t border-surface-border p-2">
        {replyingTo && (
          <div className="mb-1.5 flex items-center justify-between rounded bg-surface-panel2 px-2 py-1 text-xs text-ink-muted">
            Replying to <span className="mx-1 font-medium text-ink">{replyingTo.displayName}</span>
            <button onClick={() => setReplyingTo(null)} aria-label="Cancel reply" className="ml-auto text-ink-faint hover:text-ink">
              <X size={13} />
            </button>
          </div>
        )}
        {blocked && isSignedIn && <p className="mb-1.5 text-xs text-amber-400">{blocked}</p>}
        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setEmotePickerOpen((v) => !v)}
              aria-label="Insert emote"
              disabled={!isSignedIn}
              className="focus-ring rounded p-1.5 text-ink-faint hover:bg-surface-panel2 hover:text-ink disabled:opacity-40"
            >
              <Smile size={17} />
            </button>
            {emotePickerOpen && (
              <>
                <button aria-hidden tabIndex={-1} className="fixed inset-0 z-10" onClick={() => setEmotePickerOpen(false)} />
                <div className="absolute bottom-9 left-0 z-20 grid w-44 grid-cols-1 gap-0.5 rounded-md border border-surface-border bg-surface-panel p-1.5 shadow-card">
                  {EMOTES.map((e) => (
                    <button
                      key={e.code}
                      onClick={() => insertEmote(e.code)}
                      className="rounded px-2 py-1 text-left text-xs text-ink-muted hover:bg-surface-panel2 hover:text-ink"
                    >
                      {e.label} <span className="text-ink-faint">{e.code}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            disabled={!isSignedIn || connection !== "connected"}
            placeholder={isSignedIn ? "Send a message" : "Sign in to chat"}
            aria-label="Chat message"
            className="focus-ring flex-1 rounded-md border border-surface-border bg-surface-raised px-2.5 py-1.5 text-sm text-ink outline-none placeholder:text-ink-faint disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!isSignedIn || connection !== "connected"}
            aria-label="Send message"
            className="focus-ring rounded-md bg-brand-magenta p-1.5 text-white hover:bg-brand-magenta/90 disabled:opacity-40"
          >
            <Send size={15} />
          </button>
        </div>
      </div>

      <ViewerListModal open={viewerListOpen} onClose={() => setViewerListOpen(false)} viewerCount={viewerCount} />
      <GuidelinesModal open={guidelinesOpen} onClose={() => setGuidelinesOpen(false)} />
    </div>
  );
}

function ModeTag({ label }: { label: string }) {
  return <span className="rounded-full bg-surface-panel2 px-2 py-0.5 text-[10px] font-medium text-ink-muted">{label}</span>;
}

function systemMessage(channelUsername: string, body: string): ChatMessage {
  return {
    id: nextId(),
    channelUsername,
    username: "system",
    displayName: "System",
    color: "#6b6b78",
    badges: [],
    body,
    sentAt: new Date().toISOString()
  };
}
