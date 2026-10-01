import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { cohensKappa, f1Series } from '@/lib/data/impact';
import { listLabels, listModels, tagHistogram } from '@/lib/data/memory';

export async function GET() {
  const labels = listLabels();
  return NextResponse.json({
    labelCount: labels.length,
    kappa: cohensKappa(labels),
    f1: f1Series(labels.length),
    tags: tagHistogram(),
    models: listModels(),
  });
}
