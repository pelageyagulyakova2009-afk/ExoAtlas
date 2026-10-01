'use client';

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

interface Impact {
  labelCount: number;
  kappa: number;
  f1: Array<{ n: number; f1: number }>;
  tags: Record<string, number>;
  models: Array<{ version: number }>;
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
    <main className="mx-auto max-w-4xl space-y-8 px-6 py-8">
      <h1 className="text-2xl font-semibold">Impact</h1>
      <p className="text-slate-300">
        Labels {impact?.labelCount ?? 0}. Kappa{' '}
        {impact ? impact.kappa.toFixed(3) : '—'}. Model versions{' '}
        {impact?.models.length ?? 0}.
      </p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={impact?.f1 ?? []}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="n" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 1]} />
            <Tooltip />
            <Line dataKey="f1" stroke="#7dd3fc" dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={tags}>
            <CartesianGrid stroke="#1e293b" />
            <XAxis dataKey="tag" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="count" fill="#38bdf8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
