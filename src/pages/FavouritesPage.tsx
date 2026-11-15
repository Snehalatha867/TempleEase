import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Trash2, 
  ArrowRight, 
  Sparkles, 
  Building2,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { Favorite, Temple } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';
import { getTempleImageUrl, handleImageError } from '../utils/imageUtils';

export const FavouritesPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getFavorites().catch(() => ({ data: [] })),
      api.getTemples()
    ])
      .then(([favRes, tRes]) => {
        if (favRes.data) setFavorites(favRes.data);
        if (tRes.data) setTemples(tRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (itemId: string) => {
    try {
      await api.removeFavorite(itemId);
      setFavorites(prev => prev.filter(f => f.itemId !== itemId && f._id !== itemId));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  };

  // Find corresponding temple for each favorite
  const resolvedTemples = favorites.map(fav => {
    const matched = temples.find(t => t._id === fav.itemId || t.slug === fav.itemId);
    return {
      fav,
      temple: matched || fav.temple
    };
  });

  if (loading) {
    return <LoadingState message="Loading your favourite shrines..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('favourites.title')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
            {t('favourites.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('favourites.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1">
            {t('favourites.subtitle')}
          </p>
        </div>

        <Link
          to="/temples"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#6D1B13] text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>{t('favourites.exploreBtn')}</span>
        </Link>
      </div>

      {/* Favorites List / Grid */}
      {favorites.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-[#E8DEC8] p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-500 mx-auto flex items-center justify-center">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-stone-800">
              No Favourite Temples Added Yet
            </h3>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              {t('favourites.empty')}
            </p>
          </div>
          <Link
            to="/temples"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{t('favourites.exploreBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resolvedTemples.map(({ fav, temple }) => {
            const templeName = temple?.name || fav.title || 'Sacred Temple';
            const locationStr = temple ? `${temple.city}, ${temple.state}` : (fav.details || 'India');
            const deity = temple?.deity || 'Presiding Supreme Deity';
            const timings = temple?.morningTimings || '06:00 AM – 09:00 PM';
            const imageSrc = getTempleImageUrl(temple?.bannerImage, temple?._id || temple?.slug);
            const templePath = temple?.slug ? `/temples/${temple.slug}` : (temple?._id ? `/temples/${temple._id}` : '/temples');

            return (
              <div
                key={fav._id}
                className="bg-white rounded-2xl border border-[#E8DEC8] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={imageSrc}
                    alt={templeName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => handleImageError(e, temple?._id || temple?.slug)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Remove Favourite Button on top right */}
                  <button
                    type="button"
                    onClick={() => handleRemove(fav.itemId || fav._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-red-50 text-stone-600 hover:text-red-600 shadow-sm transition-colors cursor-pointer"
                    title="Remove from Favourites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/80 backdrop-blur-xs text-white mb-1">
                      {deity}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold font-temple-heading truncate text-amber-50">
                      {templeName}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <MapPin className="w-3.5 h-3.5 text-[#C25610] shrink-0" />
                      <span className="truncate">{locationStr}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-stone-500">
                      <Clock className="w-3.5 h-3.5 text-[#C25610] shrink-0" />
                      <span className="truncate">{timings}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-[#F2EDE4] flex items-center justify-between gap-2">
                    <Link
                      to={templePath}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>{t('home.viewDetails')}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>

                    <Link
                      to={`/booking?templeId=${temple?._id || fav.itemId}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#C25610] text-[#C25610] hover:bg-orange-50 text-xs font-semibold transition-colors"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Book Seva</span>
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
