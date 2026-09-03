import { Router } from "express";
import { prisma } from "../lib/prisma.js";
import { levelForXp } from "../lib/xp.js";

export const chatRouter = Router();

chatRouter.get("/:channel/history", async (req, res) => {
  const messages = await prisma.chatMessage.findMany({
    where: { channel: req.params.channel },
    include: { user: true },
    orderBy: { createdAt: "desc" },
    take: 50
  });

  res.json({
    messages: messages.reverse().map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      user: {
        username: m.user.username,
        displayName: m.user.displayName,
        avatarColor: m.user.avatarColor,
        level: levelForXp(m.user.xp)
      }
    }))
  });
});
