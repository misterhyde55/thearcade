import NodeMediaServer from "node-media-server";
import { prisma } from "../lib/prisma.js";

const RTMP_PORT = Number(process.env.RTMP_PORT ?? 1935);
const MEDIA_HTTP_PORT = Number(process.env.MEDIA_HTTP_PORT ?? 8000);

// Streamers point OBS at rtmp://<host>:1935/live/<streamKey>. node-media-server
// transcodes the incoming feed to HLS segments served over MEDIA_HTTP_PORT, which
// the web player consumes with hls.js. This is what makes "going live" real instead
// of a mock: any RTMP-capable broadcaster (OBS, Streamlabs) works out of the box.
export function createMediaServer() {
  const nms = new NodeMediaServer({
    rtmp: {
      port: RTMP_PORT,
      chunk_size: 60000,
      gop_cache: true,
      ping: 30,
      ping_timeout: 60
    },
    http: {
      port: MEDIA_HTTP_PORT,
      mediaroot: "./media",
      allow_origin: "*"
    },
    trans: {
      ffmpeg: process.env.FFMPEG_PATH ?? "/usr/bin/ffmpeg",
      tasks: [
        {
          app: "live",
          hls: true,
          // 2s segments / 3 in the playlist keeps live latency low (~6-8s) vs Twitch's ~15-30s+.
          hlsFlags: "[hls_time=2:hls_list_size=3:hls_flags=delete_segments]"
        }
      ]
    }
  });

  nms.on("prePublish", async (id, streamPath) => {
    const key = streamPath.split("/").pop() ?? "";
    const user = await prisma.user.findUnique({ where: { streamKey: key } });
    if (!user) {
      const session = nms.getSession(id);
      session?.reject();
      return;
    }
  });

  nms.on("postPublish", async (_id, streamPath) => {
    const key = streamPath.split("/").pop() ?? "";
    const user = await prisma.user.findUnique({ where: { streamKey: key } });
    if (!user) return;
    await prisma.stream.update({
      where: { userId: user.id },
      data: { isLive: true, startedAt: new Date(), endedAt: null, thumbnailSeed: Date.now() }
    });
  });

  nms.on("donePublish", async (_id, streamPath) => {
    const key = streamPath.split("/").pop() ?? "";
    const user = await prisma.user.findUnique({ where: { streamKey: key } });
    if (!user) return;
    await prisma.stream.update({
      where: { userId: user.id },
      data: { isLive: false, endedAt: new Date(), viewerCount: 0 }
    });
  });

  return nms;
}
