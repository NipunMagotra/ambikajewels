export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col items-center justify-center pt-20 px-4">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-14 h-14 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary relative">
          <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
        </div>
        <div className="text-center space-y-1.5">
          <span className="font-headline-md text-base sm:text-lg tracking-[0.2em] gold-text-gradient font-bold block">
            AMBIKA JEWELS
          </span>
          <p className="font-label-caps text-[10px] text-on-surface-variant/70 tracking-[0.25em] uppercase">
            Curating Fine Jammu Craftsmanship...
          </p>
        </div>
      </div>
    </div>
  );
}
