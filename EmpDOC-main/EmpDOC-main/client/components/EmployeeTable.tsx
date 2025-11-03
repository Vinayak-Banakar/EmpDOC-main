import { useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth } from "../hooks/use-auth";

export interface EmployeeRow {
  _id: string;
  name: string;
  dateOfJoining: string;
  salary: number;
  experienceMonths?: number;
  experienceYears?: number;
}

export default function EmployeeTable({ onEdit }: { onEdit: (emp: EmployeeRow) => void }) {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ name: "", minSalary: "", maxSalary: "", minExpMonths: "", maxExpMonths: "" });
  const [rows, setRows] = useState<EmployeeRow[]>([]);

  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v as string); });
    return params.toString();
  }, [filters]);

  const fetchData = async () => {
    const res = await api.get(`/employees?${queryParams}`);
    setRows(res.data);
  };

  useEffect(() => { fetchData(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryParams]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete employee?")) return;
    await api.delete(`/employees/${id}`);
    fetchData();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 items-end">
        <div className="space-y-1 col-span-2 md:col-span-2">
          <Label>Name</Label>
          <Input placeholder="Search by name" value={filters.name} onChange={(e) => setFilters((f) => ({ ...f, name: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <Label>Min Salary</Label>
          <Input type="number" value={filters.minSalary} onChange={(e) => setFilters((f) => ({ ...f, minSalary: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <Label>Max Salary</Label>
          <Input type="number" value={filters.maxSalary} onChange={(e) => setFilters((f) => ({ ...f, maxSalary: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <Label>Min Exp (months)</Label>
          <Input type="number" value={filters.minExpMonths} onChange={(e) => setFilters((f) => ({ ...f, minExpMonths: e.target.value }))} />
        </div>
        <div className="space-y-1">
          <Label>Max Exp (months)</Label>
          <Input type="number" value={filters.maxExpMonths} onChange={(e) => setFilters((f) => ({ ...f, maxExpMonths: e.target.value }))} />
        </div>
        <Button onClick={fetchData}>Apply</Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Experience</TableHead>
              <TableHead>Salary</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r._id}>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{new Date(r.dateOfJoining).toLocaleDateString()}</TableCell>
                <TableCell>{r.experienceYears}y ({r.experienceMonths}m)</TableCell>
                <TableCell>${r.salary.toLocaleString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button variant="secondary" size="sm" onClick={() => onEdit(r)}>Edit</Button>
                  {user?.role === "HR" && (
                    <Button variant="destructive" size="sm" onClick={() => onDelete(r._id)}>Delete</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
