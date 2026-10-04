export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-[var(--bg-main)] pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <div className="h-3 w-36 bg-[var(--accent-gold)]/20 rounded-full mx-auto" />
          <div className="h-8 w-60 bg-[var(--bg-surface)] rounded mx-auto" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="h-12 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2px]" />

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2px] overflow-hidden space-y-3 p-3">
              <div className="aspect-[3/4] bg-[var(--bg-surface)] rounded-[2px]" />
              <div className="h-4 w-3/4 bg-[var(--bg-surface)] rounded mx-auto" />
              <div className="h-3 w-1/2 bg-[var(--accent-gold)]/20 rounded mx-auto" />
              <div className="h-8 w-full bg-[var(--bg-surface)] rounded-[2px]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
