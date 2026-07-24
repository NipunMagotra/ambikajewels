import Link from 'next/link';

export default function CategoryGrid() {
  const categories = [
    {
      name: 'Bridal Couture',
      image: '/products/royal-kundan.png',
      span: 'lg:col-span-8 lg:row-span-2 h-[380px] lg:h-full',
      link: '/collections?category=Bridal Couture'
    },
    {
      name: 'Signature Necklaces',
      image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-4 h-[240px]',
      link: '/collections?category=Necklaces'
    },
    {
      name: 'Artisanal Earrings',
      image: '/products/kundan-chandbali.png',
      span: 'lg:col-span-4 h-[240px]',
      link: '/collections?category=Earrings'
    },
    {
      name: 'Temple Gold',
      image: '/products/temple-lakshmi.png',
      span: 'lg:col-span-6 h-[240px]',
      link: '/collections?category=Temple Jewelry'
    },
    {
      name: 'Bangles & Kadas',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
      span: 'lg:col-span-6 h-[240px]',
      link: '/collections?category=Bangles %26 Bracelets'
    }
  ];

  return (
    <section className="py-16 px-margin-mobile lg:px-margin-desktop">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h3 className="font-headline-md text-3xl lg:text-4xl text-on-surface">
          Shop By Category
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {categories.map((cat, idx) => (
          <Link
            key={idx}
            href={cat.link}
            className={`${cat.span} group relative overflow-hidden bg-surface-container block border border-outline-variant/20 hover:border-primary/50 transition-all duration-300`}
          >
            <div 
              className="w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
              style={{ backgroundImage: `url('${cat.image}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
              <h4 className="font-headline-sm text-xl text-on-surface font-semibold group-hover:text-primary transition-colors">
                {cat.name}
              </h4>
              <span className="material-symbols-outlined text-primary text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}


