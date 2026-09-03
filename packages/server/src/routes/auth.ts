import { Router } from "express";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { signToken } from "../lib/token.js";
import { requireAuth, type AuthedRequest } from "../middleware/auth.js";
import { levelForXp } from "../lib/xp.js";

export const authRouter = Router();

const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only.");

const registerSchema = z.object({
  username: usernameSchema,
  email: z.string().email(),
  password: z.string().min(8, "Password needs at least 8 characters.")
});

function publicUser(user: {
  id: string;
  username: string;
  displayName: string;
  bio: string;
  avatarColor: string;
  xp: number;
  createdAt: Date;
}) {
  return {
    id: user.id,
    username: user.username,
    displayName: user.displayName,
    bio: user.bio,
    avatarColor: user.avatarColor,
    xp: user.xp,
    level: levelForXp(user.xp),
    createdAt: user.createdAt
  };
}

authRouter.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? "Invalid input." });
  }
  const { username, email, password } = parsed.data;

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] }
  });
  if (existing) {
    return res.status(409).json({ error: "That username or email is already taken." });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const streamKey = randomBytes(16).toString("hex");

  const user = await prisma.user.create({
    data: {
      username,
      displayName: username,
      email,
      passwordHash,
      streamKey,
      stream: { create: { title: `${username}'s broadcast` } }
    }
  });

  const token = signToken({ userId: user.id, username: user.username });
  res.status(201).json({ token, user: publicUser(user) });
});

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Enter your username/email and password." });
  }
  const { usernameOrEmail, password } = parsed.data;

  const user = await prisma.user.findFirst({
    where: { OR: [{ username: usernameOrEmail }, { email: usernameOrEmail }] }
  });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ error: "Game over — wrong credentials." });
  }

  const token = signToken({ userId: user.id, username: user.username });
  res.json({ token, user: publicUser(user) });
});

authRouter.get("/me", requireAuth, async (req: AuthedRequest, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.auth!.userId } });
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user: publicUser(user), streamKey: user.streamKey });
});

authRouter.post("/stream-key/regenerate", requireAuth, async (req: AuthedRequest, res) => {
  const streamKey = randomBytes(16).toString("hex");
  await prisma.user.update({ where: { id: req.auth!.userId }, data: { streamKey } });
  res.json({ streamKey });
});
