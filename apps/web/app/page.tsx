import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm uppercase tracking-[0.2em] text-accent">
        Citizen science
      </p>
      <h1 className="mt-3 text-4xl font-semibold">ExoForge</h1>
      <p className="mt-4 text-lg text-slate-300">
        Generate a world, mark what you see, and feed the next generation of
        objects.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          className="rounded bg-accent px-4 py-2 font-medium text-ink"
          href="/planet/42"
        >
          Open a planet
        </Link>
        <Link
          className="rounded border border-slate-600 px-4 py-2"
          href="/galaxy/7"
        >
          Open a galaxy
        </Link>
        <Link
          className="rounded border border-slate-600 px-4 py-2"
          href="/dashboard"
        >
          Impact
        </Link>
      </div>
    </main>
  );
}
