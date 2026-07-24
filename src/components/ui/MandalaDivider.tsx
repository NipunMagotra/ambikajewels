export default function MandalaDivider() {
  return (
    <div className="flex items-center justify-center py-section-gap">
      <div className="h-[1px] bg-outline-variant flex-1 max-w-xs"></div>
      <span className="material-symbols-outlined text-primary mx-8" style={{ fontVariationSettings: "'FILL' 1" }}>
        spa
      </span>
      <div className="h-[1px] bg-outline-variant flex-1 max-w-xs"></div>
    </div>
  );
}
