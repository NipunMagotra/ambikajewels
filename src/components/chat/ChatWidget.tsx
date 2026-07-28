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
      text: "Namaste! I'm Aanya from Ambika Jewels. I'm here to help you choose the right gold and diamond jewelry or make custom designs. How can I help you today?" 
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

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text })
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
        text: 'Sorry, I am having trouble connecting. Please try again or chat with our shop on WhatsApp.'
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
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-12 h-12 sm:w-14 sm:h-14 bg-primary-container border-[1.5px] border-primary rounded-full flex items-center justify-center text-primary shadow-xl hover:bg-primary hover:text-on-primary transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
        aria-label="Ask Ambika Assistant"
      >
        <span className="material-symbols-outlined text-xl sm:text-2xl">chat</span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 lg:bottom-8 right-3 left-3 sm:left-auto sm:right-8 w-auto sm:w-96 max-h-[540px] sm:max-h-[620px] h-[78vh] bg-surface-container border border-outline-variant shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right rounded-xs ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-surface-container-high border-b border-outline-variant p-3.5 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 border border-primary/30">
              <span className="material-symbols-outlined text-primary text-base">support_agent</span>
            </div>
            <div>
              <h4 className="font-label-caps text-xs text-primary font-bold tracking-wider">ASK AMBIKA</h4>
              <p className="text-[9px] text-on-surface-variant font-label-caps tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Aanya • Personal Jewelry Guide
              </p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors p-1" aria-label="Close Chat">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3.5 custom-scrollbar bg-surface flex flex-col gap-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[88%] p-3 font-body-md text-xs sm:text-sm leading-relaxed ${
                msg.sender === 'user' 
                  ? 'bg-primary text-on-primary rounded-l-lg rounded-tr-lg font-medium shadow-sm' 
                  : 'bg-surface-container-high text-on-surface border border-outline-variant/40 rounded-r-lg rounded-tl-lg shadow-xs'
              }`}>
                {msg.text}
              </div>
              
              {/* Product Recommendations */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-2.5 flex gap-2 overflow-x-auto max-w-full custom-scrollbar pb-1.5">
                  {msg.products.map(p => (
                    <Link key={p.id} href={`/collections/${p.slug}`} className="block w-24 shrink-0 bg-surface-container-low border border-outline-variant/30 p-1.5 rounded-xs hover:border-primary transition-colors">
                      <div className="aspect-[3/4] bg-surface border border-outline-variant/20 overflow-hidden mb-1">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${p.images[0]}')` }} />
                      </div>
                      <p className="font-label-caps text-[9px] text-on-surface truncate">{p.name}</p>
                      <p className="font-label-caps text-[9px] text-primary font-bold">{p.display_price}</p>
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

          {/* Quick Prompts on initial load */}
          {messages.length === 1 && !isLoading && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => sendQuery(prompt)}
                  className="text-[10px] font-label-caps bg-surface-container-high hover:bg-primary-container text-on-surface hover:text-primary border border-outline-variant/60 rounded-full px-2.5 py-1 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {isLoading && (
            <div className="flex gap-1 items-center bg-surface-container-high border border-outline-variant rounded-r-lg rounded-tl-lg p-2.5 w-14 h-9">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-2.5 bg-surface-container-high border-t border-outline-variant flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask Aanya in simple English..."
            className="flex-1 bg-surface border border-outline-variant text-on-surface font-body-md text-base sm:text-sm p-2 outline-none focus:border-primary transition-colors rounded-xs"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary text-on-primary w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center disabled:opacity-50 hover:bg-primary-container hover:text-primary transition-colors border border-primary shrink-0"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>

      </div>
    </>
  );
}
