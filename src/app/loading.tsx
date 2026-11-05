export default function RootLoading() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center p-6">
      <div className="relative flex items-center justify-center">
        <div className="size-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/20 animate-pulse border border-amber-500/20 flex items-center justify-center">
          <div className="size-8 rounded-xl bg-amber-500 animate-spin flex items-center justify-center text-zinc-950 font-black text-xs">
            SS
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="h-4 w-32 bg-slate-200 dark:bg-zinc-800 rounded-full animate-pulse" />
        <div className="h-3 w-48 bg-slate-100 dark:bg-zinc-800/60 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
