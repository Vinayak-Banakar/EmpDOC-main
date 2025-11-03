import { useEffect, useState } from "react";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface Employee {
  _id?: string;
  name: string;
  dateOfJoining: string;
  salary: number | string;
  experienceMonths?: number;
  experienceYears?: number;
}

export default function EmployeeForm({ existing, onSaved }: { existing?: Employee | null; onSaved: (e: any) => void }) {
  const [form, setForm] = useState<Employee>({ name: "", dateOfJoining: "", salary: "" });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existing) setForm({
      _id: existing._id,
      name: existing.name,
      dateOfJoining: existing.dateOfJoining?.slice(0,10),
      salary: existing.salary,
      experienceMonths: existing.experienceMonths,
      experienceYears: existing.experienceYears,
    });
  }, [existing]);

  const onSubmit = async () => {
    setLoading(true);
    const fd = new FormData();
    fd.append("name", String(form.name));
    fd.append("dateOfJoining", String(form.dateOfJoining));
    fd.append("salary", String(form.salary));
    if (file) fd.append("avatar", file);

    try {
      const res = existing?._id
        ? await api.put(`/employees/${existing._id}`, fd, { headers: { "Content-Type": "multipart/form-data" } })
        : await api.post(`/employees`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      onSaved(res.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Name</Label>
          <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Jane Doe" />
        </div>
        <div className="space-y-2">
          <Label>Date of Joining</Label>
          <Input type="date" value={form.dateOfJoining} onChange={(e) => setForm((f) => ({ ...f, dateOfJoining: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Salary</Label>
          <Input type="number" value={form.salary} onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label>Avatar (optional)</Label>
          <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </div>
      </div>
      <Button onClick={onSubmit} disabled={loading}>{loading ? "Saving..." : existing?._id ? "Update" : "Save"}</Button>
      {existing?.experienceYears !== undefined && (
        <p className="text-sm text-muted-foreground">Experience: {existing.experienceYears} years ({existing.experienceMonths} months)</p>
      )}
    </div>
  );
}
