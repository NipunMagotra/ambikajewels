export default function HeritageSection() {
  return (
    <section className="mb-section-gap grid grid-cols-1 lg:grid-cols-2 items-center gap-stack-lg lg:gap-margin-desktop px-margin-mobile lg:px-margin-desktop">
      <div className="relative order-2 lg:order-1">
        <div className="aspect-square bg-surface-container-high overflow-hidden gold-border">
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAxCxqZhg2CKKEAVGcZl7zv_1RQ-KPMeKGw6IJYS5T1KZpC_FC7KPtSIuwDfQSsfmGSjFRtm6Qq26FaosGr_2kn10YMi87hprslng2Ybc2fVt0b7FUxmQAT4v82Mh_84jKxkEwEwQyK4TvIW0l4rp9eIBwd1dyLvlT_Q5GBx1Ff9HUkLqfndkpDq6xTf8sSrKXMY9aIaFLYFzW77lbNe-pO77HGDE4tc1XxQ3goDHO0EUbLiX3Zrus')" }}
          />
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-surface-container border border-outline-variant p-stack-md hidden lg:block">
          <p className="font-body-md text-body-md italic text-on-surface-variant">
            "Every piece of jewelry is a story carved in gold, a memory meant to last generations."
          </p>
          <p className="font-label-caps text-label-caps text-primary mt-4">— MASTER KARIGAR</p>
        </div>
      </div>
      
      <div className="lg:pl-12 order-1 lg:order-2 text-center lg:text-left">
        <span className="font-label-caps text-label-caps text-primary tracking-[0.2em] mb-4 block">ABOUT US</span>
        <h3 className="font-display-lg-mobile lg:font-display-lg text-display-lg-mobile lg:text-display-lg mb-stack-lg">
          40 Years of <span className="italic font-normal">Craftsmanship</span>
        </h3>
        <p className="font-body-md lg:font-body-lg text-on-surface-variant/90 mb-stack-lg leading-relaxed font-light max-w-lg">
          Since 1984, Ambika Jewels has handcrafted authentic 22K gold, Polki, and Kundan jewelry in Jammu.
        </p>
        <button className="border-[1.5px] border-primary px-stack-lg py-4 font-label-caps text-label-caps text-primary hover:bg-primary hover:text-on-primary transition-all duration-300 w-full lg:w-auto">
          OUR STORY
        </button>
      </div>
    </section>
  );
}
