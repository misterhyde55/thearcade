import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { prisma } from "./lib/prisma.js";
import { verifyToken } from "./lib/token.js";
import { levelForXp } from "./lib/xp.js";

const MESSAGE_XP = 2;
const viewerRooms = new Map<string, Set<string>>();

function roomKey(channel: string) {
  return `channel:${channel}`;
}

async function broadcastViewerCount(io: Server, channel: string) {
  const count = viewerRooms.get(channel)?.size ?? 0;
  io.to(roomKey(channel)).emit("viewers", { count });
  const stream = await prisma.stream.findFirst({ where: { user: { username: channel } } });
  if (!stream) return;
  await prisma.stream.update({
    where: { id: stream.id },
    data: { viewerCount: count, peakViewers: Math.max(stream.peakViewers, count) }
  });
}

export function attachRealtime(httpServer: HttpServer, corsOrigin: string) {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin }
  });

  io.on("connection", (socket) => {
    let currentChannel: string | null = null;
    let authedUserId: string | null = null;

    socket.on("auth", (token: string | undefined) => {
      const payload = token ? verifyToken(token) : null;
      authedUserId = payload?.userId ?? null;
    });

    socket.on("join", async (channel: string) => {
      if (typeof channel !== "string" || !channel) return;
      if (currentChannel) {
        socket.leave(roomKey(currentChannel));
        viewerRooms.get(currentChannel)?.delete(socket.id);
        void broadcastViewerCount(io, currentChannel);
      }
      currentChannel = channel;
      socket.join(roomKey(channel));
      if (!viewerRooms.has(channel)) viewerRooms.set(channel, new Set());
      viewerRooms.get(channel)!.add(socket.id);
      void broadcastViewerCount(io, channel);
    });

    socket.on("chat:message", async (body: string) => {
      if (!currentChannel || !authedUserId) return;
      const trimmed = body?.toString().trim().slice(0, 300);
      if (!trimmed) return;

      const user = await prisma.user.update({
        where: { id: authedUserId },
        data: { xp: { increment: MESSAGE_XP } }
      });

      const message = await prisma.chatMessage.create({
        data: { channel: currentChannel, body: trimmed, userId: authedUserId }
      });

      io.to(roomKey(currentChannel)).emit("chat:message", {
        id: message.id,
        body: message.body,
        createdAt: message.createdAt,
        user: {
          username: user.username,
          displayName: user.displayName,
          avatarColor: user.avatarColor,
          level: levelForXp(user.xp)
        }
      });
    });

    socket.on("disconnect", () => {
      if (currentChannel) {
        viewerRooms.get(currentChannel)?.delete(socket.id);
        void broadcastViewerCount(io, currentChannel);
      }
    });
  });

  return io;
}
