'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';

export default function CheckoutPage() {
  const router = useRouter();
  const { state, cartTotal, dispatch } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: ''
  });

  const tax = Math.round(cartTotal * siteConfig.tax.gstRate);
  const isFreeShipping = cartTotal >= siteConfig.shipping.freeThreshold;
  const shipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
  const finalTotal = cartTotal + tax + shipping;

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(paise / 100);
  };

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePlaceOrderWhatsApp = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          shipping_address: formData.address,
          notes: formData.notes,
          items: state.items
        })
      });

      const data = await response.json();
      const num = data?.order?.order_number || `AMB-${Math.floor(100000 + Math.random() * 900000)}`;

      setOrderId(num);

      // Build pre-filled WhatsApp message
      const phoneNum = siteConfig.contact.whatsapp.replace(/[^0-9]/g, '') || '919419100000';
      const itemSummary = state.items.map((item, idx) => 
        `${idx + 1}. *${item.name}* [${item.metal_finish}]\n   Qty: ${item.quantity} | Total: ₹${((item.price * item.quantity)/100).toLocaleString('en-IN')}`
      ).join('\n\n');

      const message = 
`Namaste Ambika Jewels! 🙏

I would like to place an order (Ref: *${num}*):

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email}
📍 *Shipping Address:* ${formData.address}
${formData.notes ? `📝 *Notes:* ${formData.notes}\n` : ''}
📦 *Items:*
${itemSummary}

💳 *Total Order Amount:* ${formatPrice(finalTotal)} (Incl. 3% GST & Shipping)

Please confirm my order and share payment details!`;

      const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;

      // Open WhatsApp app / web
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      // Clear cart & navigate to Step 3
      dispatch({ type: 'CLEAR_CART' });
      setStep(3);
    } catch (error) {
      console.error(error);
      alert('Proceeding to WhatsApp confirmation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0 && step !== 3) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-4">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-center">Your cart is currently empty.</p>
          <Link href="/collections" className="bg-primary-container px-8 py-3.5 font-label-caps text-xs text-primary border-[1.5px] border-primary font-bold tracking-widest">
            RETURN TO GALLERY
          </Link>
        </main>
        <Footer />
        <MobileBottomNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-20 sm:pt-24 pb-24 lg:pb-section-gap">
        <div className="container mx-auto px-4 sm:px-margin-mobile lg:px-margin-desktop max-w-4xl">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 sm:mb-section-gap relative max-w-md mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-outline-variant/40 -z-10"></div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step >= 1 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>1</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>INFO</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step >= 2 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>2</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>PAYMENT</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step === 3 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>3</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step === 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>CONFIRM</span>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant/30 p-4 sm:p-8 lg:p-12 rounded-xs">
            
            {/* STEP 1: INFO */}
            {step === 1 && (
              <form onSubmit={handleInfoSubmit}>
                <h2 className="font-headline-md text-xl sm:text-2xl text-primary mb-6 border-b border-outline-variant/30 pb-3">Delivery & Contact Details</h2>
                
                <div className="flex flex-col gap-5 mb-6">
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">FULL NAME *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">PHONE NUMBER *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="Enter phone number (e.g. +91 9876543210)"
                    />
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">EMAIL ADDRESS *</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="Enter email address (e.g. name@example.com)"
                    />
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">SHIPPING ADDRESS *</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors resize-none"
                      placeholder="Enter full street address, city, state, and PIN code"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">SPECIAL INSTRUCTIONS / NOTES (OPTIONAL)</label>
                    <input 
                      type="text" 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="E.g., Please call before delivery or custom sizing"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-8 pt-4 border-t border-outline-variant/30">
                  <button type="submit" className="w-full sm:w-auto bg-primary-container px-8 py-3.5 font-label-caps text-xs text-primary border-[1.5px] border-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 font-bold tracking-wider group">
                    <span>CONTINUE TO PAYMENT</span>
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT & WHATSAPP ORDER */}
            {step === 2 && (
              <div>
                <h2 className="font-headline-md text-xl sm:text-2xl text-primary mb-4">Payment & Confirmation</h2>
                
                {/* Online Payment Integration Notice */}
                <div className="bg-primary-container/20 border border-primary/40 p-4 sm:p-6 mb-6 rounded-xs">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-xl sm:text-2xl mt-0.5">info</span>
                    <div>
                      <h4 className="font-headline-sm text-sm sm:text-base text-primary mb-1 font-semibold">Online Payment Gateway Integration In Progress</h4>
                      <p className="font-body-md text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                        We are currently integrating automated online payment gateways. In the meantime, you can complete your order, inquire about live gold prices, and finalize payment directly via WhatsApp!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-outline-variant/30 p-4 sm:p-6 mb-6 rounded-xs">
                  <h4 className="font-label-caps text-xs text-on-surface mb-3 font-semibold tracking-wider">ORDER SUMMARY</h4>
                  <div className="flex justify-between font-body-md text-xs sm:text-sm text-on-surface-variant mb-2">
                    <span>Items ({state.items.length})</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-xs sm:text-sm text-on-surface-variant mb-3 pb-3 border-b border-outline-variant/20">
                    <span>Taxes (3% GST) & Shipping</span>
                    <span>{formatPrice(tax + shipping)}</span>
                  </div>
                  <div className="flex justify-between font-headline-sm text-base sm:text-lg text-primary font-bold">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 pt-4 border-t border-outline-variant/30">
                  <button onClick={() => setStep(1)} className="w-full sm:w-auto font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO DETAILS
                  </button>
                  
                  <button 
                    onClick={handlePlaceOrderWhatsApp}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto gold-bg-gradient px-8 py-3.5 font-label-caps text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md tracking-wider"
                  >
                    <span className="material-symbols-outlined text-base">chat_bubble</span>
                    {isSubmitting ? 'PREPARING ORDER...' : 'ORDER VIA WHATSAPP NOW'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <div className="text-center py-10 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl">check</span>
                </div>
                
                <h2 className="font-headline-md text-2xl sm:text-4xl text-primary mb-3">Order Request Received</h2>
                
                <p className="font-body-lg text-xs sm:text-base text-on-surface-variant mb-2">
                  Thank you, {formData.name}. Your order inquiry has been processed.
                </p>
                {orderId && (
                  <p className="font-label-caps text-xs sm:text-sm text-primary tracking-widest mb-6 font-bold">
                    ORDER REF: {orderId}
                  </p>
                )}

                <div className="max-w-md mx-auto bg-background border border-outline-variant/30 p-5 sm:p-6 mb-8 rounded-xs">
                  <p className="font-body-md text-xs sm:text-sm text-on-surface mb-4 leading-relaxed">
                    WhatsApp has been launched with your order details. If it did not open automatically, click below to send your order:
                  </p>
                  <a 
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste Ambika Jewels! I just placed order ${orderId} for ${formData.name}. Please confirm!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full gold-bg-gradient px-4 py-3.5 font-label-caps text-xs font-bold hover:brightness-110 transition-all shadow-md tracking-wider"
                  >
                    <span className="material-symbols-outlined text-base">chat_bubble</span> OPEN WHATSAPP CHAT
                  </a>
                </div>

                <Link href="/collections" className="font-label-caps text-xs text-primary hover:underline font-bold tracking-widest">
                  RETURN TO GALLERY
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
