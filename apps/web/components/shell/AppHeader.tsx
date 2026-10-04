/**
 * Ported from: MAY55A/SciBitHub src/components/navigation/Header.tsx and nav.tsx
 * Original author: MAY55A
 * License: AGPL-3.0
 * Adaptations: ExoForge routes only; no theme switcher, no admin/researcher roles.
 * Email is shown when a Supabase session exists.
 */
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createSupabaseBrowser } from '@/lib/supabase/browser';

const LINKS = [
  { href: '/planet/42', label: 'Planet' },
  { href: '/galaxy/7', label: 'Galaxy' },
  { href: '/annotate', label: 'Annotate' },
  { href: '/dashboard', label: 'Dashboard' },
];

export function AppHeader() {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => {
    const client = createSupabaseBrowser();
    if (!client) return;
    void client.auth
      .getUser()
      .then(({ data }) => setEmail(data.user?.email ?? null));
  }, []);
  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-white/10 bg-[#0a0a0f]/90 px-4">
      <Link href="/" className="font-semibold tracking-wide">
        ExoForge
      </Link>
      <nav className="flex gap-4 text-sm text-slate-300">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} className="hover:text-white">
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="text-xs text-slate-400">{email ?? 'Guest'}</span>
    </header>
  );
}

export function AppSidebar() {
  return (
    <aside className="hidden w-44 shrink-0 border-r border-white/10 p-3 md:block">
      <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">
        Workspace
      </p>
      <ul className="space-y-1 text-sm">
        {LINKS.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="block rounded-lg px-2 py-1.5 hover:bg-white/10"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
