import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Loader2, ArrowRight, MapPin, Sparkles, Home } from 'lucide-react';
import { api } from '../../services/api';
import { Temple, Pooja, Facility, Parking } from '../../types';
import { getTempleImageUrl, handleImageError } from '../../utils/imageUtils';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    temples: Temple[];
    poojas: Pooja[];
    facilities: Facility[];
    parking: Parking[];
  }>({
    temples: [],
    poojas: [],
    facilities: [],
    parking: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults({ temples: [], poojas: [], facilities: [], parking: [] });
      return;
    }

    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        setLoading(true);
        api.search(query)
          .then((res) => {
            if (res && res.results) {
              setResults({
                temples: res.results.temples || [],
                poojas: res.results.poojas || [],
                facilities: res.results.facilities || [],
                parking: res.results.parking || []
              });
            }
          })
          .catch(() => {})
          .finally(() => setLoading(false));
      } else {
        setResults({ temples: [], poojas: [], facilities: [], parking: [] });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  if (!isOpen) return null;

  const totalResults =
    results.temples.length +
    results.poojas.length +
    results.facilities.length +
    results.parking.length;

  const handleSelect = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 sm:p-6 md:p-10 animate-in fade-in">
      <div 
        className="bg-[#FAF7F2] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E5DCCE] overflow-hidden mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#E5DCCE] flex items-center gap-3 bg-white">
          <Search className="w-5 h-5 text-[#7B1D16] shrink-0" />
          <input
            type="text"
            placeholder="Search by temple name, deity, city, state, pooja, or facility..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full text-base bg-transparent border-0 outline-hidden focus:ring-0 text-[#241F1A] placeholder:text-stone-400"
          />
          {loading && <Loader2 className="w-4 h-4 text-[#7B1D16] animate-spin shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 rounded-md"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-[70vh] overflow-y-auto p-4 space-y-5">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-xs text-stone-500">
              Type at least 2 characters to search across Indian temples and verified visitor guides.
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Tirumala', 'Srisailam', 'Meenakshi', 'Jagannath', 'Somnath', 'Kashi', 'Ayodhya', 'Lord Shiva', 'Suprabhata', 'Parking'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    className="px-2.5 py-1 text-xs bg-[#F4EFE6] text-[#3A1412] hover:bg-[#EDE5D8] rounded-full transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : totalResults === 0 && !loading ? (
            <div className="py-8 text-center text-sm text-stone-500">
              No matching temple records found for &ldquo;{query}&rdquo;.
            </div>
          ) : (
            <>
              {/* Matched Temples */}
              {results.temples.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Home className="w-3.5 h-3.5 text-[#7B1D16]" />
                    <span>Sacred Temples ({results.temples.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {results.temples.map((t) => (
                      <button
                        key={t._id}
                        onClick={() => handleSelect(`/temples/${t.slug || t._id}`)}
                        className="w-full text-left p-2.5 bg-white hover:bg-[#F4EFE6] rounded-xl border border-[#E5DCCE] transition-colors flex items-center gap-3 group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-stone-200 overflow-hidden shrink-0">
                          <img
                            src={getTempleImageUrl(t.bannerImage, t._id || t.slug)}
                            alt={t.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                            onError={(e) => handleImageError(e, t._id || t.slug)}
                          />
                        </div>
                        <div className="grow min-w-0">
                          <p className="text-sm font-bold text-[#3A1412] truncate group-hover:text-[#7B1D16]">
                            {t.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-stone-500 truncate mt-0.5">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#E07A28]" />
                              {t.city}, {t.state}
                            </span>
                            <span>·</span>
                            <span className="text-[#8C2518] font-medium">{t.deity}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7B1D16] transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Poojas & Sevas */}
              {results.poojas.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#7B1D16]" />
                    <span>Poojas & Sevas ({results.poojas.length})</span>
                  </h4>
                  <div className="space-y-1.5">
                    {results.poojas.map((p) => (
                      <button
                        key={p._id}
                        onClick={() => handleSelect(`/poojas`)}
                        className="w-full text-left p-2.5 bg-white hover:bg-[#F4EFE6] rounded-xl border border-[#E5DCCE] transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#3A1412]">{p.name}</p>
                          <p className="text-xs text-stone-600 line-clamp-1">{p.time} · {p.description}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7B1D16] transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Facilities */}
              {results.facilities.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Visitor Facilities ({results.facilities.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.facilities.map((f) => (
                      <button
                        key={f._id}
                        onClick={() => handleSelect('/facilities')}
                        className="w-full text-left p-2.5 bg-white hover:bg-[#F4EFE6] rounded-xl border border-[#E5DCCE] transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#3A1412]">{f.name}</p>
                          <p className="text-xs text-stone-600 line-clamp-1">{f.location} · {f.timing}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7B1D16] transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Parking */}
              {results.parking.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                    Parking Locations ({results.parking.length})
                  </h4>
                  <div className="space-y-1.5">
                    {results.parking.map((park) => (
                      <button
                        key={park._id}
                        onClick={() => handleSelect('/parking')}
                        className="w-full text-left p-2.5 bg-white hover:bg-[#F4EFE6] rounded-xl border border-[#E5DCCE] transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#3A1412]">{park.name}</p>
                          <p className="text-xs text-stone-600 line-clamp-1">{park.distance} · {park.capacity}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#7B1D16] transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
