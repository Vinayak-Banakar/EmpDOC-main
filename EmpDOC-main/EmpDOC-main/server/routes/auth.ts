import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

import mongoose from "mongoose";

router.post("/signup", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  const { email, password, role } = req.body as {
    email: string;
    password: string;
    role: "HR" | "Employee";
  };
  if (!email || !password || !role)
    return res.status(400).json({ error: "email, password, role required" });
  if (!["HR", "Employee"].includes(role))
    return res.status(400).json({ error: "Invalid role" });
  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ error: "Email already registered" });
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, role });
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

router.post("/login", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: "Database not connected" });
  }
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password)
    return res.status(400).json({ error: "email and password required" });
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id.toString() }, JWT_SECRET, {
    expiresIn: "7d",
  });
  res.json({
    token,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

export default router;
