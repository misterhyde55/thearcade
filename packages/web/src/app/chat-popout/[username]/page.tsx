"use client";

import { useParams } from "next/navigation";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { getStreamByCreatorId, getCreatorByUsername } from "@/lib/mock-data";

export default function ChatPopoutPage() {
  const params = useParams<{ username: string }>();
  const creator = getCreatorByUsername(params.username);
  const stream = creator ? getStreamByCreatorId(creator.id) : undefined;

  return (
    <div className="h-screen w-screen bg-surface p-2">
      <ChatPanel channelUsername={params.username} viewerCount={stream?.viewerCount ?? 0} standalone />
    </div>
  );
}
