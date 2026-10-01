'use client';

import { FEATURE_TAGS } from '@exoforge/types';
import { useEffect } from 'react';
import { LabeledSlider } from '@/components/ui/Controls';
import { usePlanetStore } from '@/lib/planet/store';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

export function LabelPanel() {
  const tags = usePlanetStore((s) => s.tags);
  const confidence = usePlanetStore((s) => s.confidence);
  const toast = usePlanetStore((s) => s.toast);
  const toggleTag = usePlanetStore((s) => s.toggleTag);
  const setConfidence = usePlanetStore((s) => s.setConfidence);
  const setToast = usePlanetStore((s) => s.setToast);
  const setSeed = usePlanetStore((s) => s.setSeed);

  useEffect(() => {
    const client = createSupabaseBrowser();
    if (!client) return;
    const channel = client
      .channel('labels')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'labels' },
        () => {
          setToast('A new label arrived.');
        },
      )
      .subscribe();
    return () => {
      void client.removeChannel(channel);
    };
  }, [setToast]);

  async function nextObject() {
    const response = await fetch('/api/objects/next', { method: 'POST' });
    if (!response.ok) {
      setToast('Queue is empty.');
      return;
    }
    const body = await response.json();
    setSeed(body.object.seed);
    setToast(`Loaded seed ${body.object.seed}.`);
  }

  async function submit() {
    if (tags.length === 0) {
      setToast('Choose at least one tag.');
      return;
    }
    const next = await fetch('/api/objects/next', { method: 'POST' });
    const queued = next.ok ? await next.json() : null;
    const objectId = queued?.object?.id;
    if (!objectId) {
      setToast('No object to label.');
      return;
    }
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
    if (!response.ok) {
      setToast('Submit failed.');
      return;
    }
    setToast('Label saved.');
    usePlanetStore.setState({ tags: [] });
  }

  return (
    <section className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          className="rounded-lg bg-[#4a9eff] px-3 py-2 text-sm font-medium text-black hover:brightness-110"
          onClick={() => void nextObject()}
        >
          Next object
        </button>
        <button
          type="button"
          className="rounded-lg border border-white/15 px-3 py-2 text-sm hover:bg-white/10"
          onClick={() => void submit()}
        >
          Submit
        </button>
      </div>
      <ul className="grid grid-cols-2 gap-1 text-sm">
        {FEATURE_TAGS.map((tag) => (
          <li key={tag}>
            <label className="flex items-center gap-2 rounded-lg px-1 py-1 hover:bg-white/5">
              <input
                type="checkbox"
                checked={tags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              {tag}
            </label>
          </li>
        ))}
      </ul>
      <LabeledSlider
        label="Confidence"
        min={0}
        max={1}
        step={0.05}
        value={confidence}
        onChange={setConfidence}
      />
      {toast ? (
        <p className="rounded-lg bg-sky-950 px-3 py-2 text-sm text-sky-100">
          {toast}
        </p>
      ) : null}
    </section>
  );
}
