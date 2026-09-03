"use client";

import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { useDemoSession } from "@/lib/demo-session";
import { useToast } from "@/components/ui/Toast";

export function FollowButton({ username, className = "" }: { username: string; className?: string }) {
  const { isSignedIn, isFollowing, toggleFollow } = useDemoSession();
  const { push } = useToast();
  const router = useRouter();
  const following = isFollowing(username);

  function onClick() {
    if (!isSignedIn) {
      push({ kind: "warning", title: "Sign in required", description: "Log in to follow creators and build your feed." });
      router.push("/login");
      return;
    }
    toggleFollow(username);
    push({
      kind: "success",
      title: following ? `Unfollowed ${username}` : `Following ${username}`,
      description: following ? undefined : "New live notifications will show up in your bell menu."
    });
  }

  return (
    <button
      onClick={onClick}
      aria-pressed={following}
      className={`focus-ring flex items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-sm font-semibold transition ${
        following
          ? "border-surface-borderStrong bg-surface-panel2 text-ink hover:border-brand-red/50 hover:text-brand-red"
          : "border-transparent bg-ink text-surface hover:bg-ink/90"
      } ${className}`}
    >
      <Heart size={15} fill={following ? "currentColor" : "none"} />
      {following ? "Following" : "Follow"}
    </button>
  );
}
