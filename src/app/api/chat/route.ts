import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/siteConfig';
import { mockProducts } from '@/data/mockProducts';
import { storeKnowledge, faqItems } from '@/data/storeKnowledge';
import type { Product } from '@/types';

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

function parseBudget(message: string): number | null {
  const match = message.match(/(?:under|<|below|max)\s*(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)/i) || 
                message.match(/(?:₹|rs\.?|inr)?\s*(\d+(?:,\d+)*)\s*(?:or less)/i);
  
  if (match && match[1]) {
    return parseInt(match[1].replace(/,/g, ''), 10) * 100;
  }
  return null;
}

function parseCategory(message: string): string | null {
  const lowerMsg = message.toLowerCase();
  for (const cat of siteConfig.categories) {
    if (lowerMsg.includes(cat.toLowerCase()) || 
        (cat.includes('Dogra') && (lowerMsg.includes('dogra') || lowerMsg.includes('dogri')))) {
      return cat;
    }
  }
  return null;
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

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are Aanya, a warm, polite, and deeply knowledgeable AI Concierge at Ambika Jewels in Jammu.

YOUR PERSONALITY & TONE:
- Start responses with a warm Indian greeting like "Namaste!".
- Speak in simple, elegant, helpful English.
- Keep answers concise (2 to 4 sentences max), but answer directly with accurate business facts.

OFFICIAL BUSINESS KNOWLEDGE BASE FOR AMBIKA JEWELS:
1. STORE DETAILS & LEADERSHIP:
   - Established: 2021 in Jammu.
   - Owner: Shivani Anand.
   - Business Representative: Lakesh Kumar.
   - Showroom & Boutique: Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, J&K 180013.
   - Contact: Phone ${storeKnowledge.phone} | WhatsApp ${storeKnowledge.whatsapp} | Email: ${storeKnowledge.email}.

2. STORE HOURS & TIMINGS:
   - Monday – Saturday: 10:00 AM – 8:00 PM.
   - Sunday: Open (10:00 AM – 8:00 PM).
   - Festive & Wedding Hours: Extended up to 9:00 PM – 10:00 PM depending on customer demand.

3. SPECIALTY & SIGNATURE DOGRA COLLECTION:
   - Known for authentic Dogra heritage jewelry reflecting Jammu's cultural heritage.
   - Signature Offerings: Dogri Jhumki, Dogri Naman Set, Dogri Long Set, and custom heritage designs.

4. PRODUCTS & PURITY:
   - Gold Jewelry: 22K Gold (916), 18K Gold (750), 14K Gold (585), and 9K Gold (375).
   - Diamond Jewelry: Available in 18K & 14K Gold (certified real diamonds).
   - Silver Collection: 925 Hallmarked Silver & traditional silver jewelry.
   - Complete Range: Necklaces, Chokers, Earrings, Bangles, Bracelets, Kadas, Rings, Bridal, Men's, and Everyday Wear.

5. GOLD EXCHANGE & CUSTOMIZATION:
   - Exchange old gold jewelry for new designs.
   - Melt existing gold jewelry to create completely new customized jewelry.
   - Upgrade older family heirlooms into modern designer pieces.
   - 3D CAD design previews on WhatsApp (+91 9086098457).

6. PAYMENT METHODS ACCEPTED:
   - UPI, Bank Transfer, RTGS, Cash, and standard digital payment methods.

CRITICAL RULES:
1. Directly answer what the customer asks based on the factual knowledge base above.
2. DO NOT prompt users to call or WhatsApp unless they explicitly ask for contact options or phone numbers.
3. If asked about non-jewelry topics, steer back politely: "Namaste! I am here to help you with Ambika Jewels collections, store timings, gold exchange, and custom designs. How can I assist you today?"

Context & Product Data:
${contextInfo}`
          },
          ...formattedHistory,
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
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
    const { message, history } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userTokens = extractKeywords(message);
    const budget = parseBudget(message);
    const category = parseCategory(message);
    
    const wantsContact = userTokens.some(t => ['contact', 'phone', 'whatsapp', 'call', 'number', 'mobile'].includes(t));

    // 1. Match products locally from mockProducts
    let matchingProducts: Product[] = [];
    if (budget || category || userTokens.some(t => ['show', 'looking', 'want', 'buy', 'product', 'dogri', 'dogra', 'jhumki', 'naman', 'long set', 'gold', 'diamond', 'silver', 'bridal', 'custom', 'exchange'].includes(t))) {
      matchingProducts = mockProducts.filter(p => {
        let matches = true;
        if (category) {
          const matchCat = p.category.toLowerCase().includes(category.toLowerCase());
          const matchCol = Boolean(p.collection && p.collection.toLowerCase().includes(category.toLowerCase()));
          matches = matches && (matchCat || matchCol);
        }
        if (budget) matches = matches && p.price <= budget;
        return matches;
      }).slice(0, 3);

      if (matchingProducts.length === 0) {
        matchingProducts = mockProducts.filter(p => 
          userTokens.some(token => matchesKeyword(token, p.name.toLowerCase()) || p.description.toLowerCase().includes(token))
        ).slice(0, 3);
      }
    }

    // 2. Build rich local catalog context
    let catalogContext = `Categories: ${siteConfig.categories.join(', ')}. Address: ${storeKnowledge.address}. Phone: ${storeKnowledge.phone}. WhatsApp: ${storeKnowledge.whatsapp}. Hours: ${storeKnowledge.hours.formattedSummary}`;
    if (matchingProducts.length > 0) {
      catalogContext += `\nMatching Products in Store: ${matchingProducts.map(p => `${p.name} (Price: ${p.display_price}, Category: ${p.category})`).join('; ')}`;
    }
    catalogContext += `\nStore FAQs:\n` + faqItems.map(f => `Q: ${f.question} | A: ${f.answer}`).join('\n');

    // 3. Call Groq AI Assistant
    const aiResponse = await callGroqLlama3(message, catalogContext, Array.isArray(history) ? history : []);

    if (aiResponse) {
      return NextResponse.json({
        text: aiResponse,
        products: matchingProducts.length > 0 ? matchingProducts : undefined,
        showContactOptions: wantsContact ? true : undefined
      });
    }

    // 4. Rule-Based Fallback
    if (matchingProducts.length > 0) {
      return NextResponse.json({
        text: `Namaste! Here are a few pieces from our store${category ? ` in ${category}` : ''}${budget ? ` under ₹${(budget/100).toLocaleString('en-IN')}` : ''}:`,
        products: matchingProducts
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
        showContactOptions: wantsContact ? true : undefined
      });
    }

    return NextResponse.json({ 
      text: wantsContact 
        ? "Namaste! You can reach Ambika Jewels directly on WhatsApp or Call using the buttons below:" 
        : `Namaste! Ambika Jewels (Estd 2021) is located at:\n${storeKnowledge.address}\n\nOur showroom hours are:\n• Monday – Saturday: 10:00 AM – 8:00 PM\n• Sunday: Open (10:00 AM – 8:00 PM)\n\nHow can I assist you today?`,
      showContactOptions: wantsContact ? true : undefined
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
