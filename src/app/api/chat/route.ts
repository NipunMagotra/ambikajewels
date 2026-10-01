import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/siteConfig';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { storeKnowledge, faqItems } from '@/data/storeKnowledge';
import { checkRateLimit } from '@/lib/rateLimit';

// PII Redaction utility (DPDP compliance / Phase 3 Item 4)
export function redactPiiForChat(text: string): string {
  if (!text) return '';
  return text
    // Redact 10-digit Indian mobile numbers (with optional +91, 0, or spaces/dashes)
    .replace(/(?:\+91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}\b/g, '[PHONE REDACTED]')
    // Redact email addresses
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL REDACTED]')
    // Redact PAN (5 letters, 4 digits, 1 letter)
    .replace(/\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/gi, '[PAN REDACTED]')
    // Redact Aadhaar (12 digits, optional spaces)
    .replace(/\b\d{4}\s?\d{4}\s?\d{4}\b/g, '[ID REDACTED]')
    // Redact 6-digit Indian PIN codes
    .replace(/\b[1-9][0-9]{5}\b/g, '[PINCODE REDACTED]');
}

// Prompt Injection Defense (Phase 3 Item 4)
export function detectPromptInjection(text: string): boolean {
  if (!text) return false;
  const injectionPatterns = [
    /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directives|prompts|rules)/i,
    /disregard\s+(all\s+)?(previous|prior|above)/i,
    /system\s+prompt/i,
    /reveal\s+(your|the)\s+(instructions|system\s+message|prompt)/i,
    /you\s+are\s+now\s+(an\s+unrestricted|DAN|a\s+hacker|in\s+developer\s+mode)/i,
    /jailbreak/i,
    /bypass\s+(safety|content|system)\s+filter/i,
    /<\|im_start\|>/i,
    /<\|im_end\|>/i,
    /\[INST\]/i,
    /\[\/INST\]/i
  ];
  return injectionPatterns.some(pattern => pattern.test(text));
}

function extractKeywords(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[.,?!]/g, '')
    .split(/\s+/)
    .filter(word => word.length >= 2);
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const matrix = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  return matrix[a.length][b.length];
}

function matchesKeyword(token: string, keyword: string): boolean {
  if (token === keyword) return true;
  if (token.includes(keyword) || keyword.includes(token)) return true;
  if (token.length > 3 && keyword.length > 3) {
    if (token.slice(0, 4) === keyword.slice(0, 4)) return true;
    if (levenshtein(token, keyword) <= 2) return true;
  }
  return false;
}

function parseCategory(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  for (const cat of siteConfig.categories) {
    if (
      lowerMsg.includes(cat.toLowerCase()) || 
      (cat.includes('Dogra') && (lowerMsg.includes('dogra') || lowerMsg.includes('dogri')))
    ) {
      return cat;
    }
  }
  return null;
}

interface ChatProductSummary {
  id: string;
  name: string;
  slug: string;
  category: string;
  images: string[];
}

// F5: Fetch product catalog strictly from database (NO mockProducts, NO prices, NO stock)
async function fetchProductsFromDb(category?: string | null, searchTerms: string[] = []): Promise<ChatProductSummary[]> {
  const dbClient = isSupabaseAdminConfigured ? supabaseAdmin : (isSupabaseConfigured ? supabase : null);
  if (!dbClient) return [];

  try {
    let query = dbClient
      .from('products')
      .select('id, name, slug, category, images')
      .limit(6);

    if (category) {
      query = query.ilike('category', `%${category}%`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    let filtered = data;
    if (searchTerms.length > 0 && !category) {
      filtered = data.filter((item: any) =>
        searchTerms.some(term => item.name?.toLowerCase().includes(term) || item.category?.toLowerCase().includes(term))
      );
    }

    return filtered.slice(0, 3).map((item: any) => ({
      id: String(item.id),
      name: item.name,
      slug: item.slug || item.id,
      category: item.category || 'Jewelry',
      images: Array.isArray(item.images) && item.images.length > 0 ? item.images : ['/hero-clean.png']
    }));
  } catch (err) {
    console.error('Database catalog query failed in chat:', err);
    return [];
  }
}

async function callGroqLlama3(
  userMessage: string, 
  contextInfo: string,
  history: { role: 'user' | 'assistant'; content: string }[] = []
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
    const formattedHistory = history.slice(-6).map(h => ({
      role: h.role === 'user' ? 'user' : 'assistant',
      content: h.content
    }));

    const messages: any[] = [
      {
        role: 'system',
        content: `You are Aanya, the official AI Jewelry Concierge for Ambika Jewels located in Lower Roop Nagar, Jammu. 

Your role is to assist customers with showroom collections, Dogra heritage jewelry, gold exchange inquiries, and showroom visit scheduling.

### 🛑 CRITICAL COMPLIANCE & SAFETY GUARDRAILS (ZERO TOLERANCE) 🛑

1. **NO PRICE OR STOCK QUOTING (MANDATORY RULE):**
   - You MUST NEVER quote specific prices, making charges, bullion rates, or stock availability. Gold and silver prices change daily with the market.
   - For every product mentioned, direct the customer to its product page link: "/collections/[slug]".
   - If asked for price or stock, respond: "Precious metal rates and live stock update daily. Please click the product link or connect with our Jammu showroom concierge on WhatsApp at +91 9086098457 for today's exact rate."

2. **CONTEXTUAL ISOLATION:** 
   - Base factual answers about the store ONLY on the provided <KNOWLEDGE_BASE>.
   - If information is not in the knowledge base, state: "I don't have that specific detail right now. Please message our showroom team on WhatsApp at +91 9086098457 and Shivani or Lakesh will be happy to assist you directly."

3. **DISCLAIMER REQUIREMENT:**
   - Always remember you are an AI assistant. Remind users that all orders, rates, and custom jewelry details must be confirmed directly with the showroom team.

4. **TONE:** Culturally respectful, honoring Dogra heritage, warm, and concise.

---
### 📥 <KNOWLEDGE_BASE>
${contextInfo}
### 📤 </KNOWLEDGE_BASE>
---`
      },
      ...formattedHistory,
      {
        role: 'user',
        content: userMessage
      }
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: 0.1,
        max_tokens: 300
      })
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('Groq API Call Exception:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    // 1. Shared Upstash Redis Rate Limiting (20 messages / min)
    const rateCheck = await checkRateLimit('chat', ip);
    if (!rateCheck.success) {
      return NextResponse.json(
        { error: 'You are sending messages too quickly. Please wait a moment.' },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { message, history } = body;
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // 2. Input Length Guardrail (Prevents prompt bloat & memory exhaustion)
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 500) {
      return NextResponse.json(
        { error: 'Message is too long. Please keep your question under 500 characters.' },
        { status: 400 }
      );
    }

    // 3. Prompt Injection Defense (Phase 3 Item 4)
    if (detectPromptInjection(trimmedMessage)) {
      return NextResponse.json({
        text: 'Namaste! I am Aanya, the jewelry concierge for Ambika Jewels in Jammu. I am here to assist you with our handcrafted Dogra jewelry, bridal collections, and showroom policies. How may I help you with our jewelry today?',
        disclaimer: 'AI assistant — please confirm all details with the store.'
      });
    }

    // 4. DPDP PII Redaction before sending to external AI (Phase 3 Item 4)
    const sanitizedUserMessage = redactPiiForChat(trimmedMessage);

    const userTokens = extractKeywords(trimmedMessage);
    const category = parseCategory(trimmedMessage);
    const wantsContact = userTokens.some(t => ['contact', 'phone', 'whatsapp', 'call', 'number', 'mobile', 'owner'].includes(t));
    const asksAboutPrice = userTokens.some(t => ['price', 'rate', 'cost', 'how much', 'discount', 'gold rate', 'making charge'].includes(t));
    const asksAboutStock = userTokens.some(t => ['stock', 'available', 'availability', 'in stock', 'ready'].includes(t));

    // 5. Fetch Matching Products from Database (NO mockProducts, NO prices, NO stock)
    let matchingProducts: ChatProductSummary[] = [];
    if (category || userTokens.some(t => ['show', 'looking', 'want', 'buy', 'product', 'dogri', 'dogra', 'jhumki', 'naman', 'necklace', 'gold', 'diamond', 'silver', 'bridal', 'custom', 'ring', 'bangle'].includes(t))) {
      matchingProducts = await fetchProductsFromDb(category, userTokens);
    }

    // 6. Build Context (Strictly omits metal rates, prices, and inventory counts)
    let catalogContext = `Store: Ambika Jewels. Location: ${storeKnowledge.address}. Contact: WhatsApp ${storeKnowledge.whatsapp}, Phone ${storeKnowledge.phone}. Showroom Hours: ${storeKnowledge.hours.formattedSummary}.`;
    if (matchingProducts.length > 0) {
      catalogContext += `\nFeatured Catalog Items: ${matchingProducts.map(p => `${p.name} (Category: ${p.category}, Page: /collections/${p.slug})`).join('; ')}`;
    }
    catalogContext += `\nStore Policies & FAQs:\n` + faqItems.map(f => `Q: ${f.question} | A: ${f.answer}`).join('\n');

    // 7. Call Groq AI with sanitized message
    const aiResponse = await callGroqLlama3(sanitizedUserMessage, catalogContext, Array.isArray(history) ? history : []);

    const disclaimer = 'AI assistant — please confirm all details, rates, and stock with the showroom.';

    if (aiResponse) {
      return NextResponse.json({
        text: aiResponse,
        products: matchingProducts.length > 0 ? matchingProducts : undefined,
        showContactOptions: wantsContact || asksAboutPrice || asksAboutStock ? true : undefined,
        disclaimer
      });
    }

    // 8. Fallback for price/stock inquiries (F5: Never quote prices or stock)
    if (asksAboutPrice || asksAboutStock) {
      return NextResponse.json({
        text: `Namaste! Because daily bullion rates (22K/18K/14K gold and 925 silver) fluctuate with the market, our live prices and showroom availability are updated in real time. Please visit any item's product page to view today's active rate, or chat directly with our showroom team on WhatsApp:`,
        products: matchingProducts.length > 0 ? matchingProducts : undefined,
        showContactOptions: true,
        disclaimer
      });
    }

    // 9. Rule-Based Fallback for Catalog & General Queries
    if (matchingProducts.length > 0) {
      return NextResponse.json({
        text: `Namaste! Here are pieces from our showroom collection${category ? ` in ${category}` : ''}. Please visit the product pages to view current designs and details:`,
        products: matchingProducts,
        disclaimer
      });
    }

    let bestMatch = null;
    let highestScore = 0;
    for (const faq of faqItems) {
      let score = 0;
      for (const kw of faq.keywords) {
        if (userTokens.some(token => matchesKeyword(token, kw))) {
          score += 1;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = faq;
      }
    }
    
    if (highestScore >= 1 && bestMatch) {
      return NextResponse.json({ 
        text: bestMatch.answer,
        showContactOptions: wantsContact ? true : undefined,
        disclaimer
      });
    }

    return NextResponse.json({ 
      text: wantsContact 
        ? "Namaste! You can reach Ambika Jewels directly on WhatsApp or Call using the buttons below:" 
        : `Namaste! Ambika Jewels is located at:\n${storeKnowledge.address}\n\nOur showroom hours are:\n• Monday – Saturday: 10:00 AM – 8:00 PM\n• Sunday: Open (10:00 AM – 8:00 PM)\n\nHow can I assist you with our handcrafted jewelry today?`,
      showContactOptions: wantsContact ? true : undefined,
      disclaimer
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
