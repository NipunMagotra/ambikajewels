import { siteConfig } from '@/config/siteConfig';

export interface StoreContentConfig {
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryButtonText: string;
    primaryButtonLink: string;
    secondaryButtonText: string;
    secondaryButtonLink: string;
    imageUrl: string;
  };
  announcement: {
    isEnabled: boolean;
    text: string;
    linkUrl?: string;
  };
  showroom: {
    address: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
    whatsapp: string;
    openingHours: string;
    holidayNotice?: string;
  };
  updatedAt: string;
}

export const DEFAULT_STORE_CONTENT: StoreContentConfig = {
  hero: {
    badge: 'DOGRA HERITAGE JEWELLERY',
    title: 'Timeless Royal Jewellery from Jammu',
    subtitle: 'Handcrafted 22K Hallmarked Gold, Certified Diamonds, and 925 Sterling Silver inspired by the Dogra dynasty.',
    primaryButtonText: 'Explore Royal Catalog',
    primaryButtonLink: '/collections/all',
    secondaryButtonText: 'Book Showroom Visit',
    secondaryButtonLink: '/contact',
    imageUrl: '/hero-clean.png'
  },
  announcement: {
    isEnabled: true,
    text: 'Festive Privilege: Use code DOGRA5000 for ₹5,000 flat savings on orders above ₹50,000 | 100% Insured BVC Armed Delivery Across India',
    linkUrl: '/collections/all'
  },
  showroom: {
    address: siteConfig.address,
    city: siteConfig.city,
    state: siteConfig.state,
    pincode: siteConfig.pincode,
    phone: siteConfig.contact.phone,
    whatsapp: siteConfig.contact.whatsapp,
    openingHours: siteConfig.timings,
    holidayNotice: 'Open all 7 days for bridal consultation'
  },
  updatedAt: new Date().toISOString()
};

let memoryStoreContent: StoreContentConfig = { ...DEFAULT_STORE_CONTENT };

export async function getStoreContent(): Promise<StoreContentConfig> {
  try {
    const { supabaseAdmin, isSupabaseAdminConfigured } = await import('./supabaseAdmin');
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('store_settings')
        .select('content, updated_at')
        .eq('key', 'website_content')
        .maybeSingle();

      if (!error && data?.content) {
        memoryStoreContent = {
          ...DEFAULT_STORE_CONTENT,
          ...(data.content as Partial<StoreContentConfig>),
          updatedAt: data.updated_at || new Date().toISOString()
        };
      }
    }
  } catch {
    // Memory fallback
  }

  return memoryStoreContent;
}

export async function saveStoreContent(content: Partial<StoreContentConfig>): Promise<StoreContentConfig> {
  const merged: StoreContentConfig = {
    hero: { ...memoryStoreContent.hero, ...(content.hero || {}) },
    announcement: { ...memoryStoreContent.announcement, ...(content.announcement || {}) },
    showroom: { ...memoryStoreContent.showroom, ...(content.showroom || {}) },
    updatedAt: new Date().toISOString()
  };

  memoryStoreContent = merged;

  try {
    const { supabaseAdmin, isSupabaseAdminConfigured } = await import('./supabaseAdmin');
    if (isSupabaseAdminConfigured && supabaseAdmin) {
      await supabaseAdmin.from('store_settings').upsert({
        key: 'website_content',
        content: merged,
        updated_at: merged.updatedAt
      }, { onConflict: 'key' });
    }
  } catch {
    // Memory state is maintained
  }

  return merged;
}

