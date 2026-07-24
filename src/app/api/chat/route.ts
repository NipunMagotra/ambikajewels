import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/siteConfig';

function extractKeywords(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[.,?!]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2);
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
        (cat === 'Bangles & Bracelets' && (lowerMsg.includes('bangle') || lowerMsg.includes('bracelet')))) {
      return cat;
    }
  }
  return null;
}

async function callGroqLlama3(userMessage: string, contextInfo: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  try {
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
            content: `Namaste! You are Ambika Assistant, an exclusive AI concierge for Ambika Jewels—a luxury heritage Indian jewelry boutique located at Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu & Kashmir 180013.

STRICT SCOPE & GUARDRAILS:
1. You MUST ONLY answer questions about Ambika Jewels, its jewelry collections (Kundan, Polki, Solitaires, Temple, Bridal Couture), store address, custom orders, hallmarking, shipping, and boutique services.
2. If the user asks ANYTHING off-topic or unrelated to Ambika Jewels or jewelry (e.g., general knowledge, math, coding, weather, politics, recipes, or outside topics), POLITELY DECLINE and pivot back: "Namaste! I am exclusively trained to assist you with Ambika Jewels' handcrafted collections, store details, and bespoke jewelry services. How may I help you explore our jewelry today?"
3. NEVER answer off-topic questions or act as a general AI. Stay 100% focused on Ambika Jewels.
4. Keep all responses concise, polite, and luxurious (2 to 4 sentences max).

Store Information & Context:
${contextInfo}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 300
      })
    });

    if (!response.ok) {
      console.warn('Groq API Error Status:', response.status);
      return null;
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.error('Groq API Call Exception:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const userTokens = extractKeywords(message);
    const budget = parseBudget(message);
    const category = parseCategory(message);

    // 1. Fetch catalog context & matching products
    let matchingProducts: any[] = [];
    if (budget || category || userTokens.some(t => ['show', 'looking', 'want', 'buy', 'product', 'necklaces', 'earrings', 'rings', 'bangles'].includes(t))) {
      let query = supabase.from('products').select('*');
      if (category) query = query.eq('category', category);
      if (budget) query = query.lte('price', budget);
      const { data } = await query.limit(3);
      if (data) matchingProducts = data;
    }

    // 2. Fetch FAQs context
    const { data: faqs } = await supabase.from('faq_items').select('*');
    let catalogContext = `Categories: ${siteConfig.categories.join(', ')}. Store Address: Shop no.3, E.W.S colony, Sector 1, Lower Roop Nagar, Jammu, Jammu and Kashmir 180013.`;
    if (matchingProducts.length > 0) {
      catalogContext += `\nRelevant Products Available: ${matchingProducts.map(p => `${p.name} (Price: ${p.display_price}, Category: ${p.category})`).join('; ')}`;
    }
    if (faqs && faqs.length > 0) {
      catalogContext += `\nStore FAQs:\n` + faqs.map(f => `Q: ${f.question} | A: ${f.answer}`).join('\n');
    }

    // 3. Try Groq Llama 3 AI Response
    const aiResponse = await callGroqLlama3(message, catalogContext);

    if (aiResponse) {
      return NextResponse.json({
        text: aiResponse,
        products: matchingProducts.length > 0 ? matchingProducts : undefined
      });
    }

    // 4. Fallback Rule-Based Logic if GROQ_API_KEY is not set or fails
    if (matchingProducts.length > 0) {
      return NextResponse.json({
        text: `Here are some of our finest pieces you might enjoy${category ? ` in ${category}` : ''}${budget ? ` under ₹${budget/100}` : ''}:`,
        products: matchingProducts
      });
    }

    if (faqs) {
      let bestMatch = null;
      let highestScore = 0;
      for (const faq of faqs) {
        const intersection = faq.keywords.filter((kw: string) => 
          userTokens.some(token => token.includes(kw) || kw.includes(token))
        ).length;
        if (intersection > highestScore) {
          highestScore = intersection;
          bestMatch = faq;
        }
      }
      if (highestScore >= 1) {
        return NextResponse.json({ text: bestMatch.answer });
      }
    }

    return NextResponse.json({ 
      text: "Namaste! I am the Ambika Jewels concierge. For custom bridal designs or personalized assistance, please connect directly with our master jewelers via WhatsApp or Call.",
      showContactOptions: true
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

