import { Router } from "express";
import multer from "multer";
import { Employee } from "../models";
import { authRequired, logAudit } from "../middleware/auth";
import type { AuthRequest } from "../middleware/auth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Create employee (HR can create for anyone, Employee can create only own)
router.post("/", authRequired, upload.single("avatar"), async (req: AuthRequest, res) => {
  const { name, dateOfJoining, salary, ownerId } = req.body as { name: string; dateOfJoining: string; salary: string; ownerId?: string };
  if (!name || !dateOfJoining || !salary) return res.status(400).json({ error: "Missing fields" });
  const owner = req.user!.role === "HR" && ownerId ? ownerId : req.user!._id;
  const avatar = req.file
    ? { data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname, size: req.file.size }
    : undefined;
  const created = await Employee.create({ owner, name, dateOfJoining: new Date(dateOfJoining), salary: Number(salary), avatar });
  await logAudit(req.user!._id.toString(), "CREATE", "Employee", created._id.toString());
  res.status(201).json(created);
});

// List employees with filters
router.get("/", authRequired, async (req: AuthRequest, res) => {
  const { name, minSalary, maxSalary, minExpMonths, maxExpMonths } = req.query as Record<string, string | undefined>;
  const user = req.user!;
  const query: any = {};
  if (user.role === "Employee") query.owner = user._id; // restrict
  if (name) query.name = { $regex: name, $options: "i" };
  if (minSalary || maxSalary) query.salary = { ...(minSalary ? { $gte: Number(minSalary) } : {}), ...(maxSalary ? { $lte: Number(maxSalary) } : {}) };
  // Experience filter: compute range by converting to dateOfJoining bounds
  if (minExpMonths || maxExpMonths) {
    const now = new Date();
    const minMonths = Number(minExpMonths || 0);
    const maxMonths = Number(maxExpMonths || 1000 * 12);
    const maxDoJ = new Date(now.getFullYear(), now.getMonth() - minMonths, now.getDate());
    const minDoJ = new Date(now.getFullYear(), now.getMonth() - maxMonths, now.getDate());
    query.dateOfJoining = { $gte: minDoJ, $lte: maxDoJ };
  }
  const items = await Employee.find(query).sort({ createdAt: -1 });
  await logAudit(user._id.toString(), "READ", "Employee", items[0]?._id?.toString() || user._id.toString(), { count: items.length });
  res.json(items);
});

// Get single (Employee can see only own)
router.get("/:id", authRequired, async (req: AuthRequest, res) => {
  const user = req.user!;
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ error: "Not found" });
  if (user.role === "Employee" && emp.owner.toString() !== user._id.toString()) return res.status(403).json({ error: "Forbidden" });
  await logAudit(user._id.toString(), "READ", "Employee", emp._id.toString());
  res.json(emp);
});

// Update (Employee can update only own)
router.put("/:id", authRequired, upload.single("avatar"), async (req: AuthRequest, res) => {
  const user = req.user!;
  const emp = await Employee.findById(req.params.id);
  if (!emp) return res.status(404).json({ error: "Not found" });
  if (user.role === "Employee" && emp.owner.toString() !== user._id.toString()) return res.status(403).json({ error: "Forbidden" });
  const updates: any = {};
  if (req.body.name) updates.name = req.body.name;
  if (req.body.dateOfJoining) updates.dateOfJoining = new Date(req.body.dateOfJoining);
  if (req.body.salary) updates.salary = Number(req.body.salary);
  if (req.file) updates.avatar = { data: req.file.buffer, contentType: req.file.mimetype, filename: req.file.originalname, size: req.file.size };
  const updated = await Employee.findByIdAndUpdate(emp._id, updates, { new: true });
  await logAudit(user._id.toString(), "UPDATE", "Employee", emp._id.toString(), { updates: Object.keys(updates) });
  res.json(updated);
});

// Delete (Employee cannot delete; only HR)
router.delete("/:id", authRequired, async (req: AuthRequest, res) => {
  const user = req.user!;
  if (user.role !== "HR") return res.status(403).json({ error: "Forbidden" });
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Not found" });
  await logAudit(user._id.toString(), "DELETE", "Employee", req.params.id);
  res.json({ ok: true });
});

// Avatar fetch
router.get("/:id/avatar", authRequired, async (req: AuthRequest, res) => {
  const user = req.user!;
  const emp = await Employee.findById(req.params.id);
  if (!emp || !emp.avatar?.data) return res.status(404).end();
  if (user.role === "Employee" && emp.owner.toString() !== user._id.toString()) return res.status(403).json({ error: "Forbidden" });
  res.setHeader("Content-Type", emp.avatar.contentType || "application/octet-stream");
  res.send(emp.avatar.data);
});

export default router;
