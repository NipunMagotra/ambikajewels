export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Gallery Skeleton */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-surface-container rounded-xs" />
              ))}
            </div>
            <div className="flex-1 aspect-square bg-surface-container rounded-xs" />
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="h-4 w-28 bg-primary/20 rounded" />
              <div className="h-8 w-3/4 bg-surface-container rounded" />
              <div className="h-6 w-32 bg-primary/30 rounded mt-2" />
            </div>

            <div className="space-y-2 pt-4 border-t border-outline-variant/20">
              <div className="h-3 w-full bg-surface-container-high rounded" />
              <div className="h-3 w-5/6 bg-surface-container-high rounded" />
              <div className="h-3 w-2/3 bg-surface-container-high rounded" />
            </div>

            <div className="space-y-3 pt-4 border-t border-outline-variant/20">
              <div className="h-4 w-24 bg-surface-container rounded" />
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-container" />
                <div className="w-10 h-10 rounded-full bg-surface-container" />
              </div>
            </div>

            <div className="h-32 bg-surface-container rounded-xs border border-outline-variant/20" />

            <div className="flex gap-4 pt-4">
              <div className="h-12 w-32 bg-surface-container rounded-xs" />
              <div className="h-12 flex-1 bg-primary/20 rounded-xs" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
