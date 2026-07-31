'use client';

export default function PGoldHowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose Amount or Weight',
      description: 'Start with as little as ₹100 or 0.01g. Select your desired 24K pure gold weight or fixed rupee amount.',
      icon: 'savings'
    },
    {
      number: '02',
      title: 'Lock Live Market Rate',
      description: 'Your rate is locked in real-time based on benchmark Indian gold market prices with zero slippage.',
      icon: 'lock_clock'
    },
    {
      number: '03',
      title: 'Stored Safely in Vault',
      description: 'Every fraction of gold you buy is backed by 100% 24K 999 Hallmark physical gold stored in insured vaults.',
      icon: 'verified_user'
    },
    {
      number: '04',
      title: 'Redeem as Physical Jewelry',
      description: 'Redeem anytime at Ambika Jewels Showroom Jammu for 24K gold coins or Dogra Heritage jewelry.',
      icon: 'diamond'
    }
  ];

  const benefits = [
    {
      icon: 'verified',
      title: '100% 24K 999 Hallmark Pure',
      description: 'Certified 999 purity gold guaranteed by Ambika Jewels (Estd 2021 Jammu).'
    },
    {
      icon: 'volunteer_activism',
      title: 'Zero Storage & Vault Fees',
      description: 'Accumulate gold digitally with no hidden maintenance or vault holding charges.'
    },
    {
      icon: 'published_with_changes',
      title: 'Instant Gold Exchange',
      description: 'Exchange digital gold balance for physical bridal jewelry or gold exchange program.'
    },
    {
      icon: 'currency_rupee',
      title: 'Buy from ₹100 Onwards',
      description: 'No lump sum required. Build your family gold legacy steadily at your own budget.'
    }
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Step by Step Section */}
      <div className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="font-label-caps text-xs text-primary tracking-[0.25em] font-bold">
            SIMPLE & SECURE PROCESS
          </div>
          <h2 className="font-headline-md text-2xl sm:text-4xl gold-text-gradient font-bold">
            How Ambika P-Gold Works
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 font-light">
            Four easy steps to buy, accumulate, and redeem 24K pure digital gold.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-surface-container/90 p-6 rounded-xs border border-outline-variant/40 hover-gold-wire space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-3xl font-bold text-primary/40 group-hover:text-primary transition-colors">
                  {step.number}
                </span>
                <span className="material-symbols-outlined text-2xl text-primary p-2 bg-primary/10 rounded-xs border border-primary/20">
                  {step.icon}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-headline-md text-base font-bold text-white">
                  {step.title}
                </h3>
                <p className="text-xs text-amber-100/80 leading-relaxed font-light">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="relative bg-surface-container/90 p-8 sm:p-10 rounded-xs border border-primary/40 space-y-8 overflow-hidden">
        <div className="absolute inset-0 mandala-bg-pattern pointer-events-none z-0" />
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <div className="font-label-caps text-xs text-primary tracking-[0.25em] font-bold">
            THE AMBIKA JEWELS GUARANTEE
          </div>
          <h3 className="font-headline-md text-2xl text-white font-bold">
            Why Accumulate P-Gold With Us?
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="bg-surface-container-high/90 p-5 rounded-xs border border-outline-variant/40 space-y-2">
              <span className="material-symbols-outlined text-primary text-2xl">{b.icon}</span>
              <h4 className="font-headline-md text-sm font-bold text-white">{b.title}</h4>
              <p className="text-xs text-amber-100/80 leading-relaxed font-light">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
