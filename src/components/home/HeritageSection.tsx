export default function HeritageSection() {
  return (
    <section className="my-12 sm:my-20 grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-margin-desktop px-4 sm:px-margin-mobile lg:px-margin-desktop">
      <div className="relative order-2 lg:order-1">
        <div className="aspect-[4/3] sm:aspect-square bg-surface-container-high overflow-hidden gold-border">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxCxqZhg2CKKEAVGcZl7zv_1RQ-KPMeKGw6IJYS5T1KZpC_FC7KPtSIuwDfQSsfmGSjFRtm6Qq26FaosGr_2kn10YMi87hprslng2Ybc2fVt0b7FUxmQAT4v82Mh_84jKxkEwEwQyK4TvIW0l4rp9eIBwd1dyLvlT_Q5GBx1Ff9HUkLqfndkpDq6xTf8sSrKXMY9aIaFLYFzW77lbNe-pO77HGDE4tc1XxQ3goDHO0EUbLiX3Zrus')" }}
          />
        </div>
        
        {/* Desktop Absolute Badge */}
        <div className="absolute -bottom-8 -right-8 w-60 h-56 bg-surface-container border border-outline-variant p-5 hidden lg:block shadow-xl">
          <p className="font-body-md text-sm italic text-on-surface-variant leading-relaxed">
            "Every piece of jewelry is a story carved in gold, a memory meant to last generations."
          </p>
          <p className="font-label-caps text-xs text-primary mt-3 font-semibold">— MASTER KARIGAR</p>
        </div>

        {/* Mobile Inline Quote */}
        <div className="mt-4 lg:hidden bg-surface-container border border-outline-variant/30 p-4 text-center">
          <p className="font-body-md text-xs italic text-on-surface-variant">
            "Every piece of jewelry is a story carved in gold, a memory meant to last generations."
          </p>
          <p className="font-label-caps text-[10px] text-primary mt-2 font-semibold">— MASTER KARIGAR</p>
        </div>
      </div>
      
      <div className="lg:pl-8 order-1 lg:order-2 text-center lg:text-left">
        <span className="font-label-caps text-xs text-primary tracking-[0.25em] mb-2 block font-semibold">OUR HERITAGE</span>
        <h3 className="font-headline-md text-3xl sm:text-4xl lg:text-5xl text-on-surface mb-4">
          40 Years of <span className="italic font-normal gold-text-gradient">Craftsmanship</span>
        </h3>
        <p className="font-body-md text-sm sm:text-base text-on-surface-variant/90 mb-6 leading-relaxed font-light max-w-lg mx-auto lg:mx-0">
          Since 1984, Ambika Jewels has handcrafted authentic 22K gold, Polki, and Kundan jewelry in Jammu. Every masterpiece is certified and hallmark stamped.
        </p>
        <button className="border border-primary px-8 py-3.5 font-label-caps text-xs text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 w-full sm:w-auto font-bold tracking-widest">
          EXPLORE OUR STORY
        </button>
      </div>
    </section>
  );
}
