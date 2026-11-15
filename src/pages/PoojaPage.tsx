import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Sparkles, 
  Clock, 
  Calendar, 
  X, 
  Heart, 
  CheckCircle2, 
  Gift, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Pooja, Favorite, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';
import { useAuth } from '../context/AuthContext';
import { getTempleImageUrl, handleImageError } from '../utils/imageUtils';

export const PoojaPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalPooja, setActiveModalPooja] = useState<Pooja | null>(null);
  const [bookedNotice, setBookedNotice] = useState(false);

  const templeParam = searchParams.get('temple');

  const categories = [
    'All',
    'Daily Pooja',
    'Special Seva',
    'Abhishekam',
    'Archana',
    'Festival Seva'
  ];

  useEffect(() => {
    api.getTemples()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTemples(res.data);
          let target = res.data[0];
          if (templeParam) {
            const found = res.data.find(t => t._id === templeParam || t.slug === templeParam);
            if (found) target = found;
          }
          setSelectedTemple(target);
        }
      })
      .catch(() => {});
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      Promise.all([
        api.getTemplePoojas(selectedTemple._id).then(r => r.data).catch(() => []),
        isAuthenticated ? api.getFavorites().then(r => r.data).catch(() => []) : Promise.resolve([])
      ]).then(([poojaList, favList]) => {
        setPoojas(poojaList);
        setFavorites(favList);
        setLoading(false);
      });
    }
  }, [selectedTemple, isAuthenticated]);

  const handleTempleChange = (templeId: string) => {
    const found = temples.find(t => t._id === templeId);
    if (found) {
      setSelectedTemple(found);
      const next = new URLSearchParams(searchParams);
      next.set('temple', found.slug || found._id);
      setSearchParams(next);
    }
  };

  const filteredPoojas = selectedCategory === 'All'
    ? poojas
    : poojas.filter(p => {
        if (selectedCategory === 'Special Seva') {
          return p.category === 'Special Seva' || p.category === 'Special Pooja';
        }
        return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
      });

  const isFavorited = (poojaId: string) => {
    return favorites.some(f => f.itemId === poojaId);
  };

  const handleFavoriteToggle = async (pooja: Pooja) => {
    if (!isAuthenticated) {
      alert('Please log in to save this pooja to your favorites.');
      return;
    }
    const alreadyFav = isFavorited(pooja._id);
    if (alreadyFav) {
      await api.removeFavorite(pooja._id).catch(() => {});
      setFavorites(prev => prev.filter(f => f.itemId !== pooja._id));
    } else {
      const res = await api.addFavorite({
        itemType: 'pooja',
        itemId: pooja._id,
        title: pooja.name,
        details: `${pooja.time} · ${selectedTemple?.name}`
      }).catch(() => null);
      if (res && res.data) {
        setFavorites(prev => [...prev, res.data]);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Pooja & Sevas</span>
      </nav>

      {/* Header & Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Pooja & Sevas Directory
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Book or plan your preferred sacred rituals and daily darshan sevas
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
                {t.name} ({t.city}, {t.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Filter Pills matching Reference 5 */}
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

      {/* List Cards matching Reference 5 */}
      {loading ? (
        <div className="py-20 text-center text-xs text-stone-500">Loading verified pooja offerings...</div>
      ) : filteredPoojas.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DCCE] p-12 text-center text-xs text-stone-500">
          No pooja offerings recorded under &ldquo;{selectedCategory}&rdquo; for {selectedTemple?.name}.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPoojas.map((pooja) => {
            const isFav = isFavorited(pooja._id);
            return (
              <div
                key={pooja._id}
                className="bg-white border border-[#E5DCCE] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#7B1D16]/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
              >
                {/* Left Thumbnail + Info */}
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#FAF7F2] border border-[#E5DCCE] overflow-hidden shrink-0 flex items-center justify-center p-2">
                    <img
                      src={getTempleImageUrl(selectedTemple?.sanctumImage, selectedTemple?._id || selectedTemple?.slug)}
                      alt={pooja.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                      onError={(e) => handleImageError(e, selectedTemple?._id || selectedTemple?.slug)}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold font-temple-heading text-[#3A1412] group-hover:text-[#7B1D16] transition-colors">
                        {pooja.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-[#7B1D16] bg-[#EFE7D8] px-2 py-0.5 rounded-full">
                        {pooja.category}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-1 max-w-xl">
                      {pooja.description}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-stone-500 pt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#E07A28]" />
                        {pooja.time}
                      </span>
                      <span>·</span>
                      <span className="font-semibold text-[#7B1D16]">
                        {pooja.price > 0 ? `₹${pooja.price}` : 'Free Darshan'}
                      </span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">
                        {pooja.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleFavoriteToggle(pooja)}
                    className="p-2 text-stone-400 hover:text-red-500 rounded-lg hover:bg-[#FAF7F2] transition-colors"
                    title={isFav ? 'Remove favorite' : 'Save favorite'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => setActiveModalPooja(pooja)}
                    className="px-4 py-2 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal for Details matching Reference 5 */}
      {activeModalPooja && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E5DCCE] shadow-2xl relative space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => {
                setActiveModalPooja(null);
                setBookedNotice(false);
              }}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1D16] bg-[#EFE7D8] px-2.5 py-0.5 rounded-full">
                {activeModalPooja.category}
              </span>
              <h3 className="text-xl font-bold font-temple-heading text-[#3A1412] mt-2">
                {activeModalPooja.name}
              </h3>
              <p className="text-xs text-stone-500">
                {selectedTemple?.name} ({selectedTemple?.city}, {selectedTemple?.state})
              </p>
            </div>

            <p className="text-xs text-stone-700 leading-relaxed">
              {activeModalPooja.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE] text-xs">
              <div>
                <span className="text-stone-500 block">Timings:</span>
                <span className="font-bold text-[#3A1412]">{activeModalPooja.time}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Duration:</span>
                <span className="font-bold text-[#3A1412]">{activeModalPooja.duration}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Fee / Contribution:</span>
                <span className="font-bold text-[#7B1D16]">{activeModalPooja.price > 0 ? `₹${activeModalPooja.price}` : 'Free'}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Slot Status:</span>
                <span className="font-bold text-emerald-700">{activeModalPooja.availability}</span>
              </div>
            </div>

            {activeModalPooja.instructions && (
              <div className="text-xs text-stone-600 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-900 block mb-0.5">Reporting Instructions:</span>
                {activeModalPooja.instructions}
              </div>
            )}

            {activeModalPooja.prasadamDetails && (
              <div className="flex items-center gap-2 text-xs text-stone-700">
                <Gift className="w-4 h-4 text-[#E07A28] shrink-0" />
                <span><strong>Prasadam Included:</strong> {activeModalPooja.prasadamDetails}</span>
              </div>
            )}

            {bookedNotice && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Slot marked in your pilgrim itinerary. Check your Profile page.</span>
              </div>
            )}

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setBookedNotice(true)}
                className="flex-1 py-2.5 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
              >
                Save to Visit Schedule
              </button>
              <button
                onClick={() => {
                  setActiveModalPooja(null);
                  setBookedNotice(false);
                }}
                className="py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#EDE5D8] text-stone-700 text-xs font-semibold rounded-xl border border-[#DACDB8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
