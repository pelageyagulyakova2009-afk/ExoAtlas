import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { isAttentionCheck } from '@/lib/data/attention';
import { listLabels, nextUnlabeled } from '@/lib/data/memory';

/**
 * Queue order is the entropy-strategy placeholder (R2): unlabeled FIFO
 * until AcquisitionStrategy.score is implemented in the ML service.
 * Inspired by zooniverse/Panoptes subject selection.
 */
export async function POST() {
  const object = nextUnlabeled();
  if (!object) return NextResponse.json({ object: null }, { status: 404 });
  return NextResponse.json({
    object,
    attentionCheck: isAttentionCheck(listLabels().length + 1),
    strategy: 'entropy-queue',
  });
}
