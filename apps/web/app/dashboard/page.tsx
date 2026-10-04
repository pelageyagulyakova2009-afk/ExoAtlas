'use client';

/**
 * Chart cards adapted from MAY55A/SciBitHub contributions-growth-chart.tsx
 * Original author: MAY55A
 * License: AGPL-3.0
 * Adaptations: F1, kappa, and tag counts from GET /api/impact.
 */
import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Impact {
  labelCount: number;
  kappa: number;
  f1: Array<{ n: number; f1: number }>;
  tags: Record<string, number>;
}

export default function DashboardPage() {
  const [impact, setImpact] = useState<Impact | null>(null);
  useEffect(() => {
    void fetch('/api/impact')
      .then((response) => response.json())
      .then(setImpact);
  }, []);
  const tags = Object.entries(impact?.tags ?? {}).map(([tag, count]) => ({
    tag,
    count,
  }));
  return (
    <main className="grid gap-4 p-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>F1 vs labels</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={impact?.f1 ?? []}>
              <CartesianGrid stroke="#1e293b" />
              <XAxis dataKey="n" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" domain={[0, 1]} />
              <Tooltip />
              <Line dataKey="f1" stroke="#4a9eff" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Kappa {impact ? impact.kappa.toFixed(3) : '—'}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-300">
          Labels {impact?.labelCount ?? 0}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
        </CardHeader>
        <CardContent className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tags}>
              <XAxis dataKey="tag" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="count" fill="#4a9eff" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </main>
  );
}
