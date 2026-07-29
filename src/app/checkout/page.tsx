'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';

// Declare global Window interface for Razorpay SDK
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

export default function CheckoutPage() {
  const { state, cartTotal, dispatch } = useCart();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [orderSummary, setOrderSummary] = useState<{
    orderNumber: string;
    paymentId: string;
    shiprocketStatus: string;
    shiprocketOrderId?: string;
  } | null>(null);

  const [formData, setFormData] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
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

  // Dynamically & Asynchronously load Razorpay SDK
  useEffect(() => {
    const loadRazorpaySdk = async () => {
      if (window.Razorpay) {
        setSdkLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => setSdkLoaded(true);
      script.onerror = () => setErrorMessage('Failed to load Razorpay payment gateway SDK.');
      document.body.appendChild(script);
    };

    loadRazorpaySdk();
  }, []);

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setStep(2);
  };

  // Trigger Razorpay Payment Integration
  const handleRazorpayPayment = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Create Razorpay Order Server-Side
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          notes: {
            customer_name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            pincode: formData.pincode
          }
        })
      });

      const orderData = await res.json();

      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initiate Razorpay order');
      }

      // Handle Mock Testing Mode if Razorpay Keys are pending setup
      if (orderData.is_mock) {
        console.warn('Mock payment process initiated.');
        const verifyRes = await fetch('/api/razorpay/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.order_id,
            razorpay_payment_id: `pay_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature',
            is_mock: true,
            customer_info: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              notes: formData.notes
            },
            items: state.items,
            total_amount: finalTotal
          })
        });

        const verifyData = await verifyRes.json();
        if (verifyData.success) {
          setOrderSummary({
            orderNumber: verifyData.order_number,
            paymentId: verifyData.payment_id,
            shiprocketStatus: verifyData.shiprocket_status,
            shiprocketOrderId: verifyData.shiprocket_order_id
          });
          dispatch({ type: 'CLEAR_CART' });
          setStep(3);
        } else {
          throw new Error(verifyData.error || 'Payment verification failed');
        }
        setIsSubmitting(false);
        return;
      }

      // 2. Open Razorpay Modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: siteConfig.name,
        description: `Order Payment (${state.items.length} items)`,
        image: '/hero-clean.png',
        order_id: orderData.order_id,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`
        },
        theme: {
          color: '#d4af37' // Luxury Gold theme accent
        },
        handler: async function (response: any) {
          try {
            setIsSubmitting(true);
            // 3. Verify Payment & Create Shiprocket Order
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                customer_info: {
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  email: formData.email,
                  phone: formData.phone,
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  notes: formData.notes
                },
                items: state.items,
                total_amount: finalTotal
              })
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              setOrderSummary({
                orderNumber: verifyData.order_number,
                paymentId: verifyData.payment_id,
                shiprocketStatus: verifyData.shiprocket_status,
                shiprocketOrderId: verifyData.shiprocket_order_id
              });
              dispatch({ type: 'CLEAR_CART' });
              setStep(3);
            } else {
              setErrorMessage(verifyData.error || 'Payment verification failed. Please contact support.');
            }
          } catch (err: any) {
            console.error('Verification error:', err);
            setErrorMessage('Payment verification failed due to network error.');
          } finally {
            setIsSubmitting(false);
          }
        },
        modal: {
          ondismiss: function () {
            setIsSubmitting(false);
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setIsSubmitting(false);
        setErrorMessage(`Payment failed: ${response.error.description || 'Transaction declined'}`);
      });
      rzp.open();
    } catch (err: any) {
      console.error('Checkout Exception:', err);
      setErrorMessage(err?.message || 'Failed to initialize payment');
      setIsSubmitting(false);
    }
  };

  if (state.items.length === 0 && step !== 3) {
    return (
      <>
        <Header />
        <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-4">
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 text-center">Your bag is currently empty.</p>
          <Link href="/collections" className="bg-primary-container px-8 py-3.5 font-label-caps text-xs text-primary border-[1.5px] border-primary font-bold tracking-widest">
            EXPLORE COLLECTIONS
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
          
          {/* Stepper Header */}
          <div className="flex items-center justify-between mb-8 sm:mb-section-gap relative max-w-md mx-auto">
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-outline-variant/40 -z-10"></div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step >= 1 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>1</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step >= 1 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>GUEST SHIPPING</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step >= 2 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>2</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step >= 2 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>RAZORPAY</span>
            </div>
            
            <div className="flex flex-col items-center gap-1.5 bg-background px-3">
              <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-label-caps text-xs sm:text-sm border-2 transition-colors ${step === 3 ? 'border-primary bg-primary text-on-primary font-bold' : 'border-outline-variant text-on-surface-variant bg-background'}`}>3</div>
              <span className={`font-label-caps text-[9px] sm:text-[10px] tracking-widest ${step === 3 ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>SHIPROCKET</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-950/40 border border-red-500/50 text-red-300 rounded-xs flex items-center gap-3 font-body-md text-xs sm:text-sm">
              <span className="material-symbols-outlined text-red-400">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-surface-container border border-outline-variant/30 p-4 sm:p-8 lg:p-12 rounded-xs">
            
            {/* STEP 1: GUEST SHIPPING DETAILS */}
            {step === 1 && (
              <form onSubmit={handleInfoSubmit}>
                <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-6">
                  <h2 className="font-headline-md text-xl sm:text-2xl text-primary">Guest Shipping Information</h2>
                  <span className="font-label-caps text-[10px] bg-primary/10 text-primary px-2.5 py-1 font-semibold tracking-wider">NO LOGIN REQUIRED</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">FIRST NAME *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. Ananya"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">LAST NAME *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">PHONE NUMBER (FOR SHIPROCKET DISPATCH) *</label>
                    <input 
                      required
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. 9876543210"
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
                      placeholder="e.g. ananya@example.com"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">STREET ADDRESS (HOUSE NO, BUILDING, STREET) *</label>
                  <textarea 
                    required
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors resize-none"
                    placeholder="e.g. House No. 42, Sector 1, Lower Roop Nagar"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">CITY *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. Jammu"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">STATE *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. Jammu & Kashmir"
                    />
                  </div>

                  <div>
                    <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">PINCODE *</label>
                    <input 
                      required
                      type="text" 
                      value={formData.pincode}
                      onChange={e => setFormData({...formData, pincode: e.target.value})}
                      className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                      placeholder="e.g. 180013"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="font-label-caps text-[10px] sm:text-xs text-on-surface-variant block mb-1.5 font-semibold">SPECIAL DELIVERY NOTES (OPTIONAL)</label>
                  <input 
                    type="text" 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-transparent border-b border-outline focus:border-primary text-on-surface font-body-md text-base sm:text-sm py-2 outline-none transition-colors"
                    placeholder="e.g., Deliver before 5 PM or ring doorbell"
                  />
                </div>

                <div className="flex justify-end mt-8 pt-4 border-t border-outline-variant/30">
                  <button type="submit" className="w-full sm:w-auto bg-primary-container px-8 py-3.5 font-label-caps text-xs text-primary border-[1.5px] border-primary hover:bg-primary hover:text-on-primary transition-colors flex items-center justify-center gap-2 font-bold tracking-wider group">
                    <span>PROCEED TO PAY VIA RAZORPAY</span>
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: REVIEW & RAZORPAY TRIGGER */}
            {step === 2 && (
              <div>
                <h2 className="font-headline-md text-xl sm:text-2xl text-primary mb-4">Review Order & Pay</h2>
                
                {/* Guest Details Overview */}
                <div className="bg-background border border-outline-variant/30 p-4 sm:p-5 mb-6 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-label-caps text-[9px] text-primary tracking-widest block font-semibold">SHIPROCKET DELIVERY DESTINATION</span>
                    <p className="font-body-md text-sm text-on-surface font-semibold">{formData.firstName} {formData.lastName} ({formData.phone})</p>
                    <p className="font-body-md text-xs text-on-surface-variant">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                    <p className="font-body-md text-xs text-on-surface-variant">{formData.email}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="font-label-caps text-[10px] text-primary underline font-bold shrink-0">
                    EDIT DETAILS
                  </button>
                </div>

                {/* Items Summary */}
                <div className="bg-background border border-outline-variant/30 p-4 sm:p-6 mb-6 rounded-xs">
                  <h4 className="font-label-caps text-xs text-on-surface mb-3 font-semibold tracking-wider border-b border-outline-variant/20 pb-2">ORDER BREAKDOWN</h4>
                  {state.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center font-body-md text-xs sm:text-sm text-on-surface-variant mb-2">
                      <span>{item.name} x {item.quantity}</span>
                      <span>{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-body-md text-xs sm:text-sm text-on-surface-variant mb-3 pt-2 pb-3 border-t border-b border-outline-variant/20">
                    <span>GST (3%) & Insured Delivery</span>
                    <span>{formatPrice(tax + shipping)}</span>
                  </div>
                  <div className="flex justify-between font-headline-sm text-base sm:text-lg text-primary font-bold">
                    <span>Total Payable Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 pt-4 border-t border-outline-variant/30">
                  <button onClick={() => setStep(1)} className="w-full sm:w-auto font-label-caps text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center justify-center gap-1.5 py-2">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO FORM
                  </button>
                  
                  <button 
                    onClick={handleRazorpayPayment}
                    disabled={isSubmitting || !sdkLoaded}
                    className="w-full sm:w-auto gold-bg-gradient px-8 py-3.5 font-label-caps text-xs font-bold hover:brightness-110 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-md tracking-wider"
                  >
                    <span className="material-symbols-outlined text-base">lock</span>
                    {isSubmitting ? 'PROCESSING PAYMENT...' : `PAY NOW (${formatPrice(finalTotal)})`}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: ORDER CONFIRMATION & SHIPROCKET STATUS */}
            {step === 3 && orderSummary && (
              <div className="text-center py-10 sm:py-16">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-6 border border-primary">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl">check_circle</span>
                </div>
                
                <h2 className="font-headline-md text-2xl sm:text-4xl text-primary mb-2">Payment Confirmed!</h2>
                <p className="font-body-lg text-xs sm:text-base text-on-surface-variant mb-6">
                  Thank you, {formData.firstName}. Your payment has been received and verified.
                </p>

                <div className="max-w-md mx-auto bg-background border border-outline-variant/30 p-5 sm:p-6 mb-8 rounded-xs text-left">
                  <div className="border-b border-outline-variant/20 pb-3 mb-3">
                    <span className="font-label-caps text-[9px] text-primary tracking-widest block font-semibold">ORDER REFERENCE NUMBER</span>
                    <p className="font-headline-sm text-lg text-on-surface font-bold">{orderSummary.orderNumber}</p>
                  </div>

                  <div className="border-b border-outline-variant/20 pb-3 mb-3">
                    <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest block">RAZORPAY PAYMENT ID</span>
                    <p className="font-body-md text-xs text-on-surface font-mono">{orderSummary.paymentId}</p>
                  </div>

                  <div>
                    <span className="font-label-caps text-[9px] text-on-surface-variant tracking-widest block mb-1">SHIPROCKET DISPATCH STATUS</span>
                    {orderSummary.shiprocketStatus === 'created' ? (
                      <span className="inline-flex items-center gap-1 font-label-caps text-xs text-green-400 font-bold bg-green-950/40 px-2.5 py-1 rounded-xs border border-green-800/40">
                        <span className="material-symbols-outlined text-sm">local_shipping</span> SHIPMENT CREATED #{orderSummary.shiprocketOrderId}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-label-caps text-xs text-amber-400 font-bold bg-amber-950/40 px-2.5 py-1 rounded-xs border border-amber-800/40">
                        <span className="material-symbols-outlined text-sm">schedule</span> PROCESSING SHIPMENT (ADMIN NOTIFIED)
                      </span>
                    )}
                  </div>
                </div>

                <Link href="/collections" className="gold-bg-gradient px-8 py-3.5 font-label-caps text-xs font-bold inline-block shadow-md tracking-wider">
                  CONTINUE SHOPPING
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
