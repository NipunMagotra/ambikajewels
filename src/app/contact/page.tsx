'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import Link from 'next/link';
import { WhatsAppButton, CallButton } from '@/components/ui/ContactButtons';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setFormSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-5xl">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 font-label-caps text-[10px] text-on-surface-variant mb-6">
            <Link href="/" className="hover:text-primary">HOME</Link>
            <span>/</span>
            <span className="text-primary font-bold">CONTACT US</span>
          </div>

          {/* Header section */}
          <div className="text-center mb-10 sm:mb-section-gap">
            <span className="font-label-caps text-xs text-primary font-bold tracking-widest block mb-2">VISIT OR GET IN TOUCH</span>
            <h1 className="font-headline-md text-3xl sm:text-5xl text-primary font-semibold mb-4">Contact Ambika Jewels</h1>
            <p className="font-body-lg text-sm sm:text-base text-on-surface-variant max-w-2xl mx-auto">
              Have questions regarding custom 3D CAD design preview, gold exchange rates, bridal trousseaus, or online orders? Our boutique concierge in Jammu is delighted to assist you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
            
            {/* Left Column: Direct Details & Map */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xs space-y-5">
                <h2 className="font-headline-sm text-xl text-primary font-semibold border-b border-outline-variant/20 pb-3">Showroom & Boutique Details</h2>

                <div>
                  <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">PHYSICAL STORE ADDRESS</span>
                  <p className="font-body-md text-sm text-on-surface leading-relaxed font-semibold">
                    Ambika Jewels <br/>
                    Shop no.3, E.W.S colony, Sector 1, <br/>
                    Lower Roop Nagar, Jammu, <br/>
                    Jammu & Kashmir 180013, India
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    (Managed by Owner Shivani Anand & Representative Lakesh Kumar)
                  </p>
                </div>

                <div>
                  <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">OFFICIAL EMAIL ADDRESS</span>
                  <a href="mailto:contact@ambikajewels.com" className="font-body-md text-sm text-on-surface font-semibold hover:text-primary block">
                    contact@ambikajewels.com
                  </a>
                </div>

                <div>
                  <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">PHONE & WHATSAPP CONCIERGE</span>
                  <p className="font-body-md text-sm text-on-surface font-semibold">Phone: +91 9682589725</p>
                  <p className="font-body-md text-sm text-on-surface font-semibold">WhatsApp: +91 9086098457</p>
                </div>

                <div>
                  <span className="font-label-caps text-[10px] text-primary block font-bold mb-1">BOUTIQUE OPERATING HOURS</span>
                  <p className="font-body-md text-xs sm:text-sm text-on-surface-variant">
                    Monday – Sunday: 10:00 AM – 8:00 PM <br/>
                    <span className="text-[11px] text-amber-400 font-semibold">(Extended during Festive & Wedding Seasons)</span>
                  </p>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <WhatsAppButton />
                  <CallButton />
                </div>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-surface-container border border-outline-variant/30 p-6 sm:p-8 rounded-xs h-full">
                <h2 className="font-headline-sm text-xl text-primary font-semibold mb-2">Send Us a Message</h2>
                <p className="font-body-md text-xs text-on-surface-variant mb-6">Fill out the form below and our jewelry concierge will respond within 24 hours.</p>

                {formSubmitted ? (
                  <div className="p-8 bg-primary/10 border border-primary text-center rounded-xs space-y-4 py-12">
                    <div className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center mx-auto">
                      <span className="material-symbols-outlined text-2xl">check</span>
                    </div>
                    <h3 className="font-headline-sm text-xl text-primary font-bold">Thank You!</h3>
                    <p className="font-body-md text-sm text-on-surface-variant max-w-md mx-auto">
                      Your inquiry has been sent successfully to <strong>contact@ambikajewels.com</strong>. Our Jammu concierge team will contact you shortly.
                    </p>
                    <button 
                      onClick={() => setFormSubmitted(false)}
                      className="font-label-caps text-xs text-primary underline font-bold mt-4 block mx-auto"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1 font-semibold">YOUR FULL NAME *</label>
                      <input 
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                        placeholder="e.g., Ananya Sharma"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1 font-semibold">EMAIL ADDRESS *</label>
                        <input 
                          required
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                          placeholder="e.g., ananya@example.com"
                        />
                      </div>

                      <div>
                        <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1 font-semibold">PHONE NUMBER (WHATSAPP)</label>
                        <input 
                          type="tel"
                          value={formData.phone}
                          onChange={e => setFormData({...formData, phone: e.target.value})}
                          className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                          placeholder="e.g., 9876543210"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1 font-semibold">INQUIRY TYPE</label>
                      <select 
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        className="w-full bg-surface-container border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors"
                      >
                        <option value="General Inquiry">General Jewelry Inquiry</option>
                        <option value="3D CAD Preview">3D CAD Bespoke Customization</option>
                        <option value="Gold Exchange">Gold Exchange & Valuation</option>
                        <option value="Live Video Shopping">Live Video Shopping Booking</option>
                        <option value="Order Tracking">Online Order Tracking</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-label-caps text-[10px] text-on-surface-variant block mb-1 font-semibold">YOUR MESSAGE *</label>
                      <textarea 
                        required
                        rows={4}
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-sm py-2 outline-none transition-colors resize-none"
                        placeholder="Tell us about the design, size, or assistance you require..."
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-primary-container px-8 py-3.5 font-label-caps text-xs text-primary border-[1.5px] border-primary hover:bg-primary hover:text-on-primary transition-colors font-bold tracking-wider"
                    >
                      SEND INQUIRY TO CONCIERGE
                    </button>
                  </form>
                )}
              </div>
            </div>

          </div>

          {/* Location Map Section */}
          <div className="bg-surface-container border border-outline-variant/30 p-6 rounded-xs">
            <h3 className="font-headline-sm text-lg text-primary font-semibold mb-4">Location Map — Lower Roop Nagar, Jammu</h3>
            <div className="h-72 sm:h-96 w-full overflow-hidden relative rounded-xs border border-outline-variant/30">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13414.288277259163!2d74.8304221!3d32.7715891!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e84e5a95f9227%3A0xb7cf9f3238914619!2sRoop%20Nagar%2C%20Jammu%2C%20Jammu%20and%20Kashmir%20180013!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2) opacity(0.85)' }}
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
