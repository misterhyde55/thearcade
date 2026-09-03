// Central mock-data file for The Arcade prototype.
//
// This is the single place UI components read platform content from. Every
// field here mirrors the typed interfaces in ./types.ts, which is the shape
// a real API would return. To connect a real backend, replace the functions
// at the bottom of this file (getCreatorByUsername, getStreamById, etc.)
// with real fetch/query calls — components should not need to change.

import type {
  AnalyticsSummary,
  BannedUserRecord,
  Category,
  ChatMessage,
  Clip,
  Creator,
  DiscoveryHighlight,
  ModLogEntry,
  ModerationCase,
  ModeratorRecord,
  Notification,
  PayoutRecord,
  Stream,
  VOD,
  VipRecord
} from "./types";

export const CATEGORIES: Category[] = [
  { slug: "gaming", name: "Gaming", description: "Competitive, co-op, and casual gameplay across every platform.", liveChannelCount: 214, totalViewers: 41230 },
  { slug: "just-chatting", name: "Just Chatting", description: "Conversation, commentary, and community hangouts.", liveChannelCount: 96, totalViewers: 22110 },
  { slug: "anime-manga", name: "Anime & Manga", description: "Reaction watch-alongs, reviews, and fandom discussion.", liveChannelCount: 58, totalViewers: 15870 },
  { slug: "art", name: "Art", description: "Digital painting, illustration, and design process streams.", liveChannelCount: 41, totalViewers: 6120 },
  { slug: "music", name: "Music", description: "Live production, DJ sets, and instrument practice.", liveChannelCount: 33, totalViewers: 5410 },
  { slug: "podcasts", name: "Podcasts", description: "Long-form conversation, interviews, and news commentary.", liveChannelCount: 22, totalViewers: 4980 },
  { slug: "tabletop", name: "Tabletop", description: "TTRPGs, board games, and card game nights.", liveChannelCount: 19, totalViewers: 3760 },
  { slug: "fitness", name: "Fitness", description: "Workouts, training logs, and athletic events.", liveChannelCount: 15, totalViewers: 2340 },
  { slug: "irl", name: "IRL", description: "Outdoors, travel, and everyday-life streams.", liveChannelCount: 27, totalViewers: 4870 },
  { slug: "retro-arcade", name: "Retro Arcade", description: "Speedruns, cabinet restorations, and classic-game deep dives.", liveChannelCount: 12, totalViewers: 3105 }
];

export const CREATORS: Creator[] = [
  {
    id: "cr_hyde",
    username: "MisterHyde55",
    displayName: "MisterHyde55",
    avatarColor: "#e0339c",
    avatarInitials: "MH",
    isCreator: true,
    createdAt: "2021-03-02T00:00:00Z",
    bannerAccent: ["#ff3b4e", "#8b5cf6"],
    channelColor: "#e0339c",
    bio: "Running the Hyde Pirates crew through anime reactions, variety gaming, retro reviews, and late-night podcasts. New captain briefings every week.",
    verified: true,
    socialLinks: [
      { label: "X", url: "https://x.com/misterhyde55" },
      { label: "Discord", url: "https://discord.gg/hydepirates" },
      { label: "YouTube", url: "https://youtube.com/@misterhyde55" }
    ],
    followerCount: 184300,
    subscriberCount: 6120,
    category: "anime-manga",
    tags: ["Variety", "Reactions", "Retro", "Community"],
    language: "English",
    matureContent: false,
    isSmallCreator: false,
    growthRate30d: 8.4,
    avgRetentionPct: 61,
    scheduleConsistencyPct: 92,
    subscriptionTiers: [
      { id: "tier_hyde_1", name: "Deckhand", priceMonthly: 4.99, perks: ["Ad-reduced viewing", "Subscriber badge", "Sub-only chat access"], isFoundingAvailable: true, foundingSlotsRemaining: 37 },
      { id: "tier_hyde_2", name: "First Mate", priceMonthly: 9.99, perks: ["Everything in Deckhand", "Custom chat emotes", "Monthly community post Q&A"], isFoundingAvailable: false },
      { id: "tier_hyde_3", name: "Captain's Table", priceMonthly: 24.99, perks: ["Everything in First Mate", "Discord captain role", "Vote on watch-along picks"], isFoundingAvailable: false }
    ],
    schedule: [
      { id: "sch_1", title: "Anime Reaction Night: Season Finale", category: "Anime & Manga", startsAt: daysFromNow(0, 20, 0), durationMinutes: 150 },
      { id: "sch_2", title: "Retro Review: Arcade Cabinet Deep Dive", category: "Retro Arcade", startsAt: daysFromNow(2, 18, 0), durationMinutes: 120 },
      { id: "sch_3", title: "Variety Gaming: Community Picks", category: "Gaming", startsAt: daysFromNow(4, 19, 0), durationMinutes: 180 },
      { id: "sch_4", title: "Hyde Pirates Podcast Ep. 42", category: "Podcasts", startsAt: daysFromNow(6, 21, 0), durationMinutes: 90 }
    ],
    communityPosts: [
      { id: "post_1", body: "Season finale reaction stream moved to tonight 8pm — the crew voted and the crew wins.", postedAt: daysFromNow(-1, 0, 0), imageAccent: "#e0339c", likeCount: 842, commentCount: 96 },
      { id: "post_2", body: "Hit 6,000 subscribers this week. Genuinely did not expect that this year. Thank you to every Deckhand and First Mate.", postedAt: daysFromNow(-4, 0, 0), imageAccent: "#8b5cf6", likeCount: 1310, commentCount: 204 }
    ]
  },
  {
    id: "cr_nova",
    username: "NovaStrikes",
    displayName: "Nova Strikes",
    avatarColor: "#22d3ee",
    avatarInitials: "NS",
    isCreator: true,
    createdAt: "2022-01-14T00:00:00Z",
    bannerAccent: ["#22d3ee", "#8b5cf6"],
    channelColor: "#22d3ee",
    bio: "Ranked FPS grinding with a focus on clean mechanics and honest VOD reviews. Coaching sessions on weekends.",
    verified: true,
    socialLinks: [{ label: "X", url: "https://x.com/novastrikes" }],
    followerCount: 92750,
    subscriberCount: 2140,
    category: "gaming",
    tags: ["FPS", "Ranked", "Competitive"],
    language: "English",
    matureContent: true,
    isSmallCreator: false,
    growthRate30d: 3.1,
    avgRetentionPct: 54,
    scheduleConsistencyPct: 85,
    subscriptionTiers: [
      { id: "tier_nova_1", name: "Recruit", priceMonthly: 4.99, perks: ["Ad-reduced viewing", "Subscriber badge"], isFoundingAvailable: false },
      { id: "tier_nova_2", name: "Squad Lead", priceMonthly: 9.99, perks: ["Everything in Recruit", "Priority in coaching queue"], isFoundingAvailable: false }
    ],
    schedule: [
      { id: "sch_5", title: "Ranked Grind: Road to Top 500", category: "Gaming", startsAt: daysFromNow(0, 17, 0), durationMinutes: 240 },
      { id: "sch_6", title: "VOD Review Saturday", category: "Gaming", startsAt: daysFromNow(3, 15, 0), durationMinutes: 120 }
    ],
    communityPosts: [
      { id: "post_3", body: "Coaching slots for Saturday are open. Drop your rank in the Discord queue channel.", postedAt: daysFromNow(-2, 0, 0), imageAccent: "#22d3ee", likeCount: 410, commentCount: 58 }
    ]
  },
  {
    id: "cr_pixel",
    username: "PixelPeach",
    displayName: "Pixel Peach",
    avatarColor: "#ff3b4e",
    avatarInitials: "PP",
    isCreator: true,
    createdAt: "2024-06-20T00:00:00Z",
    bannerAccent: ["#ff3b4e", "#e0339c"],
    channelColor: "#ff3b4e",
    bio: "Speedrunning SNES-era platformers and restoring a dying arcade cabinet one stream at a time. New here, glad you found me.",
    verified: false,
    socialLinks: [{ label: "Discord", url: "https://discord.gg/pixelpeach" }],
    followerCount: 3840,
    subscriberCount: 96,
    category: "retro-arcade",
    tags: ["Speedrunning", "Retro", "Restoration"],
    language: "English",
    matureContent: false,
    isSmallCreator: true,
    growthRate30d: 41.2,
    avgRetentionPct: 71,
    scheduleConsistencyPct: 97,
    subscriptionTiers: [
      { id: "tier_pixel_1", name: "Cabinet Crew", priceMonthly: 3.99, perks: ["Subscriber badge", "Sub-only chat access"], isFoundingAvailable: true, foundingSlotsRemaining: 12 }
    ],
    schedule: [
      { id: "sch_7", title: "Cabinet Restoration Part 6", category: "Retro Arcade", startsAt: daysFromNow(1, 16, 0), durationMinutes: 150 },
      { id: "sch_8", title: "Any% Speedrun Practice", category: "Retro Arcade", startsAt: daysFromNow(5, 16, 0), durationMinutes: 120 }
    ],
    communityPosts: [
      { id: "post_4", body: "The new capacitors arrived — cabinet should power on clean this week. Streaming the reveal live.", postedAt: daysFromNow(-1, 0, 0), imageAccent: "#ff3b4e", likeCount: 88, commentCount: 21 }
    ]
  },
  {
    id: "cr_lofi",
    username: "LoFiLuna",
    displayName: "LoFi Luna",
    avatarColor: "#8b5cf6",
    avatarInitials: "LL",
    isCreator: true,
    createdAt: "2023-02-11T00:00:00Z",
    bannerAccent: ["#8b5cf6", "#22d3ee"],
    channelColor: "#8b5cf6",
    bio: "Building lo-fi beats live from scratch — sample chopping, mixing, and the occasional total restart when it's not working.",
    verified: false,
    socialLinks: [{ label: "SoundCloud", url: "https://soundcloud.com/lofiluna" }],
    followerCount: 27600,
    subscriberCount: 640,
    category: "music",
    tags: ["Production", "Lo-fi", "Beatmaking"],
    language: "English",
    matureContent: false,
    isSmallCreator: false,
    growthRate30d: 12.7,
    avgRetentionPct: 66,
    scheduleConsistencyPct: 88,
    subscriptionTiers: [
      { id: "tier_lofi_1", name: "Listener", priceMonthly: 4.99, perks: ["Subscriber badge", "Access to stem downloads"], isFoundingAvailable: false }
    ],
    schedule: [{ id: "sch_9", title: "Beat Session: Rainy Day Loops", category: "Music", startsAt: daysFromNow(1, 14, 0), durationMinutes: 120 }],
    communityPosts: []
  },
  {
    id: "cr_tabletop",
    username: "TabletopTitans",
    displayName: "Tabletop Titans",
    avatarColor: "#ffb020",
    avatarInitials: "TT",
    isCreator: true,
    createdAt: "2021-11-05T00:00:00Z",
    bannerAccent: ["#ffb020", "#ff3b4e"],
    channelColor: "#ffb020",
    bio: "A rotating table of four running long-form campaigns with genuinely terrible dice luck.",
    verified: true,
    socialLinks: [{ label: "X", url: "https://x.com/tabletoptitans" }],
    followerCount: 61200,
    subscriberCount: 1870,
    category: "tabletop",
    tags: ["TTRPG", "Campaign", "Comedy"],
    language: "English",
    matureContent: false,
    isSmallCreator: false,
    growthRate30d: 5.6,
    avgRetentionPct: 74,
    scheduleConsistencyPct: 95,
    subscriptionTiers: [
      { id: "tier_tt_1", name: "Party Member", priceMonthly: 5.99, perks: ["Subscriber badge", "Session recap posts"], isFoundingAvailable: false }
    ],
    schedule: [{ id: "sch_10", title: "Campaign Session 34", category: "Tabletop", startsAt: daysFromNow(2, 19, 30), durationMinutes: 210 }],
    communityPosts: []
  },
  {
    id: "cr_ink",
    username: "InkAndIron",
    displayName: "Ink & Iron",
    avatarColor: "#22d3ee",
    avatarInitials: "II",
    isCreator: true,
    createdAt: "2022-09-18T00:00:00Z",
    bannerAccent: ["#22d3ee", "#ff3b4e"],
    channelColor: "#22d3ee",
    bio: "Digital painting and character design, from rough sketch to final render, with process talk the whole way.",
    verified: false,
    socialLinks: [{ label: "Portfolio", url: "https://inkandiron.art" }],
    followerCount: 18400,
    subscriberCount: 410,
    category: "art",
    tags: ["Illustration", "Process", "Character Design"],
    language: "English",
    matureContent: false,
    isSmallCreator: false,
    growthRate30d: 9.8,
    avgRetentionPct: 58,
    scheduleConsistencyPct: 80,
    subscriptionTiers: [{ id: "tier_ink_1", name: "Studio Pass", priceMonthly: 4.99, perks: ["Subscriber badge", "Brush pack downloads"], isFoundingAvailable: false }],
    schedule: [],
    communityPosts: []
  },
  {
    id: "cr_gwen",
    username: "GridironGwen",
    displayName: "Gridiron Gwen",
    avatarColor: "#ff3b4e",
    avatarInitials: "GG",
    isCreator: true,
    createdAt: "2023-05-30T00:00:00Z",
    bannerAccent: ["#ff3b4e", "#ffb020"],
    channelColor: "#ff3b4e",
    bio: "Strength training logs, mobility work, and honest talk about staying consistent when motivation disappears.",
    verified: false,
    socialLinks: [],
    followerCount: 9600,
    subscriberCount: 155,
    category: "fitness",
    tags: ["Strength", "Training Log"],
    language: "English",
    matureContent: false,
    isSmallCreator: true,
    growthRate30d: 22.4,
    avgRetentionPct: 63,
    scheduleConsistencyPct: 90,
    subscriptionTiers: [{ id: "tier_gwen_1", name: "Training Partner", priceMonthly: 4.99, perks: ["Subscriber badge", "Weekly program notes"], isFoundingAvailable: true, foundingSlotsRemaining: 20 }],
    schedule: [],
    communityPosts: []
  },
  {
    id: "cr_night",
    username: "TheNightShift",
    displayName: "The Night Shift",
    avatarColor: "#a4a4b2",
    avatarInitials: "NS",
    isCreator: true,
    createdAt: "2020-08-01T00:00:00Z",
    bannerAccent: ["#3a3a47", "#8b5cf6"],
    channelColor: "#8b5cf6",
    bio: "Late-night conversation, news commentary, and whatever the chat wants to talk about at 1am.",
    verified: true,
    socialLinks: [{ label: "Podcast", url: "https://nightshift.fm" }],
    followerCount: 74100,
    subscriberCount: 1420,
    category: "podcasts",
    tags: ["Commentary", "Late Night", "IRL"],
    language: "English",
    matureContent: true,
    isSmallCreator: false,
    growthRate30d: 2.9,
    avgRetentionPct: 69,
    scheduleConsistencyPct: 93,
    subscriptionTiers: [{ id: "tier_night_1", name: "Regular", priceMonthly: 4.99, perks: ["Subscriber badge", "Ad-reduced viewing"], isFoundingAvailable: false }],
    schedule: [],
    communityPosts: []
  },
  {
    id: "cr_sakura",
    username: "SakuraSpeaks",
    displayName: "Sakura Speaks",
    avatarColor: "#e0339c",
    avatarInitials: "SS",
    isCreator: true,
    createdAt: "2024-11-02T00:00:00Z",
    bannerAccent: ["#e0339c", "#8b5cf6"],
    channelColor: "#e0339c",
    bio: "Seasonal anime discussion and manga reading streams. Two months in, three months of research behind me.",
    verified: false,
    socialLinks: [],
    followerCount: 1120,
    subscriberCount: 24,
    category: "anime-manga",
    tags: ["Discussion", "Manga", "New Creator"],
    language: "English",
    matureContent: false,
    isSmallCreator: true,
    growthRate30d: 68.0,
    avgRetentionPct: 55,
    scheduleConsistencyPct: 100,
    subscriptionTiers: [{ id: "tier_sakura_1", name: "Reader", priceMonthly: 3.99, perks: ["Subscriber badge"], isFoundingAvailable: true, foundingSlotsRemaining: 47 }],
    schedule: [],
    communityPosts: []
  },
  {
    id: "cr_quinn",
    username: "QuantumQuinn",
    displayName: "Quantum Quinn",
    avatarColor: "#22d3ee",
    avatarInitials: "QQ",
    isCreator: true,
    createdAt: "2025-01-19T00:00:00Z",
    bannerAccent: ["#22d3ee", "#ff3b4e"],
    channelColor: "#22d3ee",
    bio: "Variety gaming with a strict one-run-per-game rule. Chat picks what breaks next.",
    verified: false,
    socialLinks: [],
    followerCount: 640,
    subscriberCount: 8,
    category: "gaming",
    tags: ["Variety", "New Creator"],
    language: "English",
    matureContent: false,
    isSmallCreator: true,
    growthRate30d: 112.0,
    avgRetentionPct: 48,
    scheduleConsistencyPct: 75,
    subscriptionTiers: [{ id: "tier_quinn_1", name: "Explorer", priceMonthly: 3.99, perks: ["Subscriber badge"], isFoundingAvailable: true, foundingSlotsRemaining: 50 }],
    schedule: [],
    communityPosts: []
  }
];

function daysFromNow(days: number, hour: number, minute: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 3600 * 1000).toISOString();
}

export const STREAMS: Stream[] = [
  {
    id: "stream_hyde_live",
    creatorId: "cr_hyde",
    title: "Season Finale Reaction Night — first watch, no spoilers please",
    category: "Anime & Manga",
    tags: ["Reaction", "First Watch", "Community"],
    status: "live",
    viewerCount: 12480,
    startedAt: hoursAgo(1.4),
    thumbnailAccent: ["#ff3b4e", "#8b5cf6"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_nova_live",
    creatorId: "cr_nova",
    title: "Ranked grind — Diamond push, coaching queue open",
    category: "Gaming",
    tags: ["FPS", "Ranked"],
    status: "live",
    viewerCount: 5210,
    startedAt: hoursAgo(3.1),
    thumbnailAccent: ["#22d3ee", "#8b5cf6"],
    matureContent: true,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_pixel_live",
    creatorId: "cr_pixel",
    title: "Cabinet restoration part 6 — new capacitors, fingers crossed",
    category: "Retro Arcade",
    tags: ["Restoration", "Retro"],
    status: "live",
    viewerCount: 312,
    startedAt: hoursAgo(0.6),
    thumbnailAccent: ["#ff3b4e", "#e0339c"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_lofi_live",
    creatorId: "cr_lofi",
    title: "Building a full beat from one vinyl sample",
    category: "Music",
    tags: ["Production", "Lo-fi"],
    status: "live",
    viewerCount: 1840,
    startedAt: hoursAgo(2.0),
    thumbnailAccent: ["#8b5cf6", "#22d3ee"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_tt_live",
    creatorId: "cr_tabletop",
    title: "Campaign Session 34: The Sunken Archive",
    category: "Tabletop",
    tags: ["TTRPG", "Campaign"],
    status: "live",
    viewerCount: 3960,
    startedAt: hoursAgo(0.9),
    thumbnailAccent: ["#ffb020", "#ff3b4e"],
    matureContent: false,
    subscriberOnly: true,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_night_live",
    creatorId: "cr_night",
    title: "1am thoughts: whatever chat brings up",
    category: "Podcasts",
    tags: ["Late Night", "Commentary"],
    status: "interrupted",
    viewerCount: 2470,
    startedAt: hoursAgo(0.3),
    thumbnailAccent: ["#3a3a47", "#8b5cf6"],
    matureContent: true,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_sakura_live",
    creatorId: "cr_sakura",
    title: "This season's most underrated manga adaptation",
    category: "Anime & Manga",
    tags: ["Discussion", "New Creator"],
    status: "ended",
    viewerCount: 0,
    startedAt: hoursAgo(3),
    thumbnailAccent: ["#e0339c", "#8b5cf6"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_quinn_live",
    creatorId: "cr_quinn",
    title: "One run per game until something breaks",
    category: "Gaming",
    tags: ["Variety", "New Creator"],
    status: "live",
    viewerCount: 18,
    startedAt: hoursAgo(0.2),
    thumbnailAccent: ["#22d3ee", "#ff3b4e"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_ink_soon",
    creatorId: "cr_ink",
    title: "Character sheet: full render session",
    category: "Art",
    tags: ["Illustration"],
    status: "starting_soon",
    viewerCount: 0,
    startedAt: null,
    thumbnailAccent: ["#22d3ee", "#ff3b4e"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  },
  {
    id: "stream_gwen_offline",
    creatorId: "cr_gwen",
    title: "Training Partner offline — back Thursday",
    category: "Fitness",
    tags: ["Strength"],
    status: "offline",
    viewerCount: 0,
    startedAt: null,
    thumbnailAccent: ["#ff3b4e", "#ffb020"],
    matureContent: false,
    subscriberOnly: false,
    language: "English",
    playbackKind: "demo",
    playbackSrc: null
  }
];

export const VODS: VOD[] = [
  { id: "vod_1", creatorId: "cr_hyde", title: "Episode 11 Reaction — the crew loses it", category: "Anime & Manga", durationMinutes: 118, viewCount: 48200, publishedAt: hoursAgo(48), thumbnailAccent: ["#ff3b4e", "#8b5cf6"], visibility: "public" },
  { id: "vod_2", creatorId: "cr_hyde", title: "Retro Review: The Cabinet That Started It All", category: "Retro Arcade", durationMinutes: 94, viewCount: 31500, publishedAt: hoursAgo(96), thumbnailAccent: ["#8b5cf6", "#22d3ee"], visibility: "public" },
  { id: "vod_3", creatorId: "cr_hyde", title: "Hyde Pirates Podcast Ep. 41", category: "Podcasts", durationMinutes: 88, viewCount: 19700, publishedAt: hoursAgo(170), thumbnailAccent: ["#e0339c", "#ff3b4e"], visibility: "subscribers" },
  { id: "vod_4", creatorId: "cr_nova", title: "Diamond Promotion Match", category: "Gaming", durationMinutes: 62, viewCount: 15100, publishedAt: hoursAgo(60), thumbnailAccent: ["#22d3ee", "#8b5cf6"], visibility: "public" },
  { id: "vod_5", creatorId: "cr_pixel", title: "Cabinet Restoration Part 5", category: "Retro Arcade", durationMinutes: 140, viewCount: 890, publishedAt: hoursAgo(140), thumbnailAccent: ["#ff3b4e", "#e0339c"], visibility: "public" },
  { id: "vod_6", creatorId: "cr_tabletop", title: "Campaign Session 33", category: "Tabletop", durationMinutes: 205, viewCount: 8900, publishedAt: hoursAgo(180), thumbnailAccent: ["#ffb020", "#ff3b4e"], visibility: "public" }
];

export const CLIPS: Clip[] = [
  { id: "clip_1", creatorId: "cr_hyde", vodId: "vod_1", title: "The reaction nobody was ready for", clippedByUsername: "crewmate_22", durationSeconds: 34, viewCount: 24100, createdAt: hoursAgo(40), thumbnailAccent: ["#ff3b4e", "#8b5cf6"] },
  { id: "clip_2", creatorId: "cr_hyde", vodId: "vod_2", title: "This cabinet should not still work", clippedByUsername: "arcade_fan", durationSeconds: 21, viewCount: 9700, createdAt: hoursAgo(90), thumbnailAccent: ["#8b5cf6", "#22d3ee"] },
  { id: "clip_3", creatorId: "cr_nova", vodId: "vod_4", title: "Clutch 1v3 to close the promo", clippedByUsername: "fps_daily", durationSeconds: 42, viewCount: 18200, createdAt: hoursAgo(55), thumbnailAccent: ["#22d3ee", "#8b5cf6"] }
];

export const CHAT_SEED: Record<string, ChatMessage[]> = {
  MisterHyde55: [
    { id: "c1", channelUsername: "MisterHyde55", username: "crewmate_22", displayName: "crewmate_22", color: "#22d3ee", badges: ["subscriber"], body: "NO WAY they actually did that", sentAt: hoursAgo(0.02) },
    { id: "c2", channelUsername: "MisterHyde55", username: "modAlex", displayName: "modAlex", color: "#8b5cf6", badges: ["moderator"], body: "keeping it spoiler-free in here, first-watchers say thanks", sentAt: hoursAgo(0.018) },
    { id: "c3", channelUsername: "MisterHyde55", username: "founder_ray", displayName: "founder_ray", color: "#ffb020", badges: ["founder", "subscriber"], body: "been here since day one and this might be the best episode yet", sentAt: hoursAgo(0.015) },
    { id: "c4", channelUsername: "MisterHyde55", username: "arcade_fan", displayName: "arcade_fan", color: "#ff3b4e", badges: [], body: "someone clip that reaction immediately", sentAt: hoursAgo(0.01) },
    { id: "c5", channelUsername: "MisterHyde55", username: "sakura_watches", displayName: "sakura_watches", color: "#e0339c", badges: ["subscriber"], body: "the pacing this season has been so good honestly", sentAt: hoursAgo(0.006) }
  ],
  NovaStrikes: [
    { id: "c6", channelUsername: "NovaStrikes", username: "aim_labs", displayName: "aim_labs", color: "#22d3ee", badges: ["subscriber"], body: "that crosshair placement was perfect", sentAt: hoursAgo(0.01) },
    { id: "c7", channelUsername: "NovaStrikes", username: "queue_watcher", displayName: "queue_watcher", color: "#ff3b4e", badges: [], body: "how long is the coaching queue rn", sentAt: hoursAgo(0.005) }
  ]
};

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", kind: "live", title: "NovaStrikes is live", body: "Ranked grind — Diamond push, coaching queue open", createdAt: hoursAgo(3), read: false, href: "/watch/stream_nova_live" },
  { id: "n2", kind: "subscription", title: "New subscriber", body: "queue_watcher subscribed at First Mate tier", createdAt: hoursAgo(5), read: false },
  { id: "n3", kind: "follow", title: "12 new followers today", body: "Your follower growth is up 8.4% over 30 days", createdAt: hoursAgo(9), read: true },
  { id: "n4", kind: "mention", title: "You were mentioned", body: "sakura_watches mentioned you in TheNightShift's chat", createdAt: hoursAgo(20), read: true },
  { id: "n5", kind: "moderation", title: "Appeal response ready", body: "Your appeal on case MOD-1042 has a status update", createdAt: hoursAgo(30), read: true, href: "/dashboard/moderation" },
  { id: "n6", kind: "system", title: "Payout scheduled", body: "Your October payout of $2,140.18 is scheduled for the 5th", createdAt: hoursAgo(48), read: true }
];

export const MODERATION_CASES: ModerationCase[] = [
  {
    id: "MOD-1042",
    rule: "copyright",
    ruleLabel: "Unlicensed music playback (Community Guideline 4.2)",
    summary: "A 90-second segment of licensed music was audible during a VOD between 01:12:40–01:14:10.",
    evidenceDescription: "Automated audio-fingerprint match against a licensed track database.",
    evidenceTimestamp: "01:12:40",
    decisionMaker: "automated",
    status: "under_appeal",
    restrictionLabel: "VOD muted during flagged segment",
    restrictionEndsAt: null,
    issuedAt: hoursAgo(30),
    appealWindowHours: 168,
    appealSubmittedAt: hoursAgo(6),
    appealResponseEtaHours: 48,
    appealHistory: [
      { at: hoursAgo(30), actor: "Automated Rights System", note: "Segment muted automatically pending review." },
      { at: hoursAgo(6), actor: "You", note: "Appeal submitted with licensing confirmation attached." }
    ]
  },
  {
    id: "MOD-0981",
    rule: "spam",
    ruleLabel: "Chat spam from associated account (Community Guideline 2.1)",
    summary: "A viewer account linked to your channel's mod team posted repeated promotional links.",
    evidenceDescription: "Chat log excerpt available, 14 messages between 22:03–22:04.",
    evidenceTimestamp: "22:03",
    decisionMaker: "human",
    status: "upheld",
    restrictionLabel: "24-hour timeout issued to associated account",
    restrictionEndsAt: hoursAgo(-0),
    issuedAt: hoursAgo(400),
    appealWindowHours: 168,
    appealSubmittedAt: hoursAgo(390),
    appealHistory: [
      { at: hoursAgo(400), actor: "Trust & Safety (human review)", note: "24-hour timeout applied to associated account." },
      { at: hoursAgo(390), actor: "You", note: "Appeal submitted disputing account ownership." },
      { at: hoursAgo(360), actor: "Trust & Safety (human review)", note: "Appeal reviewed. Decision uphold — ownership confirmed via login history." }
    ]
  }
];

export const MODERATORS: ModeratorRecord[] = [
  { id: "mod_1", username: "modAlex", addedAt: hoursAgo(4000), actionsLast30d: 214 },
  { id: "mod_2", username: "crewmate_22", addedAt: hoursAgo(1200), actionsLast30d: 88 }
];

export const VIPS: VipRecord[] = [
  { id: "vip_1", username: "founder_ray", addedAt: hoursAgo(6000) },
  { id: "vip_2", username: "arcade_fan", addedAt: hoursAgo(2200) }
];

export const BANNED_USERS: BannedUserRecord[] = [
  { id: "ban_1", username: "spam_bot_44", bannedAt: hoursAgo(500), reason: "Repeated promotional links after warning", bannedBy: "modAlex" },
  { id: "ban_2", username: "guest_9182", bannedAt: hoursAgo(1500), reason: "Targeted harassment of another viewer", bannedBy: "You" }
];

export const MOD_LOG: ModLogEntry[] = [
  { id: "log_1", actorUsername: "modAlex", action: "Timed out 10m", targetUsername: "loud_guest_2", at: hoursAgo(1) },
  { id: "log_2", actorUsername: "You", action: "Enabled follower-only mode", targetUsername: "—", at: hoursAgo(2) },
  { id: "log_3", actorUsername: "crewmate_22", action: "Deleted message", targetUsername: "spam_bot_44", at: hoursAgo(500) },
  { id: "log_4", actorUsername: "You", action: "Banned user", targetUsername: "spam_bot_44", at: hoursAgo(500) }
];

export const PAYOUTS: PayoutRecord[] = [
  { id: "pay_1", periodLabel: "September 2026", grossRevenue: 2890.4, platformFee: 433.56, processingFee: 84.02, netPayout: 2372.82, status: "processing", paidAt: null },
  { id: "pay_2", periodLabel: "August 2026", grossRevenue: 3120.1, platformFee: 468.02, processingFee: 90.48, netPayout: 2561.6, status: "paid", paidAt: hoursAgo(700) },
  { id: "pay_3", periodLabel: "July 2026", grossRevenue: 2440.75, platformFee: 366.11, processingFee: 70.78, netPayout: 2003.86, status: "paid", paidAt: hoursAgo(1400) }
];

export const ANALYTICS: AnalyticsSummary = {
  avgConcurrentViewers: 4210,
  peakViewers: 12480,
  uniqueViewers: 58900,
  watchTimeHours: 41200,
  followerGrowth30d: 8.4,
  subscriberGrowth30d: 11.2,
  estimatedRevenue30d: 2890.4,
  chatMessagesPerHour: 640,
  retentionCurve: [
    { label: "0m", value: 100 },
    { label: "10m", value: 88 },
    { label: "20m", value: 79 },
    { label: "30m", value: 71 },
    { label: "45m", value: 64 },
    { label: "60m", value: 58 },
    { label: "90m", value: 47 },
    { label: "120m", value: 38 }
  ],
  discoverySources: [
    { label: "Browse page", pct: 34 },
    { label: "Category page", pct: 22 },
    { label: "Search", pct: 18 },
    { label: "Direct / returning", pct: 16 },
    { label: "Shared clips", pct: 10 }
  ],
  deviceBreakdown: [
    { label: "Desktop", pct: 58 },
    { label: "Mobile", pct: 27 },
    { label: "Tablet", pct: 8 },
    { label: "TV / console", pct: 7 }
  ],
  viewerHistory30d: Array.from({ length: 14 }).map((_, i) => ({
    label: `Day ${i + 1}`,
    value: Math.round(3200 + Math.sin(i / 2) * 900 + i * 60)
  })),
  streamComparison: [
    { title: "Season Finale Reaction Night", date: "Today", avgViewers: 9800, peakViewers: 12480, durationMinutes: 140 },
    { title: "Retro Review: Cabinet Deep Dive", date: "3 days ago", avgViewers: 6200, peakViewers: 8100, durationMinutes: 118 },
    { title: "Variety Gaming: Community Picks", date: "6 days ago", avgViewers: 5100, peakViewers: 7300, durationMinutes: 176 },
    { title: "Hyde Pirates Podcast Ep. 41", date: "9 days ago", avgViewers: 3400, peakViewers: 4900, durationMinutes: 88 }
  ]
};

export const WATCH_HISTORY: { vodId: string; progressPct: number; watchedAt: string }[] = [
  { vodId: "vod_2", progressPct: 62, watchedAt: hoursAgo(20) },
  { vodId: "vod_4", progressPct: 28, watchedAt: hoursAgo(50) },
  { vodId: "vod_6", progressPct: 91, watchedAt: hoursAgo(70) }
];

export const DISCOVERY_HIGHLIGHTS: DiscoveryHighlight[] = [
  { creatorId: "cr_pixel", reason: "Fast-growing: +41% viewers over 30 days" },
  { creatorId: "cr_sakura", reason: "New creator: consistent 3x/week schedule since launch" },
  { creatorId: "cr_quinn", reason: "Highly engaged: strong chat participation relative to size" },
  { creatorId: "cr_gwen", reason: "Strong retention: viewers stay 63% of the average session" }
];

// ---- Lookup helpers (stand-ins for real API calls) ----

export function getCreatorByUsername(username: string): Creator | undefined {
  return CREATORS.find((c) => c.username.toLowerCase() === username.toLowerCase());
}

export function getCreatorById(id: string): Creator | undefined {
  return CREATORS.find((c) => c.id === id);
}

export function getStreamById(id: string): Stream | undefined {
  return STREAMS.find((s) => s.id === id);
}

export function getStreamByCreatorId(creatorId: string): Stream | undefined {
  return STREAMS.find((s) => s.creatorId === creatorId);
}

export function getLiveStreams(): Stream[] {
  return STREAMS.filter((s) => s.status === "live").sort((a, b) => b.viewerCount - a.viewerCount);
}

export function getVodsByCreatorId(creatorId: string): VOD[] {
  return VODS.filter((v) => v.creatorId === creatorId);
}

export function getClipsByCreatorId(creatorId: string): Clip[] {
  return CLIPS.filter((c) => c.creatorId === creatorId);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getAllChannelEntries(): { creator: Creator; stream: Stream }[] {
  return CREATORS.map((creator) => ({ creator, stream: getStreamByCreatorId(creator.id) })).filter(
    (entry): entry is { creator: Creator; stream: Stream } => Boolean(entry.stream)
  );
}

export function getStreamsByCategorySlug(slug: string): Stream[] {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return STREAMS.filter((s) => s.category === category.name);
}
