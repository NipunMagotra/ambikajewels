'use client';

export default function PGoldHowItWorks() {
  const services = [
    {
      number: '01',
      title: '100% Gold Exchange Program',
      description: 'Exchange any old gold jewelry for brand-new designer pieces at 100% current market gold valuation with zero weight deduction.',
      icon: 'currency_exchange'
    },
    {
      number: '02',
      title: '3D CAD Custom Preview',
      description: 'Send any sketch or Instagram photo on WhatsApp (+91 9086098457). Receive a 3D digital CAD preview before crafting.',
      icon: 'palette'
    },
    {
      number: '03',
      title: 'Old Gold Melting & Redesign',
      description: 'Melt heirloom family gold in front of you at our showroom and redesign it into modern Dogra Heritage collections.',
      icon: 'local_fire_department'
    },
    {
      number: '04',
      title: 'Boutique Consultation & Video Call',
      description: 'Book 1-on-1 private consultations with owner Shivani Anand or schedule live video shopping calls from anywhere.',
      icon: 'support_agent'
    }
  ];

  const guarantees = [
    {
      icon: 'verified',
      title: 'BIS Hallmarked Purity',
      description: 'All gold jewelry is 100% BIS Hallmarked (22K 916, 18K 750, 14K 585) with official purity certificates.'
    },
    {
      icon: 'diamond',
      title: 'Certified Real Diamonds',
      description: 'Solitaires and diamond settings accompanied by official GIA & IGI certificates.'
    },
    {
      icon: 'military_tech',
      title: 'Authentic Dogra Heritage',
      description: 'Jammu karigars crafting authentic Dogri Jhumki, Naman sets, and traditional bridal jewelry.'
    },
    {
      icon: 'local_shipping',
      title: 'Insured Delivery & Pickup',
      description: 'Fully insured shipping across Jammu & Kashmir and pan-India with Shiprocket tracking.'
    }
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Services Section */}
      <div className="space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
            EXPERT SHOWROOM SERVICES
          </div>
          <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
            Gold Exchange & Custom Craftsmanship
          </h2>
          <p className="text-sm sm:text-base text-amber-50 font-normal">
            Bespoke jewelry services at Ambika Jewels Showroom & Boutique in Jammu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s) => (
            <div
              key={s.number}
              className="bg-[#221312] p-6 sm:p-7 rounded-md border-2 border-amber-500/40 hover:border-amber-300 space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-4xl font-bold text-amber-400">
                  {s.number}
                </span>
                <span className="material-symbols-outlined text-3xl text-amber-300 p-2.5 bg-amber-500/20 rounded-md border border-amber-500/30">
                  {s.icon}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-headline-md text-lg font-bold text-white">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Guarantees Grid */}
      <div className="relative bg-[#221312] p-8 sm:p-12 rounded-md border-2 border-amber-500/50 space-y-8 overflow-hidden">
        <div className="absolute inset-0 mandala-bg-pattern pointer-events-none z-0 opacity-10" />
        <div className="text-center space-y-2 max-w-xl mx-auto relative z-10">
          <div className="font-label-caps text-xs text-amber-400 tracking-[0.25em] font-bold">
            AMBIKA JEWELS LEGACY (ESTD 2021)
          </div>
          <h3 className="font-headline-md text-2xl sm:text-3xl text-white font-bold">
            Our Quality & Purity Commitment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          {guarantees.map((g) => (
            <div key={g.title} className="bg-[#2e1917] p-6 rounded-md border border-amber-500/40 space-y-3">
              <span className="material-symbols-outlined text-amber-400 text-3xl">{g.icon}</span>
              <h4 className="font-headline-md text-base font-bold text-white">{g.title}</h4>
              <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-normal">{g.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
