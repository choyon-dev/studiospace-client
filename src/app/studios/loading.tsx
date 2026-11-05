import StudioCardSkeleton from '@/components/StudioCardSkeleton';

export default function StudiosLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="h-8 sm:h-10 w-48 sm:w-64 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
          <div className="h-4 w-60 sm:w-80 bg-slate-100 dark:bg-zinc-800/60 rounded-lg animate-pulse mt-2" />
        </div>
        <div className="h-10 w-40 bg-slate-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="hidden lg:block lg:col-span-1 space-y-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 space-y-4">
            <div className="h-5 w-24 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-full bg-slate-100 dark:bg-zinc-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
            <div className="h-5 w-28 bg-slate-200 dark:bg-zinc-800 rounded animate-pulse pt-4" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 w-full bg-slate-100 dark:bg-zinc-800/50 rounded-lg animate-pulse" />
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <StudioCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
