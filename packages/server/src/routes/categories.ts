import { Router } from "express";
import { prisma } from "../lib/prisma.js";

export const categoriesRouter = Router();

categoriesRouter.get("/", async (_req, res) => {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { streams: { where: { isLive: true } } } } }
  });
  res.json({
    categories: categories.map((c) => ({
      slug: c.slug,
      name: c.name,
      emoji: c.emoji,
      liveCount: c._count.streams
    }))
  });
});
