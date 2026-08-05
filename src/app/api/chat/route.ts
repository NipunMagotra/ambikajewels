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

    const messages: any[] = [
      {
        role: 'system',
        content: `You are Aanya, the official AI Jewelry Concierge for Ambika Jewels (Estd. 2021) located in Lower Roop Nagar, Jammu. 

Your primary function is to assist customers with showroom collections, the Gold Exchange Program, 3D CAD customization, and the Ambika P-Gold digital accumulation module.

### 🛑 STRICT SYSTEM GUARDRAILS (MUST OBEY) 🛑

1. **CONTEXTUAL ISOLATION:** You must answer the user's query **ONLY** using the information provided in the <KNOWLEDGE_BASE> section below. 
2. **ZERO-FABRICATION RULE:** If the <KNOWLEDGE_BASE> does not contain the exact information needed to fully answer the prompt, you MUST output the following exact phrase and nothing else:
   "I apologize, but I don't have the exact details for that right now. Please connect with our WhatsApp concierge at +91 9086098457 or visit our showroom, and Shivani or Lakesh will be happy to assist you directly."
3. **NO PRICE SPECULATION:** Never guess, estimate, or hardcode gold prices, digital gold rates, or custom jewelry costs. You may only quote prices if they are explicitly passed to you in the live <KNOWLEDGE_BASE>.
4. **NO PROMISES:** You cannot approve loans, guarantee exact delivery times, or confirm inventory. You only provide information.
5. **TONE:** Professional, culturally respectful (honoring Dogra heritage), warm, and concise.

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
        temperature: 0.0,
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
