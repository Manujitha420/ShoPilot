'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import {
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Heart,
  Bookmark,
  Tag,
  ShieldCheck,
  Truck,
  Info,
  Check,
  TrendingUp,
  Zap,
  Award,
  Leaf,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  Gift,
  Bell,
  ChevronRight,
  Plus,
  Minus,
  CreditCard,
  Star,
  Eye,
  ChevronLeft
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
    reviews?: any[];
    warrantyInformation?: string;
    shippingInformation?: string;
    returnPolicy?: string;
  };
  quantity: number;
  variant: string;
  aiBadge?: string;
  badgeColor?: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Gift options state
  const [isGift, setIsGift] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');

  // Alerts states
  const [alertProduct, setAlertProduct] = useState<number | null>(null);
  const [alertType, setAlertType] = useState<'stock' | 'price' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load cart data
  useEffect(() => {
    const loadCart = () => {
      try {
        const cartData = localStorage.getItem('shopilot_cart');
        const savedData = localStorage.getItem('shopilot_saved_for_later');

        if (cartData) {
          setCartItems(JSON.parse(cartData));
        } else {
          // Prepopulate with a default premium setup if empty so the user is immediately wowed
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
                brand: 'Aura',
                thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'],
                warrantyInformation: '1 Year Manufacturer Warranty',
                shippingInformation: 'Ships in 1-2 business days',
                returnPolicy: '30 days return policy'
              },
              quantity: 1,
              variant: 'Matte Black',
              aiBadge: 'Best Value',
              badgeColor: 'bg-emerald-500'
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
                brand: 'Nova',
                thumbnail: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80',
                images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&auto=format&fit=crop&q=80'],
                warrantyInformation: '2 Years Manufacturer Warranty',
                shippingInformation: 'Ships in 1-2 business days',
                returnPolicy: '30 days return policy'
              },
              quantity: 1,
              variant: 'Tactile Blue Switches',
              aiBadge: 'Trending',
              badgeColor: 'bg-indigo-500'
            }
          ];
          setCartItems(defaultItems);
          localStorage.setItem('shopilot_cart', JSON.stringify(defaultItems));
        }

        if (savedData) {
          setSavedItems(JSON.parse(savedData));
        } else {
          // Prepopulate saved for later
          const defaultSaved: CartItem[] = [
            {
              product: {
                id: 922,
                title: 'Royal Oud Intense Cologne',
                description: 'Luxurious scent for men.',
                category: 'Fragrances',
                price: 145.00,
                discountPercentage: 10,
                rating: 4.8,
                stock: 18,
                brand: 'RegalScent',
                thumbnail: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80',
                images: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600&auto=format&fit=crop&q=80']
              },
              quantity: 1,
              variant: '100ml Eau de Parfum'
            }
          ];
          setSavedItems(defaultSaved);
          localStorage.setItem('shopilot_saved_for_later', JSON.stringify(defaultSaved));
        }

        // Initialize recently viewed
        const recent = [
          { id: 902, title: 'Zenith Watch Pro', price: 349.00, rating: 4.8, thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80', brand: 'Zenith' },
          { id: 904, title: 'Lumina X-900 Mirrorless', price: 1299.00, rating: 5.0, thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80', brand: 'Lumina' },
          { id: 921, title: 'Hydration Therapy Essence', price: 39.00, rating: 4.7, thumbnail: 'https://images.unsplash.com/photo-1608248597481-496100c80836?w=600&auto=format&fit=crop&q=80', brand: 'LumiSkin' }
        ];
        setRecentlyViewed(recent);
      } catch (e) {
        console.error('Failed to load storage items:', e);
      }
    };

    loadCart();
  }, []);

  // Save updates to localStorage
  const saveCartToStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('shopilot_cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('shopilot_cart_update'));
  };

  const saveSavedToStorage = (updatedSaved: CartItem[]) => {
    setSavedItems(updatedSaved);
    localStorage.setItem('shopilot_saved_for_later', JSON.stringify(updatedSaved));
  };

  // Quantity updates
  const handleQuantity = (idx: number, delta: number) => {
    const updated = [...cartItems];
    const newQty = Math.max(1, Math.min(updated[idx].product.stock, updated[idx].quantity + delta));
    updated[idx].quantity = newQty;
    saveCartToStorage(updated);
  };

  // Remove item
  const handleRemove = (idx: number) => {
    const updated = cartItems.filter((_, i) => i !== idx);
    saveCartToStorage(updated);
    triggerToast('Removed item from cart.');
  };

  // Save for Later
  const handleSaveForLater = (idx: number) => {
    const item = cartItems[idx];
    const updatedCart = cartItems.filter((_, i) => i !== idx);
    const updatedSaved = [...savedItems, item];
    saveCartToStorage(updatedCart);
    saveSavedToStorage(updatedSaved);
    triggerToast('Moved item to Saved for Later shelf.');
  };

  // Move back to Cart
  const handleMoveToCart = (idx: number) => {
    const item = savedItems[idx];
    const updatedSaved = savedItems.filter((_, i) => i !== idx);
    const updatedCart = [...cartItems, item];
    saveCartToStorage(updatedCart);
    saveSavedToStorage(updatedSaved);
    triggerToast('Moved item to Shopping Cart!');
  };

  // Delete saved item
  const handleDeleteSaved = (idx: number) => {
    const updated = savedItems.filter((_, i) => i !== idx);
    saveSavedToStorage(updated);
    triggerToast('Deleted saved item.');
  };

  // Move to wishlist (simulate adding to favorites hook)
  const handleMoveToWishlist = (idx: number) => {
    const item = cartItems[idx];
    try {
      const favoritesData = localStorage.getItem('shopilot_favorites');
      let favorites = favoritesData ? JSON.parse(favoritesData) : [];
      if (!favorites.includes(item.product.id)) {
        favorites.push(item.product.id);
        localStorage.setItem('shopilot_favorites', JSON.stringify(favorites));
        window.dispatchEvent(new Event('shopilot_favorites_update'));
      }
      handleRemove(idx);
      triggerToast('Moved item to your Wishlist.');
    } catch (e) {
      console.error(e);
    }
  };

  // Coupon handling
  const applyCoupon = () => {
    setCouponError(null);
    const code = couponCode.trim().toUpperCase();
    if (code === 'SAVE20') {
      setAppliedCoupon('SAVE20');
      setCouponDiscount(20); // 20% off
      triggerToast('Applied coupon SAVE20: 20% discount applied!');
    } else if (code === 'FREESHIP') {
      setAppliedCoupon('FREESHIP');
      setCouponDiscount(0); // free shipping
      triggerToast('Applied coupon FREESHIP: Free shipping applied!');
    } else {
      setCouponError('Invalid coupon code. Try code: SAVE20 or FREESHIP');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Calculation summaries
  const totalItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const originalSubtotal = cartItems.reduce((sum, item) => {
    const originalPrice = item.product.discountPercentage
      ? item.product.price / (1 - item.product.discountPercentage / 100)
      : item.product.price;
    return sum + (originalPrice * item.quantity);
  }, 0);

  const productSavings = originalSubtotal - subtotal;
  const couponSavings = appliedCoupon === 'SAVE20' ? subtotal * 0.20 : 0;

  // Shipping calculation (free shipping target is $150)
  const shippingCost = subtotal > 150 || appliedCoupon === 'FREESHIP' ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const totalAmount = subtotal - couponSavings + shippingCost + tax;

  const estimatedDeliveryDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  // Add to cart directly from recommendations
  const handleAddRecommendedToCart = (p: any) => {
    const newItem: CartItem = {
      product: {
        id: p.id,
        title: p.title,
        description: p.description || 'Premium accessory.',
        category: p.category || 'Accessories',
        price: p.price,
        discountPercentage: 0,
        rating: p.rating || 4.5,
        stock: 10,
        brand: p.brand || 'Generic',
        thumbnail: p.thumbnail,
        images: [p.thumbnail]
      },
      quantity: 1,
      variant: 'Standard / Default'
    };
    saveCartToStorage([...cartItems, newItem]);
    triggerToast(`Added "${p.title}" to Cart!`);
  };

  // AI Insights triggers
  const getAiInsights = () => {
    const insights = [];

    // 1. Compatibility check
    const hasHeadphones = cartItems.some(i => i.product.title.toLowerCase().includes('sound') || i.product.title.toLowerCase().includes('headphone'));
    const hasKeyboard = cartItems.some(i => i.product.title.toLowerCase().includes('keyboard') || i.product.title.toLowerCase().includes('nova'));
    if (hasHeadphones && hasKeyboard) {
      insights.push({
        type: 'compatibility',
        icon: '✔',
        color: 'text-indigo-600 bg-indigo-50 border-indigo-100',
        title: 'Compatibility Match: Verified',
        text: 'Aura Headphones and Nova Tactile Keyboard are fully compatible and run seamlessly on identical computer systems.'
      });
    }

    // 2. Shipping milestone
    const freeShippingTarget = 150;
    if (subtotal > 0 && subtotal < freeShippingTarget && appliedCoupon !== 'FREESHIP') {
      const remaining = freeShippingTarget - subtotal;
      insights.push({
        type: 'shipping',
        icon: '🚚',
        color: 'text-amber-700 bg-amber-50 border-amber-100',
        title: 'Free Shipping Goal',
        text: `You are only $${remaining.toFixed(2)} away from qualifying for FREE standard shipping! Add a recommended accessory to save on shipping charges.`
      });
    } else if (subtotal >= freeShippingTarget && appliedCoupon !== 'FREESHIP') {
      insights.push({
        type: 'shipping',
        icon: '🎉',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-100',
        title: 'Free Standard Shipping unlocked!',
        text: 'Your order exceeds $150. Enjoy free ground shipping at checkout.'
      });
    }

    // 3. Bundle savings
    if (hasHeadphones && hasKeyboard) {
      insights.push({
        type: 'bundle',
        icon: '💡',
        color: 'text-purple-700 bg-purple-50 border-purple-100',
        title: 'Bundle Opportunity: Aura + Nova Set',
        text: 'Bundle these two desktop components to unlock an additional 15% discount. Apply code SAVE20 in your summary block!'
      });
    }

    // 4. Price history alerts
    if (cartItems.some(i => i.product.discountPercentage > 0)) {
      insights.push({
        type: 'price',
        icon: '📉',
        color: 'text-rose-700 bg-rose-50 border-rose-100',
        title: 'Limited Time Price Drop Detected',
        text: 'Aura Sound Max Wireless has dropped by 40%. The shoPilot AI algorithm rates this as a "Strong Buy" recommendation.'
      });
    }

    return insights;
  };

  const aiInsights = getAiInsights();

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

      {/* Breadcrumb section */}
      <div className="bg-white border-b border-slate-100 py-3.5 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-xs font-semibold text-slate-500 flex items-center gap-2.5">
          <Link href="/" className="hover:text-slate-855 transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900">Cart</span>
        </div>
      </div>

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <ShoppingCart className="w-7 h-7 text-[#3b42c4]" />
              Shopping Cart
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm font-semibold mt-1">
              You have <span className="text-slate-800 font-bold">{totalItemCount} item(s)</span> in your shopping basket.
            </p>
          </div>

          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-colors shadow-2xs cursor-pointer shrink-0 align-self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </button>
        </div>

        {cartItems.length === 0 ? (
          /* Empty Cart State */
          <div className="text-center py-20 bg-white border border-slate-200/80 rounded-3xl shadow-sm space-y-4">
            <ShoppingCart className="w-16 h-16 text-slate-200 mx-auto animate-pulse" />
            <h2 className="text-xl font-bold text-slate-800">Your cart is currently empty</h2>
            <p className="text-slate-400 text-sm max-w-sm mx-auto">Add some items from our catalog to get premium AI compatibility checks and savings suggestions!</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          /* Combined Cart Items & Checkout Dashboard Section */
          <div className="space-y-8">

            {/* Merged parent Dashboard Card */}
            <div className="bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Cart Items List */}
                <div className="lg:col-span-8 space-y-4">
                  {cartItems.map((item, idx) => {
                    const originalPrice = item.product.discountPercentage
                      ? (item.product.price / (1 - item.product.discountPercentage / 100)).toFixed(2)
                      : null;

                    return (
                      <div
                        key={item.product.id}
                        className="bg-slate-50/50 border border-slate-200/60 rounded-3xl p-5 flex flex-col md:flex-row gap-5 items-start relative hover:border-slate-300 transition-colors"
                      >
                        {/* Floating AI Badging */}
                        {item.aiBadge && (
                          <span className={`absolute -top-2.5 left-5 text-white text-[9px] font-extrabold tracking-wider px-2 py-0.5 rounded-md shadow-sm ${item.badgeColor || 'bg-indigo-600'}`}>
                            {item.aiBadge}
                          </span>
                        )}

                        {/* Image */}
                        <div className="w-full md:w-32 aspect-square bg-white border border-slate-100 rounded-2xl overflow-hidden p-2 flex items-center justify-center shrink-0">
                          <img
                            src={item.product.thumbnail}
                            alt={item.product.title}
                            className="max-h-full object-contain pointer-events-none"
                          />
                        </div>

                        {/* Info & Details */}
                        <div className="flex-1 flex flex-col justify-between self-stretch gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                              <span>{item.product.brand || 'Generic'}</span>
                              <span className="text-indigo-500 bg-indigo-50 border border-indigo-100/60 px-1.5 py-0.5 rounded-md">
                                {item.product.category.replace('-', ' ')}
                              </span>
                            </div>
                            <Link href={`/products/${item.product.id}`} className="hover:text-indigo-600 transition-colors">
                              <h3 className="font-black text-sm md:text-base text-slate-800 leading-tight">
                                {item.product.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                              <span>Variant: <span className="text-slate-800">{item.variant}</span></span>
                              <span>|</span>
                              <div className="flex items-center gap-0.5 text-amber-500">
                                <Star className="w-3.5 h-3.5 fill-current" />
                                <span>{item.product.rating.toFixed(1)} ({item.product.reviews?.length || 3})</span>
                              </div>
                            </div>
                          </div>

                          {/* Controls Bottom Row */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-auto">

                            {/* Qty Counter */}
                            <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shrink-0">
                              <button
                                onClick={() => handleQuantity(idx, -1)}
                                disabled={item.quantity <= 1}
                                className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-4 font-bold text-xs text-slate-800">{item.quantity}</span>
                              <button
                                onClick={() => handleQuantity(idx, 1)}
                                disabled={item.quantity >= item.product.stock}
                                className="px-2.5 py-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Quick action buttons */}
                            <div className="flex items-center gap-3.5 text-xs font-bold text-slate-500 select-none">
                              <button
                                onClick={() => handleSaveForLater(idx)}
                                className="hover:text-indigo-600 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Bookmark className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Save for Later</span>
                              </button>
                              <button
                                onClick={() => handleMoveToWishlist(idx)}
                                className="hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Heart className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Move to Wishlist</span>
                              </button>
                              <button
                                onClick={() => handleRemove(idx)}
                                className="text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">Remove</span>
                              </button>
                            </div>

                          </div>
                        </div>

                        {/* Price & Status Right section */}
                        <div className="w-full md:w-36 flex md:flex-col justify-between md:items-end self-stretch border-t md:border-t-0 md:border-l border-slate-250 pt-4 md:pt-0 md:pl-4 shrink-0 text-right">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                            {originalPrice && (
                              <>
                                <span className="text-[10px] text-slate-400 line-through mt-0.5">${(parseFloat(originalPrice) * item.quantity).toFixed(2)}</span>
                                <span className="text-emerald-600 text-[9px] font-black tracking-wide uppercase mt-0.5">-{Math.round(item.product.discountPercentage)}% Off</span>
                              </>
                            )}
                          </div>

                          {/* Status items */}
                          <div className="mt-auto space-y-1 text-[10px] font-bold text-right">
                            <div className="text-slate-400">
                              Del. Estimate: <span className="text-slate-700">{estimatedDeliveryDate()}</span>
                            </div>
                            <div className="text-slate-400">
                              Returns: <span className="text-emerald-600">{item.product.returnPolicy || '30 days returns'}</span>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>

                {/* Right Column: Checkout & Order Summary (with delivery selector removed) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6 lg:border-l lg:border-slate-100 lg:pl-8">
                  <div>
                    <h2 className="text-base font-black text-slate-900">Order Summary</h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Secure payment processing</p>
                  </div>

                  {/* Coupon input */}
                  <div className="space-y-2">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Coupon Code</span>
                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                        <span className="text-emerald-700 font-bold">Applied: {appliedCoupon}</span>
                        <button onClick={removeCoupon} className="text-rose-500 font-extrabold hover:text-rose-700">Remove</button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="E.g. SAVE20"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                        <button
                          onClick={applyCoupon}
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold cursor-pointer"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                    {couponError && <p className="text-[10px] text-rose-600 font-semibold">{couponError}</p>}
                  </div>

                  {/* Gift Option check */}
                  <div className="space-y-3.5 bg-slate-50 border border-slate-200/50 p-4 rounded-2xl">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isGift}
                        onChange={() => setIsGift(!isGift)}
                        className="rounded border-slate-350 text-indigo-600"
                      />
                      <span className="flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-indigo-500" /> Send as a Gift</span>
                    </label>

                    {isGift && (
                      <div className="space-y-3 pt-2 border-t border-slate-200/60 animate-fadeIn">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-600 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={giftWrap}
                            onChange={() => setGiftWrap(!giftWrap)}
                            className="rounded border-slate-300 text-indigo-600"
                          />
                          <span>Premium wrapping packaging (+$4.99)</span>
                        </label>
                        <textarea
                          placeholder="Gift message content..."
                          value={giftMessage}
                          onChange={(e) => setGiftMessage(e.target.value)}
                          rows={2}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Subtotals & Math */}
                  <div className="space-y-3.5 border-t border-b border-slate-100 py-4 text-xs font-semibold text-slate-600">
                    <div className="flex justify-between">
                      <span>Original Subtotal</span>
                      <span className="line-through">${originalSubtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-emerald-600">
                      <span>Product Savings</span>
                      <span>-${productSavings.toFixed(2)}</span>
                    </div>
                    {couponSavings > 0 && (
                      <div className="flex justify-between text-emerald-600">
                        <span>Coupon discount</span>
                        <span>-${couponSavings.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Est. Shipping</span>
                      <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. Tax (8%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-slate-900 font-black text-sm pt-2">
                      <span>Total Amount</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm rounded-2xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Secure Checkout (${totalAmount.toFixed(2)})</span>
                  </button>

                  {/* Accepted Payments Preview */}
                  <div className="text-center space-y-2">
                    <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Accepted Payments</span>
                    <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl py-3 px-4">
                      <div className="w-14 h-8 bg-white border border-slate-200/85 rounded-lg flex items-center justify-center p-1.5 shadow-3xs hover:border-slate-350 transition-colors">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Visa_Inc._logo_%282021%E2%80%93present%29.svg/3840px-Visa_Inc._logo_%282021%E2%80%93present%29.svg.png"
                          alt="Visa"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="w-14 h-8 bg-white border border-slate-200/85 rounded-lg flex items-center justify-center p-1 shadow-3xs hover:border-slate-350 transition-colors">
                        <img
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_6Mg7eXMGERjANGEEZHbO7L4LR6VJinqCoJe5MmSXh93IQJLTUDN7mcSD&s=10"
                          alt="Mastercard"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="w-14 h-8 bg-white border border-slate-200/85 rounded-lg flex items-center justify-center p-1.5 shadow-3xs hover:border-slate-350 transition-colors">
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/PayPal_Logo2014.svg/960px-PayPal_Logo2014.svg.png?_=20230314143144"
                          alt="PayPal"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="w-14 h-8 bg-white border border-slate-200/85 rounded-lg flex items-center justify-center p-1 shadow-3xs hover:border-slate-350 transition-colors">
                        <img
                          src="https://download.logo.wine/logo/Google_Pay/Google_Pay-Logo.wine.png"
                          alt="Google Pay"
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            </div>

            {/* shoPilot AI Cart Insights Banner (now positioned below the checkout section) */}
            {aiInsights.length > 0 && (
              <div className="border border-indigo-100 bg-gradient-to-br from-indigo-50/20 via-white to-indigo-50/10 rounded-[32px] p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-indigo-500 animate-pulse" />
                  <span className="text-xs font-black text-slate-800 tracking-wider uppercase">shoPilot AI Cart Insights</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInsights.map((insight, idx) => (
                    <div key={idx} className={`p-4 border rounded-2xl flex gap-3 shadow-3xs ${insight.color}`}>
                      <span className="text-lg shrink-0 select-none mt-0.5">{insight.icon}</span>
                      <div>
                        <p className="font-extrabold text-xs tracking-wide leading-none mb-1">{insight.title}</p>
                        <p className="text-[11px] font-semibold leading-normal text-slate-600">{insight.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Secure Checkout Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-5 text-center space-y-3.5 shadow-md">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black tracking-tight text-indigo-300">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Secure payment processing
              </div>
              <p className="text-[10px] text-slate-300 font-semibold leading-normal">
                All transactions are encrypted with bank-grade SSL security protocols. Easy 30-day money-back guarantee.
              </p>
            </div>

            {/* Saved for Later Shelf */}
            {savedItems.length > 0 && (
              <div className="border border-slate-200 bg-white rounded-[32px] p-6 shadow-sm space-y-4">
                <div>
                  <h2 className="text-base font-black text-slate-900">Saved for Later ({savedItems.length})</h2>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Items paused from purchase, saved locally</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {savedItems.map((item, idx) => (
                    <div key={item.product.id} className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex gap-4 items-center">
                      <div className="w-16 h-16 bg-white border border-slate-100 rounded-xl overflow-hidden p-1 flex items-center justify-center shrink-0">
                        <img src={item.product.thumbnail} alt={item.product.title} className="max-h-full object-contain" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-slate-800 truncate">{item.product.title}</h4>
                        <span className="text-[10px] text-slate-400 font-bold truncate block mt-0.5">${item.product.price.toFixed(2)}</span>

                        <div className="flex gap-3 text-[10px] font-extrabold mt-2 text-slate-500">
                          <button
                            onClick={() => handleMoveToCart(idx)}
                            className="hover:text-indigo-600 flex items-center gap-0.5 cursor-pointer"
                          >
                            Move to Cart
                          </button>
                          <button
                            onClick={() => handleDeleteSaved(idx)}
                            className="hover:text-rose-600 flex items-center gap-0.5 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Frequently Bought Together */}
            <div className="space-y-4">
              <div>
                <h2 className="text-base font-black text-slate-900">Frequently Bought Together</h2>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Complementary additions and accessories</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {recentlyViewed.map((p) => {
                  const matchScore = 92; // AI Match Score mock
                  const rating = p.rating || 4.7;
                  return (
                    <div
                      key={p.id}
                      onClick={() => router.push(`/products/${p.id}`)}
                      className="group relative bg-white border border-slate-200/60 hover:border-slate-350 rounded-3xl p-4 flex flex-col h-[380px] transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
                    >
                      {/* Image Container */}
                      <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-50 mb-3.5 border border-slate-100 flex items-center justify-center">
                        <img
                          src={p.thumbnail}
                          alt={p.title}
                          className="max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        {/* AI Match Badge */}
                        <span className="absolute top-2 left-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[8px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                          <Sparkles className="w-2 h-2 fill-current" />
                          {matchScore}% Match
                        </span>
                      </div>

                      {/* Metadata */}
                      <div className="flex flex-col flex-1">
                        <div className="flex items-center justify-between text-[10px] mb-1.5 font-bold uppercase tracking-wider text-slate-400">
                          <span>{p.brand || 'Generic'}</span>
                          <div className="flex items-center gap-0.5 text-amber-500 bg-amber-50 border border-amber-100 px-1 py-0.5 rounded-md">
                            <Star className="w-2.5 h-2.5 fill-current" />
                            <span className="font-extrabold text-[9px]">{rating.toFixed(1)}</span>
                          </div>
                        </div>

                        <h3 className="text-xs font-black text-slate-800 line-clamp-2 leading-snug hover:text-[#3b42c4] transition-colors">
                          {p.title}
                        </h3>

                        {/* Action & Price Bottom Row */}
                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-sm font-black text-slate-900">${p.price.toFixed(2)}</span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddRecommendedToCart(p);
                            }}
                            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-855 text-white rounded-xl font-bold text-[10px] transition-colors cursor-pointer"
                          >
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
