'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';
import { siteConfig } from '@/config/siteConfig';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Enquiry',
    message: '',
  });
  const [marketingConsent, setMarketingConsent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 sm:pt-32 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-sans text-[10px] text-[var(--text-secondary)] mb-4 uppercase tracking-wider font-medium">
            <Link href="/" className="hover:text-[var(--accent-gold)] transition-colors">HOME</Link>
            <span>/</span>
            <span className="text-[var(--accent-gold)] font-semibold">CONTACT US</span>
          </div>

          {/* Header section */}
          <div className="text-center mb-8 sm:mb-10">
            <span className="font-sans text-[9px] sm:text-[10px] text-[var(--accent-gold)] font-semibold tracking-[0.3em] uppercase block mb-1">
              VISIT OR GET IN TOUCH
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[var(--text-primary)] font-normal mb-2">Contact Ambika Jewels</h1>
            <p className="font-sans text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl mx-auto font-light leading-relaxed">
              Have questions regarding custom 3D CAD design preview, gold exchange rates, bridal trousseaus, or online orders? Our boutique concierge in Jammu is delighted to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-10">
            
            {/* Left Column: Direct Details */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-5 sm:p-6 rounded-[2px] space-y-4">
                <h2 className="font-serif text-lg sm:text-xl text-[var(--text-primary)] font-normal border-b border-[var(--border-subtle)] pb-2.5">
                  Showroom &amp; Boutique Details
                </h2>

                <div>
                  <span className="font-sans text-[9px] text-[var(--accent-gold)] block font-semibold uppercase tracking-wider mb-0.5">PHYSICAL STORE ADDRESS</span>
                  <p className="font-sans text-xs sm:text-sm text-[var(--text-primary)] leading-relaxed font-light">
                    Ambika Jewels <br/>
                    Shop no.3, E.W.S colony, Sector 1, <br/>
                    Lower Roop Nagar, Jammu, <br/>
                    Jammu &amp; Kashmir 180013, India
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-1 font-light">
                    (Managed by Owner Shivani Anand &amp; Representative Lakesh Kumar)
                  </p>
                </div>

                <div>
                  <span className="font-sans text-[9px] text-[var(--accent-gold)] block font-semibold uppercase tracking-wider mb-0.5">OFFICIAL EMAIL ADDRESS</span>
                  <a href={`mailto:${siteConfig.contact.email}`} className="font-sans text-xs sm:text-sm text-[var(--text-primary)] font-medium hover:text-[var(--accent-gold)] block transition-colors">
                    {siteConfig.contact.email}
                  </a>
                </div>

                <div>
                  <span className="font-sans text-[9px] text-[var(--accent-gold)] block font-semibold uppercase tracking-wider mb-0.5">PHONE &amp; WHATSAPP CONCIERGE</span>
                  <p className="font-sans text-xs sm:text-sm text-[var(--text-primary)] font-medium">Phone: +91 9682589725</p>
                  <p className="font-sans text-xs sm:text-sm text-[var(--text-primary)] font-medium">WhatsApp: +91 9086098457</p>
                </div>

                <div>
                  <span className="font-sans text-[9px] text-[var(--accent-gold)] block font-semibold uppercase tracking-wider mb-0.5">BOUTIQUE OPERATING HOURS</span>
                  <p className="font-sans text-xs text-[var(--text-secondary)] font-light leading-relaxed">
                    Monday – Sunday: 10:00 AM – 8:00 PM <br/>
                    <span className="text-[11px] text-[var(--accent-gold)] font-medium">(Extended during Festive &amp; Wedding Seasons)</span>
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] text-xs font-sans text-[var(--text-secondary)] space-y-0.5">
                  <span className="font-sans text-[9px] text-[var(--accent-gold)] block font-semibold uppercase tracking-wider mb-1">REGISTRATIONS</span>
                  <p>Legal Entity: Ambika Jewels</p>
                  <p>GSTIN: {siteConfig.gstin}</p>
                  <p>BIS Hallmark: {siteConfig.bisHallmarkLicense}</p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <WhatsAppButton />
                  <CallButton />
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-6 sm:p-7 rounded-[2px] h-full">
                <h2 className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-normal mb-1">Send Us a Message</h2>
                <p className="font-sans text-xs text-[var(--text-secondary)] mb-5 font-light">Fill out the form below and our jewellery concierge will respond within 24 hours.</p>

                {formSubmitted ? (
                  <div className="p-8 bg-[var(--bg-surface)] border border-[var(--border-card)] text-center rounded-[2px] space-y-3 py-12">
                    <div className="w-12 h-12 bg-[var(--accent-gold)] text-white rounded-full flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                    <h3 className="font-serif text-xl text-[var(--text-primary)] font-normal">Thank You!</h3>
                    <p className="font-sans text-xs text-[var(--text-secondary)] max-w-md mx-auto font-light">
                      Your enquiry has been sent successfully to <strong>{siteConfig.contact.email}</strong>. Our Jammu concierge team will contact you shortly.
                    </p>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="font-sans text-xs text-[var(--accent-gold)] underline font-semibold mt-4 block mx-auto cursor-pointer uppercase tracking-wider"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* DPDP Statutory Notice */}
                    <div className="p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[2px] text-[11px] text-[var(--text-secondary)] flex items-start gap-2 mb-2 leading-relaxed font-light">
                      <span className="material-symbols-outlined text-[var(--accent-gold)] text-base shrink-0 mt-0.5">shield</span>
                      <span><strong>DPDP Privacy Notice:</strong> Your name, email, and phone are collected strictly to respond to your consultation. We do not sell your personal data.</span>
                    </div>

                    <div>
                      <label className="font-sans text-[10px] text-[var(--accent-gold)] block mb-1 font-semibold uppercase tracking-wider">YOUR FULL NAME *</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs sm:text-sm p-2.5 rounded-[2px] outline-none transition-colors"
                        placeholder="e.g., Ananya Sharma"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-sans text-[10px] text-[var(--accent-gold)] block mb-1 font-semibold uppercase tracking-wider">EMAIL ADDRESS *</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs sm:text-sm p-2.5 rounded-[2px] outline-none transition-colors"
                          placeholder="e.g., ananya@example.com"
                        />
                      </div>

                      <div>
                        <label className="font-sans text-[10px] text-[var(--accent-gold)] block mb-1 font-semibold uppercase tracking-wider">PHONE (WHATSAPP)</label>
                        <input 
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs sm:text-sm p-2.5 rounded-[2px] outline-none transition-colors"
                          placeholder="e.g., 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-sans text-[10px] text-[var(--accent-gold)] block mb-1 font-semibold uppercase tracking-wider">ENQUIRY TYPE</label>
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs sm:text-sm p-2.5 rounded-[2px] outline-none transition-colors cursor-pointer"
                      >
                        <option value="General Enquiry" className="bg-[var(--bg-card)] text-[var(--text-primary)]">General Jewellery Enquiry</option>
                        <option value="3D CAD Preview" className="bg-[var(--bg-card)] text-[var(--text-primary)]">3D CAD Bespoke Customisation</option>
                        <option value="Gold Exchange" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Gold Exchange &amp; Valuation</option>
                        <option value="Live Video Shopping" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Live Video Shopping Booking</option>
                        <option value="Order Tracking" className="bg-[var(--bg-card)] text-[var(--text-primary)]">Online Order Tracking</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-sans text-[10px] text-[var(--accent-gold)] block mb-1 font-semibold uppercase tracking-wider">YOUR MESSAGE *</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-xs sm:text-sm p-2.5 rounded-[2px] outline-none transition-colors resize-none"
                        placeholder="Tell us about the design, size, or assistance you require..."
                      ></textarea>
                    </div>

                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-[var(--text-secondary)] pt-1">
                      <input 
                        type="checkbox" 
                        checked={marketingConsent}
                        onChange={e => setMarketingConsent(e.target.checked)}
                        className="accent-[#D8B75A] w-3.5 h-3.5 mt-0.5 cursor-pointer rounded shrink-0"
                      />
                      <span className="text-[11px] leading-relaxed font-light">
                        (Optional) Send me WhatsApp updates on custom Dogra heritage releases and showroom exhibitions.
                      </span>
                    </label>

                    <button 
                      type="submit" 
                      className="btn-gold-primary w-full py-3.5"
                    >
                      SEND INQUIRY TO CONCIERGE
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Location Map Section */}
          <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 sm:p-6 rounded-[2px]">
            <h2 className="font-serif text-lg text-[var(--text-primary)] font-normal mb-3">Location Map: Lower Roop Nagar, Jammu</h2>
            <div className="h-64 sm:h-80 w-full overflow-hidden relative rounded-[2px] border border-[var(--border-subtle)]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                className="border-0 opacity-90 contrast-[1.05] dark:invert dark:hue-rotate-180 dark:contrast-125 dark:opacity-85"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ambika Jewels Showroom Location Map"
              />
            </div>
          </div>

        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
