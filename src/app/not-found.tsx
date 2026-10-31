import React from 'react';
import Link from 'next/link';
import { Aperture, Home, Film, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="relative mb-8">
        <div className="size-32 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-amber-500 mx-auto shadow-xl shadow-amber-500/10 animate-pulse">
          <Aperture className="size-16 stroke-[1.8]" />
        </div>
        <div className="absolute -top-2 -right-2 size-10 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400">
          <Film className="size-5" />
        </div>
        <div className="absolute -bottom-2 -left-2 size-9 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center shadow-md">
          <Sparkles className="size-4" />
        </div>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
        This Production Set Doesn&apos;t Exist
      </h1>

      <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 mt-3 max-w-md mx-auto leading-relaxed">
        The studio space or scene you are looking for has been relocated, unlisted, or never existed on the StudioSpace production schedule.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs bg-amber-500 text-zinc-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shadow-amber-500/25"
        >
          <Home className="size-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          href="/studios"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-xs border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <span>Explore All Studios</span>
        </Link>
      </div>
    </div>
  );
}
