import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import { authRouter } from "./routes/auth.js";
import { streamsRouter } from "./routes/streams.js";
import { categoriesRouter } from "./routes/categories.js";
import { chatRouter } from "./routes/chat.js";
import { attachRealtime } from "./realtime.js";
import { createMediaServer } from "./media/rtmp.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRouter);
app.use("/api/streams", streamsRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/chat", chatRouter);

const httpServer = createServer(app);
attachRealtime(httpServer, CORS_ORIGIN);

httpServer.listen(PORT, () => {
  console.log(`[api] listening on :${PORT}`);
});

if (process.env.DISABLE_RTMP !== "true") {
  try {
    const nms = createMediaServer();
    nms.run();
    console.log(`[rtmp] ingest ready on rtmp://localhost:${process.env.RTMP_PORT ?? 1935}/live/<streamKey>`);
  } catch (err) {
    console.warn("[rtmp] media server failed to start (is ffmpeg installed?). API + chat still work.", err);
  }
}
