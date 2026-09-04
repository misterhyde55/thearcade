// Central type definitions for The Arcade prototype.
// These are the shapes a real API/database would eventually return —
// keeping them typed here means swapping mock-data.ts for real fetches
// later doesn't require touching component code.

export type StreamStatus =
  | "live"
  | "starting_soon"
  | "offline"
  | "ended"
  | "interrupted";

export type BadgeType = "creator" | "moderator" | "founder" | "subscriber" | "vip";

export interface SocialLink {
  label: string;
  url: string;
}

export interface User {
  id: string;
  username: string;
  displayName: string;
  avatarColor: string;
  avatarInitials: string;
  isCreator: boolean;
  createdAt: string;
}

export interface SubscriptionTier {
  id: string;
  name: string;
  priceMonthly: number;
  perks: string[];
  isFoundingAvailable: boolean;
  foundingSlotsRemaining?: number;
}

export interface ScheduleEntry {
  id: string;
  title: string;
  category: string;
  startsAt: string;
  durationMinutes: number;
}

export interface CommunityPost {
  id: string;
  body: string;
  postedAt: string;
  imageAccent: string;
  likeCount: number;
  commentCount: number;
}

export interface Creator extends User {
  isCreator: true;
  bannerAccent: [string, string];
  channelColor: string;
  bio: string;
  verified: boolean;
  socialLinks: SocialLink[];
  followerCount: number;
  subscriberCount: number;
  category: string;
  tags: string[];
  language: string;
  matureContent: boolean;
  isSmallCreator: boolean;
  growthRate30d: number;
  avgRetentionPct: number;
  scheduleConsistencyPct: number;
  subscriptionTiers: SubscriptionTier[];
  schedule: ScheduleEntry[];
  communityPosts: CommunityPost[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  liveChannelCount: number;
  totalViewers: number;
}

export interface Stream {
  id: string;
  creatorId: string;
  title: string;
  category: string;
  tags: string[];
  status: StreamStatus;
  viewerCount: number;
  startedAt: string | null;
  thumbnailAccent: [string, string];
  matureContent: boolean;
  subscriberOnly: boolean;
  language: string;
  playbackKind: "demo" | "hls";
  playbackSrc: string | null;
}

export interface VOD {
  id: string;
  creatorId: string;
  title: string;
  category: string;
  durationMinutes: number;
  viewCount: number;
  publishedAt: string;
  thumbnailAccent: [string, string];
  visibility: "public" | "subscribers" | "private";
}

export interface Clip {
  id: string;
  creatorId: string;
  vodId: string | null;
  title: string;
  clippedByUsername: string;
  durationSeconds: number;
  viewCount: number;
  createdAt: string;
  thumbnailAccent: [string, string];
}

export interface ChatBadgeSet {
  badges: BadgeType[];
}

export interface ChatMessage {
  id: string;
  channelUsername: string;
  username: string;
  displayName: string;
  color: string;
  badges: BadgeType[];
  body: string;
  sentAt: string;
  replyToId?: string;
  mentions?: string[];
  deleted?: boolean;
}

export type ModerationRuleCategory =
  | "hate_conduct"
  | "harassment"
  | "spam"
  | "sexual_content"
  | "violence"
  | "impersonation"
  | "copyright";

export type ModerationDecisionMaker = "automated" | "human";

export type ModerationStatus = "active" | "under_appeal" | "overturned" | "upheld" | "expired";

export interface ModerationCase {
  id: string;
  rule: ModerationRuleCategory;
  ruleLabel: string;
  summary: string;
  evidenceDescription: string;
  evidenceTimestamp: string | null;
  decisionMaker: ModerationDecisionMaker;
  status: ModerationStatus;
  restrictionLabel: string;
  restrictionEndsAt: string | null;
  issuedAt: string;
  appealWindowHours: number;
  appealSubmittedAt?: string;
  appealResponseEtaHours?: number;
  appealHistory: { at: string; actor: string; note: string }[];
}

export type NotificationKind =
  | "follow"
  | "subscription"
  | "live"
  | "mention"
  | "moderation"
  | "system"
  | "clip";

export interface Notification {
  id: string;
  kind: NotificationKind;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
  href?: string;
}

export interface AnalyticsPoint {
  label: string;
  value: number;
}

export interface AnalyticsSummary {
  avgConcurrentViewers: number;
  peakViewers: number;
  uniqueViewers: number;
  watchTimeHours: number;
  followerGrowth30d: number;
  subscriberGrowth30d: number;
  estimatedRevenue30d: number;
  chatMessagesPerHour: number;
  retentionCurve: AnalyticsPoint[];
  discoverySources: { label: string; pct: number }[];
  deviceBreakdown: { label: string; pct: number }[];
  viewerHistory30d: AnalyticsPoint[];
  streamComparison: { title: string; date: string; avgViewers: number; peakViewers: number; durationMinutes: number }[];
}

export interface ModeratorRecord {
  id: string;
  username: string;
  addedAt: string;
  actionsLast30d: number;
}

export interface VipRecord {
  id: string;
  username: string;
  addedAt: string;
}

export interface BannedUserRecord {
  id: string;
  username: string;
  bannedAt: string;
  reason: string;
  bannedBy: string;
}

export interface ModLogEntry {
  id: string;
  actorUsername: string;
  action: string;
  targetUsername: string;
  at: string;
}

export interface PayoutRecord {
  id: string;
  periodLabel: string;
  grossRevenue: number;
  platformFee: number;
  processingFee: number;
  netPayout: number;
  status: "paid" | "processing" | "scheduled";
  paidAt: string | null;
}

export interface DiscoveryHighlight {
  creatorId: string;
  reason: string;
}

// --- Creator-first expansion: discovery, safety, money, support, governance ---

export type DiscoveryReasonIcon = "sparkles" | "trending-up" | "users" | "radio" | "heart" | "moon" | "compass" | "repeat";

export interface DiscoveryEntry {
  creatorId: string;
  reason: string;
  icon: DiscoveryReasonIcon;
}

export interface ReportRecord {
  id: string;
  reporterUsername: string;
  reporterReputation: "new_account" | "mixed_history" | "trusted";
  targetType: "chat_message" | "clip" | "stream";
  reason: string;
  submittedAt: string;
  flaggedCoordinated: boolean;
}

export interface LockdownAction {
  id: string;
  label: string;
  description: string;
  enabledByDefault: boolean;
}

export interface RevenueLineItem {
  label: string;
  amount: number;
}

export interface StreamRevenueRecord {
  streamTitle: string;
  date: string;
  subscriptions: number;
  tips: number;
  giftedSubs: number;
  ads: number;
  total: number;
}

export interface CreatorGoal {
  id: string;
  label: string;
  targetAmount: number;
  currentAmount: number;
  unit: "subscribers" | "dollars" | "followers";
  endsAt: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: "technical" | "monetization" | "moderation" | "safety" | "feature_request";
  status: "open" | "awaiting_creator" | "awaiting_support" | "resolved";
  priority: "standard" | "live_broadcast";
  createdAt: string;
  updatedAt: string;
  etaHours: number;
  messages: { author: "creator" | "support"; body: string; at: string }[];
}

export interface CopyrightClaim {
  id: string;
  vodTitle: string;
  claimedTimestamp: string;
  claimantName: string | null;
  status: "muted_segment" | "restricted" | "disputed" | "resolved_released" | "resolved_upheld";
  filedAt: string;
  description: string;
}

export interface CouncilProposal {
  id: string;
  title: string;
  summary: string;
  status: "voting" | "advisory_review" | "decided_binding" | "decided_advisory";
  votesFor: number;
  votesAgainst: number;
  closesAt: string;
  decisionType: "advisory" | "binding";
}

export interface AdSettings {
  adsEnabled: boolean;
  manualTriggerOnly: boolean;
  maxAdsPerHour: number;
  subscribersSeeAds: boolean;
  blockDuringKeyMoments: boolean;
  allowedCategories: string[];
}

export interface AdRevenueRecord {
  id: string;
  triggeredAt: string;
  durationSeconds: number;
  estimatedRevenue: number;
  trigger: "manual" | "auto";
}
