'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import type { Product } from '@/types';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  products?: Product[];
  showContactOptions?: boolean;
};

const QUICK_PROMPTS = [
  'Bridal & Wedding Sets',
  'Store Location & Timings',
  'Custom Gold Design',
  'Gold Purity & Guarantee'
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'initial', 
      sender: 'bot', 
      text: "Namaste! I'm Aanya from Ambika Jewels. I'm here to assist you with authentic Dogra heritage jewellery, bridal collections, or custom 3D CAD designs. How may I help you today?" 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const sendQuery = async (queryText: string) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg: Message = { id: String(Date.now()), sender: 'user', text: queryText.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const history = messages
      .filter(m => m.id !== 'initial')
      .map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history })
      });
      const data = await res.json();
      
      if (res.ok) {
        setMessages(prev => [...prev, {
          id: String(Date.now() + 1),
          sender: 'bot',
          text: data.text,
          products: data.products,
          showContactOptions: data.showContactOptions
        }]);
      } else {
        throw new Error(data.error || 'Failed to fetch response');
      }
    } catch {
      setMessages(prev => [...prev, {
        id: String(Date.now() + 2),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting right now. Please message our Jammu showroom directly on WhatsApp for instant assistance.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    sendQuery(inputValue);
  };

  return (
    <>
      {/* Floating Action Button - Positioned SAFELY above mobile bottom nav */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed right-4 lg:right-8 w-12 h-12 sm:w-13 sm:h-13 bg-[var(--bg-card)] border-[1.5px] border-[var(--accent-gold)] rounded-full flex items-center justify-center text-[var(--accent-gold)] shadow-2xl hover:bg-[var(--accent-gold)] hover:text-white transition-all z-40 cursor-pointer ${
          isOpen ? 'scale-0' : 'scale-100'
        }`}
        style={{
          bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))',
        }}
        aria-label="Ask Ambika Assistant"
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">chat</span>
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed right-3 left-3 sm:left-auto sm:right-8 w-auto sm:w-96 max-h-[520px] sm:max-h-[600px] h-[75vh] bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right rounded-[2px] ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{
          bottom: 'calc(5rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        
        {/* Header */}
        <div className="bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] p-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[var(--bg-card)] flex items-center justify-center shrink-0 border border-[var(--accent-gold)]/40">
              <span className="material-symbols-outlined text-[var(--accent-gold)] text-base">support_agent</span>
            </div>
            <div>
              <h4 className="font-sans text-xs text-[var(--accent-gold)] font-bold tracking-[0.16em] uppercase">ASK AMBIKA</h4>
              <p className="text-[9px] text-[var(--text-secondary)] font-sans tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Aanya • Personal Jewellery Guide
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)} 
            className="text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors p-1 cursor-pointer" 
            aria-label="Close Chat"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Disclaimer Banner */}
        <div className="bg-[var(--bg-surface)] px-3 py-1.5 border-b border-[var(--border-subtle)] text-[9.5px] text-[var(--text-secondary)] font-sans tracking-wider text-center flex items-center justify-center gap-1.5">
          <span className="material-symbols-outlined text-xs text-[var(--accent-gold)]">info</span>
          <span>AI assistant, confirm details with showroom</span>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar bg-[var(--bg-main)] flex flex-col gap-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[88%] p-3 font-sans text-xs sm:text-[13px] leading-relaxed rounded-[2px] ${
                msg.sender === 'user' 
                  ? 'bg-[var(--accent-gold)] text-white font-medium shadow-sm' 
                  : 'bg-[var(--bg-card)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-xs'
              }`}>
                {msg.text}
              </div>
              
              {/* Product Recommendations */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-2.5 flex gap-2 overflow-x-auto max-w-full custom-scrollbar pb-1.5">
                  {msg.products.map(p => (
                    <Link key={p.id} href={`/collections/${p.slug || p.id}`} className="block w-24 shrink-0 bg-[var(--bg-card)] border border-[var(--border-subtle)] p-1.5 rounded-[2px] hover:border-[var(--accent-gold)] transition-colors">
                      <div className="aspect-[3/4] bg-[var(--bg-surface)] border border-[var(--border-subtle)] overflow-hidden mb-1">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${p.images?.[0] || '/hero-clean.png'}')` }} />
                      </div>
                      <p className="font-serif text-[10px] text-[var(--text-primary)] truncate">{p.name}</p>
                      <p className="font-sans text-[8px] text-[var(--accent-gold)] font-semibold tracking-wider uppercase mt-0.5">View Details →</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Contact Options Fallback */}
              {msg.showContactOptions && (
                <div className="mt-2.5 flex flex-col gap-2 w-full max-w-[240px]">
                  <WhatsAppButton />
                  <CallButton />
                </div>
              )}
            </div>
          ))}

          {/* Quick Prompts */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(prompt)}
                  className="text-[10px] font-sans bg-[var(--bg-card)] hover:bg-[var(--accent-gold)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-subtle)] rounded-full px-2.5 py-1 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-1.5 items-center bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-[2px] p-2.5 w-16 h-8">
              <div className="w-1.5 h-1.5 bg-[var(--accent-gold)] rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-[var(--accent-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-[var(--accent-gold)] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-2.5 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask Aanya in simple English..."
            className="flex-1 bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-sans text-xs p-2.5 outline-none focus:border-[var(--accent-gold)] transition-colors rounded-[2px]"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="btn-gold-primary px-3 py-2 disabled:opacity-40 shrink-0"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>

        <div className="bg-[var(--bg-surface)] px-2 py-1 text-[9px] text-[var(--text-secondary)]/80 text-center border-t border-[var(--border-subtle)] font-sans">
          AI assistant, confirm details with showroom
        </div>

      </div>
    </>
  );
}
