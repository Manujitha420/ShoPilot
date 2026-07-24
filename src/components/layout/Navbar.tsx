'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ShoppingCart, LogOut, User, Settings, ChevronDown } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { CATEGORY_IMAGES, DEFAULT_IMAGE } from '@/constants';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();
  const [isCategoriesHovered, setIsCategoriesHovered] = useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setIsCategoriesHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsCategoriesHovered(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cartData = localStorage.getItem('shopilot_cart');
        if (cartData) {
          const items = JSON.parse(cartData);
          const count = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
          setCartCount(count);
        } else {
          setCartCount(0);
        }
      } catch (e) {
        console.error('Failed to parse cart:', e);
      }
    };

    updateCartCount();

    window.addEventListener('shopilot_cart_update', updateCartCount);
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('shopilot_cart_update', updateCartCount);
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="w-full px-6 sm:px-10 lg:px-16 relative z-20">
        <div className="flex items-center justify-between h-16 sm:h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl font-bold tracking-tight text-[#3b42c4]">
              shoPilot
            </span>
          </Link>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex items-center text-[20px] font-semibold gap-8 absolute left-1/2 -translate-x-1/2">
            {navLinks.map((link) => {
              // Define active states
              const isActive = link.href === '/' ? pathname === '/' : pathname?.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold text-[16px] tracking-wide py-1.5 px-1 relative transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-[#3b42c4] after:transition-transform after:duration-300 hover:after:scale-x-100 ${isActive
                    ? 'text-[#3b42c4]'
                    : 'text-slate-500 hover:text-[#3b42c4]'
                    }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Categories Hover Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1.5 text-sm font-semibold text-[16px] tracking-wide py-1.5 px-1 relative transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-[#3b42c4] after:transition-transform after:duration-300 hover:after:scale-x-100 text-slate-500 hover:text-[#3b42c4] cursor-pointer ${
                  isCategoriesHovered ? 'after:scale-x-100 text-[#3b42c4]' : ''
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isCategoriesHovered ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </nav>

          <div className="flex items-center gap-4 sm:gap-6">
            {/* Notification Bell */}
            <button className="p-2 hover:bg-slate-50 rounded-full transition-colors relative cursor-pointer text-slate-500 hover:text-slate-800">
              <Bell className="w-5 h-5 stroke-[2]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full border border-white" />
            </button>

            {/* Shopping Cart */}
            <Link
              href="/cart"
              className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800 relative"
            >
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-600 border border-white text-white text-[9px] font-black rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  if (isAuthenticated) {
                    setIsDropdownOpen(!isDropdownOpen);
                  } else {
                    router.push('/login');
                  }
                }}
                className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 cursor-pointer hover:border-slate-400 transition-all flex items-center justify-center bg-slate-100"
              >
                {isAuthenticated && user?.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="https://dummyjson.com/icon/emilys/128"
                    alt="Default Avatar"
                    className="w-full h-full object-cover"
                  />
                )}
              </button>

              {/* Dropdown Menu for Authenticated Users */}
              {isDropdownOpen && isAuthenticated && user && (
                <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-2 border-b border-slate-50">
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">@{user.username}</p>
                  </div>

                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors text-left cursor-pointer font-medium"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

            {/* Settings Button */}
            <button
              onClick={() => router.push('/settings')}
              className="p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer text-slate-500 hover:text-slate-800"
              title="Settings"
            >
              <Settings className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Panel - Full Screen Width */}
      {isCategoriesHovered && (
        <div
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-2xl z-[100] animate-fadeIn before:absolute before:-top-4 before:left-0 before:right-0 before:h-4 before:content-['']"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="w-full px-6 sm:px-10 lg:px-16 py-6 max-h-[380px] overflow-y-auto scrollbar-none">
            <div className="grid grid-cols-6 gap-3">
              {isCategoriesLoading ? (
                <div className="col-span-6 flex justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b42c4]"></div>
                </div>
              ) : categories && categories.length > 0 ? (
                categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/products?category=${category.slug}`}
                    onClick={() => setIsCategoriesHovered(false)}
                    className="group flex flex-col gap-2 p-1.5 rounded-xl hover:bg-slate-50 transition-all text-center"
                  >
                    {/* Image Container - compact height */}
                    <div className="w-full h-[64px] rounded-lg overflow-hidden bg-slate-100 relative shadow-sm border border-slate-100/50">
                      <img
                        src={CATEGORY_IMAGES[category.slug] || DEFAULT_IMAGE}
                        alt={category.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    {/* Label */}
                    <span className="text-[12px] font-bold text-slate-700 group-hover:text-[#3b42c4] transition-colors self-center relative py-0.5 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-[#3b42c4] after:transition-transform after:duration-300 group-hover:after:scale-x-100 truncate max-w-full">
                      {category.name}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="col-span-6 text-center text-xs text-slate-400 py-6">
                  No categories found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Scrolling Discount Banner */}
      <div className="w-full bg-[#3b42c4] text-white overflow-hidden py-4 text-[13px] font-bold select-none border-t border-indigo-500/20 relative z-10">
        <style>{`
          @keyframes marquee-ltr {
            0% {
              transform: translateX(-50%);
            }
            100% {
              transform: translateX(0);
            }
          }
          .marquee-container {
            display: flex;
            width: max-content;
            animation: marquee-ltr 28s linear infinite;
          }
          .marquee-container:hover {
            animation-play-state: paused;
          }
          .marquee-item {
            display: flex;
            align-items: center;
            flex-shrink: 0;
            gap: 6rem;
            padding-right: 6rem;
            white-space: nowrap;
          }
        `}</style>
        <div className="marquee-container cursor-pointer">
          <div className="marquee-item">
            <span>⚡ TODAY'S AI MATCH PROMO: Use code <strong className="text-amber-300">AISHOP20</strong> for 20% off high-rated laptops & smartphones!</span>
            <span>🎁 FREE EXPRESS SHIPPING: Automatically applied on checkout for orders over $100!</span>
            <span>⭐ SHOPILOT DEALS: Chat with our AI Shopping Assistant to find secret discounts!</span>
          </div>
          <div className="marquee-item">
            <span>⚡ TODAY'S AI MATCH PROMO: Use code <strong className="text-amber-300">AISHOP20</strong> for 20% off high-rated laptops & smartphones!</span>
            <span>🎁 FREE EXPRESS SHIPPING: Automatically applied on checkout for orders over $100!</span>
            <span>⭐ SHOPILOT DEALS: Chat with our AI Shopping Assistant to find secret discounts!</span>
          </div>
        </div>
      </div>
    </header>
  );
}
