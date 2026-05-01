export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card/50 px-5 py-4 animate-pulse">
      <div className="h-8 w-8 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-muted" />
        <div className="h-2 w-16 rounded bg-muted/70" />
      </div>
      <div className="h-3 w-20 rounded bg-muted" />
      <div className="h-3 w-16 rounded bg-muted hidden sm:block" />
      <div className="h-3 w-24 rounded bg-muted hidden md:block" />
    </div>
  );
}

export function SkeletonGrid() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
