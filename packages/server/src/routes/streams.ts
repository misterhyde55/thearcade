import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { requireAuth, optionalAuth, type AuthedRequest } from "../middleware/auth.js";
import { levelForXp } from "../lib/xp.js";

export const streamsRouter = Router();

function streamCard(stream: {
  id: string;
  title: string;
  isLive: boolean;
  viewerCount: number;
  startedAt: Date | null;
  thumbnailSeed: number;
  category: { slug: string; name: string; emoji: string } | null;
  user: { username: string; displayName: string; avatarColor: string; xp: number };
}) {
  return {
    id: stream.id,
    title: stream.title,
    isLive: stream.isLive,
    viewerCount: stream.viewerCount,
    startedAt: stream.startedAt,
    thumbnailSeed: stream.thumbnailSeed,
    category: stream.category,
    channel: {
      username: stream.user.username,
      displayName: stream.user.displayName,
      avatarColor: stream.user.avatarColor,
      level: levelForXp(stream.user.xp)
    }
  };
}

streamsRouter.get("/live", async (req, res) => {
  const categorySlug = typeof req.query.category === "string" ? req.query.category : undefined;
  const streams = await prisma.stream.findMany({
    where: {
      isLive: true,
      category: categorySlug ? { slug: categorySlug } : undefined
    },
    include: { user: true, category: true },
    orderBy: { viewerCount: "desc" }
  });
  res.json({ streams: streams.map(streamCard) });
});

streamsRouter.get("/channel/:username", optionalAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { username: req.params.username },
    include: { stream: { include: { category: true, user: true } } }
  });
  if (!user || !user.stream) return res.status(404).json({ error: "Channel not found." });

  let isFollowing = false;
  if (req.auth) {
    const follow = await prisma.follow.findUnique({
      where: { followerId_followedId: { followerId: req.auth.userId, followedId: user.id } }
    });
    isFollowing = Boolean(follow);
  }

  const followerCount = await prisma.follow.count({ where: { followedId: user.id } });

  res.json({
    stream: streamCard(user.stream),
    bio: user.bio,
    followerCount,
    isFollowing,
    isOwner: req.auth?.userId === user.id
  });
});

const updateSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  categorySlug: z.string().optional()
});

streamsRouter.patch("/me", requireAuth, async (req: AuthedRequest, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Invalid update." });

  const category = parsed.data.categorySlug
    ? await prisma.category.findUnique({ where: { slug: parsed.data.categorySlug } })
    : undefined;

  const stream = await prisma.stream.update({
    where: { userId: req.auth!.userId },
    data: {
      title: parsed.data.title,
      categoryId: parsed.data.categorySlug ? category?.id ?? null : undefined
    },
    include: { user: true, category: true }
  });
  res.json({ stream: streamCard(stream) });
});

streamsRouter.post("/follow/:username", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.status(404).json({ error: "User not found." });
  if (target.id === req.auth!.userId) {
    return res.status(400).json({ error: "You can't follow yourself, high scorer." });
  }

  await prisma.follow.upsert({
    where: { followerId_followedId: { followerId: req.auth!.userId, followedId: target.id } },
    update: {},
    create: { followerId: req.auth!.userId, followedId: target.id }
  });
  res.status(201).json({ following: true });
});

streamsRouter.delete("/follow/:username", requireAuth, async (req: AuthedRequest, res) => {
  const target = await prisma.user.findUnique({ where: { username: req.params.username } });
  if (!target) return res.status(404).json({ error: "User not found." });

  await prisma.follow
    .delete({
      where: { followerId_followedId: { followerId: req.auth!.userId, followedId: target.id } }
    })
    .catch(() => undefined);
  res.json({ following: false });
});
