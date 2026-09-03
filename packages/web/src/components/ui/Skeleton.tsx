export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-surface-panel2 ${className}`} aria-hidden />;
}

export function StreamCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border border-surface-border bg-surface-panel">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}
