import { siteConfig } from "@/config/siteConfig";

export function WhatsAppButton() {
  return (
    <a 
      className="flex items-center gap-2 bg-[#0b3829] hover:bg-[#0e4834] text-[#a3e4cb] hover:text-white border border-[#0e5c46] px-4 py-3 font-sans text-xs font-semibold rounded-[2px] transition-all justify-center tracking-wider uppercase shadow-xs" 
      href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="material-symbols-outlined text-base">chat_bubble</span> Chat on WhatsApp
    </a>
  );
}

export function CallButton() {
  return (
    <a 
      className="flex items-center gap-2 border border-[var(--border-subtle)] hover:border-[var(--accent-gold)] text-[var(--text-primary)] hover:text-[var(--accent-gold)] bg-[var(--bg-card)] hover:bg-[var(--bg-surface)] px-4 py-3 font-sans text-xs font-semibold rounded-[2px] transition-all justify-center tracking-wider uppercase shadow-xs" 
      href={`tel:${siteConfig.contact.phone}`}
    >
      <span className="material-symbols-outlined text-base">phone</span> Call Us
    </a>
  );
}
