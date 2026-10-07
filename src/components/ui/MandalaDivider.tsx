export default function MandalaDivider() {
  return (
    <div className="flex items-center justify-center py-6 sm:py-8 px-4" aria-hidden="true">
      <div className="h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-gold)]/30 to-[var(--accent-gold)]/60 flex-1 max-w-[120px] sm:max-w-xs"></div>
      <div className="mx-4 sm:mx-6 flex items-center justify-center">
        <svg
          className="w-4 h-4 text-[var(--accent-gold)]"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L13.5 8.5L20 10L14.5 13.5L16 20L12 16L8 20L9.5 13.5L4 10L10.5 8.5L12 2Z" />
        </svg>
      </div>
      <div className="h-[1px] bg-gradient-to-l from-transparent via-[var(--accent-gold)]/30 to-[var(--accent-gold)]/60 flex-1 max-w-[120px] sm:max-w-xs"></div>
    </div>
  );
}
