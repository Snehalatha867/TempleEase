import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Home, 
  ChevronDown, 
  QrCode, 
  User as UserIcon, 
  Menu, 
  X, 
  LogOut, 
  Settings,
  Compass,
  Clock,
  MapPin,
  Car,
  HeartPulse,
  PhoneCall,
  Sparkles,
  Info,
  Calendar,
  Heart,
  MessageSquare,
  Globe,
  Bell,
  Check
} from 'lucide-react';
import { SupportedLanguage } from '../../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenScanQr?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenScanQr }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { language, setLanguage, t, languagesList } = useLanguage();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [templesDropdownOpen, setTemplesDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const templesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (templesRef.current && !templesRef.current.contains(event.target as Node)) {
        setTemplesDropdownOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setServicesDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setTemplesDropdownOpen(false);
    setServicesDropdownOpen(false);
    setUserDropdownOpen(false);
    setLangDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isHome = location.pathname === '/';
  const currentLangObj = languagesList.find(l => l.code === language) || languagesList[0];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF7F2] border-b border-[#E8DEC8] shadow-xs">
      
      {/* Top Banner Mantra & Helpline matching reference mockup */}
      <div className="bg-[#6D1B13] text-[#F8E7D1] text-[11px] font-medium py-1.5 px-4 sm:px-6 lg:px-8 border-b border-[#8C2518] flex items-center justify-between">
        <div className="flex items-center gap-2 tracking-wide font-serif">
          <span>{t('topbar.mantra')}</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#F8E7D1]/90">
          <span className="hidden sm:inline font-mono">{t('topbar.helpline')}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3">
          
          {/* Logo with Sacred Gopuram & Om emblem */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group shrink-0"
          >
            <div className="w-11 h-11 rounded-lg bg-[#E07A28] border border-[#C25610] p-1 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 40 40" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 4L14 11H26L20 4Z" fill="#FFF2DF" stroke="#8C2518" strokeWidth="1.2" />
                <path d="M12 11L9 18H31L28 11H12Z" fill="#FED7AA" stroke="#8C2518" strokeWidth="1.2" />
                <path d="M8 18L5 26H35L32 18H8Z" fill="#FDBA74" stroke="#8C2518" strokeWidth="1.2" />
                <path d="M4 26V36H36V26H4Z" fill="#FFF2DF" stroke="#8C2518" strokeWidth="1.2" />
                <path d="M16 36V28C16 26.5 17.5 25 20 25C22.5 25 24 26.5 24 28V36H16Z" fill="#7B1D16" />
                <circle cx="20" cy="19" r="1.5" fill="#7B1D16" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold font-temple-heading tracking-tight text-[#6D1B13] group-hover:text-[#8C2518] transition-colors leading-none">
                Temple Ease
              </span>
              <span className="text-[11px] text-[#8C2518] italic font-serif tracking-wide mt-1">
                {t('brand.tagline')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-sm font-medium">
            {/* Home Pill Button */}
            <Link
              to="/"
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                isHome
                  ? 'bg-[#6D1B13] text-white shadow-xs'
                  : 'text-[#4A3E39] hover:bg-[#EFE7D8]'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{t('nav.home')}</span>
            </Link>

            {/* Explore Temples */}
            <Link
              to="/temples"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname.startsWith('/temples')
                  ? 'text-[#6D1B13] bg-[#EFE7D8]'
                  : 'text-[#4A3E39] hover:text-[#6D1B13] hover:bg-[#EFE7D8]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>{t('nav.explore')}</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => {
                  setServicesDropdownOpen(!servicesDropdownOpen);
                  setTemplesDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  ['/booking', '/calendar', '/planner', '/announcements', '/timings', '/map', '/parking', '/emergency', '/hospitals'].some(p => location.pathname.startsWith(p))
                    ? 'text-[#6D1B13] bg-[#EFE7D8]'
                    : 'text-[#4A3E39] hover:text-[#6D1B13] hover:bg-[#EFE7D8]'
                }`}
              >
                <span>{t('nav.services')}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {servicesDropdownOpen && (
                <div className="absolute left-0 mt-2 w-72 bg-white border border-[#E5DCCE] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 divide-y divide-stone-100">
                  <div className="p-2 space-y-1">
                    <Link
                      to="/booking"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F2] text-[#2A231F] hover:text-[#6D1B13] transition-colors"
                    >
                      <Sparkles className="w-4 h-4 text-[#E07A28] shrink-0" />
                      <div>
                        <p className="font-semibold">{t('services.poojaBooking')}</p>
                        <p className="text-[10px] text-stone-500">Book poojas, abhishekams & seva pass</p>
                      </div>
                    </Link>

                    <Link
                      to="/calendar"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F2] text-[#2A231F] hover:text-[#6D1B13] transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-[#E07A28] shrink-0" />
                      <div>
                        <p className="font-semibold">{t('services.calendar')}</p>
                        <p className="text-[10px] text-stone-500">Festivals, daily schedule & seva calendar</p>
                      </div>
                    </Link>

                    <Link
                      to="/planner"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F2] text-[#2A231F] hover:text-[#6D1B13] transition-colors"
                    >
                      <Compass className="w-4 h-4 text-[#E07A28] shrink-0" />
                      <div>
                        <p className="font-semibold">{t('services.planner')}</p>
                        <p className="text-[10px] text-stone-500">Personalized arrival & family visit schedule</p>
                      </div>
                    </Link>

                    <Link
                      to="/announcements"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#FAF7F2] text-[#2A231F] hover:text-[#6D1B13] transition-colors"
                    >
                      <Bell className="w-4 h-4 text-[#E07A28] shrink-0" />
                      <div>
                        <p className="font-semibold">{t('services.announcements')}</p>
                        <p className="text-[10px] text-stone-500">Timings changes & important pilgrim notices</p>
                      </div>
                    </Link>
                  </div>

                  <div className="p-2 space-y-1">
                    <Link
                      to="/timings"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:text-[#6D1B13]"
                    >
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t('services.timings')}</span>
                    </Link>
                    <Link
                      to="/map"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:text-[#6D1B13]"
                    >
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t('services.map')}</span>
                    </Link>
                    <Link
                      to="/parking"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:text-[#6D1B13]"
                    >
                      <Car className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t('services.parking')}</span>
                    </Link>
                    <Link
                      to="/emergency"
                      onClick={() => setServicesDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs text-stone-700 hover:text-[#6D1B13]"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-stone-400" />
                      <span>{t('services.emergency')}</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/about'
                  ? 'text-[#6D1B13] bg-[#EFE7D8]'
                  : 'text-[#4A3E39] hover:text-[#6D1B13] hover:bg-[#EFE7D8]'
              }`}
            >
              {t('nav.about')}
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                location.pathname === '/contact'
                  ? 'text-[#6D1B13] bg-[#EFE7D8]'
                  : 'text-[#4A3E39] hover:text-[#6D1B13] hover:bg-[#EFE7D8]'
              }`}
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            
            {/* Language Selector Dropdown (Feature 7) */}
            <div className="relative" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#E8DEC8] hover:border-[#C25610] bg-white text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                title="Change Platform Language"
              >
                <Globe className="w-3.5 h-3.5 text-[#C25610]" />
                <span className="hidden sm:inline font-medium">{currentLangObj.nativeName}</span>
                <span className="sm:hidden font-mono uppercase">{language}</span>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5DCCE] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100 flex items-center justify-between">
                    <span>{t('nav.selectLanguage')}</span>
                    <Globe className="w-3 h-3 text-stone-400" />
                  </div>
                  {languagesList.map(item => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-xs text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-amber-50 text-[#6D1B13] font-bold'
                            : 'text-stone-700 hover:bg-[#FAF7F2]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{item.flag}</span>
                          <span>{item.nativeName}</span>
                          <span className="text-[10px] text-stone-400">({item.label})</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C25610]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Scan QR Button */}
            <button
              onClick={() => {
                if (onOpenScanQr) onOpenScanQr();
                else navigate('/qr');
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#8C2518] text-[#8C2518] hover:bg-[#8C2518] hover:text-white transition-all text-xs font-semibold shadow-2xs group cursor-pointer"
              title="Scan Temple QR Code Placard"
            >
              <QrCode className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              <span>{t('nav.scanQr')}</span>
            </button>

            {/* User Account / Login Dropdown */}
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6D1B13] text-white hover:bg-[#8C2518] transition-all text-xs font-semibold shadow-xs"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>{t('nav.login')}</span>
              </Link>
            ) : (
              <div className="relative" ref={userRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#C25610]/40 bg-amber-50/50 hover:bg-amber-100/50 text-[#6D1B13] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <div className="w-6 h-6 rounded-full bg-[#6D1B13] text-white flex items-center justify-center text-[10px] font-bold">
                    {user?.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[90px] truncate hidden md:inline">{user?.name}</span>
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#E5DCCE] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-1 divide-y divide-stone-100">
                    <div className="px-4 py-2">
                      <p className="text-xs font-bold text-stone-800 truncate">{user?.name}</p>
                      <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-[#8C2518]">
                        {user?.role}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile?tab=bookings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#E07A28]" />
                        <span>{t('nav.myBookings')}</span>
                      </Link>
                      <Link
                        to="/favourites"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13]"
                      >
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t('nav.myFavourites')}</span>
                      </Link>
                      <Link
                        to="/profile?tab=plans"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13]"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#E07A28]" />
                        <span>{t('nav.myPlans')}</span>
                      </Link>
                      <Link
                        to="/feedback"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13]"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t('nav.feedback')}</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13]"
                      >
                        <Settings className="w-3.5 h-3.5 text-stone-400" />
                        <span>{t('nav.profile')}</span>
                      </Link>
                    </div>

                    {isAdmin && (
                      <div className="py-1">
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs text-stone-700 hover:bg-[#FAF7F2] hover:text-[#6D1B13] font-semibold"
                        >
                          <Settings className="w-3.5 h-3.5 text-[#6D1B13]" />
                          <span>{t('nav.adminPortal')}</span>
                        </Link>
                      </div>
                    )}

                    <div className="py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('nav.logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-[#EFE7D8] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-[#E8DEC8] px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 shadow-lg">
          
          {/* Mobile Language Selector */}
          <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#C25610]" />
              {t('nav.selectLanguage')}:
            </span>
            <div className="flex gap-1">
              {languagesList.map(item => (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`px-2 py-1 rounded text-[11px] font-bold ${
                    language === item.code ? 'bg-[#6D1B13] text-white' : 'bg-white text-stone-700 border border-stone-200'
                  }`}
                >
                  {item.nativeName}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col space-y-1">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2 text-[#6D1B13]"
            >
              <Home className="w-4 h-4 text-[#6D1B13]" />
              <span>{t('nav.home')}</span>
            </Link>

            <Link
              to="/temples"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E07A28]" />
              <span>{t('nav.explore')}</span>
            </Link>

            <Link
              to="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2 text-[#6D1B13]"
            >
              <Sparkles className="w-4 h-4 text-[#E07A28]" />
              <span>{t('services.poojaBooking')}</span>
            </Link>

            <Link
              to="/calendar"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-[#E07A28]" />
              <span>{t('services.calendar')}</span>
            </Link>

            <Link
              to="/planner"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#E07A28]" />
              <span>{t('services.planner')}</span>
            </Link>

            <Link
              to="/announcements"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Bell className="w-4 h-4 text-[#E07A28]" />
              <span>{t('services.announcements')}</span>
            </Link>

            <Link
              to="/favourites"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Heart className="w-4 h-4 text-rose-500" />
              <span>{t('nav.myFavourites')}</span>
            </Link>

            <Link
              to="/feedback"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>{t('nav.feedback')}</span>
            </Link>

            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-[#E07A28]" />
              <span>{t('nav.about')}</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#EFE7D8] flex items-center gap-2"
            >
              <span>{t('nav.contact')}</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-[#E8DEC8] flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenScanQr) onOpenScanQr();
                else navigate('/qr');
              }}
              className="w-full text-center py-2.5 text-xs font-semibold text-[#6D1B13] border border-[#6D1B13] rounded-full flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              <span>{t('nav.scanQr')}</span>
            </button>
            {!isAuthenticated ? (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-white bg-[#6D1B13] rounded-full shadow-xs"
              >
                {t('nav.login')} / {t('nav.register')}
              </Link>
            ) : (
              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 text-xs font-semibold text-[#6D1B13] bg-[#EFE7D8] rounded-full"
              >
                {t('nav.profile')} & {t('nav.myBookings')}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-xs font-semibold text-white bg-[#1B2430] rounded-lg mt-1"
              >
                {t('nav.adminPortal')}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
