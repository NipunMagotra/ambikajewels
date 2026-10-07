/**
 * Catalog Search Engine
 *
 * Provides fast, client-side, case-insensitive keyword searching across
 * product name, description, category, purity, and tags.
 */

import type { Product } from '@/types';

export function searchCatalog(products: Product[], query: string, maxDefault: number = 4): Product[] {
  if (!query || typeof query !== 'string') {
    return products.slice(0, maxDefault);
  }

  const trimmed = query.trim().toLowerCase();
  if (!trimmed) {
    return products.slice(0, maxDefault);
  }

  // Tokenize query into individual search terms for multi-word search
  const terms = trimmed.split(/\s+/).filter(Boolean);

  return products.filter((p) => {
    const name = (p.name || '').toLowerCase();
    const desc = (p.description || '').toLowerCase();
    const cat = (p.category || '').toLowerCase();
    const purity = (p.purity || '').toLowerCase();
    const badges = (p.badges || []).join(' ').toLowerCase();
    const tags = ((p as any).tags || []).join(' ').toLowerCase();

    const searchableText = `${name} ${desc} ${cat} ${purity} ${badges} ${tags}`;

    // All search terms must match the product (with jewelry/jewellery synonym support)
    return terms.every((term) => {
      const termVariants = [term];
      if (term.includes('jewelry')) termVariants.push(term.replace(/jewelry/g, 'jewellery'));
      if (term.includes('jewellery')) termVariants.push(term.replace(/jewellery/g, 'jewelry'));
      return termVariants.some((v) => searchableText.includes(v));
    });
  });
}
