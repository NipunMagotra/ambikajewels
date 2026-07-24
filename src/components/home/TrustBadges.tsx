export default function TrustBadges() {
  const pillars = [
    { icon: 'verified', label: '100% HALLMARKED GOLD' },
    { icon: 'diamond', label: 'CERTIFIED DIAMONDS' },
    { icon: 'sync', label: 'LIFETIME EXCHANGE' },
    { icon: 'local_shipping', label: 'FREE INSURED SHIPPING' }
  ];

  return (
    <section className="py-6 bg-surface-container-lowest border-y border-outline-variant/20 px-margin-mobile lg:px-margin-desktop">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-6">
        {pillars.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 mx-auto lg:mx-0">
            <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
            <span className="font-label-caps text-[10px] text-on-surface-variant/90 tracking-[0.22em] font-semibold">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

