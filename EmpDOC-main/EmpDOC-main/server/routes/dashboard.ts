import { Router } from "express";
import { Employee } from "../models";
import { authRequired } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/salary", authRequired, async (req: AuthRequest, res) => {
  const user = req.user!;
  if (user.role !== "HR") return res.status(403).json({ error: "Forbidden" });

  const employees = await Employee.find({});

  const salaries = employees.map((e) => e.salary);
  const avgSalary = salaries.length ? salaries.reduce((a, b) => a + b, 0) / salaries.length : 0;
  const maxSalary = salaries.length ? Math.max(...salaries) : 0;

  const buckets = [
    { label: "0-2y", min: 0, max: 24 },
    { label: "2-5y", min: 25, max: 60 },
    { label: "5-10y", min: 61, max: 120 },
    { label: "10+y", min: 121, max: 10_000 },
  ];

  const distribution = buckets.map((b) => ({ label: b.label, count: 0 }));
  employees.forEach((e) => {
    const doj = e.dateOfJoining;
    const months = (new Date().getFullYear() - doj.getFullYear()) * 12 + (new Date().getMonth() - doj.getMonth());
    const idx = buckets.findIndex((b) => months >= b.min && months <= b.max);
    if (idx >= 0) distribution[idx].count += 1;
  });

  res.json({ avgSalary, maxSalary, distribution });
});

export default router;
