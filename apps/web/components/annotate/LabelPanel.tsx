'use client';

import {
  FEATURE_TAGS,
  type FeatureTag,
  type ForgeObject,
} from '@exoforge/types';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

export function LabelPanel({
  objectHint,
}: {
  objectHint: ForgeObject['type'];
}) {
  const [objectId, setObjectId] = useState<string | null>(null);
  const [attention, setAttention] = useState(false);
  const [tags, setTags] = useState<FeatureTag[]>([]);
  const [confidence, setConfidence] = useState(0.7);
  const [message, setMessage] = useState(
    'Load the next object, then mark what you see.',
  );

  async function loadNext() {
    const response = await fetch('/api/objects/next', { method: 'POST' });
    if (!response.ok) {
      setMessage('Queue is empty.');
      setObjectId(null);
      return;
    }
    const body = await response.json();
    setObjectId(body.object.id);
    setAttention(Boolean(body.attentionCheck));
    setTags([]);
    setMessage(`${body.object.type} seed ${body.object.seed}`);
  }

  useEffect(() => {
    const client = createSupabaseBrowser();
    if (!client) return;
    const channel = client
      .channel('labels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'labels' },
        () => {
          setMessage('A new label arrived.');
        },
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, []);

  async function submit() {
    if (!objectId) return;
    const response = await fetch('/api/labels', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        objectId,
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
    setMessage(`Saved.${check}`);
    setObjectId(null);
  }

  return (
    <section className="space-y-3 border-t border-slate-800 pt-4">
      <h2 className="font-medium">Annotate ({objectHint})</h2>
      <p className="text-slate-400">{message}</p>
      {attention ? (
        <p className="text-amber-300">
          Attention check: include the known features.
        </p>
      ) : null}
      <button
        type="button"
        className="rounded bg-slate-700 px-3 py-1"
        onClick={() => void loadNext()}
      >
        Next object
      </button>
      <ul className="space-y-1">
        {FEATURE_TAGS.map((tag) => (
          <li key={tag}>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={(event) => {
                  setTags((current) =>
                    event.target.checked
                      ? [...current, tag]
                      : current.filter((item) => item !== tag),
                  );
                }}
              />
              {tag}
            </label>
          </li>
        ))}
      </ul>
      <label className="block">
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
      <button
        type="button"
        className="rounded bg-accent px-3 py-1 text-ink"
        onClick={() => void submit()}
      >
        Submit
      </button>
    </section>
  );
}
