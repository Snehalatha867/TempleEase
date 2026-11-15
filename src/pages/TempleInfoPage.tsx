import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { api } from '../services/api';
import { Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { getTempleImageUrl, handleImageError } from '../utils/imageUtils';

export const TempleInfoPage: React.FC = () => {
  const [temple, setTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'Overview' | 'History' | 'Timings' | 'Rules'>('Overview');

  useEffect(() => {
    api.getTemple()
      .then(res => setTemple(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !temple) {
    return <LoadingState message="Loading temple information..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb matching Reference */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E87325] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Temple</span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-temple-heading text-[#3A1412]">
          {temple.name}
        </h1>
        <p className="text-xs text-stone-500 mt-1">{temple.subtitle}</p>
      </div>

      {/* Featured Image Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E5DCCE] shadow-xs h-64 sm:h-80 md:h-96">
        <img
          src={getTempleImageUrl(temple.bannerImage, temple._id || temple.slug)}
          alt={temple.name}
          className="w-full h-full object-cover object-center"
          referrerPolicy="no-referrer"
          onError={(e) => handleImageError(e, temple._id || temple.slug)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        <div className="absolute bottom-4 left-4 sm:left-6 text-white">
          <span className="text-xs uppercase tracking-widest text-[#F4A261] font-semibold">Sacred Pilgrim Shrine</span>
          <h2 className="text-lg sm:text-2xl font-bold font-temple-heading">Dravidian Architecture & Holy Pushkarini</h2>
        </div>
      </div>

      {/* Interactive Tabs Strip matching Reference 4 */}
      <div className="flex items-center gap-2 border-b border-[#E5DCCE] pb-2 overflow-x-auto scrollbar-none">
        {(['Overview', 'History', 'Timings', 'Rules'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab
                ? 'bg-[#E87325] text-white shadow-xs'
                : 'bg-white text-stone-600 border border-[#E5DCCE] hover:bg-[#FAF7F2]'
            }`}
          >
            {tab === 'Rules' ? 'Rules & Guidelines' : tab}
          </button>
        ))}
      </div>

      {/* 2-Column Clean Layout matching Reference 4 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Narrative Content & Temple Information */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Dynamic Tab Body */}
          {activeTab === 'Overview' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3 mb-3">
                  Temple Overview & Traditions
                </h2>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {temple.description}
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#3A1412] mb-2">Religious Significance</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {temple.significance}
                </p>
              </div>

              <div className="pt-2">
                <h3 className="text-sm font-bold text-[#3A1412] mb-2">Daily Agamic Traditions</h3>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {temple.traditions}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3">
                Temple History
              </h2>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {temple.history}
              </p>
              <div className="mt-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE] text-xs text-stone-600">
                The temple architecture exhibits grand stone pillars, intricately carved mandapams, and sacred enclosures constructed under centuries of royal patronage.
              </div>
            </div>
          )}

          {activeTab === 'Timings' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3">
                Daily Darshan Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
                  <span className="font-bold text-[#3A1412] block mb-1">Morning Darshan</span>
                  <p className="text-stone-600">{temple.morningTimings}</p>
                </div>
                <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
                  <span className="font-bold text-[#3A1412] block mb-1">Evening Darshan</span>
                  <p className="text-stone-600">{temple.eveningTimings}</p>
                </div>
              </div>
              <p className="text-xs text-stone-600 pt-2">
                Public Sarva Darshan queues remain open during general hours. Special priority slots are reserved for seniors and Divyangjan devotees.
              </p>
              <Link to="/timings" className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E87325] hover:underline pt-2">
                <span>View Full Daily Schedule Timeline</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {activeTab === 'Rules' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
              <h2 className="text-lg font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3">
                Visitor Rules & Dress Code
              </h2>
              <div className="space-y-3 text-xs text-stone-700">
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
                  <strong className="block text-[#3A1412] mb-0.5">Men&apos;s Dress Code:</strong>
                  <span>{temple.dressCodeMen}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
                  <strong className="block text-[#3A1412] mb-0.5">Women&apos;s Dress Code:</strong>
                  <span>{temple.dressCodeWomen}</span>
                </div>
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
                  <strong className="block text-[#3A1412] mb-0.5">Photography Policy:</strong>
                  <span>{temple.photographyRule}</span>
                </div>
              </div>
            </div>
          )}

          {/* Temple Information Contact Card matching Reference 4 */}
          <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-2">
              Temple Information
            </h3>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E87325] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Address</strong>
                  <p className="text-stone-600">{temple.address}, {temple.district}, {temple.state} - {temple.pinCode}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#E87325] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Phone</strong>
                  <p className="text-stone-600">{temple.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#E87325] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Email</strong>
                  <p className="text-stone-600">{temple.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Globe className="w-4 h-4 text-[#E87325] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-stone-900">Website</strong>
                  <a href={temple.website} target="_blank" rel="noreferrer" className="text-[#E87325] hover:underline">
                    {temple.website}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Timings Card with Get Directions Button matching Reference 4 */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-base font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-2">
              Timings
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-600">Opening Time</span>
                <strong className="text-[#3A1412] font-semibold tabular-nums">05:00 AM</strong>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-600">Closing Time</span>
                <strong className="text-[#3A1412] font-semibold tabular-nums">09:00 PM</strong>
              </div>

              <div className="pt-1">
                <span className="text-stone-500 block text-[11px] font-medium">Morning Session</span>
                <strong className="text-[#3A1412] text-xs">05:00 AM – 12:00 PM</strong>
              </div>

              <div className="pt-1">
                <span className="text-stone-500 block text-[11px] font-medium">Evening Session</span>
                <strong className="text-[#3A1412] text-xs">04:00 PM – 09:00 PM</strong>
              </div>
            </div>

            {/* Prominent Orange "Get Directions" Button matching Reference 4 */}
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Directions</span>
            </a>
          </div>
        </div>

      </div>

    </div>
  );
};
