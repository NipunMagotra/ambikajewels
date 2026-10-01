export default function TestimonialsSection() {
  const commitments = [
    {
      title: 'BIS Hallmarked Purity',
      subtitle: 'GOVERNMENT CERTIFIED GOLD',
      description: 'Every gold creation is stamped with BIS hallmark standards ensuring guaranteed metal purity (22K, 18K, 14K, and 9K) and uncompromised authenticity.',
      icon: 'verified'
    },
    {
      title: 'Certified Real Diamonds',
      subtitle: 'GIA & IGI STANDARDS',
      description: 'Our natural diamonds and solitaire engagement rings adhere to international 4C grading standards with authentic gemological documentation.',
      icon: 'diamond'
    },
    {
      title: 'Secure Express Delivery',
      subtitle: 'PAN-INDIA DOORSTEP SHIPMENT',
      description: 'Dispatched through Shiprocket in specialized tamper-evident security packaging with verified courier tracking until handed to you.',
      icon: 'local_shipping'
    },
    {
      title: 'Jammu Flagship Showroom',
      subtitle: 'AUTHENTIC DOGRA JEWELRY',
      description: 'Visit our physical boutique in Lower Roop Nagar, Jammu for private bridal viewings, custom 3D CAD design, and authentic Dogra heirloom craftsmanship.',
      icon: 'storefront'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/20 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      <div className="container mx-auto">
        <div className="text-center max-w-lg mx-auto mb-10 sm:mb-12">
          <span className="font-label-caps text-[9px] sm:text-[10px] text-primary tracking-[0.3em] font-semibold block mb-1">
            THE AMBIKA COMMITMENT
          </span>
          <h3 className="font-headline-md text-2xl sm:text-3xl lg:text-4xl text-on-surface">
            Standards of Heritage Craftsmanship
          </h3>
          <p className="font-body-md text-xs sm:text-sm text-on-surface-variant mt-2">
            Every piece crafted at our Jammu showroom reflects dedicated goldsmith artistry and uncompromising modern quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {commitments.map((item, idx) => (
            <div 
              key={idx}
              className="bg-surface-container/40 border border-outline-variant/20 p-5 sm:p-6 flex flex-col justify-between rounded-xs hover:border-primary/40 transition-colors"
            >
              <div>
                <span className="material-symbols-outlined text-primary text-2xl sm:text-3xl mb-3 block">
                  {item.icon}
                </span>
                <span className="font-label-caps text-[8.5px] text-primary tracking-widest font-semibold block mb-1">
                  {item.subtitle}
                </span>
                <h4 className="font-headline-sm text-base sm:text-lg text-on-surface font-semibold mb-2">
                  {item.title}
                </h4>
                <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">
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
