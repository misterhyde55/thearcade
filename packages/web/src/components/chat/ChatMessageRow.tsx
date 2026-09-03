"use client";

import { useState } from "react";
import { MoreVertical, Reply, Trash2 } from "lucide-react";
import { ChatBadge } from "@/components/ui/Badge";
import type { ChatMessage } from "@/lib/types";

function renderBody(body: string) {
  const parts = body.split(/(@\w+|:[a-zA-Z]+:)/g);
  return parts.map((part, i) => {
    if (part.startsWith("@")) {
      return (
        <span key={i} className="font-semibold text-brand-cyan">
          {part}
        </span>
      );
    }
    if (/^:[a-zA-Z]+:$/.test(part)) {
      return (
        <span key={i} className="mx-0.5 rounded bg-brand-purple/15 px-1.5 py-0.5 text-xs font-semibold text-brand-purple">
          {part.replace(/:/g, "")}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export function ChatMessageRow({
  message,
  isModerator,
  onReply,
  onDelete,
  onTimeout,
  onBan
}: {
  message: ChatMessage;
  isModerator: boolean;
  onReply: (message: ChatMessage) => void;
  onDelete: (id: string) => void;
  onTimeout: (username: string, minutes: number) => void;
  onBan: (username: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  if (message.deleted) {
    return <p className="px-3 py-1 text-xs italic text-ink-faint">Message removed by a moderator.</p>;
  }

  return (
    <div className="group relative px-3 py-1 hover:bg-surface-panel2/60">
      {message.replyToId && <p className="ml-1 text-[11px] text-ink-faint">↳ replying to a message above</p>}
      <p className="break-words text-sm leading-snug">
        <span className="mr-1 inline-flex items-center gap-0.5 align-middle">
          {message.badges.map((b) => (
            <ChatBadge key={b} type={b} />
          ))}
        </span>
        <span className="font-semibold" style={{ color: message.color }}>
          {message.displayName}
        </span>
        <span className="text-ink-faint">: </span>
        <span className="text-ink/90">{renderBody(message.body)}</span>
      </p>

      <div className="absolute right-1 top-1 hidden items-center gap-0.5 rounded bg-surface-panel px-0.5 group-hover:flex">
        <button
          onClick={() => onReply(message)}
          aria-label={`Reply to ${message.displayName}`}
          className="focus-ring rounded p-1 text-ink-faint hover:text-ink"
        >
          <Reply size={13} />
        </button>
        {isModerator && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Moderation actions"
              className="focus-ring rounded p-1 text-ink-faint hover:text-ink"
            >
              <MoreVertical size={13} />
            </button>
            {menuOpen && (
              <>
                <button aria-hidden tabIndex={-1} className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 z-20 mt-1 w-40 rounded-md border border-surface-border bg-surface-panel py-1 shadow-card">
                  <button
                    onClick={() => {
                      onDelete(message.id);
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs text-ink-muted hover:bg-surface-panel2 hover:text-ink"
                  >
                    <Trash2 size={12} /> Delete message
                  </button>
                  {[1, 10, 60].map((m) => (
                    <button
                      key={m}
                      onClick={() => {
                        onTimeout(message.username, m);
                        setMenuOpen(false);
                      }}
                      className="flex w-full px-3 py-1.5 text-left text-xs text-ink-muted hover:bg-surface-panel2 hover:text-ink"
                    >
                      Timeout {m < 60 ? `${m}m` : "1h"}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onBan(message.username);
                      setMenuOpen(false);
                    }}
                    className="flex w-full px-3 py-1.5 text-left text-xs font-medium text-brand-red hover:bg-brand-red/10"
                  >
                    Ban user
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
