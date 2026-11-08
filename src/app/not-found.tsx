import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Aperture } from 'lucide-react';

export default function NotFound() {
  const quickCategories = [
    { label: 'Photo Studios', href: '/studios?category=Photo%20Studio' },
    { label: 'Film Stages', href: '/studios?category=Film%20Stage' },
    { label: 'Podcast Lounges', href: '/studios?category=Podcast%20Lounge' },
    { label: 'Music Suites', href: '/studios?category=Music%20Suite' },
  ];

  return (
    <div className="min-h-[72vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-6">
        <div className="relative border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl p-6 bg-white/50 dark:bg-zinc-900/40 backdrop-blur-xs">
          <div className="absolute top-2 left-2 size-2 border-t-2 border-l-2 border-amber-500" />
          <div className="absolute top-2 right-2 size-2 border-t-2 border-r-2 border-amber-500" />
          <div className="absolute bottom-2 left-2 size-2 border-b-2 border-l-2 border-amber-500" />
          <div className="absolute bottom-2 right-2 size-2 border-b-2 border-r-2 border-amber-500" />

          <div className="flex items-center justify-center gap-3">
            <Aperture className="size-6 text-amber-500 animate-spin" style={{ animationDuration: '12s' }} />
            <span className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 font-mono">
              404
            </span>
          </div>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        Stage Not Found
      </h1>

      <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm mx-auto">
        The requested space or page route is unavailable.
      </p>

      <div className="flex items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-md shadow-amber-500/20"
        >
          <ArrowLeft className="size-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-zinc-100 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors border border-zinc-200 dark:border-zinc-800"
        >
          <Search className="size-3.5" />
          <span>Browse Studios</span>
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] text-zinc-400 uppercase font-semibold mr-1">Direct Jump:</span>
        {quickCategories.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="px-2.5 py-1 text-xs rounded-lg bg-zinc-100/70 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 hover:text-amber-500 transition-colors"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
