import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { ARTICLES } from '../page';
import { mockProducts } from '@/data/mockProducts';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return { title: 'Article Not Found | Ambika Jewels' };

  return {
    title: `${article.title} | Ambika Jewels Journal`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const otherArticles = ARTICLES.filter((a) => a.slug !== slug);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 sm:pt-28 pb-20 lg:pb-28 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <article className="container mx-auto px-4 sm:px-6 lg:px-12 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="text-[10px] font-sans text-[var(--text-tertiary)] flex items-center gap-2 uppercase tracking-wider mb-8">
            <Link href="/" className="hover:text-[var(--text-primary)]">HOME</Link>
            <span>/</span>
            <Link href="/journal" className="hover:text-[var(--text-primary)]">JOURNAL</Link>
            <span>/</span>
            <span className="text-[var(--text-primary)] truncate font-medium">{article.category}</span>
          </div>

          {/* Article Header */}
          <div className="mb-10 text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-3 text-[10px] font-sans uppercase tracking-[0.24em] text-[var(--accent-gold)] font-medium mb-3">
              <span>{article.category}</span>
              <span>&bull;</span>
              <span>{article.date}</span>
              <span>&bull;</span>
              <span>{article.readTime}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[var(--text-primary)] font-normal tracking-tight mb-4 leading-[1.15]">
              {article.title}
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[var(--text-tertiary)] font-light">
              By {article.author} &bull; Jammu Showroom Atelier
            </p>
          </div>

          {/* Large Hero Image */}
          <div className="relative aspect-[16/10] overflow-hidden bg-[var(--bg-surface)] mb-12 rounded-[1px]">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body */}
          <div className="prose prose-stone dark:prose-invert max-w-2xl mx-auto text-xs sm:text-sm font-sans text-[var(--text-secondary)] leading-relaxed space-y-6 font-light">
            {article.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}

            {/* Editorial Pull Quote */}
            <div className="my-10 p-6 sm:p-8 border-y border-[var(--border-subtle)] text-center">
              <span className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] italic font-light block leading-snug">
                &ldquo;True heirloom jewellery does not age; it acquires history, memories, and provenance.&rdquo;
              </span>
              <span className="font-sans text-[9.5px] uppercase tracking-[0.25em] text-[var(--accent-gold)] block mt-3 font-medium">
                THE HOUSE OF AMBIKA JEWELS &bull; JAMMU
              </span>
            </div>
          </div>

          {/* Shop Related Heirlooms */}
          <div className="mt-16 pt-12 border-t border-[var(--border-subtle)]">
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-[9.5px] font-sans tracking-[0.28em] uppercase text-[var(--accent-gold)] font-medium block mb-1">
                FROM THE ATELIER
              </span>
              <h3 className="font-serif text-2xl text-[var(--text-primary)] font-normal">
                Pieces Inspired by this Essay
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mockProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-[var(--bg-surface)] mb-2">
                    <Link href={`/collections/${p.slug || p.id}`}>
                      <img src={p.images?.[0] || '/hero-clean.png'} alt={p.name} className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700" />
                    </Link>
                  </div>
                  <h4 className="font-serif text-xs sm:text-sm text-[var(--text-primary)] line-clamp-1">
                    <Link href={`/collections/${p.slug || p.id}`}>{p.name}</Link>
                  </h4>
                  <span className="font-sans text-xs font-medium text-[var(--text-primary)]">
                    {p.display_price}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Related Articles */}
          {otherArticles.length > 0 && (
            <div className="mt-16 pt-12 border-t border-[var(--border-subtle)]">
              <h3 className="font-serif text-xl text-[var(--text-primary)] mb-6 font-normal text-center">
                More Stories from the Atelier
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {otherArticles.map((oa) => (
                  <Link
                    key={oa.slug}
                    href={`/journal/${oa.slug}`}
                    className="p-4 bg-[var(--bg-surface)] hover:bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[1px] transition-colors group flex gap-4"
                  >
                    <div className="w-20 h-20 aspect-square shrink-0 overflow-hidden bg-white/40">
                      <img src={oa.image} alt={oa.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[9px] font-sans uppercase tracking-wider text-[var(--accent-gold)] block mb-1">
                        {oa.category}
                      </span>
                      <h4 className="font-serif text-sm text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors line-clamp-2">
                        {oa.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </article>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}

