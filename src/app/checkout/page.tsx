'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
        <main className="min-h-screen pt-32 pb-section-gap flex flex-col items-center justify-center">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">Your cart is empty.</p>
          <Link href="/collections" className="bg-primary-container px-stack-lg py-4 font-label-caps text-label-caps text-primary border-[1.5px] border-primary">
            RETURN TO GALLERY
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-section-gap">
        <div className="container mx-auto px-margin-mobile lg:px-margin-desktop max-w-4xl">
          
          {/* Stepper */}
          <div className="flex items-center justify-between mb-section-gap relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-outline-variant -z-10"></div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-caps text-sm border-2 transition-colors ${step >= 1 ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant bg-background'}`}>1</div>
              <span className={`font-label-caps text-[10px] tracking-widest ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>INFO</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-caps text-sm border-2 transition-colors ${step >= 2 ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant bg-background'}`}>2</div>
              <span className={`font-label-caps text-[10px] tracking-widest ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>PAYMENT</span>
            </div>
            
            <div className="flex flex-col items-center gap-2 bg-background px-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-caps text-sm border-2 transition-colors ${step === 3 ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant bg-background'}`}>3</div>
              <span className={`font-label-caps text-[10px] tracking-widest ${step === 3 ? 'text-primary' : 'text-on-surface-variant'}`}>CONFIRM</span>
            </div>
          </div>

          <div className="bg-surface-container border border-outline-variant p-6 lg:p-12">
            
            {/* STEP 1: INFO */}
            {step === 1 && (
              <form onSubmit={handleInfoSubmit}>
                <h2 className="font-headline-sm text-headline-sm text-primary mb-stack-lg border-b border-outline-variant pb-4">Delivery & Contact Details</h2>
                
                <div className="flex flex-col gap-6 mb-stack-lg">
                  <div>
                    <label className="font-label-caps text-xs text-on-surface-variant block mb-2">FULL NAME *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md py-2 outline-none transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-xs text-on-surface-variant block mb-2">PHONE NUMBER *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md py-2 outline-none transition-colors"
                      placeholder="Enter phone number (e.g. +91 9876543210)"
                    />
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-xs text-on-surface-variant block mb-2">EMAIL ADDRESS *</label>
                    <input 
                      required
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md py-2 outline-none transition-colors"
                      placeholder="Enter email address (e.g. name@example.com)"
                    />
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-xs text-on-surface-variant block mb-2">SHIPPING ADDRESS *</label>
                    <textarea 
                      required
                      value={formData.address}
                      onChange={e => setFormData({...formData, address: e.target.value})}
                      rows={3}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md py-2 outline-none transition-colors resize-none"
                      placeholder="Enter full street address, city, state, and PIN code"
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="font-label-caps text-xs text-on-surface-variant block mb-2">SPECIAL INSTRUCTIONS / NOTES (OPTIONAL)</label>
                    <input 
                      type="text" 
                      value={formData.notes}
                      onChange={e => setFormData({...formData, notes: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md py-2 outline-none transition-colors"
                      placeholder="E.g., Please call before delivery or custom sizing"
                    />
                  </div>
                </div>

                <div className="flex justify-end mt-stack-lg pt-stack-md border-t border-outline-variant">
                  <button type="submit" className="bg-primary-container px-stack-lg py-4 font-label-caps text-label-caps text-primary border-[1.5px] border-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center gap-2 group">
                    CONTINUE TO PAYMENT <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: PAYMENT & WHATSAPP ORDER */}
            {step === 2 && (
              <div>
                <h2 className="font-headline-sm text-headline-sm text-primary mb-stack-md">Payment & Confirmation</h2>
                
                {/* Online Payment Integration Notice */}
                <div className="bg-primary-container/20 border border-primary/40 p-6 mb-stack-lg">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1 text-2xl">info</span>
                    <div>
                      <h4 className="font-headline-sm text-base text-primary mb-2">Online Payment Integration In Progress</h4>
                      <p className="font-body-md text-on-surface-variant leading-relaxed">
                        We are currently integrating automated online payment gateways. In the meantime, you can complete your order, ask questions about live gold prices, and finalize payment directly via WhatsApp!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-background border border-outline-variant p-6 mb-stack-lg">
                  <h4 className="font-label-caps text-label-caps text-on-surface mb-4">ORDER SUMMARY</h4>
                  <div className="flex justify-between font-body-md text-on-surface-variant mb-2">
                    <span>Items ({state.items.length})</span>
                    <span>{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between font-body-md text-on-surface-variant mb-4 pb-4 border-b border-outline-variant">
                    <span>Taxes (3% GST) & Shipping</span>
                    <span>{formatPrice(tax + shipping)}</span>
                  </div>
                  <div className="flex justify-between font-headline-sm text-lg text-primary">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-stack-lg pt-stack-md border-t border-outline-variant">
                  <button onClick={() => setStep(1)} className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> BACK
                  </button>
                  
                  <button 
                    onClick={handlePlaceOrderWhatsApp}
                    disabled={isSubmitting}
                    className="gold-bg-gradient px-stack-lg py-4 font-label-caps text-label-caps font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-lg">chat_bubble</span>
                    {isSubmitting ? 'PREPARING ORDER...' : 'ORDER VIA WHATSAPP NOW'}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <div className="text-center py-section-gap">
                <div className="w-20 h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary">
                  <span className="material-symbols-outlined text-4xl">check</span>
                </div>
                
                <h2 className="font-display-lg-mobile text-display-lg-mobile text-primary mb-4">Order Request Received</h2>
                
                <p className="font-body-lg text-on-surface-variant mb-2">
                  Thank you, {formData.name}. Your order inquiry has been processed.
                </p>
                {orderId && (
                  <p className="font-label-caps text-primary tracking-widest mb-stack-lg font-bold">
                    ORDER REF: {orderId}
                  </p>
                )}

                <div className="max-w-md mx-auto bg-background border border-outline-variant p-6 mb-stack-lg">
                  <p className="font-body-md text-on-surface mb-4">
                    WhatsApp has been launched with your order details. If it did not open automatically, click below to send your order:
                  </p>
                  <a 
                    href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Namaste Ambika Jewels! I just placed order ${orderId} for ${formData.name}. Please confirm!`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full gold-bg-gradient px-4 py-4 font-label-caps text-label-caps font-bold hover:brightness-110 transition-all"
                  >
                    <span className="material-symbols-outlined text-lg">chat_bubble</span> OPEN WHATSAPP CHAT
                  </a>
                </div>

                <Link href="/collections" className="font-label-caps text-label-caps text-primary hover:underline">
                  RETURN TO GALLERY
                </Link>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
