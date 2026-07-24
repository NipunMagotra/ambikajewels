import { siteConfig } from "@/config/siteConfig";

export function WhatsAppButton() {
  return (
    <a 
      className="flex items-center gap-3 bg-secondary-container text-on-secondary-container px-4 py-3 font-label-caps text-label-caps rounded hover:brightness-110 transition-all justify-center" 
      href={`https://wa.me/${siteConfig.contact.whatsapp.replace('+', '')}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="material-symbols-outlined text-lg">chat_bubble</span> Chat on WhatsApp
    </a>
  );
}

export function CallButton() {
  return (
    <a 
      className="flex items-center gap-3 border border-outline px-4 py-3 font-label-caps text-label-caps rounded text-on-surface-variant hover:bg-surface-variant transition-all justify-center" 
      href={`tel:${siteConfig.contact.phone}`}
    >
      <span className="material-symbols-outlined text-lg">phone</span> Call Us
    </a>
  );
}
