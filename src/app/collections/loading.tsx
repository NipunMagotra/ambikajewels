export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="space-y-3 text-center max-w-xl mx-auto">
          <div className="h-4 w-32 bg-primary/20 rounded mx-auto" />
          <div className="h-8 w-64 bg-surface-container rounded mx-auto" />
          <div className="h-3 w-80 bg-surface-container-high rounded mx-auto" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="flex gap-2 justify-center overflow-x-auto py-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 w-24 bg-surface-container rounded-xs shrink-0" />
          ))}
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-surface-container border border-outline-variant/20 rounded-xs overflow-hidden space-y-3 p-3">
              <div className="aspect-square bg-surface-container-high rounded-xs" />
              <div className="h-4 w-3/4 bg-surface-container-high rounded" />
              <div className="h-3 w-1/2 bg-surface-container-high rounded" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-5 w-20 bg-primary/20 rounded" />
                <div className="h-8 w-16 bg-surface-container-high rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
