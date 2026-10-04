'use client';

/**
 * Task chrome adapted from MAY55A/SciBitHub task header and submit flow.
 * Original author: MAY55A (layout idea)
 * License: AGPL-3.0
 * Adaptations: ExoForge R3F viewers, feature tags, existing attention and train rules.
 */
import {
  FEATURE_TAGS,
  type FeatureTag,
  type ObjectKind,
} from '@exoforge/types';
import { useState } from 'react';
import { GalaxyCanvas } from '@/components/galaxy/GalaxyScene';
import { PlanetCanvas } from '@/components/planet/PlanetScene';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { shouldPostLabel } from '@/lib/annotate/validate';
import { useGalaxyStore } from '@/lib/galaxy/store';
import { usePlanetStore } from '@/lib/planet/store';

interface Queued {
  id: string;
  seed: number;
  type: ObjectKind;
}

export default function AnnotatePage() {
  const tags = usePlanetStore((s) => s.tags);
  const toggleTag = usePlanetStore((s) => s.toggleTag);
  const confidence = usePlanetStore((s) => s.confidence);
  const setConfidence = usePlanetStore((s) => s.setConfidence);
  const setPlanetSeed = usePlanetStore((s) => s.setSeed);
  const setGalaxySeed = useGalaxyStore((s) => s.setSeed);
  const [object, setObject] = useState<Queued | null>(null);
  const [attention, setAttention] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('Load the next object.');

  async function loadNext() {
    const response = await fetch('/api/objects/next', { method: 'POST' });
    if (!response.ok) {
      setMessage('Queue is empty.');
      setObject(null);
      return;
    }
    const body = await response.json();
    const next = body.object as Queued;
    setObject(next);
    setAttention(Boolean(body.attentionCheck));
    if (next.type === 'galaxy') setGalaxySeed(next.seed);
    else setPlanetSeed(next.seed);
    usePlanetStore.setState({ tags: [] });
    const impact = await fetch('/api/impact').then((res) => res.json());
    setProgress(((impact.labelCount ?? 0) % 32) * (100 / 32));
    setMessage(`${next.type} seed ${next.seed}`);
  }

  async function submit() {
    if (!shouldPostLabel(tags) || !object) {
      setMessage('Choose at least one tag.');
      return;
    }
    const response = await fetch('/api/labels', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        objectId: object.id,
        userId: '00000000-0000-0000-0000-000000000001',
        tags,
        confidence,
      }),
    });
    const body = await response.json();
    if (!response.ok) {
      setMessage(body.error ?? 'Submit failed');
      return;
    }
    const check =
      body.attentionPassed === null
        ? ''
        : body.attentionPassed
          ? ' Attention check passed.'
          : ' Attention check failed.';
    const trained = body.model ? ' Model updated.' : '';
    setMessage(`Saved.${check}${trained}`);
    setObject(null);
    usePlanetStore.setState({ tags: [] });
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      <div className="min-w-0 flex-1">
        {object?.type === 'galaxy' ? <GalaxyCanvas /> : <PlanetCanvas />}
      </div>
      <Card className="m-3 w-80 overflow-y-auto">
        <CardHeader>
          <CardTitle>Annotate</CardTitle>
          <p className="text-sm text-slate-400">{message}</p>
          {attention ? <Badge>Attention check</Badge> : null}
          <Progress value={progress} />
        </CardHeader>
        <CardContent className="space-y-3">
          <Button type="button" onClick={() => void loadNext()}>
            Next object
          </Button>
          <ul className="grid grid-cols-2 gap-1 text-sm">
            {FEATURE_TAGS.map((tag) => (
              <li key={tag}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={tags.includes(tag as FeatureTag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              </li>
            ))}
          </ul>
          <label className="block text-xs">
            Confidence {confidence.toFixed(2)}
            <input
              className="w-full"
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={confidence}
              onChange={(event) => setConfidence(Number(event.target.value))}
            />
          </label>
          <Button type="button" variant="outline" onClick={() => void submit()}>
            Submit
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
