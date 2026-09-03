"use client";

// Demo Session — stands in for real authentication in this prototype pass.
//
// The Arcade's real auth (packages/server) already issues JWTs for basic
// accounts, but almost none of the new creator-tooling surface (dashboard,
// subscriptions, moderation, analytics) has a backend yet. Rather than half
// -wire two auth systems, this prototype uses one clearly-labeled demo
// session so every screen is explorable. Swapping this for real session
// data later means changing this file, not the ~30 components that read
// `useDemoSession()`.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CREATORS, getCreatorByUsername } from "./mock-data";
import type { Creator } from "./types";

export type DemoRole = "guest" | "viewer" | "creator";

export interface ViewerIdentity {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  avatarInitials: string;
}

const DEFAULT_VIEWER: ViewerIdentity = {
  id: "vw_demo",
  username: "arcade_viewer",
  displayName: "Arcade Viewer",
  avatarColor: "#22d3ee",
  avatarInitials: "AV"
};

const DEMO_CREATOR_USERNAME = "MisterHyde55";
const STORAGE_KEY = "arcade.demoSession.v1";

interface StoredSession {
  role: DemoRole;
  followedUsernames: string[];
  notificationReadIds: string[];
  subscriptions: Record<string, string>;
}

interface DemoSessionValue {
  role: DemoRole;
  viewer: ViewerIdentity;
  creator: Creator | null;
  isSignedIn: boolean;
  followedUsernames: string[];
  signInAsViewer: () => void;
  signInAsCreator: () => void;
  signOut: () => void;
  isFollowing: (username: string) => boolean;
  toggleFollow: (username: string) => void;
  markNotificationRead: (id: string) => void;
  readNotificationIds: string[];
  subscriptions: Record<string, string>;
  subscribeTo: (username: string, tierId: string) => void;
  cancelSubscription: (username: string) => void;
  isSubscribedTo: (username: string) => boolean;
}

const DemoSessionContext = createContext<DemoSessionValue | null>(null);

const EMPTY_SESSION: StoredSession = { role: "guest", followedUsernames: [], notificationReadIds: [], subscriptions: {} };

function loadStored(): StoredSession {
  if (typeof window === "undefined") return EMPTY_SESSION;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SESSION;
    const parsed = JSON.parse(raw) as StoredSession;
    return {
      role: parsed.role ?? "guest",
      followedUsernames: parsed.followedUsernames ?? [],
      notificationReadIds: parsed.notificationReadIds ?? [],
      subscriptions: parsed.subscriptions ?? {}
    };
  } catch {
    return EMPTY_SESSION;
  }
}

export function DemoSessionProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<DemoRole>("guest");
  const [followedUsernames, setFollowedUsernames] = useState<string[]>([]);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);
  const [subscriptions, setSubscriptions] = useState<Record<string, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = loadStored();
    setRole(stored.role);
    setFollowedUsernames(stored.followedUsernames);
    setReadNotificationIds(stored.notificationReadIds);
    setSubscriptions(stored.subscriptions);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: StoredSession = { role, followedUsernames, notificationReadIds: readNotificationIds, subscriptions };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [role, followedUsernames, readNotificationIds, subscriptions, hydrated]);

  const signInAsViewer = useCallback(() => setRole("viewer"), []);
  const signInAsCreator = useCallback(() => setRole("creator"), []);
  const signOut = useCallback(() => setRole("guest"), []);

  const isFollowing = useCallback(
    (username: string) => followedUsernames.includes(username),
    [followedUsernames]
  );

  const toggleFollow = useCallback((username: string) => {
    setFollowedUsernames((prev) =>
      prev.includes(username) ? prev.filter((u) => u !== username) : [...prev, username]
    );
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setReadNotificationIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const subscribeTo = useCallback((username: string, tierId: string) => {
    setSubscriptions((prev) => ({ ...prev, [username]: tierId }));
  }, []);

  const cancelSubscription = useCallback((username: string) => {
    setSubscriptions((prev) => {
      const next = { ...prev };
      delete next[username];
      return next;
    });
  }, []);

  const isSubscribedTo = useCallback((username: string) => username in subscriptions, [subscriptions]);

  const creator = role === "creator" ? getCreatorByUsername(DEMO_CREATOR_USERNAME) ?? null : null;

  const viewer: ViewerIdentity =
    role === "creator" && creator
      ? {
          id: creator.id,
          username: creator.username,
          displayName: creator.displayName,
          avatarColor: creator.avatarColor,
          avatarInitials: creator.avatarInitials
        }
      : DEFAULT_VIEWER;

  const value = useMemo<DemoSessionValue>(
    () => ({
      role,
      viewer,
      creator,
      isSignedIn: role !== "guest",
      followedUsernames,
      signInAsViewer,
      signInAsCreator,
      signOut,
      isFollowing,
      toggleFollow,
      markNotificationRead,
      readNotificationIds,
      subscriptions,
      subscribeTo,
      cancelSubscription,
      isSubscribedTo
    }),
    [
      role,
      viewer,
      creator,
      followedUsernames,
      signInAsViewer,
      signInAsCreator,
      signOut,
      isFollowing,
      toggleFollow,
      markNotificationRead,
      readNotificationIds,
      subscriptions,
      subscribeTo,
      cancelSubscription,
      isSubscribedTo
    ]
  );

  return <DemoSessionContext.Provider value={value}>{children}</DemoSessionContext.Provider>;
}

export function useDemoSession(): DemoSessionValue {
  const ctx = useContext(DemoSessionContext);
  if (!ctx) throw new Error("useDemoSession must be used within DemoSessionProvider");
  return ctx;
}

export function suggestedCreatorsForViewer(): Creator[] {
  return CREATORS.slice(0, 6);
}
