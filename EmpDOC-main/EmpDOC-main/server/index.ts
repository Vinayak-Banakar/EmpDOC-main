import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { handleDemo } from "./routes/demo";
import authRoutes from "./routes/auth";
import employeeRoutes from "./routes/employees";
import dashboardRoutes from "./routes/dashboard";
import { requireDbConnected } from "./middleware/db";

// Prevent mongoose from buffering commands when not connected — fail fast instead of hanging
mongoose.set("bufferCommands", false);

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // DB connection (non-blocking)
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.warn(
      "MONGO_URI not set. API will be unavailable until configured.",
    );
  } else {
    mongoose
      .connect(uri)
      .then(() => console.log("MongoDB connected"))
      .catch((e) => console.error("MongoDB connection error", e));
  }

  // Health
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  // Demo
  app.get("/api/demo", handleDemo);

  // Feature routes
  // Auth routes: allow signup/login to run even if DB disconnected? return DB error if not connected
  app.use("/api/auth", authRoutes);

  // All employee and dashboard routes require DB connected
  app.use("/api/employees", requireDbConnected, employeeRoutes);
  app.use("/api/dashboard", requireDbConnected, dashboardRoutes);

  return app;
}
