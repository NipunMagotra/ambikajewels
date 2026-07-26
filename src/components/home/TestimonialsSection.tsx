export default function TestimonialsSection() {
  const reviews = [
    {
      name: 'Sunita & Ananya Sharma',
      location: 'Jammu & New Delhi',
      quote: 'Great quality bridal Kundan set. The purity hallmark and video call made buying online easy.'
    },
    {
      name: 'Rohan & Meera Malhotra',
      location: 'Chandigarh',
      quote: 'The diamond quality is top notch. Insured delivery was fast and safe.'
    },
    {
      name: 'Dr. Devika Ranawat',
      location: 'Jaipur',
      quote: 'Beautiful traditional gold designs and excellent finish. Highly recommended.'
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-surface-container-lowest border-t border-outline-variant/20 px-4 sm:px-margin-mobile lg:px-margin-desktop">
      <div className="container mx-auto">
        <div className="text-center max-w-md mx-auto mb-8 sm:mb-10">
          <span className="font-label-caps text-[9px] sm:text-[10px] text-primary tracking-[0.3em] font-semibold block mb-1">
            TESTIMONIALS
          </span>
          <h3 className="font-headline-md text-2xl sm:text-3xl lg:text-4xl text-on-surface">
            Customer Reviews
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((rev, idx) => (
            <div 
              key={idx}
              className="bg-surface-container/40 border border-outline-variant/20 p-5 sm:p-6 flex flex-col justify-between rounded-xs"
            >
              <p className="font-body-md text-xs sm:text-sm italic text-on-surface-variant/90 leading-relaxed mb-4">
                "{rev.quote}"
              </p>
              <div className="border-t border-outline-variant/10 pt-3 flex flex-wrap justify-between items-center gap-2">
                <span className="font-headline-sm text-xs sm:text-sm text-on-surface font-semibold">{rev.name}</span>
                <span className="font-label-caps text-[9px] text-on-surface-variant/60">{rev.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
