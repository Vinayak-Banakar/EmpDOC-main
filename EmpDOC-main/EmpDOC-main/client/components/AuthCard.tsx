import { useState } from "react";
import api from "../lib/api";
import { useAuth } from "../hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AuthCard() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"HR" | "Employee" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onLogin = async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.token, res.data.user);
    } catch (e: any) {
      setError(e.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  const onSignup = async () => {
    if (!role) { setError("Select a role"); return; }
    setLoading(true); setError(null);
    try {
      const res = await api.post("/auth/signup", { email, password, role });
      login(res.data.token, res.data.user);
    } catch (e: any) {
      setError(e.response?.data?.error || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="bg-card/70 backdrop-blur border rounded-xl p-6 shadow-sm w-full max-w-md">
      <Tabs defaultValue="login">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign up</TabsTrigger>
        </TabsList>
        <TabsContent value="login" className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" onClick={onLogin} disabled={loading}>{loading ? "Loading..." : "Login"}</Button>
        </TabsContent>
        <TabsContent value="signup" className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select onValueChange={(v: any) => setRole(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HR">HR</SelectItem>
                <SelectItem value="Employee">Employee</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button className="w-full" onClick={onSignup} disabled={loading}>{loading ? "Loading..." : "Create account"}</Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
