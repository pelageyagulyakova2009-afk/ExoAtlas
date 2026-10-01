import { FEATURE_TAGS, type FeatureTag } from '@exoforge/types';

export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { attentionPassed, isAttentionCheck } from '@/lib/data/attention';
import { addLabel, listLabels, recordModel } from '@/lib/data/memory';
import { requestTrain, shouldTrain } from '@/lib/ml/client';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    objectId?: string;
    userId?: string;
    tags?: string[];
    confidence?: number;
  };
  if (!body.objectId || !body.userId || !Array.isArray(body.tags)) {
    return NextResponse.json({ error: 'invalid body' }, { status: 400 });
  }
  const tags = body.tags.filter((tag): tag is FeatureTag =>
    (FEATURE_TAGS as readonly string[]).includes(tag),
  );
  const confidence = Math.min(1, Math.max(0, body.confidence ?? 0.5));
  const prior = listLabels().length;
  const check = isAttentionCheck(prior + 1);
  const label = addLabel({
    objectId: body.objectId,
    userId: body.userId,
    tags,
    confidence,
  });
  const count = listLabels().length;
  let model = null;
  if (shouldTrain(count)) {
    const train = await requestTrain(count);
    model = recordModel({ labelCount: count, trained: train.trained ? 1 : 0 });
  }
  return NextResponse.json({
    label,
    attentionCheck: check,
    attentionPassed: check ? attentionPassed(tags) : null,
    model,
  });
}
