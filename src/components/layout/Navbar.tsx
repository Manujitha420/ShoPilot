'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Bell, ShoppingCart, LogOut, User, Settings } from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

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
    { href: '/#categories', label: 'Categories' },
  ];

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If we're on the home page, intercept and scroll smoothly
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('categories');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="w-full px-6 sm:px-10 lg:px-16">
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
              const isCategoriesLink = link.href === '/#categories';

              // Define active states
              let isActive = false;
              if (isCategoriesLink) {
                isActive = false; // Categories is scroll-based anchor
              } else if (link.href === '/') {
                isActive = pathname === '/';
              } else {
                isActive = pathname?.startsWith(link.href);
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={isCategoriesLink ? handleCategoryClick : undefined}
                  className={`text-sm font-semibold text-[16px] tracking-wide py-1.5 px-1 relative transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-left after:scale-x-0 after:bg-[#3b42c4] after:transition-transform after:duration-300 hover:after:scale-x-100 ${isActive
                    ? 'text-[#3b42c4]'
                    : 'text-slate-500 hover:text-[#3b42c4]'
                    }`}
                >
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User controls (Notification, Cart, Avatar) */}
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

      {/* Scrolling Discount Banner */}
      <div className="w-full bg-[#3b42c4] text-white overflow-hidden py-4 text-[13px] font-bold select-none border-t border-indigo-500/20 relative z-50">
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
