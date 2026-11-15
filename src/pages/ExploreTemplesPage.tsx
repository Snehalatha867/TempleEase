import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Sparkles, 
  Filter, 
  RotateCcw, 
  ShieldCheck, 
  ArrowRight, 
  Heart,
  Clock,
  Loader2,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { Temple } from '../types';
import { useAuth } from '../context/AuthContext';
import { getTempleImageUrl, handleImageError } from '../utils/imageUtils';

export const ExploreTemplesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);
  const [states, setStates] = useState<string[]>([]);
  const [deities, setDeities] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const { isAuthenticated } = useAuth();

  // Read URL query params
  const searchQuery = searchParams.get('q') || '';
  const stateFilter = searchParams.get('state') || 'All';
  const deityFilter = searchParams.get('deity') || 'All';
  const popularFilter = searchParams.get('popular') === 'true';
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'state'>('popular');

  useEffect(() => {
    // Load metadata
    api.getMetadata()
      .then(res => {
        if (res.data) {
          setStates(res.data.states);
          setDeities(res.data.deities);
        }
      })
      .catch(() => {});

    // Load favorites if user logged in
    if (isAuthenticated) {
      api.getFavorites()
        .then(res => {
          if (res.data) {
            setFavoriteIds(new Set(res.data.map(f => f.itemId)));
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  useEffect(() => {
    setLoading(true);
    api.getTemples({
      q: searchQuery || undefined,
      state: stateFilter !== 'All' ? stateFilter : undefined,
      deity: deityFilter !== 'All' ? deityFilter : undefined,
      popular: popularFilter ? true : undefined
    })
      .then(res => {
        if (res.data) {
          let list = [...res.data];
          if (sortBy === 'name') {
            list.sort((a, b) => a.name.localeCompare(b.name));
          } else if (sortBy === 'state') {
            list.sort((a, b) => a.state.localeCompare(b.state));
          } else {
            // Popular first
            list.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
          }
          setTemples(list);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchQuery, stateFilter, deityFilter, popularFilter, sortBy]);

  const handleSearchChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val.trim()) next.set('q', val);
    else next.delete('q');
    setSearchParams(next);
  };

  const handleStateChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val !== 'All') next.set('state', val);
    else next.delete('state');
    setSearchParams(next);
  };

  const handleDeityChange = (val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val !== 'All') next.set('deity', val);
    else next.delete('deity');
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams());
    setSortBy('popular');
  };

  const toggleFavorite = async (temple: Temple) => {
    if (!isAuthenticated) {
      alert('Please log in to save temples to your personal favorites.');
      return;
    }
    const isFav = favoriteIds.has(temple._id);
    if (isFav) {
      await api.removeFavorite(temple._id).catch(() => {});
      setFavoriteIds(prev => {
        const next = new Set(prev);
        next.delete(temple._id);
        return next;
      });
    } else {
      await api.addFavorite({
        itemType: 'temple',
        itemId: temple._id,
        title: temple.name,
        details: `${temple.city}, ${temple.state}`
      }).catch(() => {});
      setFavoriteIds(prev => new Set(prev).add(temple._id));
    }
  };

  const hasActiveFilters = searchQuery || stateFilter !== 'All' || deityFilter !== 'All' || popularFilter;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Breadcrumb & Title */}
      <div className="border-b border-[#E8DEC8] pb-5">
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <Link to="/" className="hover:text-[#7B1D16]">Home</Link>
          <span>/</span>
          <span className="text-[#7B1D16] font-semibold">Explore Temples</span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold font-temple-heading text-[#3A1412] tracking-tight">
              India&apos;s Sacred Temples Directory
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Verified historical shrines, daily pooja schedules, timings, and visitor facilities across India
            </p>
          </div>
          <div className="text-xs font-semibold text-[#8C2518] bg-[#EFE7D8] px-3 py-1.5 rounded-full border border-[#DACDB8]">
            {loading ? 'Searching...' : `${temples.length} Temples Listed`}
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#7B1D16] absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search temple name, city, district..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16]"
            />
          </div>

          {/* State Filter */}
          <div className="relative">
            <MapPin className="w-4 h-4 text-[#7B1D16] absolute left-3 top-3 pointer-events-none" />
            <select
              value={stateFilter}
              onChange={(e) => handleStateChange(e.target.value)}
              aria-label="Filter temples by state"
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] cursor-pointer appearance-none font-medium"
            >
              <option value="All">All Indian States</option>
              {states.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span className="absolute right-3 top-2.5 pointer-events-none text-stone-400 text-xs">▼</span>
          </div>

          {/* Deity Filter */}
          <div className="relative">
            <Sparkles className="w-4 h-4 text-[#7B1D16] absolute left-3 top-3 pointer-events-none" />
            <select
              value={deityFilter}
              onChange={(e) => handleDeityChange(e.target.value)}
              aria-label="Filter temples by deity"
              className="w-full pl-9 pr-8 py-2 text-xs bg-[#FAF7F2] border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] cursor-pointer appearance-none font-medium"
            >
              <option value="All">All Deities</option>
              {deities.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <span className="absolute right-3 top-2.5 pointer-events-none text-stone-400 text-xs">▼</span>
          </div>

          {/* Sort By & Reset */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'popular' | 'name' | 'state')}
              aria-label="Sort temples by criteria"
              className="w-full py-2 px-3 text-xs bg-[#FAF7F2] border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] cursor-pointer font-medium"
            >
              <option value="popular">Sort: Popularity</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="state">Sort: State</option>
            </select>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="p-2 text-xs text-stone-600 hover:text-[#7B1D16] bg-[#FAF7F2] hover:bg-[#EFE7D8] border border-[#DACDB8] rounded-xl flex items-center justify-center shrink-0 transition-colors"
                title="Reset Filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Popular Quick Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-stone-600">
          <span className="text-[11px] font-semibold text-stone-400">Quick Filters:</span>
          {['Tirumala', 'Lord Shiva', 'Andhra Pradesh', 'Tamil Nadu', 'Lord Krishna', 'Lord Vishnu'].map((pill) => (
            <button
              key={pill}
              onClick={() => {
                if (['Andhra Pradesh', 'Tamil Nadu'].includes(pill)) handleStateChange(pill);
                else if (['Lord Shiva', 'Lord Krishna', 'Lord Vishnu'].includes(pill)) handleDeityChange(pill);
                else handleSearchChange(pill);
              }}
              className="px-2.5 py-1 rounded-full text-[11px] bg-[#FAF7F2] hover:bg-[#EFE7D8] border border-[#E8DEC8] text-[#3A1412] transition-colors"
            >
              {pill}
            </button>
          ))}
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="w-8 h-8 text-[#7B1D16] animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading verified temple directory...</p>
        </div>
      ) : temples.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-12 text-center space-y-3">
          <Compass className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-[#3A1412]">No Temples Found Matching Your Search</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Try adjusting your search keywords, clearing state filters, or exploring popular pilgrimages.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-[#7B1D16] text-white text-xs font-semibold rounded-full shadow-xs mt-2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map((temple) => {
            const isFav = favoriteIds.has(temple._id);
            return (
              <div
                key={temple._id}
                className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                  <img
                    src={getTempleImageUrl(temple.bannerImage, temple._id || temple.slug)}
                    alt={temple.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => handleImageError(e, temple._id || temple.slug)}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Verification Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#7B1D16] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7B1D16]" />
                    <span>{temple.verificationStatus === 'Verified from Official Portal' ? 'Verified Portal' : 'Unverified'}</span>
                  </div>

                  {/* Favorite Heart Button */}
                  <button
                    onClick={() => toggleFavorite(temple)}
                    className="absolute top-3 right-3 p-1.5 bg-white/90 backdrop-blur-xs rounded-full shadow-xs text-stone-700 hover:text-red-500 transition-colors"
                    title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
                  >
                    <Heart className={`w-4 h-4 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>

                  {/* Deity Tag on Image */}
                  <div className="absolute bottom-2.5 left-3 text-xs text-[#FFDF85] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{temple.deity}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex flex-col grow justify-between space-y-3">
                  <div>
                    <h3 className="text-base font-bold font-temple-heading text-[#3A1412] leading-tight group-hover:text-[#7B1D16] transition-colors">
                      {temple.name}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-[#E07A28] mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{temple.city}, {temple.state}</span>
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2 leading-relaxed">
                      {temple.subtitle || temple.description}
                    </p>
                  </div>

                  {/* Opening hours & view details */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                    <div className="text-[11px] text-stone-500">
                      <span className="font-semibold text-stone-700 block">Morning:</span>
                      <span>{temple.morningTimings.split('–')[0]}</span>
                    </div>

                    <Link
                      to={`/temples/${temple.slug || temple._id}`}
                      className="py-2 px-3.5 text-xs font-semibold text-white bg-[#7B1D16] hover:bg-[#5E140E] rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
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
