export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  xp: number;
  level: number;
  createdAt: string;
}

export interface ChannelSummary {
  username: string;
  displayName: string;
  avatarColor: string;
  level: number;
}

export interface CategoryRef {
  slug: string;
  name: string;
  emoji: string;
}

export interface StreamCardData {
  id: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: string | null;
  thumbnailSeed: number;
  category: CategoryRef | null;
  channel: ChannelSummary;
}

export interface Category extends CategoryRef {
  liveCount: number;
}

export interface ChatMessageData {
  id: string;
  body: string;
  createdAt: string;
  user: ChannelSummary;
}
