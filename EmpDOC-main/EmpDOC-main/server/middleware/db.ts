import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

export function requireDbConnected(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  return next();
}
