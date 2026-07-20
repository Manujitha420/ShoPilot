'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Gift,
  Sparkles,
  Leaf,
  Check,
  ArrowLeft,
  Lock,
  AlertCircle,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  Star
} from 'lucide-react';

interface CartItem {
  product: {
    id: number;
    title: string;
    description: string;
    category: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand?: string;
    thumbnail: string;
    images: string[];
  };
  quantity: number;
  variant: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Shipping details state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('United States');
  const [stateProv, setStateProv] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [address, setAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [saveAddress, setSaveAddress] = useState(false);
  const [setAsDefault, setSetAsDefault] = useState(false);

  // Delivery state
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express' | 'same_day'>('standard');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'apple' | 'google' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Billing state
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billFullName, setBillFullName] = useState('');
  const [billAddress, setBillAddress] = useState('');
  const [billCity, setBillCity] = useState('');
  const [billZip, setBillZip] = useState('');

  // Coupon state
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoSavings, setPromoSavings] = useState(0);
  const [promoError, setPromoError] = useState<string | null>(null);


  // Sustainability state
  const [ecoPackaging, setEcoPackaging] = useState(false);
  const [reusableBox, setReusableBox] = useState(false);
  const [carbonNeutralDelivery, setCarbonNeutralDelivery] = useState(false);

  // Additional fields
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Feedback states
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');

  // Load cart data
  useEffect(() => {
    try {
      const cartData = localStorage.getItem('shopilot_cart');
      if (cartData) {
        setCartItems(JSON.parse(cartData));
      } else {
        // Fallback mock items
        const defaultItems: CartItem[] = [
          {
            product: {
              id: 931,
              title: 'Aura Sound Max Wireless (Matte Black)',
              description: 'Studio-grade headphones with ANC.',
              category: 'Electronics',
              price: 179.00,
              discountPercentage: 40,
              rating: 4.9,
              stock: 12,
              thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
              images: []
            },
            quantity: 1,
            variant: 'Matte Black'
          },
          {
            product: {
              id: 933,
              title: 'Nova Mechanical Core Tactile Keyboard',
              description: 'Premium tactile mechanical keyboard.',
              category: 'Computing',
              price: 111.30,
              discountPercentage: 30,
              rating: 4.7,
              stock: 8,
              thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
              images: []
            },
            quantity: 1,
            variant: 'Tactile Blue Switches'
          }
        ];
        setCartItems(defaultItems);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Math calculations
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Delivery cost calculation
  const getDeliveryCost = () => {
    if (deliveryMethod === 'express') return 19.99;
    if (deliveryMethod === 'same_day') return 35.00;
    // Standard delivery is FREE above $150
    return subtotal >= 150 ? 0 : 9.99;
  };

  const deliveryCost = getDeliveryCost();
  const reusableBoxCost = reusableBox ? 2.00 : 0;


  // Coupon calculation
  const applyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'SAVE20') {
      setAppliedPromo('SAVE20');
      setPromoSavings(subtotal * 0.20);
      triggerToast('Promo code SAVE20 applied: 20% discount!');
    } else if (code === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setPromoSavings(deliveryMethod === 'standard' ? deliveryCost : 0);
      triggerToast('Promo code FREESHIP applied: Free standard shipping!');
    } else {
      setPromoError('Invalid promo code. Try SAVE20');
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoSavings(0);
    setPromoCode('');
  };

  const tax = subtotal * 0.08; // 8% tax
  const totalAmount = subtotal - promoSavings + deliveryCost + tax + reusableBoxCost;

  const getArrivalDate = (method: typeof deliveryMethod) => {
    const days = method === 'same_day' ? 0 : method === 'express' ? 1 : 4;
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Form submission handler
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (!fullName) errors.push('Full Name is required.');
    if (!email) errors.push('Email address is required.');
    if (!address) errors.push('Street Address is required.');
    if (!city) errors.push('City is required.');
    if (!zip) errors.push('Postal Code is required.');

    if (paymentMethod === 'card') {
      if (!cardNumber) errors.push('Card Number is required.');
      if (!cardExpiry) errors.push('Card Expiration Date is required.');
      if (!cardCvv) errors.push('CVV Security Code is required.');
    }

    if (!sameAsShipping) {
      if (!billFullName) errors.push('Billing Full Name is required.');
      if (!billAddress) errors.push('Billing Address is required.');
    }

    if (!agreeTerms) {
      errors.push('You must agree to the Terms and Conditions.');
    }

    if (errors.length > 0) {
      setFormErrors(errors);
      triggerToast('Please complete all required fields.');
      window.scrollTo({ top: 150, behavior: 'smooth' });
      return;
    }

    setFormErrors([]);
    // Success flow
    const confirmId = `SP-${Math.floor(100000 + Math.random() * 900000)}-AI`;
    setOrderId(confirmId);
    setShowSuccessModal(true);

    // Clear cart on successful purchase
    localStorage.removeItem('shopilot_cart');
    window.dispatchEvent(new Event('shopilot_cart_update'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />

      {/* Floating success toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-800 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Success Modal overlay */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-[36px] max-w-lg w-full p-8 shadow-2xl text-center space-y-6 animate-scaleUp">
            <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-emerald-600">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Order Confirmed!</h2>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Order ID: {orderId}</p>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
              Thank you for shopping with shoPilot! Your order will be delivered by <span className="text-slate-900 font-extrabold">{getArrivalDate(deliveryMethod)}</span>. A confirmation receipt has been sent to <span className="text-slate-900 font-extrabold">{email}</span>.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowSuccessModal(false);
                  router.push('/');
                }}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm rounded-2xl transition-all cursor-pointer"
              >
                Back to Shopping
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb section */}
      <div className="bg-white border-b border-slate-100 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500 flex items-center gap-2.5">
          <Link href="/" className="hover:text-slate-855 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/cart" className="hover:text-slate-855 transition-colors">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Checkout</span>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-7 h-7 text-indigo-600" />
              Checkout & Shipping
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              Verify your delivery coordinates and complete purchase
            </p>
          </div>

          <button
            onClick={() => router.push('/cart')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors shadow-2xs cursor-pointer shrink-0 align-self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Cart</span>
          </button>
        </div>

        {formErrors.length > 0 && (
          <div className="bg-rose-50 border border-rose-100 rounded-3xl p-5 mb-8 text-xs font-semibold text-rose-600 space-y-1.5">
            <span className="font-extrabold uppercase text-[10px] tracking-wider block mb-1">Please fix the following issues:</span>
            {formErrors.map((err, idx) => (
              <p key={idx} className="flex items-center gap-1.5"><AlertCircle className="w-4.5 h-4.5 shrink-0" /> {err}</p>
            ))}
          </div>
        )}

        <form onSubmit={handlePurchase} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column (8 cols): Checkout Details */}
          <div className="lg:col-span-8 space-y-8">

            {/* Form Section 1: Shipping Information */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Shipping Information</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Where should we deliver your order?</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g. (555) 000-1234"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="E.g. john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Country *</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">State / Province *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. California"
                    value={stateProv}
                    onChange={(e) => setStateProv(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">City *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. San Francisco"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Postal / Zip Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 94103"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Street Address *</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g. 123 Market Street"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Apartment, Suite, Unit (Optional)</label>
                  <input
                    type="text"
                    placeholder="E.g. Apt 4B"
                    value={apartment}
                    onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Address options */}
              <div className="flex flex-wrap gap-6 pt-2 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={saveAddress}
                    onChange={() => setSaveAddress(!saveAddress)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Save this address</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={setAsDefault}
                    onChange={() => setSetAsDefault(!setAsDefault)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Set as default address</span>
                </label>
              </div>
            </div>

            {/* Form Section 2: Delivery Method */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Delivery Method</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Select your preferred speed and cost</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-800">Standard Delivery (3–5 days)</p>
                      <p className="text-slate-400 font-semibold mt-0.5">Est. Arrival: {getArrivalDate('standard')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-950">
                    {subtotal >= 150 ? 'FREE' : '$9.99'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-800">Express Delivery (1–2 days)</p>
                      <p className="text-slate-400 font-semibold mt-0.5">Est. Arrival: {getArrivalDate('express')}</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-950">$19.99</span>
                </label>

                <label className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:border-slate-300 transition-colors bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'same_day'}
                      onChange={() => setDeliveryMethod('same_day')}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <div className="text-xs">
                      <p className="font-extrabold text-slate-800">Same Day Delivery</p>
                      <p className="text-slate-400 font-semibold mt-0.5">Available in selected areas</p>
                    </div>
                  </div>
                  <span className="text-xs font-black text-slate-950">$35.00</span>
                </label>
              </div>
            </div>

            {/* Form Section 3: Payment Method */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-black text-slate-900">Payment Method</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Safe and encrypted checkout processing</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                  <Lock className="w-3.5 h-3.5 text-emerald-500" /> SSL Encrypted
                </div>
              </div>

              {/* Selector Tabs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`h-12 px-4 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${paymentMethod === 'card'
                    ? 'bg-indigo-50 border-[#3b42c4]'
                    : 'bg-slate-50 border-slate-200'
                    }`}
                >
                  <img 
                    src="https://www.freepnglogos.com/uploads/mastercard-png/what-are-the-visa-and-mastercard-limited-acceptance-programs-8.png" 
                    alt="visa and mastercard" 
                    className="h-6 w-auto object-contain"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`h-12 px-4 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${paymentMethod === 'paypal'
                    ? 'bg-indigo-50 border-[#3b42c4]'
                    : 'bg-slate-50 border-slate-200'
                    }`}
                >
                  <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/PayPal_Logo2014.svg/960px-PayPal_Logo2014.svg.png?_=20230314143144" 
                    alt="paypal" 
                    className="h-5 w-auto object-contain"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('google')}
                  className={`h-12 px-4 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${paymentMethod === 'google'
                    ? 'bg-indigo-50 border-[#3b42c4]'
                    : 'bg-slate-50 border-slate-200'
                    }`}
                >
                  <img 
                    src="https://download.logo.wine/logo/Google_Pay/Google_Pay-Logo.wine.png" 
                    alt="google pay" 
                    className="h-6 w-auto object-contain"
                  />
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 animate-fadeIn">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Card Number *</label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Cardholder Name *</label>
                    <input
                      type="text"
                      placeholder="E.g. JOHN DOE"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Expiry *</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">CVV *</label>
                      <input
                        type="password"
                        placeholder="123"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod !== 'card' && (
                <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center text-xs font-semibold text-slate-500 animate-fadeIn">
                  🎉 Selected: {paymentMethod.toUpperCase()} Checkout. You will authorize coordinates in the popup window.
                </div>
              )}

              {/* Billing Address Toggle */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={() => setSameAsShipping(!sameAsShipping)}
                    className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Billing Address is same as Shipping Address</span>
                </label>

                {!sameAsShipping && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl animate-fadeIn">
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billing Full Name *</label>
                      <input
                        type="text"
                        placeholder="E.g. John Doe"
                        value={billFullName}
                        onChange={(e) => setBillFullName(e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Billing Address *</label>
                      <input
                        type="text"
                        placeholder="E.g. 123 Market Street"
                        value={billAddress}
                        onChange={(e) => setBillAddress(e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">City *</label>
                      <input
                        type="text"
                        placeholder="E.g. San Francisco"
                        value={billCity}
                        onChange={(e) => setBillCity(e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Zip Code *</label>
                      <input
                        type="text"
                        placeholder="E.g. 94103"
                        value={billZip}
                        onChange={(e) => setBillZip(e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>



            {/* Form Section 5: Order Notes & Terms */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">Order Instructions & Terms</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Accept policies and add custom delivery instructions</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Special Delivery Instructions</label>
                  <textarea
                    placeholder="E.g., Leave at the front gate or call on arrival..."
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                  />
                </div>

                <label className="flex items-start gap-2.5 text-xs font-bold text-slate-700 cursor-pointer select-none pt-2">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={() => setAgreeTerms(!agreeTerms)}
                    className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 mt-0.5"
                  />
                  <span className="leading-snug">I agree to the Terms & Conditions and Privacy Policy.</span>
                </label>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Summary details & AI recommendations */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">

            {/* Order Calculations sticky Summary card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-6">
              <div>
                <h2 className="text-base font-black text-slate-900">Order Totals</h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Final amount validation</p>
              </div>

              {/* Subtotals & calculations list */}
              <div className="space-y-3.5 border-t border-b border-slate-100 py-4 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalItemCount} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoSavings > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Promo discount</span>
                    <span>-${promoSavings.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Cost</span>
                  <span>{deliveryCost === 0 ? 'FREE' : `$${deliveryCost.toFixed(2)}`}</span>
                </div>
                {reusableBoxCost > 0 && (
                  <div className="flex justify-between">
                    <span>Eco Reusable Box</span>
                    <span>+$2.00</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Est. Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-slate-900 font-black text-sm pt-2">
                  <span>Total Amount</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo input inline */}
              <div className="space-y-2">
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Apply Promo Code</span>
                {appliedPromo ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                    <span className="text-emerald-700 font-bold">Applied: {appliedPromo}</span>
                    <button type="button" onClick={removePromo} className="text-rose-500 font-extrabold hover:text-rose-700">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="E.g. SAVE20"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={applyPromo}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                )}
                {promoError && <p className="text-[10px] text-rose-600 font-semibold">{promoError}</p>}
              </div>

              {/* Complete Purchase Button */}
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4.5 h-4.5" />
                <span>Complete Purchase (${totalAmount.toFixed(2)})</span>
              </button>
            </div>

            {/* Secure Checkout Banners */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 text-center space-y-3.5 shadow-md">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-tight text-indigo-300">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Secure checkout validation
              </div>
              <p className="text-[10px] text-slate-300 font-semibold leading-normal">
                Encrypted Payment processing. 30-Day Money Back Guarantee. Easy Returns.
              </p>
            </div>

            {/* Professional Return Policy & Support Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900">Customer Support & Returns</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Help & refund policies</p>
              </div>
              
              <div className="space-y-3.5 text-xs font-semibold text-slate-600">
                <div className="flex gap-3 items-start">
                  <span className="text-indigo-500 text-sm select-none">🛡</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Hassle-Free 30-Day Returns</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Return items in original packaging within 30 days for a full, quick refund.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start pt-3.5 border-t border-slate-100">
                  <span className="text-indigo-500 text-sm select-none">💬</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">24/7 Live Concierge Help</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Click the floating helper to query similar sizes, accessories, or delivery coordinates instantly.</p>
                  </div>
                </div>

                <div className="flex gap-3 items-start pt-3.5 border-t border-slate-100">
                  <span className="text-indigo-500 text-sm select-none">📧</span>
                  <div>
                    <h4 className="font-bold text-slate-800 text-xs">Direct Support Desk</h4>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal mt-0.5">Reach out to us directly at <span className="text-[#3b42c4] font-bold">support@shopilot.com</span> or explore our comprehensive FAQs page.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </form>

      </main>

      <Footer />
    </div>
  );
}
