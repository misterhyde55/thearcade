import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/token.js";

export interface AuthedRequest extends Request {
  auth?: { userId: string; username: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = token ? verifyToken(token) : null;
  if (!payload) {
    return res.status(401).json({ error: "Insert coin to continue (authentication required)." });
  }
  req.auth = payload;
  next();
}

export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  const payload = token ? verifyToken(token) : null;
  if (payload) req.auth = payload;
  next();
}
