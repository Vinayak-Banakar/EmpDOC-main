import { useEffect, useState } from "react";
import api from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis } from "recharts";

export default function SalaryCharts() {
  const [data, setData] = useState<{ avgSalary: number; maxSalary: number; distribution: { label: string; count: number }[] } | null>(null);
  useEffect(() => {
    api.get("/dashboard/salary").then((res) => setData(res.data));
  }, []);

  if (!data) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Average Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${data.avgSalary.toFixed(0)}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Highest Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">${data.maxSalary.toFixed(0)}</p>
        </CardContent>
      </Card>
      <Card className="lg:col-span-1 lg:row-span-1 lg:col-start-1 lg:row-start-2">
        <CardHeader>
          <CardTitle>Distribution by Experience</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.distribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis allowDecimals={false} />
              <RTooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
