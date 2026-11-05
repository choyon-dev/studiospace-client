import React from 'react';

export default function StudioCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden shadow-xs">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 block">
        <div className="w-full h-full bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        <div className="absolute top-3 left-3 z-10">
          <div className="h-6 w-22 rounded-lg bg-zinc-950/50 backdrop-blur-md animate-pulse border border-white/5" />
        </div>
        <div className="absolute top-3 right-3 size-9 rounded-full bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md animate-pulse" />
      </div>

      <div className="flex flex-col flex-1 p-4 sm:p-5 justify-between gap-3">
        <div className="flex items-center justify-between text-xs gap-2">
          <div className="flex items-center gap-1.5 w-1/2">
            <div className="size-3.5 rounded-full bg-zinc-300 dark:bg-zinc-700 animate-pulse shrink-0" />
            <div className="h-3.5 w-24 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="size-3.5 rounded-full bg-amber-400/40 animate-pulse shrink-0" />
            <div className="h-3.5 w-12 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="h-5 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
          <div className="h-5 w-3/5 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/80 mt-auto">
          <div className="flex items-baseline gap-1.5">
            <div className="h-6 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3.5 w-6 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800 animate-pulse hidden sm:block ml-1" />
          </div>

          <div className="h-7 w-24 rounded-xl bg-amber-500/30 dark:bg-amber-500/20 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
