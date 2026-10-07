export default function TestimonialsSection() {
  const commitments = [
    {
      title: 'BIS Hallmarked Purity',
      subtitle: 'BIS ASSAYED & HALLMARKED',
      description: 'Every gold creation carries an official Bureau of Indian Standards (BIS) hallmark and unique 6-character HUID laser engraving.',
      icon: 'verified'
    },
    {
      title: 'Laboratory-Certified Diamonds',
      subtitle: 'GIA & IGI DOCUMENTED',
      description: 'Natural diamonds and solitaire rings are backed by authentic third-party laboratory documentation grading color, cut, and clarity.',
      icon: 'diamond'
    },
    {
      title: 'Secure Armored Delivery',
      subtitle: 'PAN-INDIA INSURED SHIPMENT',
      description: 'Dispatched via BVC Logistics in tamper-evident security bags with armored transit, real-time tracking, and OTP verification.',
      icon: 'local_shipping'
    },
    {
      title: 'Jammu Flagship Showroom',
      subtitle: 'AUTHENTIC DOGRA JEWELLERY',
      description: 'Visit our boutique in Lower Roop Nagar, Jammu for private bridal viewings, custom 3D CAD design, and gold exchange.',
      icon: 'storefront'
    }
  ];

  return (
    <section className="py-10 sm:py-14 bg-[var(--bg-main)] border-t border-[var(--border-subtle)] px-4 sm:px-margin-mobile lg:px-margin-desktop">
      <div className="container mx-auto">
        <div className="text-center max-w-lg mx-auto mb-8 sm:mb-10">
          <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-[0.3em] uppercase font-semibold block mb-1">
            THE AMBIKA COMMITMENT
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[var(--text-primary)] font-normal">
            Standards of Heritage Craftsmanship
          </h2>
          <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] mt-1.5 font-light">
            Every piece crafted at our Jammu showroom reflects dedicated goldsmith artistry and uncompromising quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {commitments.map((item, idx) => (
            <div 
              key={idx}
              className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-6 sm:p-7 flex flex-col justify-between rounded-[2px] hover:border-[var(--accent-gold)]/60 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent-gold)]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div>
                <div className="w-10 h-10 rounded-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-[var(--accent-gold)] text-xl">
                    {item.icon}
                  </span>
                </div>
                <span className="font-sans text-[8.5px] text-[var(--accent-gold)] tracking-[0.25em] uppercase font-semibold block mb-1">
                  {item.subtitle}
                </span>
                <h3 className="font-serif text-lg text-[var(--text-primary)] font-normal mb-2 tracking-tight">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-[var(--text-secondary)] leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
