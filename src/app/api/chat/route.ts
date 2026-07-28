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
            content: `You are Aanya, a friendly and helpful assistant at Ambika Jewels in Jammu.

LANGUAGE & VOICE (CRITICAL REQUIREMENT):
- ALWAYS USE VERY SIMPLE, PLAIN ENGLISH. 
- Use short sentences and simple words that anyone can easily understand.
- DO NOT use complex, fancy, or difficult English words (avoid words like "trousseau", "bespoke", "craftsmanship", "enameling", "paramount", "ephemeral").
- Instead of "bespoke", say "custom made" or "made for you".
- Instead of "trousseau", say "wedding jewelry".
- Instead of "boutique", say "shop" or "store".
- Keep your tone warm, friendly, polite, and welcoming (you can start with "Namaste" or "Hello").
- Keep replies brief: 2 to 3 simple sentences max.

CRITICAL RULE ON CONTACTING STORE / WHATSAPP:
- NEVER tell the user to call or contact via WhatsApp UNLESS the user explicitly asks for contact numbers, phone number, WhatsApp, or how to contact the store.
- Answer all questions directly yourself in the chat. Do NOT push or suggest WhatsApp or phone calls unless requested.

STORE CONTEXT & FACTS:
1. STORE LOCATION & HOURS:
   - Address: ${storeKnowledge.address}
   - Hours:
     • Monday: ${storeKnowledge.hours.monday}
     • Tuesday to Saturday: ${storeKnowledge.hours.tuesdayToSaturday}
     • Sunday: ${storeKnowledge.hours.sunday}
   - Phone: ${storeKnowledge.phone} | WhatsApp: ${storeKnowledge.whatsapp} | Email: ${storeKnowledge.email}
2. GOLD & DIAMOND PURITY:
   ${storeKnowledge.purityAndCertification.map(p => `- ${p}`).join('\n   ')}
3. CUSTOM ORDERS & OLD GOLD:
   ${storeKnowledge.customOrders.map(c => `- ${c}`).join('\n   ')}
4. EASY POLICIES:
   ${storeKnowledge.policies.map(p => `- ${p}`).join('\n   ')}

GUARDRAILS:
1. Only talk about Ambika Jewels, jewelry products, store details, prices, and custom orders.
2. If asked anything unrelated (like math, weather, news, or general questions), reply simply: "Namaste! I am here to help you with Ambika Jewels products, prices, and store details. How can I help you pick your jewelry today?"

Context & Products:
${contextInfo}`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 250
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
    const wantsContact = userTokens.some(t => ['contact', 'phone', 'whatsapp', 'call', 'reach', 'number', 'address', 'mobile'].includes(t));

    // 1. Match products locally from mockProducts (Zero Database Dependency)
    let matchingProducts: Product[] = [];
    if (budget || category || userTokens.some(t => ['show', 'looking', 'want', 'buy', 'product', 'necklace', 'necklaces', 'earring', 'earrings', 'ring', 'rings', 'bangle', 'bangles', 'kundan', 'polki', 'diamond', 'gold', 'solitaire', 'bridal'].includes(t))) {
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

      // Fallback keyword search if no direct category match
      if (matchingProducts.length === 0) {
        matchingProducts = mockProducts.filter(p => 
          userTokens.some(token => p.name.toLowerCase().includes(token) || p.description.toLowerCase().includes(token))
        ).slice(0, 3);
      }
    }

    // 2. Build local catalog context from storeKnowledge and faqItems
    let catalogContext = `Categories: ${siteConfig.categories.join(', ')}. Address: ${storeKnowledge.address}. Phone: ${storeKnowledge.phone}. WhatsApp: ${storeKnowledge.whatsapp}. Hours: ${storeKnowledge.hours.formattedSummary}`;
    if (matchingProducts.length > 0) {
      catalogContext += `\nMatching Products in Store: ${matchingProducts.map(p => `${p.name} (Price: ${p.display_price}, Category: ${p.category})`).join('; ')}`;
    }
    catalogContext += `\nStore FAQs:\n` + faqItems.map(f => `Q: ${f.question} | A: ${f.answer}`).join('\n');

    // 3. Call Groq AI Assistant with full local context
    const aiResponse = await callGroqLlama3(message, catalogContext);

    if (aiResponse) {
      return NextResponse.json({
        text: aiResponse,
        products: matchingProducts.length > 0 ? matchingProducts : undefined,
        showContactOptions: wantsContact ? true : undefined
      });
    }

    // 4. Pure Local Rule-Based Fallback if Groq API key is missing or fails
    if (matchingProducts.length > 0) {
      return NextResponse.json({
        text: `Namaste! Here are a few nice pieces from our shop${category ? ` in ${category}` : ''}${budget ? ` under ₹${(budget/100).toLocaleString('en-IN')}` : ''}:`,
        products: matchingProducts
      });
    }

    // Local FAQ Keyword Matcher
    let bestMatch = null;
    let highestScore = 0;
    for (const faq of faqItems) {
      const intersection = faq.keywords.filter(kw => 
        userTokens.some(token => token.includes(kw) || kw.includes(token))
      ).length;
      if (intersection > highestScore) {
        highestScore = intersection;
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
        ? "Namaste! You can reach our shop directly on WhatsApp or Call using the buttons below:" 
        : "Namaste! I am Aanya from Ambika Jewels. I am happy to help you with our gold & diamond collections, store hours, prices, gold purity, or store details. What would you like to know?",
      showContactOptions: wantsContact ? true : undefined
    });

  } catch (err) {
    console.error('Chat API Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
