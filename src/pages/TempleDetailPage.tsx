import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Info, 
  Car, 
  HeartPulse, 
  PhoneCall, 
  ExternalLink, 
  QrCode, 
  Heart, 
  ArrowLeft, 
  Share2, 
  Download, 
  Printer, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  Navigation,
  Sparkles,
  Utensils,
  Landmark,
  Coins,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { Temple, Pooja, ScheduleItem, Parking, Facility, PrasadamItem, DonationItem, Hospital, EmergencyContact, Guideline } from '../types';
import { useAuth } from '../context/AuthContext';

export const TempleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'timings' | 'poojas' | 'map' | 'parking' | 'prasadam' | 'donations' | 'guidelines' | 'emergency'>('overview');
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isFavorite, setIsFavorite] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    api.getTempleById(id)
      .then(res => {
        if (res.data) {
          setTemple(res.data);
          // Check if favorited
          if (isAuthenticated) {
            api.getFavorites()
              .then(favRes => {
                if (favRes.data) {
                  const has = favRes.data.some(f => f.itemId === res.data._id);
                  setIsFavorite(has);
                }
              })
              .catch(() => {});
          }
          // Fetch QR
          api.getTempleQr(res.data._id)
            .then(qrRes => {
              setQrDataUrl(qrRes.qrDataUrl);
            })
            .catch(() => {});
        } else {
          setError('Temple details could not be found.');
        }
      })
      .catch(err => {
        setError(err.message || 'Failed to load temple information.');
      })
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const toggleFavorite = async () => {
    if (!temple) return;
    if (!isAuthenticated) {
      alert('Please log in to save temples to your favorites.');
      return;
    }
    if (isFavorite) {
      await api.removeFavorite(temple._id).catch(() => {});
      setIsFavorite(false);
    } else {
      await api.addFavorite({
        itemType: 'temple',
        itemId: temple._id,
        title: temple.name,
        details: `${temple.city}, ${temple.state}`
      }).catch(() => {});
      setIsFavorite(true);
    }
  };

  const handleShare = () => {
    if (navigator.share && temple) {
      navigator.share({
        title: temple.name,
        text: `Explore verified temple timings, pooja schedule and visitor facilities for ${temple.name} on Temple Ease:`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Temple URL copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 space-y-3">
        <Loader2 className="w-8 h-8 text-[#7B1D16] animate-spin" />
        <p className="text-xs text-stone-500">Loading verified temple records...</p>
      </div>
    );
  }

  if (error || !temple) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-600 mx-auto" />
        <h2 className="text-xl font-bold font-temple-heading text-[#3A1412]">
          {error || 'Temple Record Not Found'}
        </h2>
        <p className="text-xs text-stone-500">
          The requested temple identifier does not match our verified registry.
        </p>
        <Link
          to="/temples"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#7B1D16] text-white text-xs font-semibold rounded-full shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Temples Directory</span>
        </Link>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'history', label: 'History & Architecture' },
    { key: 'timings', label: 'Timings' },
    { key: 'poojas', label: 'Pooja & Sevas' },
    { key: 'map', label: 'Temple Map' },
    { key: 'parking', label: 'Parking' },
    { key: 'prasadam', label: 'Prasadam' },
    { key: 'donations', label: 'Donations & e-Hundi' },
    { key: 'guidelines', label: 'Visitor Guidelines' },
    { key: 'emergency', label: 'Emergency Help' }
  ];

  return (
    <div className="space-y-6 pb-16">
      
      {/* 1. HERO BANNER WITH TEMPLE PHOTO & VERIFIED METADATA */}
      <div className="relative min-h-[320px] md:min-h-[380px] bg-stone-900 overflow-hidden flex items-end">
        <img
          src={temple.bannerImage || '/images/temple_cover_banner.jpg'}
          alt={temple.name}
          className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.65]"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/temple_cover_banner.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Content overlaid on banner */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full text-white">
          <div className="flex items-center gap-2 text-xs text-[#FFDF85] mb-2 font-medium">
            <Link to="/temples" className="hover:underline flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Temples Directory</span>
            </Link>
            <span>/</span>
            <span>{temple.state}</span>
            <span>/</span>
            <span>{temple.city}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="text-xs bg-[#7B1D16]/90 border border-[#D4AF37]/50 text-[#FFDF85] px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {temple.deity}
                </span>
                <span className="text-xs bg-white/20 backdrop-blur-xs text-white px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  {temple.verificationStatus}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold font-temple-heading tracking-tight drop-shadow-md">
                {temple.name}
              </h1>

              <p className="text-xs sm:text-sm text-stone-200 mt-1 max-w-2xl font-serif italic">
                {temple.subtitle}
              </p>

              <div className="flex items-center gap-4 text-xs text-stone-300 mt-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E07A28]" />
                  {temple.address}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#E07A28]" />
                  {temple.morningTimings}
                </span>
              </div>
            </div>

            {/* Actions: Favorite, Share, QR code */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Book Seva Button */}
              <Link
                to={`/booking?templeId=${temple._id}`}
                className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#6D1B13] transition-colors flex items-center gap-1.5 text-xs font-bold shadow-xs shrink-0"
              >
                <Sparkles className="w-4 h-4 text-[#6D1B13]" />
                <span>Book Seva</span>
              </Link>

              {/* Plan Visit Button */}
              <Link
                to={`/planner?templeId=${temple._id}`}
                className="p-2.5 rounded-xl bg-white/20 border border-white/30 hover:bg-white/30 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Plan Visit</span>
              </Link>

              <button
                onClick={toggleFavorite}
                className={`p-2.5 rounded-xl border backdrop-blur-xs transition-colors flex items-center gap-1.5 text-xs font-semibold ${
                  isFavorite 
                    ? 'bg-red-600/90 border-red-500 text-white' 
                    : 'bg-white/20 border-white/30 text-white hover:bg-white/30'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-white/20 border border-white/30 hover:bg-white/30 text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
                title="Share Temple"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              <button
                onClick={() => setQrModalOpen(true)}
                className="p-2.5 rounded-xl bg-[#7B1D16] border border-[#D4AF37]/40 hover:bg-[#5E140E] text-white transition-colors flex items-center gap-1.5 text-xs font-semibold shadow-xs"
                title="View Temple QR Placard"
              >
                <QrCode className="w-4 h-4" />
                <span>Temple QR</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E8DEC8] flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap rounded-lg transition-all ${
                activeTab === tab.key
                  ? 'bg-[#7B1D16] text-white shadow-xs'
                  : 'text-[#4A3E39] hover:bg-[#EFE7D8] hover:text-[#7B1D16]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. TAB CONTENT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* TAB A: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main description & significance */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
                <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                  <Info className="w-5 h-5 text-[#E07A28]" />
                  <span>About {temple.name}</span>
                </h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {temple.description}
                </p>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-2">
                    Spiritual & Religious Significance
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {temple.significance}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-2">
                    Sacred Traditions & Daily Rituals
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {temple.traditions}
                  </p>
                </div>
              </div>

              {/* Highlights & Festivals */}
              <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-3">
                <h3 className="text-sm font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#E07A28]" />
                  <span>Major Annual Festivals</span>
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {temple.festivals}
                </p>
              </div>
            </div>

            {/* Sidebar: Timings & Official Links */}
            <div className="space-y-5">
              <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8DEC8] p-5 shadow-xs space-y-4">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider border-b border-[#E8DEC8] pb-2">
                  Operational Timings
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="font-semibold text-stone-700 block">Morning Session:</span>
                    <span className="text-stone-600">{temple.morningTimings}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700 block">Evening Session:</span>
                    <span className="text-stone-600">{temple.eveningTimings}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-stone-700 block">Darshan Protocol:</span>
                    <span className="text-stone-600">{temple.darshanTimings}</span>
                  </div>
                </div>

                <Link
                  to={`/timings?temple=${temple._id}`}
                  className="w-full py-2 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>View Full Daily Schedule</span>
                </Link>
              </div>

              {/* Verified Contact Card */}
              <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs space-y-3">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider border-b border-[#E8DEC8] pb-2">
                  Official Contact & Trust Portal
                </h4>
                <div className="space-y-2 text-xs text-stone-600">
                  <p><span className="font-semibold text-stone-800">Helpline:</span> {temple.phone}</p>
                  <p><span className="font-semibold text-stone-800">Email:</span> {temple.email}</p>
                  <p className="text-[11px] text-stone-500"><span className="font-semibold text-stone-800">Address:</span> {temple.address}</p>
                </div>

                {temple.officialWebsite && (
                  <a
                    href={temple.officialWebsite}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2 bg-[#FAF7F2] hover:bg-[#EFE7D8] text-[#7B1D16] border border-[#DACDB8] text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Visit Official Trust Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB B: HISTORY & ARCHITECTURE */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-bold font-temple-heading text-[#3A1412] mb-3">
                Historical Origins & Royalty Patronage
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {temple.history}
              </p>
            </div>

            <div className="pt-5 border-t border-stone-100">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] mb-3 flex items-center gap-2">
                <Landmark className="w-5 h-5 text-[#E07A28]" />
                <span>Architectural Marvel & Shikhara Style</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {temple.architecture}
              </p>
            </div>

            <div className="pt-5 border-t border-stone-100">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] mb-3">
                Grand Festivals & Celestial Celebrations
              </h3>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {temple.festivals}
              </p>
            </div>
          </div>
        )}

        {/* TAB C: TIMINGS */}
        {activeTab === 'timings' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#E07A28]" />
                <span>Verified Temple Opening & Closing Hours</span>
              </h3>
              <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200">
                Live Timetables Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8]">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-1">Morning Opening</h4>
                <p className="text-lg font-bold text-[#3A1412]">{temple.morningTimings}</p>
                <p className="text-[11px] text-stone-500 mt-1">Includes Suprabhatam and morning Nitya Archanas.</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8]">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-1">Evening & Night</h4>
                <p className="text-lg font-bold text-[#3A1412]">{temple.eveningTimings}</p>
                <p className="text-[11px] text-stone-500 mt-1">Evening Sandhya Harathi and Sayana Seva.</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8]">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-1">Sarva Darshan Queue</h4>
                <p className="text-sm font-bold text-[#3A1412]">{temple.darshanTimings}</p>
                <p className="text-[11px] text-stone-500 mt-1">General public free entry lines with tokens.</p>
              </div>
            </div>

            {temple.specialDayTimings && (
              <div className="p-4 bg-[#FFF9EC] rounded-xl border border-[#F4E1BA] text-xs">
                <span className="font-bold text-[#7B1D16] block mb-1">Special Days & Festival Modifications:</span>
                <p className="text-stone-700">{temple.specialDayTimings}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB D: POOJA & SEVAS */}
        {activeTab === 'poojas' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412]">
                Daily Poojas & Arjitha Sevas at {temple.name}
              </h3>
              <span className="text-xs text-stone-500">
                Official prices & booking timings
              </span>
            </div>

            {(!temple.poojas || temple.poojas.length === 0) ? (
              <p className="text-xs text-stone-500 py-6 text-center">No individual poojas listed yet for this temple.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#E8DEC8] text-stone-500 uppercase font-semibold text-[10px] tracking-wider bg-[#FAF7F2]">
                      <th className="py-3 px-3">Seva / Pooja Name</th>
                      <th className="py-3 px-3">Timing & Duration</th>
                      <th className="py-3 px-3">Official Fee</th>
                      <th className="py-3 px-3">Prasadam / Significance</th>
                      <th className="py-3 px-3">Availability</th>
                      <th className="py-3 px-3 text-right">Online Booking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {temple.poojas.map((p) => (
                      <tr key={p._id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold text-[#3A1412] block">{p.name}</span>
                          <span className="text-[10px] text-[#7B1D16]">{p.category}</span>
                        </td>
                        <td className="py-3 px-3 text-stone-600">
                          <span>{p.time}</span>
                          <span className="block text-[10px] text-stone-400">{p.duration}</span>
                        </td>
                        <td className="py-3 px-3 font-bold text-[#3A1412]">
                          {p.price > 0 ? `₹${p.price}` : 'Free'}
                        </td>
                        <td className="py-3 px-3 text-stone-600 max-w-xs">
                          <p className="line-clamp-2">{p.prasadamDetails || p.significance}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {p.availability}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <Link
                            to={`/booking?templeId=${temple._id}&poojaId=${p._id}`}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#6D1B13] hover:bg-[#8C2518] text-white text-[11px] font-semibold transition-colors"
                          >
                            <span>Book</span>
                            <Sparkles className="w-3 h-3 text-amber-300" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB E: MAP */}
        {activeTab === 'map' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#E07A28]" />
                <span>Geographic Location & Route Directions</span>
              </h3>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${temple.latitude},${temple.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 bg-[#7B1D16] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-xs"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open in Google Maps</span>
              </a>
            </div>

            <div className="h-80 w-full rounded-xl overflow-hidden border border-[#E5DCCE] relative bg-stone-100">
              <iframe
                title={`${temple.name} Map`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${temple.longitude - 0.04}%2C${temple.latitude - 0.04}%2C${temple.longitude + 0.04}%2C${temple.latitude + 0.04}&layer=mapnik&marker=${temple.latitude}%2C${temple.longitude}`}
              />
            </div>

            <div className="p-3.5 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
              <span><strong>Coordinates:</strong> {temple.latitude.toFixed(4)}° N, {temple.longitude.toFixed(4)}° E</span>
              <span><strong>Address:</strong> {temple.address}</span>
            </div>
          </div>
        )}

        {/* TAB F: PARKING */}
        {activeTab === 'parking' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] mb-1 flex items-center gap-2">
                <Car className="w-5 h-5 text-[#E07A28]" />
                <span>Authorized Parking Locations for {temple.name}</span>
              </h3>
              <p className="text-xs text-stone-500 mb-4">
                Verified parking slots with walking distances and vehicle restrictions
              </p>

              {(!temple.parking || temple.parking.length === 0) ? (
                <p className="text-xs text-stone-500 py-6 text-center">Parking details awaiting verification for this temple.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {temple.parking.map((park) => (
                    <div key={park._id} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-[#3A1412]">{park.name}</h4>
                        <span className="text-[10px] font-bold text-[#7B1D16] bg-[#EFE7D8] px-2 py-0.5 rounded-full">
                          {park.capacity}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600">{park.location}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-500 pt-1">
                        <div><strong>Distance:</strong> {park.distance}</div>
                        <div><strong>Walking Time:</strong> {park.walkingTime}</div>
                        <div><strong>Hours:</strong> {park.timing}</div>
                        <div><strong>Fee:</strong> {park.fee}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB G: PRASADAM */}
        {activeTab === 'prasadam' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                <Utensils className="w-5 h-5 text-[#E07A28]" />
                <span>Sacred Prasadam & Free Annadanam Details</span>
              </h3>
            </div>

            {temple.prasadamSummary && (
              <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#EFE7D8] text-xs leading-relaxed text-stone-700">
                <strong>Prasadam Heritage:</strong> {temple.prasadamSummary}
              </div>
            )}

            {(!temple.prasadam || temple.prasadam.length === 0) ? (
              <p className="text-xs text-stone-500 py-6 text-center">Prasadam counter listings being updated.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {temple.prasadam.map((pr) => (
                  <div key={pr._id} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] space-y-2">
                    <h4 className="text-xs font-bold text-[#3A1412]">{pr.name}</h4>
                    <p className="text-[11px] text-stone-600">{pr.description}</p>
                    <div className="pt-2 border-t border-stone-200/60 text-[11px] space-y-1 text-stone-500">
                      <div><strong>Counter:</strong> {pr.counterLocation}</div>
                      <div><strong>Timing:</strong> {pr.distributionTiming}</div>
                      <div><strong className="text-[#7B1D16]">Price:</strong> {pr.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB H: DONATIONS */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
              <Coins className="w-5 h-5 text-[#E07A28]" />
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412]">
                Official e-Hundi & Donations Information
              </h3>
            </div>

            <div className="p-4 bg-[#FFF9EC] rounded-xl border border-[#F4E1BA] text-xs text-stone-700 space-y-2">
              <p className="font-semibold text-[#7B1D16]">Devotee Transparency Advisory:</p>
              <p>
                Temple Ease does not collect financial contributions or charge payment processing fees. All donor contributions must only be made directly to the official temple devasthanam trusts listed below.
              </p>
            </div>

            {temple.donationInfo && (
              <div className="p-5 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] space-y-3">
                <h4 className="text-sm font-bold text-[#3A1412]">{temple.donationInfo.trustName}</h4>
                <p className="text-xs text-stone-600">{temple.donationInfo.instructions}</p>
                <div className="text-xs text-stone-500">
                  <strong>Counter Location:</strong> {temple.donationInfo.counterLocation}
                </div>
                {temple.donationInfo.officialUrl && (
                  <a
                    href={temple.donationInfo.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
                  >
                    <span>Proceed to Official Trust Donation Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB I: VISITOR GUIDELINES */}
        {activeTab === 'guidelines' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
            <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] border-b border-stone-100 pb-3">
              Visitor Guidelines, Dress Code & Etiquette
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] space-y-2">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider">Men&apos;s Dress Code</h4>
                <p className="text-xs text-stone-700 leading-relaxed">{temple.dressCodeMen}</p>
              </div>

              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] space-y-2">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider">Women&apos;s Dress Code</h4>
                <p className="text-xs text-stone-700 leading-relaxed">{temple.dressCodeWomen}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <h4 className="text-xs font-bold text-stone-800">Photography Rules</h4>
                <p className="text-xs text-stone-600">{temple.photographyRule}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <h4 className="text-xs font-bold text-stone-800">Footwear Instructions</h4>
                <p className="text-xs text-stone-600">{temple.footwearRule}</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1">
                <h4 className="text-xs font-bold text-stone-800">Queue Protocol</h4>
                <p className="text-xs text-stone-600">{temple.queueInstructions}</p>
              </div>
            </div>

            {temple.rules && temple.rules.length > 0 && (
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8]">
                <h4 className="text-xs font-bold text-[#7B1D16] uppercase tracking-wider mb-2">Important Temple Rules</h4>
                <ul className="space-y-1.5 text-xs text-stone-700 list-disc list-inside">
                  {temple.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB J: EMERGENCY */}
        {activeTab === 'emergency' && (
          <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3 flex-wrap gap-2">
              <h3 className="text-lg font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                <HeartPulse className="w-5 h-5 text-red-600" />
                <span>Emergency Help, Nearby Hospitals & Security</span>
              </h3>
              <span className="text-xs text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full font-bold">
                24x7 Direct Helplines
              </span>
            </div>

            {/* Quick Dial Helplines */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-center space-y-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">Police Helpline</span>
                <span className="text-2xl font-bold text-red-700 block">100 / 112</span>
                <a
                  href="tel:100"
                  className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-center space-y-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">Ambulance Service</span>
                <span className="text-2xl font-bold text-red-700 block">108</span>
                <a
                  href="tel:108"
                  className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Now</span>
                </a>
              </div>

              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 text-center space-y-2">
                <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">Temple Security Desk</span>
                <span className="text-lg font-bold text-red-700 block truncate">{temple.phone}</span>
                <a
                  href={`tel:${temple.phone.replace(/[^0-9+]/g, '')}`}
                  className="w-full py-1.5 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Temple Help Desk</span>
                </a>
              </div>
            </div>

            {/* Nearby Hospitals */}
            {temple.hospitals && temple.hospitals.length > 0 && (
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="text-sm font-bold text-[#3A1412]">Verified Nearby Hospitals</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {temple.hospitals.map((h) => (
                    <div key={h._id} className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] flex items-center justify-between gap-3">
                      <div>
                        <h5 className="text-xs font-bold text-[#3A1412]">{h.name}</h5>
                        <p className="text-[11px] text-stone-500">{h.address}</p>
                        <p className="text-[11px] text-stone-600 font-medium mt-1">Distance: {h.distance}</p>
                      </div>
                      <a
                        href={`tel:${h.phone.replace(/[^0-9+]/g, '')}`}
                        className="py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shrink-0"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{h.phone}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* QR MODAL FOR THIS TEMPLE */}
      {qrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-[#E5DCCE] shadow-2xl text-center space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-temple-heading text-[#3A1412]">
                {temple.name} QR Placard
              </h3>
              <button
                onClick={() => setQrModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            {qrDataUrl ? (
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#DACDB8] inline-block">
                <img src={qrDataUrl} alt="Temple QR" className="w-52 h-52 mx-auto bg-white p-2 rounded-lg" />
              </div>
            ) : (
              <div className="w-52 h-52 bg-stone-100 rounded-xl mx-auto flex items-center justify-center text-xs text-stone-400">
                Generating QR...
              </div>
            )}

            <p className="text-xs text-stone-500">
              Devotees can scan this placard at the temple gopuram to immediately view timings, poojas, and parking without logging in.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <a
                href={qrDataUrl}
                download={`${temple.slug || 'temple'}-qr-placard.png`}
                className="flex-1 py-2 bg-[#7B1D16] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </a>
              <button
                onClick={() => window.print()}
                className="py-2 px-3 bg-[#FAF7F2] border border-[#DACDB8] text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
