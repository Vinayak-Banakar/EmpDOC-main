import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../hooks/use-auth";
import AuthCard from "../components/AuthCard";
import EmployeeForm, { type Employee } from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";
import SalaryCharts from "../components/SalaryCharts";
import api from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function Index() {
  const { user, logout } = useAuth();
  const [myRecord, setMyRecord] = useState<Employee | null>(null);
  const [editEmp, setEditEmp] = useState<any | null>(null);
  const isHR = user?.role === "HR";

  const fetchMine = async () => {
    try {
      const res = await api.get("/employees");
      setMyRecord(res.data?.[0] || null);
    } catch {}
  };

  useEffect(() => { if (user?.role === "Employee") fetchMine(); }, [user]);

  const header = (
    <header className="sticky top-0 z-10 backdrop-blur bg-background/70 border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-primary rounded-md" />
          <span className="font-extrabold tracking-tight text-xl">PeopleOps</span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Badge variant="secondary">{user.email}</Badge>
              <Badge>{user.role}</Badge>
              <Button variant="outline" onClick={logout}>Logout</Button>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        {header}
        <main className="mx-auto max-w-6xl px-4">
          <section className="py-16 grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">HR & Employee Management</h1>
              <p className="text-muted-foreground text-lg">Secure JWT auth, role-based access, salary insights, and full audit trail. Employees can add their own profile; HR has full control.</p>
              <ul className="grid grid-cols-2 gap-3 text-sm">
                <li className="bg-card border rounded-lg p-3">RBAC: HR vs Employee</li>
                <li className="bg-card border rounded-lg p-3">Auto experience from DOJ</li>
                <li className="bg-card border rounded-lg p-3">Salary analytics</li>
                <li className="bg-card border rounded-lg p-3">CRUD audit logs</li>
              </ul>
            </div>
            <div className="flex justify-center"><AuthCard /></div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {header}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {isHR ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Employee Directory</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Employee</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Employee</DialogTitle>
                  </DialogHeader>
                  <EmployeeForm onSaved={() => (window.location.reload())} />
                </DialogContent>
              </Dialog>
            </div>
            <EmployeeTable onEdit={(emp) => setEditEmp(emp)} />
            <Card>
              <CardHeader><CardTitle>Salary Insights</CardTitle></CardHeader>
              <CardContent>
                <SalaryCharts />
              </CardContent>
            </Card>
            <Dialog open={!!editEmp} onOpenChange={(o) => !o && setEditEmp(null)}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Employee</DialogTitle>
                </DialogHeader>
                {editEmp && (
                  <EmployeeForm existing={editEmp} onSaved={() => (window.location.reload())} />
                )}
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold">My Profile</h2>
            <Card>
              <CardContent className="pt-6">
                <EmployeeForm existing={myRecord || undefined} onSaved={fetchMine} />
              </CardContent>
            </Card>
            {myRecord && (
              <Card>
                <CardHeader><CardTitle>My Details</CardTitle></CardHeader>
                <CardContent className="grid gap-2">
                  <div className="text-sm text-muted-foreground">Created: {new Date((myRecord as any).createdAt).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Updated: {new Date((myRecord as any).updatedAt).toLocaleString()}</div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
