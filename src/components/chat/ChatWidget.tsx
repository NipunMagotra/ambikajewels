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

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 'initial', sender: 'bot', text: 'Namaste! Welcome to Ambika Jewels. How may I assist you with our heritage collections today?' }
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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: inputValue.trim() };
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
          id: Date.now().toString(),
          sender: 'bot',
          text: data.text,
          products: data.products,
          showContactOptions: data.showContactOptions
        }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        sender: 'bot',
        text: 'Sorry, I am having trouble connecting right now. Please try again later or reach out via WhatsApp.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 bg-primary-container border-[1.5px] border-primary rounded-full flex items-center justify-center text-primary shadow-lg hover:bg-primary hover:text-on-primary transition-all z-40 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-[calc(100vw-32px)] lg:w-96 max-h-[600px] h-[80vh] bg-surface-container border border-outline-variant shadow-2xl flex flex-col z-50 transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`}>
        
        {/* Header */}
        <div className="bg-surface-container-high border-b border-outline-variant p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-sm">diamond</span>
            </div>
            <div>
              <h4 className="font-label-caps text-label-caps text-primary">AMBIKA ASSISTANT</h4>
              <p className="text-[10px] text-on-surface-variant font-label-caps tracking-widest">ALWAYS ONLINE</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-surface flex flex-col gap-4">
          {messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-3 font-body-md text-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-on-primary rounded-l-lg rounded-tr-lg' 
                  : 'bg-surface-container-high text-on-surface border border-outline-variant rounded-r-lg rounded-tl-lg'
              }`}>
                {msg.text}
              </div>
              
              {/* Product Recommendations */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 flex gap-2 overflow-x-auto max-w-[280px] custom-scrollbar pb-2">
                  {msg.products.map(p => (
                    <Link key={p.id} href={`/collections/${p.slug}`} className="block w-24 shrink-0">
                      <div className="aspect-[3/4] bg-surface-container-low border border-outline-variant overflow-hidden mb-1">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${p.images[0]}')` }} />
                      </div>
                      <p className="font-label-caps text-[10px] text-on-surface truncate">{p.name}</p>
                      <p className="font-label-caps text-[10px] text-primary">{p.display_price}</p>
                    </Link>
                  ))}
                </div>
              )}

              {/* Contact Options Fallback */}
              {msg.showContactOptions && (
                <div className="mt-3 flex flex-col gap-2 w-full max-w-[250px]">
                  <WhatsAppButton />
                  <CallButton />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-1 items-center bg-surface-container-high border border-outline-variant rounded-r-lg rounded-tl-lg p-3 w-16 h-10">
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSend} className="p-3 bg-surface-container-high border-t border-outline-variant flex gap-2">
          <input 
            type="text" 
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder="Ask about our collections..."
            className="flex-1 bg-surface border border-outline-variant text-on-surface font-body-md text-sm p-2 outline-none focus:border-primary transition-colors"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary text-on-primary w-10 h-10 flex items-center justify-center disabled:opacity-50 hover:bg-primary-container hover:text-primary transition-colors border border-primary"
          >
            <span className="material-symbols-outlined text-sm">send</span>
          </button>
        </form>

      </div>
    </>
  );
}
