import Link from 'next/link';

export function Nav() {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-6 py-3">
      <Link href="/" className="font-semibold tracking-wide">
        ExoForge
      </Link>
      <nav className="flex gap-4 text-sm text-slate-300">
        <Link href="/planet/42">Planet</Link>
        <Link href="/galaxy/7">Galaxy</Link>
        <Link href="/dashboard">Dashboard</Link>
      </nav>
    </header>
  );
}
