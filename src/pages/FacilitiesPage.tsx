import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Utensils, 
  Droplets, 
  Bath, 
  Gift, 
  Footprints, 
  ShieldCheck, 
  Accessibility, 
  HeartPulse, 
  Info, 
  Car,
  Clock,
  MapPin,
  CheckCircle2,
  Phone
} from 'lucide-react';
import { api } from '../services/api';
import { Facility, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const FacilitiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const templeParam = searchParams.get('temple');

  useEffect(() => {
    api.getTemples().then(res => {
      if (res.data && res.data.length > 0) {
        setTemples(res.data);
        let target = res.data[0];
        if (templeParam) {
          const found = res.data.find(t => t._id === templeParam || t.slug === templeParam);
          if (found) target = found;
        }
        setSelectedTemple(target);
      }
    }).catch(() => {});
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleFacilities(selectedTemple._id)
        .then(res => setFacilities(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedTemple]);

  const handleTempleChange = (templeId: string) => {
    const found = temples.find(t => t._id === templeId);
    if (found) {
      setSelectedTemple(found);
      const next = new URLSearchParams(searchParams);
      next.set('temple', found.slug || found._id);
      setSearchParams(next);
    }
  };

  const getCategoryIcon = (category: string) => {
    const cat = category.toLowerCase();
    if (cat.includes('water')) return Droplets;
    if (cat.includes('rest') || cat.includes('bath')) return Bath;
    if (cat.includes('food') || cat.includes('meal') || cat.includes('annadanam')) return Utensils;
    if (cat.includes('prasadam')) return Gift;
    if (cat.includes('footwear')) return Footprints;
    if (cat.includes('locker') || cat.includes('cloak')) return ShieldCheck;
    if (cat.includes('wheelchair') || cat.includes('assistance')) return Accessibility;
    if (cat.includes('medical')) return HeartPulse;
    if (cat.includes('transport') || cat.includes('parking')) return Car;
    return Info;
  };

  const categories = ['All', 'Accommodation & Rest', 'Free Food & Meals', 'Tonsuring & Rituals', 'Drinking Water'];

  const filteredFacilities = selectedCategory === 'All'
    ? facilities
    : facilities.filter(f => f.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Facilities & Amenities</span>
      </nav>

      {/* Header & Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Pilgrim Facilities & Free Amenities
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Free drinking water, annadanam halls, accommodation, tonsuring, and rest complexes at {selectedTemple?.name}
          </p>
        </div>

        {/* Temple Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-700">Select Temple:</label>
          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => handleTempleChange(e.target.value)}
            className="text-xs p-2 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-semibold text-[#7B1D16]"
          >
            {temples.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#7B1D16] text-white shadow-xs'
                : 'bg-white text-stone-600 hover:bg-[#FAF7F2] border border-[#E5DCCE]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Facilities Cards Grid */}
      {loading ? (
        <LoadingState message="Loading temple facilities..." />
      ) : filteredFacilities.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DCCE] p-12 text-center text-xs text-stone-500">
          No specific amenities listed under &ldquo;{selectedCategory}&rdquo; for {selectedTemple?.name}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFacilities.map((fac) => {
            const IconComp = getCategoryIcon(fac.category);
            return (
              <div
                key={fac._id}
                className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs hover:border-[#7B1D16] transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-3 bg-[#FAF7F2] border border-[#E5DCCE] text-[#7B1D16] rounded-xl">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {fac.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold font-temple-heading text-[#3A1412] leading-tight">
                    {fac.name}
                  </h3>
                  <p className="text-[11px] font-semibold text-[#E07A28] mt-0.5 mb-2">
                    {fac.category}
                  </p>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {fac.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 text-xs space-y-1.5 text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{fac.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{fac.timing}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
