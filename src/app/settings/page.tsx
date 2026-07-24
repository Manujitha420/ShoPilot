'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { 
  User, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  Bell, 
  Sparkles, 
  Sliders, 
  Eye, 
  Lock, 
  Heart, 
  Accessibility, 
  Truck, 
  Globe, 
  Share2, 
  HelpCircle, 
  Info, 
  LogOut,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Shield,
  Volume2
} from 'lucide-react';

type TabType = 
  | 'profile' 
  | 'addresses' 
  | 'payments' 
  | 'orders' 
  | 'notifications' 
  | 'ai' 
  | 'shopping' 
  | 'appearance' 
  | 'privacy' 
  | 'wishlist' 
  | 'accessibility' 
  | 'delivery' 
  | 'language' 
  | 'connected' 
  | 'help' 
  | 'about';

export default function SettingsPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  
  // Protect route: Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/settings');
    }
  }, [isAuthenticated, isLoading, router]);

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile fields state
  const [fullName, setFullName] = useState('Emily Johnson');
  const [username, setUsername] = useState('emily_j');
  const [email, setEmail] = useState('emily@example.com');
  const [phone, setPhone] = useState('(555) 123-4567');
  const [dob, setDob] = useState('1995-06-15');
  const [gender, setGender] = useState('female');

  // Address list mock state
  const [addresses, setAddresses] = useState([
    { id: 1, type: 'Home', address: '123 Market St, Apt 4B, San Francisco, CA 94103', isDefault: true },
    { id: 2, type: 'Office', address: '500 Howard St, Suite 100, San Francisco, CA 94105', isDefault: false }
  ]);
  const [newAddrType, setNewAddrType] = useState('Home');
  const [newAddrText, setNewAddrText] = useState('');

  // Payment methods mock state
  const [cards, setCards] = useState([
    { id: 1, brand: 'Visa', last4: '4242', exp: '12/28', isDefault: true },
    { id: 2, brand: 'Mastercard', last4: '8890', exp: '08/27', isDefault: false }
  ]);
  const [newCardNumber, setNewCardNumber] = useState('');
  const [newCardBrand, setNewCardBrand] = useState('Visa');

  // Notification toggles
  const [notifOrder, setNotifOrder] = useState(true);
  const [notifDelivery, setNotifDelivery] = useState(true);
  const [notifPromos, setNotifPromos] = useState(false);
  const [notifFlashSales, setNotifFlashSales] = useState(true);
  const [notifPriceDrops, setNotifPriceDrops] = useState(true);
  const [notifAiRecs, setNotifAiRecs] = useState(true);
  const [notifAlerts, setNotifAlerts] = useState(false);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSms, setNotifSms] = useState(false);
  const [notifPush, setNotifPush] = useState(true);

  // AI Preferences toggles
  const [aiAssistantEnabled, setAiAssistantEnabled] = useState(true);
  const [aiRecsEnabled, setAiRecsEnabled] = useState(true);
  const [aiSearchEnabled, setAiSearchEnabled] = useState(true);
  const [aiStyleEnabled, setAiStyleEnabled] = useState(true);
  const [aiSummariesEnabled, setAiSummariesEnabled] = useState(true);
  const [aiVoiceEnabled, setAiVoiceEnabled] = useState(false);
  const [aiFreq, setAiFreq] = useState<'minimal' | 'balanced' | 'frequent'>('balanced');

  // Shopping preferences
  const [prefCategory, setPrefCategory] = useState('Electronics');
  const [prefBrand, setPrefBrand] = useState('Aura');
  const [prefColor, setPrefColor] = useState('Black');
  const [prefSize, setPrefSize] = useState('Medium');
  const [prefBudget, setPrefBudget] = useState('150');
  const [prefCurrency, setPrefCurrency] = useState('USD ($)');

  // Appearance settings
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>('light');
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [compactMode, setCompactMode] = useState(false);
  const [largeProductCards, setLargeProductCards] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // Security Toggles
  const [enable2Fa, setEnable2Fa] = useState(false);
  const [enableBiometrics, setEnableBiometrics] = useState(false);

  // Wishlist Settings
  const [wishlistPrivate, setWishlistPrivate] = useState(true);
  const [wishlistNotifs, setWishlistNotifs] = useState(true);

  // Accessibility Toggles
  const [highContrast, setHighContrast] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [voiceCommands, setVoiceCommands] = useState(false);

  // Delivery preferences
  const [deliverySpeed, setDeliverySpeed] = useState<'standard' | 'express' | 'same_day'>('standard');
  const [deliverySafeLoc, setDeliverySafeLoc] = useState('Front porch');
  const [deliveryWeekend, setDeliveryWeekend] = useState(true);

  // Region settings
  const [regionLanguage, setRegionLanguage] = useState('English');
  const [regionCountry, setRegionCountry] = useState('United States');
  const [regionTimezone, setRegionTimezone] = useState('GMT-8 (PST)');

  // Connected accounts
  const [googleConnected, setGoogleConnected] = useState(true);
  const [appleConnected, setAppleConnected] = useState(false);
  const [fbConnected, setFbConnected] = useState(false);

  // Prepopulate if logged in
  useEffect(() => {
    if (user) {
      setFullName(`${user.firstName} ${user.lastName}`);
      setUsername(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrText.trim()) return;
    const newId = addresses.length > 0 ? Math.max(...addresses.map(a => a.id)) + 1 : 1;
    setAddresses([
      ...addresses,
      { id: newId, type: newAddrType, address: newAddrText, isDefault: false }
    ]);
    setNewAddrText('');
    triggerToast(`Added new ${newAddrType} address successfully.`);
  };

  const handleDeleteAddress = (id: number) => {
    setAddresses(addresses.filter(a => a.id !== id));
    triggerToast('Removed address.');
  };

  const handleSetDefaultAddress = (id: number) => {
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === id })));
    triggerToast('Updated default shipping address.');
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCardNumber.trim() || newCardNumber.length < 4) return;
    const last4 = newCardNumber.slice(-4);
    const newId = cards.length > 0 ? Math.max(...cards.map(c => c.id)) + 1 : 1;
    setCards([
      ...cards,
      { id: newId, brand: newCardBrand, last4, exp: '12/29', isDefault: false }
    ]);
    setNewCardNumber('');
    triggerToast(`Linked new ${newCardBrand} card.`);
  };

  const handleRemoveCard = (id: number) => {
    setCards(cards.filter(c => c.id !== id));
    triggerToast('Removed payment method.');
  };

  const handleSignOut = () => {
    logout();
    triggerToast('Logged out successfully.');
    router.push('/login');
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile Settings', icon: <User className="w-4 h-4" /> },
    { id: 'addresses', label: 'Address Book', icon: <MapPin className="w-4 h-4" /> },
    { id: 'payments', label: 'Payment Options', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders & Refunds', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notification Settings', icon: <Bell className="w-4 h-4" /> },
    { id: 'ai', label: 'shoPilot AI Preferences', icon: <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" /> },
    { id: 'shopping', label: 'Shopping Prefs', icon: <Sliders className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance & Style', icon: <Eye className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy & Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'wishlist', label: 'Wishlist Rules', icon: <Heart className="w-4 h-4" /> },
    { id: 'accessibility', label: 'Accessibility', icon: <Accessibility className="w-4 h-4" /> },
    { id: 'delivery', label: 'Delivery Preferences', icon: <Truck className="w-4 h-4" /> },
    { id: 'language', label: 'Language & Region', icon: <Globe className="w-4 h-4" /> },
    { id: 'connected', label: 'Linked Accounts', icon: <Share2 className="w-4 h-4" /> },
    { id: 'help', label: 'Help & FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'about', label: 'About App', icon: <Info className="w-4 h-4" /> }
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3b42c4]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 relative">
      <Navbar />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-slate-850 text-white font-bold text-xs px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Account & App Settings</h1>
          <p className="text-xs text-slate-400 font-semibold mt-1">Configure profile details, payment methods, notifications, and AI engines</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Tabs (3 cols) */}
          <div className="lg:col-span-3 bg-white border border-slate-200/80 rounded-[28px] p-4 shadow-xs space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold rounded-2xl transition-all cursor-pointer ${
                  activeTab === tab.id 
                    ? 'bg-indigo-50 text-[#3b42c4]' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                <span className="flex-1">{tab.label}</span>
                <ChevronRight className={`w-3.5 h-3.5 opacity-40 transition-transform ${activeTab === tab.id ? 'translate-x-0.5' : ''}`} />
              </button>
            ))}

            {/* Logout CTA */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-2xl transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Active Tab Main Panel (9 cols) */}
          <div className="lg:col-span-9 bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-xs min-h-[600px] flex flex-col justify-between">
            
            <div className="space-y-6">
              
              {/* Profile Panel */}
              {activeTab === 'profile' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Profile Information</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your personal credentials and identifiers</p>
                  </div>

                  {/* Profile Pic Card */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                    <img 
                      src={user?.image || "https://dummyjson.com/icon/emilys/128"} 
                      alt="Avatar" 
                      className="w-14 h-14 rounded-full border border-slate-200 object-cover bg-white"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">Profile Picture</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Change your avatar by uploading a file</p>
                      <button 
                        type="button" 
                        onClick={() => triggerToast('Select local file to upload avatar...')} 
                        className="text-[10px] font-black text-indigo-650 mt-1 hover:text-indigo-850 cursor-pointer block"
                      >
                        Upload Photo
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Username</label>
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Phone Number</label>
                      <input 
                        type="text" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Date of Birth (Optional)</label>
                      <input 
                        type="date" 
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Gender (Optional)</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs font-medium focus:ring-1 focus:ring-indigo-500 focus:outline-hidden bg-white"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                    <button 
                      type="button" 
                      onClick={() => triggerToast('Change password request sent to email.')}
                      className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
                    >
                      Change Password
                    </button>
                    <button 
                      type="button" 
                      onClick={() => {
                        if (confirm('Are you absolutely sure you want to permanently delete your ShoPilot account? This cannot be undone.')) {
                          triggerToast('Account deletion request queued.');
                        }
                      }}
                      className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-600 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses Panel */}
              {activeTab === 'addresses' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Saved Addresses</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your delivery locations</p>
                  </div>

                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <div key={addr.id} className="flex items-start justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50/50 gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-black uppercase text-indigo-650 tracking-wider bg-indigo-50 px-2 py-0.5 rounded-md">
                            {addr.type} Address {addr.isDefault && '• DEFAULT'}
                          </span>
                          <p className="text-xs font-semibold text-slate-700 leading-normal">{addr.address}</p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          {!addr.isDefault && (
                            <button 
                              onClick={() => handleSetDefaultAddress(addr.id)}
                              className="text-[10px] font-extrabold text-slate-500 hover:text-slate-700 cursor-pointer"
                            >
                              Set Default
                            </button>
                          )}
                          <button 
                            onClick={() => handleDeleteAddress(addr.id)}
                            className="text-[10px] font-extrabold text-rose-500 hover:text-rose-700 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add address form */}
                  <form onSubmit={handleAddAddress} className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-black text-slate-800">Add New Address</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <div className="sm:col-span-1">
                        <select 
                          value={newAddrType}
                          onChange={(e) => setNewAddrType(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                        >
                          <option>Home</option>
                          <option>Office</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div className="sm:col-span-3 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Enter complete street coordinates, city, zip code..."
                          value={newAddrText}
                          onChange={(e) => setNewAddrText(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Payments Panel */}
              {activeTab === 'payments' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Payment Methods</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage your linked credit cards and digital wallets</p>
                  </div>

                  <div className="space-y-3">
                    {cards.map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-slate-400" />
                          <div className="text-xs">
                            <p className="font-extrabold text-slate-800">{card.brand} •••• {card.last4}</p>
                            <p className="text-slate-400 font-semibold mt-0.5">Expires: {card.exp} {card.isDefault && '• DEFAULT'}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveCard(card.id)}
                          className="text-xs font-extrabold text-rose-500 hover:text-rose-700 cursor-pointer"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Card Form */}
                  <form onSubmit={handleAddCard} className="pt-4 border-t border-slate-100 space-y-3">
                    <h3 className="text-xs font-black text-slate-800">Add New Payment Method</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <select 
                        value={newCardBrand}
                        onChange={(e) => setNewCardBrand(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold bg-white"
                      >
                        <option>Visa</option>
                        <option>Mastercard</option>
                        <option>American Express</option>
                      </select>
                      <div className="sm:col-span-2 flex gap-2">
                        <input 
                          type="text" 
                          maxLength={16}
                          placeholder="Card number (16 digits)..."
                          value={newCardNumber}
                          onChange={(e) => setNewCardNumber(e.target.value)}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold"
                        />
                        <button 
                          type="submit"
                          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Panel */}
              {activeTab === 'orders' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Orders & Purchases</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Quick access to order logs and invoices</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => triggerToast('Navigating to Order History details...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Order History</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">View details of all your past transactions.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Navigating to Active Orders tracking...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Active Orders</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Track live shipments and delivery estimates.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Redirecting to Return dashboard...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Returns & Exchanges</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Initiate or view return status logs.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Generating invoices list for download...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Invoices & Receipts</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Download receipts and tax slips in PDF.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* Notifications Panel */}
              {activeTab === 'notifications' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Notification Preferences</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Control how and when we send you updates</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-[10px] text-slate-400">Activity Rules</h3>
                    <div className="space-y-2.5">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Order updates & receipts</span>
                        <input type="checkbox" checked={notifOrder} onChange={() => setNotifOrder(!notifOrder)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Delivery & Courier status alerts</span>
                        <input type="checkbox" checked={notifDelivery} onChange={() => setNotifDelivery(!notifDelivery)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Promotional codes & holiday vouchers</span>
                        <input type="checkbox" checked={notifPromos} onChange={() => setNotifPromos(!notifPromos)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Flash Sales & Limited Deals</span>
                        <input type="checkbox" checked={notifFlashSales} onChange={() => setNotifFlashSales(!notifFlashSales)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Wishlist items price drop notices</span>
                        <input type="checkbox" checked={notifPriceDrops} onChange={() => setNotifPriceDrops(!notifPriceDrops)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>AI Smart Recommendations alerts</span>
                        <input type="checkbox" checked={notifAiRecs} onChange={() => setNotifAiRecs(!notifAiRecs)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                    </div>

                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-[10px] text-slate-400 pt-4 border-t border-slate-100">Channels</h3>
                    <div className="space-y-2.5">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Email Notifications</span>
                        <input type="checkbox" checked={notifEmail} onChange={() => setNotifEmail(!notifEmail)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>SMS / Text Messages</span>
                        <input type="checkbox" checked={notifSms} onChange={() => setNotifSms(!notifSms)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>In-app Push Notifications</span>
                        <input type="checkbox" checked={notifPush} onChange={() => setNotifPush(!notifPush)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* AI Preferences Panel */}
              {activeTab === 'ai' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
                      AI Preferences & Engines
                    </h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Control how the shoPilot AI assistant matches parameters</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Enable shoPilot AI Assistant widget</span>
                        <input type="checkbox" checked={aiAssistantEnabled} onChange={() => setAiAssistantEnabled(!aiAssistantEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Personalized Recommendations feed</span>
                        <input type="checkbox" checked={aiRecsEnabled} onChange={() => setAiRecsEnabled(!aiRecsEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Smart semantic search suggestions</span>
                        <input type="checkbox" checked={aiSearchEnabled} onChange={() => setAiSearchEnabled(!aiSearchEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>AI Style & Match Advice</span>
                        <input type="checkbox" checked={aiStyleEnabled} onChange={() => setAiStyleEnabled(!aiStyleEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>AI Product Reviews Summaries</span>
                        <input type="checkbox" checked={aiSummariesEnabled} onChange={() => setAiSummariesEnabled(!aiSummariesEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Voice Shopping search assistance</span>
                        <input type="checkbox" checked={aiVoiceEnabled} onChange={() => setAiVoiceEnabled(!aiVoiceEnabled)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                    </div>

                    <div className="space-y-1.5 pt-4 border-t border-slate-100">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Recommendation Frequency</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['minimal', 'balanced', 'frequent'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setAiFreq(mode)}
                            className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer capitalize ${
                              aiFreq === mode 
                                ? 'bg-indigo-50 border-[#3b42c4] text-[#3b42c4]' 
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4">
                      <button 
                        type="button" 
                        onClick={() => triggerToast('AI Conversation history cleared.')}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
                      >
                        Clear AI Chat History
                      </button>
                      <button 
                        type="button" 
                        onClick={() => triggerToast('AI Chat transcript exported as JSON.')}
                        className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
                      >
                        Export Conversation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Shopping Preferences Panel */}
              {activeTab === 'shopping' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Shopping Preferences</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Customize your general e-commerce filter values</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preferred Category</label>
                      <select value={prefCategory} onChange={(e) => setPrefCategory(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option>Electronics</option>
                        <option>Computing</option>
                        <option>Kitchen & Home</option>
                        <option>Apparel</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Favorite Brand</label>
                      <input type="text" value={prefBrand} onChange={(e) => setPrefBrand(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Favorite Color</label>
                      <input type="text" value={prefColor} onChange={(e) => setPrefColor(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preferred Size</label>
                      <input type="text" value={prefSize} onChange={(e) => setPrefSize(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Target Budget Range ($)</label>
                      <input type="number" value={prefBudget} onChange={(e) => setPrefBudget(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Currency</label>
                      <select value={prefCurrency} onChange={(e) => setPrefCurrency(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option>USD ($)</option>
                        <option>CAD (C$)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Appearance Panel */}
              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Appearance Settings</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Customize the visual styling of the catalog board</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Theme Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['light', 'dark', 'system'] as const).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => setThemeMode(mode)}
                            className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer capitalize ${
                              themeMode === mode 
                                ? 'bg-indigo-50 border-[#3b42c4] text-[#3b42c4]' 
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {mode} Mode
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Font Size Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['small', 'medium', 'large'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => setFontSize(sz)}
                            className={`py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer capitalize ${
                              fontSize === sz 
                                ? 'bg-indigo-50 border-[#3b42c4] text-[#3b42c4]' 
                                : 'bg-slate-50 border-slate-200 text-slate-500'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-100">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Compact Mode Layout</span>
                        <input type="checkbox" checked={compactMode} onChange={() => setCompactMode(!compactMode)} className="rounded border-slate-300 text-indigo-655 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Large Product Catalog Cards</span>
                        <input type="checkbox" checked={largeProductCards} onChange={() => setLargeProductCards(!largeProductCards)} className="rounded border-slate-300 text-indigo-655 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Interactive transitions & Animations</span>
                        <input type="checkbox" checked={animationsEnabled} onChange={() => setAnimationsEnabled(!animationsEnabled)} className="rounded border-slate-300 text-indigo-655 focus:ring-indigo-500" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Panel */}
              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Privacy & Security</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Control credentials, active logins, and AI storage data</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-[10px] text-slate-400">Security Options</h3>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Two-Factor Authentication (2FA)</span>
                        <input type="checkbox" checked={enable2Fa} onChange={() => setEnable2Fa(!enable2Fa)} className="rounded border-slate-300 text-indigo-655 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Biometric Login (Face ID / Fingerprint)</span>
                        <input type="checkbox" checked={enableBiometrics} onChange={() => setEnableBiometrics(!enableBiometrics)} className="rounded border-slate-300 text-indigo-655 focus:ring-indigo-500" />
                      </label>
                    </div>

                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider text-[10px] text-slate-400 pt-4 border-t border-slate-100">AI Privacy & Data</h3>
                    <div className="pt-2 flex flex-wrap gap-4">
                      <button type="button" onClick={() => triggerToast('AI personalization data downloaded.')} className="px-4 py-2 border border-slate-200 text-slate-750 text-xs font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer">Download AI Data</button>
                      <button type="button" onClick={() => triggerToast('Search history logs successfully deleted.')} className="px-4 py-2 border border-slate-200 text-slate-755 text-xs font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer">Delete Search History</button>
                      <button type="button" onClick={() => triggerToast('Recommendation weights cleared.')} className="px-4 py-2 border border-slate-200 text-slate-755 text-xs font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer">Clear Recommendations Logs</button>
                      <button type="button" onClick={() => triggerToast('Recently viewed items storage cleared.')} className="px-4 py-2 border border-slate-200 text-slate-755 text-xs font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer">Clear Recently Viewed</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Wishlist Panel */}
              {activeTab === 'wishlist' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Wishlist & Sharing Rules</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Control access rights to your favorite catalog items</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Keep Wishlists Private (Only visible to me)</span>
                        <input type="checkbox" checked={wishlistPrivate} onChange={() => setWishlistPrivate(!wishlistPrivate)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Allow Wishlist sharing via public link</span>
                        <input type="checkbox" checked={!wishlistPrivate} onChange={() => setWishlistPrivate(!wishlistPrivate)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                      <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                        <span>Send updates when wishlist items go on discount</span>
                        <input type="checkbox" checked={wishlistNotifs} onChange={() => setWishlistNotifs(!wishlistNotifs)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Accessibility Panel */}
              {activeTab === 'accessibility' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Accessibility Features</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Configure screen and interactive offsets</p>
                  </div>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>High Contrast Visual Board</span>
                      <input type="checkbox" checked={highContrast} onChange={() => setHighContrast(!highContrast)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>Enable Larger Text scaling</span>
                      <input type="checkbox" checked={largerText} onChange={() => setLargerText(!largerText)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>Optimize layout for Screen Reader tools</span>
                      <input type="checkbox" checked={screenReader} onChange={() => setScreenReader(!screenReader)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>Reduced Motion (disable scrolling parallax)</span>
                      <input type="checkbox" checked={reducedMotion} onChange={() => setReducedMotion(!reducedMotion)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>Voice Commands assistance</span>
                      <input type="checkbox" checked={voiceCommands} onChange={() => setVoiceCommands(!voiceCommands)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                  </div>
                </div>
              )}

              {/* Delivery Panel */}
              {activeTab === 'delivery' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Delivery Preferences</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Define your defaults for physical shipments</p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Preferred Delivery Speed</label>
                      <select value={deliverySpeed} onChange={(e: any) => setDeliverySpeed(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option value="standard">Standard Delivery (3-5 days)</option>
                        <option value="express">Express Delivery (1-2 days)</option>
                        <option value="same_day">Same Day Delivery</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Safe Delivery Drop Location</label>
                      <input type="text" value={deliverySafeLoc} onChange={(e) => setDeliverySafeLoc(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium" />
                    </div>

                    <label className="flex items-center justify-between text-xs font-bold text-slate-700 cursor-pointer">
                      <span>Allow weekend deliveries</span>
                      <input type="checkbox" checked={deliveryWeekend} onChange={() => setDeliveryWeekend(!deliveryWeekend)} className="rounded border-slate-300 text-indigo-650 focus:ring-indigo-500" />
                    </label>
                  </div>
                </div>
              )}

              {/* Language & Region */}
              {activeTab === 'language' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Language & Region</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Customize geographical metrics and text settings</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Language</label>
                      <select value={regionLanguage} onChange={(e) => setRegionLanguage(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option>English</option>
                        <option>French</option>
                        <option>Spanish</option>
                        <option>German</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Country</label>
                      <select value={regionCountry} onChange={(e) => setRegionCountry(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option>United States</option>
                        <option>Canada</option>
                        <option>United Kingdom</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Time Zone</label>
                      <select value={regionTimezone} onChange={(e) => setRegionTimezone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-medium bg-white">
                        <option>GMT-8 (PST)</option>
                        <option>GMT-5 (EST)</option>
                        <option>GMT+0 (UTC)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Connected Accounts */}
              {activeTab === 'connected' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Linked Accounts</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage OAuth credentials linked with your profile</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-800">Link with Google</span>
                      <button 
                        onClick={() => setGoogleConnected(!googleConnected)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          googleConnected ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                        }`}
                      >
                        {googleConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-800">Link with Apple</span>
                      <button 
                        onClick={() => setAppleConnected(!appleConnected)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          appleConnected ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                        }`}
                      >
                        {appleConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl bg-slate-50/50">
                      <span className="text-xs font-bold text-slate-800">Link with Facebook</span>
                      <button 
                        onClick={() => setFbConnected(!fbConnected)}
                        className={`px-4 py-2 text-xs font-extrabold rounded-xl border transition-all cursor-pointer ${
                          fbConnected ? 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700' : 'bg-slate-900 hover:bg-slate-800 text-white border-transparent'
                        }`}
                      >
                        {fbConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Help & Support */}
              {activeTab === 'help' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">Help & Support Desk</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Get quick access to support options and guides</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => triggerToast('Redirecting to FAQ center...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Frequently Asked Questions (FAQ)</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Find quick answers for delivery rules, refund windows, and invoice templates.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Starting Live Support conversation...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Live Chat Assistant</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Start an instant session with our support team.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Redirecting to bug report screen...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Report a Problem</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Submit bug details or visual errors directly to developers.</p>
                    </button>

                    <button 
                      onClick={() => triggerToast('Opening feedback form...')}
                      className="p-5 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors text-left space-y-1 cursor-pointer bg-slate-50/50"
                    >
                      <h4 className="text-xs font-black text-slate-800">Send App Feedback</h4>
                      <p className="text-[10px] text-slate-400 leading-normal">Share your ideas for new shoPilot features or design edits.</p>
                    </button>
                  </div>
                </div>
              )}

              {/* About Panel */}
              {activeTab === 'about' && (
                <div className="space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="text-base sm:text-lg font-black text-slate-900">About shoPilot</h2>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Software version logs and licenses</p>
                  </div>

                  <div className="space-y-3.5 text-xs text-slate-650 leading-relaxed font-semibold">
                    <p>🤖 **App Version**: `v1.2.5 (Stable Build)`</p>
                    <p>⚖ **Policies**: Explore our [Terms & Conditions](#) and [Privacy Policy](#) docs.</p>
                    <p>📦 **Open Source Libraries**: Rendered using Next.js, Lucide Icons, and Llama 3.3 models via NVIDIA NIM APIs.</p>
                    <button 
                      type="button" 
                      onClick={() => triggerToast('Opening app store to rate ShoPilot...')}
                      className="text-xs font-black text-indigo-650 hover:text-indigo-850 cursor-pointer pt-2 block"
                    >
                      Rate shoPilot App ⭐
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Save Button Panel at bottom of tabs */}
            <div className="pt-6 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => triggerToast('Changes saved successfully.')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Save Settings
              </button>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
