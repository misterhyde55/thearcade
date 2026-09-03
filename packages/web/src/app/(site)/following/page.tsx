"use client";

import Link from "next/link";
import { Heart, LogIn } from "lucide-react";
import { StreamCard } from "@/components/stream/StreamCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SectionKicker } from "@/components/ui/SectionKicker";
import { useDemoSession } from "@/lib/demo-session";
import { getAllChannelEntries } from "@/lib/mock-data";

export default function FollowingPage() {
  const { isSignedIn, followedUsernames } = useDemoSession();

  if (!isSignedIn) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <EmptyState
          icon={LogIn}
          title="Sign in to see your Player Favorites"
          description="Following creators keeps their live status, schedule, and VODs in one place."
          action={
            <Link href="/login" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
              Log in
            </Link>
          }
        />
      </div>
    );
  }

  const entries = getAllChannelEntries().filter((e) => followedUsernames.includes(e.creator.username));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <SectionKicker>YOUR ROSTER</SectionKicker>
      <h1 className="mb-6 text-xl font-semibold text-ink">Player Favorites</h1>
      {entries.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved yet"
          description="Follow creators from their channel page or any stream card to see them here."
          action={
            <Link href="/browse" className="focus-ring rounded-md bg-brand-magenta px-4 py-2 text-sm font-semibold text-white hover:bg-brand-magenta/90">
              Browse creators
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entries.map((e) => (
            <StreamCard key={e.stream.id} stream={e.stream} />
          ))}
        </div>
      )}
    </div>
  );
}
