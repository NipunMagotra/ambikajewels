'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';
import { getEmailSuggestion } from '@/lib/checkoutValidation';

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
  panNumber: string;
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
    bvcStatus?: string;
    bvcDocketNumber?: string;
    bvcSecurityBag?: string;
    token?: string;
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
    panNumber: '',
    notes: ''
  });

  const tax = Math.round(cartTotal * siteConfig.tax.gstRate);
  const isFreeShipping = cartTotal >= siteConfig.shipping.freeThreshold;
  const shipping = isFreeShipping ? 0 : siteConfig.shipping.flatRate;
  const finalTotal = cartTotal + tax + shipping;

  const [showPhoneConfirmModal, setShowPhoneConfirmModal] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [hasDismissedTypo, setHasDismissedTypo] = useState(false);

  const emailSuggestion = getEmailSuggestion(formData.email);

  // Rate-Lock countdown timer (guarantees precious metal prices for N minutes)
  const rateLockDuration = (siteConfig.rates.rateLockMinutes || 15) * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(rateLockDuration);
  const [rateLockExpired, setRateLockExpired] = useState(false);
  const [rateLockToken, setRateLockToken] = useState<string | null>(null);
  const [marketingConsent, setMarketingConsent] = useState(false); // DPDP Act 2023: Unticked by default

  const fetchServerRateLock = async () => {
    try {
      const res = await fetch('/api/rates/lock');
      const data = await res.json();
      if (res.ok && data.token) {
        setRateLockToken(data.token);
        const remSecs = Math.max(0, Math.floor((data.expires_at - Date.now()) / 1000));
        setSecondsRemaining(remSecs);
        setRateLockExpired(remSecs <= 0);
      } else {
        setSecondsRemaining(rateLockDuration);
      }
    } catch {
      setSecondsRemaining(rateLockDuration);
    }
  };

  useEffect(() => {
    fetchServerRateLock();
  }, []);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      setRateLockExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          setRateLockExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const handleRefreshRateLock = async () => {
    setErrorMessage(null);
    await fetchServerRateLock();
  };

  const formatLockTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainderSecs.toString().padStart(2, '0')}`;
  };

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

    // 1. Indian Phone Number Validation (10 digits starting with 6-9)
    const cleanPhone = formData.phone.trim().replace(/[\s-]/g, '').replace(/^\+91/, '');
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9682589725) to receive BVC Logistics armored dispatch updates.');
      return;
    }

    // 2. Indian Pincode Validation (6 digits)
    const cleanPin = formData.pincode.trim();
    if (!/^[1-9][0-9]{5}$/.test(cleanPin)) {
      setErrorMessage('Please enter a valid 6-digit Indian delivery PIN code (e.g. 180013).');
      return;
    }

    // 3. Email Validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address for official tax invoice and order receipts.');
      return;
    }

    if (emailSuggestion && !hasDismissedTypo) {
      setErrorMessage(`Notice: Did you mean "${emailSuggestion}"? Please click "Use Suggested Email" under the field or submit again to proceed with ${formData.email}.`);
      setHasDismissedTypo(true);
      return;
    }

    // 4. PAN Card Validation (> ₹2,00,000 as mandated by Indian CBDT Rule 114B)
    if (finalTotal > 20000000) {
      const cleanPan = formData.panNumber.trim().toUpperCase();
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(cleanPan)) {
        setErrorMessage('Under Indian Income Tax Rule 114B, customer PAN card is mandatory for jewelry transactions exceeding ₹2 Lakh. Please enter a valid 10-character PAN (e.g. ABCDE1234F).');
        return;
      }
    }

    // Open Phone & Contact Confirmation Modal before Step 2
    setShowPhoneConfirmModal(true);
  };

  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Trigger Razorpay Payment Integration
  const handleRazorpayPayment = async () => {
    if (rateLockExpired) {
      setErrorMessage(`The ${siteConfig.rates.rateLockMinutes || 15}-minute bullion rate lock has expired. Please click "REFRESH & RE-LOCK" above to confirm today's active price before proceeding.`);
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Terms & Conditions, Shipping Policy, and Cancellation & Refund Policy to proceed with payment.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Create Razorpay Order Server-Side (also pre-inserts a pending order in Supabase)
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          items: state.items,
          rate_lock_token: rateLockToken,
          rate_timestamp: Date.now(),
          customer_info: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            pincode: formData.pincode,
            pan_number: formData.panNumber ? formData.panNumber.toUpperCase() : undefined,
            notes: formData.notes
          },
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
            supabase_order_id: orderData.supabase_order_id,
            customer_info: {
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              pincode: formData.pincode,
              pan_number: formData.panNumber ? formData.panNumber.toUpperCase() : undefined,
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
            shiprocketStatus: verifyData.bvc_status || verifyData.shiprocket_status,
            shiprocketOrderId: verifyData.bvc_docket_number || verifyData.shiprocket_order_id,
            bvcStatus: verifyData.bvc_status,
            bvcDocketNumber: verifyData.bvc_docket_number,
            bvcSecurityBag: verifyData.bvc_security_bag_number,
            token: verifyData.token
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
                supabase_order_id: orderData.supabase_order_id,
                customer_info: {
                  first_name: formData.firstName,
                  last_name: formData.lastName,
                  email: formData.email,
                  phone: formData.phone,
                  address: formData.address,
                  city: formData.city,
                  state: formData.state,
                  pincode: formData.pincode,
                  pan_number: formData.panNumber ? formData.panNumber.toUpperCase() : undefined,
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
                shiprocketStatus: verifyData.bvc_status || verifyData.shiprocket_status,
                shiprocketOrderId: verifyData.bvc_docket_number || verifyData.shiprocket_order_id,
                bvcStatus: verifyData.bvc_status,
                bvcDocketNumber: verifyData.bvc_docket_number,
                bvcSecurityBag: verifyData.bvc_security_bag_number,
                token: verifyData.token
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
        <main className="min-h-screen pt-28 pb-24 flex flex-col items-center justify-center px-4 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
          <p className="font-serif text-lg text-[var(--text-secondary)] mb-6 text-center font-normal">Your bag is currently empty.</p>
          <Link href="/collections" className="btn-gold-primary">
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
      <main className="min-h-screen pt-20 sm:pt-24 pb-20 lg:pb-16 bg-[var(--bg-main)] text-[var(--text-primary)] transition-colors duration-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          
          {/* Order Summary Accordion (Mobile & Desktop) */}
          {step < 3 && (
            <div className="border-b border-[var(--border-subtle)] pb-4 mb-8">
              <button
                type="button"
                onClick={() => setShowOrderSummary(!showOrderSummary)}
                className="w-full flex items-center justify-between text-left group cursor-pointer"
                aria-expanded={showOrderSummary}
              >
                <div className="flex items-center gap-2.5 text-[var(--accent-gold)]">
                  <span className="material-symbols-outlined text-lg">shopping_bag</span>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] font-medium text-[var(--text-primary)] group-hover:text-[var(--accent-gold)] transition-colors">
                    {showOrderSummary ? 'HIDE ORDER SUMMARY' : 'SHOW ORDER SUMMARY'}
                  </span>
                  <span className={`material-symbols-outlined text-sm text-[var(--accent-gold)] transition-transform duration-200 ${showOrderSummary ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </div>
                <span className="font-serif text-2xl text-[var(--text-primary)] font-normal tracking-wide">
                  {formatPrice(finalTotal)}
                </span>
              </button>

              {showOrderSummary && (
                <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 rounded-xs space-y-3.5 animate-fade-in border border-[var(--border-card)]">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">Selected Creations</div>
                  {state.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs text-[var(--text-secondary)] gap-4">
                      <div>
                        <span className="font-serif text-sm text-[var(--text-primary)] font-medium block">{item.name}</span>
                        <span className="text-[11px] text-[var(--text-secondary)]/80">
                          {item.metal_finish} {item.selected_size ? `· Size ${item.selected_size}` : ''} × {item.quantity}
                        </span>
                      </div>
                      <span className="font-sans font-medium text-[var(--text-primary)] shrink-0">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-[var(--border-subtle)] text-xs space-y-1.5">
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>GST (3% Statutory Precious Metal Tax)</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    <div className="flex justify-between text-[var(--text-secondary)]">
                      <span>Insured Armored Express Transit</span>
                      <span className={isFreeShipping ? 'text-[var(--accent-gold)] font-semibold' : ''}>{isFreeShipping ? 'FREE' : formatPrice(shipping)}</span>
                    </div>
                    <div className="flex justify-between text-sm font-semibold text-[var(--accent-gold)] pt-2 border-t border-[var(--border-subtle)]">
                      <span>Total Payable</span>
                      <span>{formatPrice(finalTotal)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Stepper: Minimalist 3 Dots with connecting lines */}
          <div className="flex items-center justify-between max-w-xs mx-auto mb-8 sm:mb-10 px-4">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                step >= 1 ? 'bg-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/25' : 'bg-[var(--text-secondary)]/40'
              }`} />
              <span className={`text-[10px] uppercase font-mono tracking-[0.2em] ${
                step === 1 ? 'text-[var(--accent-gold)] font-semibold' : 'text-[var(--text-secondary)]'
              }`}>
                INFO
              </span>
            </div>

            <div className={`flex-1 h-[1px] mx-3 -mt-4 transition-colors ${
              step >= 2 ? 'bg-[var(--accent-gold)]' : 'bg-[var(--accent-gold)]/25'
            }`} />

            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                step >= 2 ? 'bg-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/25' : 'bg-[var(--bg-card)] border border-[var(--accent-gold)]/30'
              }`} />
              <span className={`text-[10px] uppercase font-mono tracking-[0.2em] ${
                step === 2 ? 'text-[var(--accent-gold)] font-semibold' : 'text-[var(--text-secondary)]'
              }`}>
                PAYMENT
              </span>
            </div>

            <div className={`flex-1 h-[1px] mx-3 -mt-4 transition-colors ${
              step >= 3 ? 'bg-[var(--accent-gold)]' : 'bg-[var(--accent-gold)]/25'
            }`} />

            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-3.5 h-3.5 rounded-full transition-all ${
                step === 3 ? 'bg-[var(--accent-gold)] ring-4 ring-[var(--accent-gold)]/25' : 'bg-[var(--bg-card)] border border-[var(--accent-gold)]/30'
              }`} />
              <span className={`text-[10px] uppercase font-mono tracking-[0.2em] ${
                step === 3 ? 'text-[var(--accent-gold)] font-semibold' : 'text-[var(--text-secondary)]'
              }`}>
                CONFIRM
              </span>
            </div>
          </div>

          {/* Live Bullion Rate-Lock Banner */}
          {step < 3 && (
            rateLockExpired ? (
              <div className="mb-6 p-4 bg-[var(--bg-surface)] border border-red-500/50 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-red-600 dark:text-red-200">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-red-500 text-xl">timer_off</span>
                  <div>
                    <strong className="block text-red-600 dark:text-red-300 font-bold uppercase tracking-wider text-[11px]">RATE LOCK WINDOW EXPIRED</strong>
                    <span>Daily live bullion rates have timed out. Please refresh to lock today's active rate and continue.</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRefreshRateLock}
                  className="btn-gold-primary text-xs py-2 px-4 shrink-0"
                >
                  REFRESH & RE-LOCK
                </button>
              </div>
            ) : (
              <div className="mb-6 p-3 sm:p-3.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xs flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-[var(--text-primary)]">
                  <span className="material-symbols-outlined text-[var(--accent-gold)] text-lg">lock_clock</span>
                  <div>
                    <span className="font-semibold text-[var(--accent-gold)] block text-[11px] tracking-wide">
                      LIVE BULLION RATE LOCKED ({siteConfig.rates.rateLockMinutes || 15} MIN GUARANTEE)
                    </span>
                    <span className="text-[var(--text-secondary)] text-[10px]">
                      Your order price is protected against intraday bullion rate fluctuations.
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm sm:text-base font-bold text-[var(--accent-gold)] bg-[var(--bg-card)] px-2.5 py-1 rounded border border-[var(--accent-gold)]/30">
                    {formatLockTime(secondsRemaining)}
                  </span>
                </div>
              </div>
            )
          )}

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-950/40 border border-red-400 dark:border-red-500/50 text-red-700 dark:text-red-300 rounded-xs flex items-center gap-3 text-xs sm:text-sm">
              <span className="material-symbols-outlined text-red-500 dark:text-red-400">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="bg-[var(--bg-card)] border border-[var(--border-card)] shadow-[var(--card-shadow)] p-5 sm:p-8 lg:p-10 rounded-xs">
            
            {/* STEP 1: GUEST SHIPPING DETAILS */}
            {step === 1 && (
              <form onSubmit={handleInfoSubmit}>
                <div className="flex items-baseline justify-between border-b border-[var(--border-subtle)] pb-3 mb-6">
                  <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] font-normal">Delivery Details</h2>
                  <span className="font-mono text-[9px] sm:text-[10px] text-[var(--accent-gold)] tracking-widest uppercase">GUEST CHECKOUT</span>
                </div>

                {/* DPDP Statutory Collection Notice */}
                <div className="p-3 mb-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xs text-[11px] text-[var(--text-secondary)] flex items-start gap-2.5 leading-relaxed">
                  <span className="material-symbols-outlined text-[var(--accent-gold)] text-base shrink-0 mt-0.5">shield</span>
                  <span><strong>DPDP Collection Notice:</strong> Shipping and contact details are collected strictly to fulfill your order, issue statutory GST invoices, and coordinate insured armored delivery via BVC Logistics. Data is encrypted and never sold.</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="checkout-first-name" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      FIRST NAME *
                    </label>
                    <input 
                      required
                      id="checkout-first-name"
                      name="firstName"
                      autoComplete="given-name"
                      type="text" 
                      value={formData.firstName}
                      onChange={e => setFormData({...formData, firstName: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] focus-visible:ring-1 focus-visible:ring-[#D8B75A] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="e.g. Ananya"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-last-name" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      LAST NAME *
                    </label>
                    <input 
                      required
                      id="checkout-last-name"
                      name="lastName"
                      autoComplete="family-name"
                      type="text" 
                      value={formData.lastName}
                      onChange={e => setFormData({...formData, lastName: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] focus-visible:ring-1 focus-visible:ring-[#D8B75A] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="e.g. Sharma"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="checkout-address" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                    SHIPPING ADDRESS *
                  </label>
                  <textarea 
                    required
                    id="checkout-address"
                    name="address"
                    autoComplete="street-address"
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    rows={2}
                    className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] focus-visible:ring-1 focus-visible:ring-[#D8B75A] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors resize-none placeholder-[var(--text-secondary)]/40"
                    placeholder="House No, Building, Street, Landmark"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label htmlFor="checkout-city" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      CITY *
                    </label>
                    <input 
                      required
                      id="checkout-city"
                      name="city"
                      autoComplete="address-level2"
                      type="text" 
                      value={formData.city}
                      onChange={e => setFormData({...formData, city: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="e.g. Jammu"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-state" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      STATE *
                    </label>
                    <input 
                      required
                      id="checkout-state"
                      name="state"
                      autoComplete="address-level1"
                      type="text" 
                      value={formData.state}
                      onChange={e => setFormData({...formData, state: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="e.g. Jammu & Kashmir"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-pincode" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      PINCODE *
                    </label>
                    <input 
                      required
                      id="checkout-pincode"
                      name="pincode"
                      autoComplete="postal-code"
                      type="text" 
                      value={formData.pincode}
                      onChange={e => setFormData({...formData, pincode: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="e.g. 180013"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="checkout-phone" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      PHONE NUMBER (FOR SECURED DELIVERY OTP) *
                    </label>
                    <input 
                      required
                      id="checkout-phone"
                      name="phone"
                      autoComplete="tel"
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label htmlFor="checkout-email" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                      EMAIL ADDRESS *
                    </label>
                    <input 
                      required
                      id="checkout-email"
                      name="email"
                      autoComplete="email"
                      type="email" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                      placeholder="For GST invoice & updates"
                    />
                    {emailSuggestion && (
                      <div className="mt-2 p-2 bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-xs flex items-center justify-between text-xs text-[var(--accent-gold)]">
                        <span className="flex items-center gap-1.5 text-[11px]">
                          <span className="material-symbols-outlined text-[var(--accent-gold)] text-sm">tips_and_updates</span>
                          Did you mean <strong>{emailSuggestion}</strong>?
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, email: emailSuggestion });
                            setHasDismissedTypo(true);
                          }}
                          className="btn-gold-primary text-[10px] py-1 px-2.5"
                        >
                          Use Suggestion
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Mandatory PAN reporting threshold for high-value purchases */}
                {finalTotal >= (siteConfig.compliance?.panRequirementThresholdInr ? siteConfig.compliance.panRequirementThresholdInr * 100 : 20000000) && (
                  <div className="mb-6 p-4 bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-xs" role="region" aria-label="Statutory PAN Compliance Information">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-[var(--accent-gold)] text-sm" aria-hidden="true">gavel</span>
                      <span className="font-mono text-xs text-[var(--accent-gold)] font-bold tracking-wider">
                        STATUTORY TAX COMPLIANCE (CBDT RULE 114B)
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-3 leading-relaxed">
                      Customer PAN card is mandatory for jewelry purchases of ₹2,00,000 or above under Indian tax regulations.
                    </p>
                    <label htmlFor="checkout-pan" className="font-mono text-[10px] sm:text-xs text-[var(--text-secondary)] block mb-1.5 font-semibold">
                      CUSTOMER PAN NUMBER (10 CHARACTERS) *
                    </label>
                    <input 
                      required
                      id="checkout-pan"
                      name="panNumber"
                      type="text" 
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={e => setFormData({...formData, panNumber: e.target.value.toUpperCase()})}
                      className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-mono text-base uppercase py-2 outline-none transition-colors"
                      placeholder="e.g. ABCDE1234F"
                    />
                  </div>
                )}

                <div className="mb-8">
                  <label htmlFor="checkout-notes" className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[var(--text-secondary)] block mb-1.5">
                    SPECIAL DELIVERY NOTES (OPTIONAL)
                  </label>
                  <input 
                    id="checkout-notes"
                    name="notes"
                    type="text" 
                    value={formData.notes}
                    onChange={e => setFormData({...formData, notes: e.target.value})}
                    className="w-full bg-transparent border-b border-[var(--border-subtle)] focus:border-[var(--accent-gold)] text-[var(--text-primary)] font-sans text-sm sm:text-base py-2.5 outline-none transition-colors placeholder-[var(--text-secondary)]/40"
                    placeholder="e.g., Deliver before 5 PM or ring doorbell"
                  />
                </div>

                <div className="mt-8 pt-4 border-t border-[var(--border-subtle)]">
                  <button type="submit" className="w-full btn-gold-primary py-4 text-xs sm:text-sm tracking-widest font-semibold flex items-center justify-center gap-2 group">
                    <span>CONTINUE TO PAYMENT</span>
                    <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward</span>
                  </button>
                </div>
              </form>
            )}

            {/* STEP 2: REVIEW & RAZORPAY TRIGGER */}
            {step === 2 && (
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[var(--text-primary)] mb-6 font-normal">Review & Payment</h2>
                
                {/* Guest Details Overview */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] p-4 sm:p-5 mb-6 rounded-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <span className="font-mono text-[9px] text-[var(--accent-gold)] tracking-widest block uppercase font-medium">BVC LOGISTICS SECURED DESTINATION</span>
                    <p className="font-medium text-sm text-[var(--text-primary)] mt-1">{formData.firstName} {formData.lastName} ({formData.phone})</p>
                    <p className="text-xs text-[var(--text-secondary)]">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{formData.email}</p>
                  </div>
                  <button onClick={() => setStep(1)} className="font-mono text-[10px] text-[var(--accent-gold)] underline uppercase tracking-widest shrink-0 cursor-pointer">
                    EDIT DETAILS
                  </button>
                </div>

                {/* Items Summary */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-4 sm:p-6 mb-6 rounded-xs">
                  <h4 className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] mb-3 pb-2 border-b border-[var(--border-subtle)]">ORDER BREAKDOWN</h4>
                  {state.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs sm:text-sm text-[var(--text-secondary)] mb-2">
                      <span>{item.name} {item.selected_size ? `(${item.selected_size})` : ''} ({item.metal_finish}) × {item.quantity}</span>
                      <span className="text-[var(--text-primary)] font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] mb-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    <span>GST (3% Statutory Precious Metal Tax)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-[var(--text-secondary)] mb-3 pb-3 border-b border-[var(--border-subtle)]">
                    <span>Express Insured Courier {isFreeShipping ? '(Free above ₹50,000)' : ''}</span>
                    <span className={isFreeShipping ? 'text-[var(--accent-gold)] font-semibold' : ''}>{isFreeShipping ? 'FREE' : formatPrice(shipping)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-lg sm:text-xl text-[var(--accent-gold)] font-medium">
                    <span>Total Payable Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Razorpay Compliance Checkbox */}
                <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] p-4 mb-6 rounded-xs">
                  <label htmlFor="checkout-agree-terms" className="flex items-start gap-3 cursor-pointer">
                    <input 
                      required
                      id="checkout-agree-terms"
                      name="agreeTerms"
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={e => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 accent-[#D8B75A] h-4 w-4 shrink-0 rounded cursor-pointer"
                    />
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      I have read and agree to the <Link href="/terms" target="_blank" className="text-[var(--accent-gold)] underline font-medium">Terms & Conditions</Link>, <Link href="/shipping-policy" target="_blank" className="text-[var(--accent-gold)] underline font-medium">Shipping Policy</Link>, and <Link href="/refund-policy" target="_blank" className="text-[var(--accent-gold)] underline font-medium">Cancellation & Refund Policy</Link> of Ambika Jewels.
                    </span>
                  </label>

                  {/* DPDP Act 2023: Unticked Optional Marketing Consent */}
                  <label htmlFor="checkout-marketing-consent" className="flex items-start gap-3 cursor-pointer mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    <input 
                      id="checkout-marketing-consent"
                      name="marketingConsent"
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={e => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 accent-[#D8B75A] h-4 w-4 shrink-0 rounded cursor-pointer"
                    />
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      (Optional) Send me WhatsApp & SMS updates regarding new Dogra heritage collections, bridal launches, and showroom events.
                    </span>
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-8 pt-4 border-t border-[var(--border-subtle)]">
                  <button onClick={() => setStep(1)} className="w-full sm:w-auto font-mono text-xs uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center gap-1.5 py-3 cursor-pointer">
                    <span className="material-symbols-outlined text-sm">arrow_back</span> BACK TO FORM
                  </button>
                  
                  <button 
                    onClick={handleRazorpayPayment}
                    disabled={isSubmitting || !sdkLoaded || !agreedToTerms}
                    className="w-full sm:w-auto btn-gold-primary py-4 px-8 text-xs tracking-widest font-semibold flex items-center justify-center gap-2"
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
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[var(--accent-gold)]/15 text-[var(--accent-gold)] rounded-full flex items-center justify-center mx-auto mb-6 border border-[var(--accent-gold)]/40">
                  <span className="material-symbols-outlined text-3xl sm:text-4xl">check_circle</span>
                </div>
                
                <h2 className="font-serif text-3xl sm:text-4xl text-[var(--text-primary)] mb-2 font-normal">Payment Confirmed</h2>
                <p className="text-xs sm:text-base text-[var(--text-secondary)] mb-8 font-light">
                  Thank you, {formData.firstName}. Your payment has been received and verified.
                </p>

                <div className="max-w-md mx-auto bg-[var(--bg-surface)] border border-[var(--border-card)] p-5 sm:p-6 mb-8 rounded-xs text-left space-y-4">
                  <div className="border-b border-[var(--border-subtle)] pb-3">
                    <span className="font-mono text-[9px] text-[var(--accent-gold)] tracking-widest uppercase block font-medium">ORDER REFERENCE NUMBER</span>
                    <p className="font-serif text-xl text-[var(--text-primary)] font-medium mt-0.5">{orderSummary.orderNumber}</p>
                  </div>

                  <div className="border-b border-[var(--border-subtle)] pb-3">
                    <span className="font-mono text-[9px] text-[var(--text-secondary)] tracking-widest uppercase block">RAZORPAY PAYMENT ID</span>
                    <p className="text-xs text-[var(--text-primary)] font-mono mt-0.5">{orderSummary.paymentId}</p>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-[var(--text-secondary)] tracking-widest uppercase block mb-1">BVC LOGISTICS SECURED DISPATCH</span>
                    {orderSummary.bvcStatus === 'booked' || orderSummary.bvcStatus === 'simulated' || orderSummary.shiprocketStatus === 'created' ? (
                      <div>
                        <span className="inline-flex items-center gap-1 font-mono text-xs text-green-700 dark:text-green-400 font-semibold bg-green-100 dark:bg-green-950/40 px-2.5 py-1 rounded-xs border border-green-300 dark:border-green-800/40">
                          <span className="material-symbols-outlined text-sm">shield</span> DOCKET #{orderSummary.bvcDocketNumber || orderSummary.shiprocketOrderId}
                        </span>
                        {orderSummary.bvcSecurityBag && (
                          <span className="block mt-1 font-mono text-[10px] text-[var(--text-secondary)]">
                            Security Bag Seal: <strong className="text-[var(--accent-gold)]">{orderSummary.bvcSecurityBag}</strong>
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-mono text-xs text-amber-700 dark:text-amber-400 font-semibold bg-amber-100 dark:bg-amber-950/40 px-2.5 py-1 rounded-xs border border-amber-300 dark:border-amber-800/40">
                        <span className="material-symbols-outlined text-sm">schedule</span> PROCESSING SECURE DISPATCH
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href={`/track?orderId=${orderSummary.orderNumber}${orderSummary.token ? `&token=${encodeURIComponent(orderSummary.token)}` : ''}`} className="btn-gold-primary py-3.5 px-6 text-xs flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-base">local_shipping</span>
                    TRACK SHIPMENT
                  </Link>
                  <Link href={`/order-status?orderId=${orderSummary.orderNumber}${orderSummary.token ? `&token=${encodeURIComponent(orderSummary.token)}` : ''}`} className="btn-gold-secondary py-3.5 px-6 text-xs flex items-center justify-center gap-1.5">
                    <span className="material-symbols-outlined text-base">receipt_long</span>
                    VIEW TAX INVOICE
                  </Link>
                  <Link href="/collections" className="py-3.5 px-6 border border-[var(--border-subtle)] text-xs font-mono uppercase tracking-widest text-[var(--text-secondary)] hover:text-[var(--accent-gold)] transition-colors flex items-center justify-center">
                    CONTINUE SHOPPING
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* PHONE & DELIVERY CONFIRMATION MODAL */}
        {showPhoneConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title">
            <div className="bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-xs max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5">
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] pb-3">
                <span className="material-symbols-outlined text-[var(--accent-gold)] text-2xl">verified_user</span>
                <div>
                  <h3 id="modal-confirm-title" className="font-serif text-xl sm:text-2xl text-[var(--text-primary)] font-normal">
                    Confirm Delivery & OTP Details
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">Please double-check your shipping contact details</p>
                </div>
              </div>

              <div className="p-4 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xs space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Mobile Phone (Delivery OTP):</span>
                  <span className="font-mono text-sm font-semibold text-[var(--accent-gold)] tracking-wider">+91 {formData.phone}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Email (Invoice & Tracking):</span>
                  <span className="text-xs font-medium text-[var(--text-primary)] break-all">{formData.email}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">Recipient:</span>
                  <span className="text-xs font-medium text-[var(--text-primary)]">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="border-t border-[var(--border-subtle)] pt-2 text-xs text-[var(--text-secondary)]">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)] block mb-0.5">Destination Address:</span>
                  <p className="text-[var(--text-primary)] leading-snug">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</p>
                </div>
              </div>

              <div className="text-[11px] text-[var(--text-secondary)] bg-[var(--bg-surface)] p-3 rounded-xs flex items-start gap-2 border border-[var(--border-subtle)]">
                <span className="material-symbols-outlined text-sm text-[var(--accent-gold)] shrink-0 mt-0.5">info</span>
                <span>
                  <strong>Important:</strong> Insured armored courier (BVC Logistics) requires an active phone number to generate delivery OTP at your doorstep.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPhoneConfirmModal(false);
                    setStep(2);
                  }}
                  className="flex-1 btn-gold-primary py-3.5 px-4 text-xs font-semibold cursor-pointer text-center"
                >
                  ✓ CONFIRM & PROCEED TO PAYMENT
                </button>
                <button
                  type="button"
                  onClick={() => setShowPhoneConfirmModal(false)}
                  className="btn-gold-secondary py-3.5 px-4 text-xs cursor-pointer text-center"
                >
                  EDIT DETAILS
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  );
}
