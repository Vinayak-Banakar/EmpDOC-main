import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuditLog, IUser, User } from "../models";
import type { Role } from "../models";

export interface AuthRequest extends Request {
  user?: IUser;
}

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export function authRequired(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    (async () => {
      const user = await User.findById(payload.userId);
      if (!user) return res.status(401).json({ error: "Unauthorized" });
      req.user = user;
      next();
    })().catch((e) => next(e));
  } catch (e) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export function requireRole(role: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    return next();
  };
}

export async function logAudit(userId: string, action: "CREATE"|"READ"|"UPDATE"|"DELETE", targetType: "Employee"|"User", targetId: string, meta?: Record<string, any>) {
  try {
    await AuditLog.create({ user: userId, action, targetType, targetId, meta });
  } catch (e) {
    console.error("Audit log failed", e);
  }
}
