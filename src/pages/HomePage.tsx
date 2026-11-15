import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Clock, 
  Car, 
  HeartPulse, 
  PhoneCall, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck, 
  Compass, 
  Bell, 
  QrCode,
  Calendar as CalendarIcon,
  Heart,
  MessageSquare,
  HelpCircle,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { Temple, Announcement, CalendarEvent } from '../types';
import { useLanguage } from '../context/LanguageContext';
import heroCoverImage from '../assets/images/temple_cover_banner_1794416210779.jpg';
import { getTempleImageUrl, handleImageError } from '../utils/imageUtils';

interface HomePageProps {
  onOpenSearch: () => void;
  onOpenScanQr?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenSearch, onOpenScanQr }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedDeity, setSelectedDeity] = useState('All');
  const [popularTemples, setPopularTemples] = useState<Temple[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [metadata, setMetadata] = useState<{ states: string[]; deities: string[]; totalTemples: number }>({
    states: [],
    deities: [],
    totalTemples: 40
  });

  // Calendar widget active date state (Default to 15 November 2026 as in mockup)
  const [activeDateIndex, setActiveDateIndex] = useState<number>(1); // Index of 15 Nov

  // 7 Dates for calendar mini-strip (Nov 14 to Nov 20, 2026)
  const miniDates = [
    { dayName: 'Sun', dateNum: 14, dateStr: '2026-11-14' },
    { dayName: 'Mon', dateNum: 15, dateStr: '2026-11-15' },
    { dayName: 'Tue', dateNum: 16, dateStr: '2026-11-16' },
    { dayName: 'Wed', dateNum: 17, dateStr: '2026-11-17' },
    { dayName: 'Thu', dateNum: 18, dateStr: '2026-11-18' },
    { dayName: 'Fri', dateNum: 19, dateStr: '2026-11-19' },
    { dayName: 'Sat', dateNum: 20, dateStr: '2026-11-20' }
  ];

  useEffect(() => {
    // Fetch popular temples
    api.getTemples({ popular: true, limit: 5 })
      .then(res => {
        if (res.data) setPopularTemples(res.data);
      })
      .catch(() => {});

    // Fetch directory metadata (states, deities)
    api.getMetadata()
      .then(res => {
        if (res.data) setMetadata(res.data);
      })
      .catch(() => {});

    // Fetch announcements
    api.getAnnouncements()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setAnnouncements(res.data.slice(0, 3));
        }
      })
      .catch(() => {});

    // Fetch calendar events
    api.getCalendarEvents()
      .then(res => {
        if (res.data) setCalendarEvents(res.data);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParts: string[] = [];
    if (searchTerm.trim()) queryParts.push(`q=${encodeURIComponent(searchTerm.trim())}`);
    if (selectedState !== 'All') queryParts.push(`state=${encodeURIComponent(selectedState)}`);
    if (selectedDeity !== 'All') queryParts.push(`deity=${encodeURIComponent(selectedDeity)}`);
    const qs = queryParts.length ? `?${queryParts.join('&')}` : '';
    navigate(`/temples${qs}`);
  };

  // 7 Quick Action Cards matching reference mockup
  const quickActions = [
    {
      title: t('action.templeInfo'),
      subtitle: t('action.templeInfoSub'),
      icon: BookOpen,
      path: '/temples'
    },
    {
      title: t('action.timings'),
      subtitle: t('action.timingsSub'),
      icon: Clock,
      path: '/timings'
    },
    {
      title: t('action.booking'),
      subtitle: t('action.bookingSub'),
      icon: CalendarIcon,
      path: '/booking',
      highlight: true
    },
    {
      title: t('action.map'),
      subtitle: t('action.mapSub'),
      icon: MapPin,
      path: '/map'
    },
    {
      title: t('action.parking'),
      subtitle: t('action.parkingSub'),
      icon: Car,
      path: '/parking'
    },
    {
      title: t('action.hospitals'),
      subtitle: t('action.hospitalsSub'),
      icon: HeartPulse,
      path: '/hospitals'
    },
    {
      title: t('action.emergency'),
      subtitle: t('action.emergencySub'),
      icon: PhoneCall,
      path: '/emergency'
    }
  ];

  // Active selected day event in calendar widget
  const activeDateObj = miniDates[activeDateIndex];
  const activeDayEvents = calendarEvents.filter(ev => ev.date === activeDateObj.dateStr);
  const activeEvent = activeDayEvents[0] || {
    title: 'Special Seva & Sahasra Deepalankarana',
    time: '6:00 AM – 8:00 AM',
    templeName: 'Sri Venkateswara Temple'
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* ================= HERO PANORAMIC BANNER ================= */}
      <section className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[500px] flex items-center justify-center overflow-hidden border-b border-[#E8DEC8]">
        {/* Real Temple Backdrop */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroCoverImage}
            alt="Sri Venkateswara Swamy Temple Panoramic Cover"
            className="w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.06]"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/images/temple_cover_banner.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
          <div className="absolute inset-0 bg-[#3F110C]/20 mix-blend-multiply" />
        </div>

        {/* Decorative Script Banner on Right matching reference */}
        <div className="hidden lg:block absolute right-8 top-12 z-10 text-right pointer-events-none">
          <span className="font-serif italic text-amber-200/90 text-2xl tracking-wide drop-shadow-md">
            {t('brand.submotto')}
          </span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 text-center space-y-5">
          
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold font-temple-heading text-white tracking-tight drop-shadow-lg">
              {t('brand.name')}
            </h1>
            
            <div className="flex items-center justify-center gap-3">
              <span className="w-12 h-px bg-amber-300/60" />
              <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-amber-300 drop-shadow-md font-medium tracking-wide">
                {t('brand.tagline')}
              </p>
              <span className="w-12 h-px bg-amber-300/60" />
            </div>

            <div className="text-amber-300 text-lg drop-shadow-sm font-serif">
              ॐ
            </div>

            <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base text-amber-100/90 leading-relaxed drop-shadow-sm font-medium">
              {t('brand.heroSubtitle')}
            </p>
          </div>

          {/* Unified Search Filter Box matching reference */}
          <form 
            onSubmit={handleSearchSubmit}
            className="max-w-4xl mx-auto bg-white/95 backdrop-blur-md p-2.5 sm:p-3 rounded-full shadow-2xl border border-white/60 flex flex-col md:flex-row items-center gap-2"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-4 w-full">
              <Search className="w-4 h-4 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder={t('search.templePlaceholder')}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs sm:text-sm text-[#241F1A] placeholder-stone-400 focus:outline-hidden bg-transparent"
              />
            </div>

            {/* State Dropdown */}
            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-stone-200 px-3 py-1 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C25610] shrink-0" />
              <select
                value={selectedState}
                onChange={e => setSelectedState(e.target.value)}
                className="w-full text-xs font-semibold text-stone-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="All">{t('search.allStates')}</option>
                {metadata.states.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Deity Dropdown */}
            <div className="w-full md:w-48 border-t md:border-t-0 md:border-l border-stone-200 px-3 py-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C25610] shrink-0" />
              <select
                value={selectedDeity}
                onChange={e => setSelectedDeity(e.target.value)}
                className="w-full text-xs font-semibold text-stone-700 bg-transparent focus:outline-hidden cursor-pointer"
              >
                <option value="All">{t('search.allDeities')}</option>
                {metadata.deities.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="w-full md:w-auto px-7 py-2.5 rounded-full bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t('search.btn')}</span>
            </button>
          </form>

        </div>
      </section>

      {/* ================= 7 QUICK ACTION ICON CARDS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-3 sm:p-4 shadow-sm">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.path}
                  className={`group p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-all ${
                    action.highlight
                      ? 'bg-amber-50/70 border-amber-300 hover:border-[#C25610] shadow-xs'
                      : 'bg-white border-[#E8DEC8] hover:border-[#C25610] hover:shadow-xs'
                  }`}
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-2 transition-transform group-hover:scale-105 ${
                    action.highlight
                      ? 'bg-[#E07A28] text-white shadow-xs'
                      : 'bg-[#FDF6ED] text-[#C25610] border border-[#F5E2CC]'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-xs font-bold text-[#6D1B13] group-hover:text-[#8C2518] line-clamp-1 leading-snug">
                    {action.title}
                  </h3>
                  <p className="text-[10px] text-stone-500 line-clamp-1 mt-0.5">
                    {action.subtitle}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= POPULAR TEMPLES + SIDEBAR WIDGETS ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        
        {/* Section Header with Golden Lotus Motifs */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8DEC8]">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 text-lg">🪷</span>
            <h2 className="text-xl sm:text-2xl font-bold font-temple-heading text-[#6D1B13]">
              {t('home.popularTemples')}
            </h2>
            <span className="text-amber-600 text-lg">🪷</span>
          </div>

          <Link
            to="/temples"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{t('services.viewAll')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* 2-Column Layout matching reference mockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Popular Temple Cards Carousel / Grid (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {popularTemples.slice(0, 5).map(temple => (
                <div
                  key={temple._id}
                  className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group text-left"
                >
                  {/* Temple Image */}
                  <div className="relative h-40 overflow-hidden bg-stone-100">
                    <img
                      src={getTempleImageUrl(temple.bannerImage, temple._id || temple.slug)}
                      alt={temple.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => handleImageError(e, temple._id || temple.slug)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/90 text-white backdrop-blur-xs">
                      {temple.deity}
                    </span>
                  </div>

                  {/* Card Content */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold font-temple-heading text-[#6D1B13] truncate group-hover:text-[#8C2518]">
                        {temple.name}
                      </h3>
                      <p className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 truncate">
                        <MapPin className="w-3 h-3 text-[#C25610] shrink-0" />
                        <span>{temple.city}, {temple.state}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#F2EDE4] flex items-center justify-between">
                      <Link
                        to={`/temples/${temple.slug || temple._id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6D1B13] hover:text-[#C25610] transition-colors"
                      >
                        <span>{t('home.viewDetails')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        to={`/booking?templeId=${temple._id}`}
                        className="text-[10px] font-semibold text-[#C25610] hover:underline"
                      >
                        Book Seva
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {/* Extra 6th Directory teaser card */}
              <Link
                to="/temples"
                className="bg-gradient-to-br from-[#FFFBF5] to-[#FAF7F2] rounded-2xl border border-dashed border-[#C25610]/40 p-5 flex flex-col items-center justify-center text-center space-y-2 group hover:border-[#C25610] transition-colors min-h-[220px]"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-[#C25610] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <h3 className="text-xs font-bold text-[#6D1B13]">
                  Explore 40+ More Shrines
                </h3>
                <p className="text-[11px] text-stone-500">
                  Search across 10+ states and all supreme deities in India
                </p>
                <span className="text-xs font-bold text-[#C25610] inline-flex items-center gap-1 pt-1">
                  <span>Browse Directory</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Temple Calendar Widget + Quick Access (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* 1. Temple Calendar Widget matching reference mockup */}
            <div className="bg-[#6D1B13] text-white rounded-2xl p-4 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-[#8C2518] pb-2.5">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-amber-300" />
                  <span className="text-xs font-bold tracking-wide">
                    {t('home.templeCalendar')}
                  </span>
                </div>
                <Link
                  to="/calendar"
                  className="text-[10px] font-semibold text-amber-200 hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>{t('home.viewFullCalendar')}</span>
                  <ChevronRight className="w-3 h-3" />
                </Link>
              </div>

              {/* Month Navigator Header */}
              <div className="flex items-center justify-center gap-3 text-xs font-bold text-amber-100">
                <span>&lt;</span>
                <span>November 2026</span>
                <span>&gt;</span>
              </div>

              {/* 7-Day Date Selector Strip */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {miniDates.map((item, idx) => {
                  const isSelected = activeDateIndex === idx;
                  return (
                    <button
                      key={item.dateNum}
                      type="button"
                      onClick={() => setActiveDateIndex(idx)}
                      className={`py-1.5 px-0.5 rounded-lg flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-400 text-[#6D1B13] font-bold shadow-xs'
                          : 'text-amber-100/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-[9px] uppercase">{item.dayName}</span>
                      <span className="text-xs font-bold mt-0.5">{item.dateNum}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Day Event Card */}
              <div className="bg-white/10 backdrop-blur-xs rounded-xl p-3 border border-white/10 flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-amber-300" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-amber-100 truncate">
                    {activeEvent.title}
                  </h4>
                  <p className="text-[11px] text-amber-200/90 truncate">
                    {activeEvent.time}
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Quick Access 6-Grid Box matching reference mockup */}
            <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-4 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6D1B13] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C25610]" />
                <span>{t('home.quickAccess')}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link
                  to="/planner"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <Compass className="w-4 h-4 text-[#C25610] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.planVisit')}
                  </span>
                </Link>

                <Link
                  to="/profile?tab=bookings"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <CalendarIcon className="w-4 h-4 text-[#C25610] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.myBookings')}
                  </span>
                </Link>

                <Link
                  to="/favourites"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <Heart className="w-4 h-4 text-rose-500 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.favourites')}
                  </span>
                </Link>

                <Link
                  to="/feedback"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.feedback')}
                  </span>
                </Link>

                <Link
                  to="/announcements"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <Bell className="w-4 h-4 text-amber-600 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.announcements')}
                  </span>
                </Link>

                <Link
                  to="/emergency"
                  className="p-2.5 rounded-xl border border-[#E8DEC8] bg-white hover:border-[#C25610] text-center flex flex-col items-center justify-center transition-all group"
                >
                  <HelpCircle className="w-4 h-4 text-[#6D1B13] mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold text-stone-700 leading-tight">
                    {t('home.help')}
                  </span>
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= 4 LOWER FEATURE BANNERS ROW ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Banner 1: Plan Your Visit */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FFF8EE] rounded-2xl border border-[#E8DEC8] p-4 flex flex-col justify-between shadow-xs hover:border-[#C25610] transition-colors text-left space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25610] flex items-center gap-1">
                <Compass className="w-3.5 h-3.5" />
                Trip Planner
              </span>
              <h3 className="text-sm font-bold text-[#6D1B13]">
                {t('banner.plannerTitle')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('banner.plannerDesc')}
              </p>
            </div>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D1B13] hover:text-[#C25610] transition-colors"
            >
              <span>{t('banner.plannerBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Banner 2: Digital Temple Pass */}
          <div className="bg-gradient-to-br from-[#FAF7F2] to-[#FFF8EE] rounded-2xl border border-[#E8DEC8] p-4 flex flex-col justify-between shadow-xs hover:border-[#C25610] transition-colors text-left space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25610] flex items-center gap-1">
                <QrCode className="w-3.5 h-3.5" />
                Mobile Access
              </span>
              <h3 className="text-sm font-bold text-[#6D1B13]">
                {t('banner.qrTitle')}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {t('banner.qrDesc')}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenScanQr) onOpenScanQr();
                else navigate('/qr');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D1B13] hover:text-[#C25610] transition-colors cursor-pointer text-left"
            >
              <span>{t('banner.qrBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Banner 3: Pooja / Seva Booking */}
          <div className="bg-gradient-to-br from-[#FFF5EA] to-[#FDE8D0] rounded-2xl border border-[#F5D5B3] p-4 flex flex-col justify-between shadow-xs hover:border-[#C25610] transition-colors text-left space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25610] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#C25610]" />
                Online Darshan
              </span>
              <h3 className="text-sm font-bold text-[#6D1B13]">
                {t('banner.bookingTitle')}
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                {t('banner.bookingDesc')}
              </p>
            </div>
            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6D1B13] hover:text-[#C25610] transition-colors"
            >
              <span>{t('banner.bookingBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Banner 4: Latest Announcements */}
          <div className="bg-gradient-to-br from-[#6D1B13] to-[#8C2518] text-white rounded-2xl p-4 flex flex-col justify-between shadow-xs text-left space-y-3">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Bell className="w-3.5 h-3.5 text-amber-300" />
                Live Updates
              </span>
              <h3 className="text-sm font-bold text-amber-50">
                {announcements[0]?.title || 'Special Festival Schedule Updates'}
              </h3>
              <p className="text-xs text-amber-100/80 line-clamp-2 leading-relaxed">
                {announcements[0]?.description || 'Check verified temple timings changes and queue guidance.'}
              </p>
            </div>
            <Link
              to="/announcements"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
            >
              <span>{t('banner.announcementBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
