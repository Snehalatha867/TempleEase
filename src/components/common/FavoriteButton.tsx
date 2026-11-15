import React, { useState } from 'react';
import { Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'temple' | 'pooja' | 'facility' | 'schedule';
  title: string;
  details?: string;
  initialFavorited?: boolean;
  onToggle?: (isFav: boolean) => void;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemId,
  itemType,
  title,
  details,
  initialFavorited = false,
  onToggle
}) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      if (confirm('Please log in or create an account to save favorite temple sevas and facilities.')) {
        navigate('/login');
      }
      return;
    }

    setLoading(true);
    try {
      if (isFavorited) {
        await api.removeFavorite(itemId);
        setIsFavorited(false);
        onToggle?.(false);
      } else {
        await api.addFavorite({ itemId, itemType, title, details });
        setIsFavorited(true);
        onToggle?.(true);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`p-2 rounded-full transition-all flex items-center justify-center ${
        isFavorited
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
          : 'bg-[#FAF7F2] text-stone-400 hover:text-rose-500 hover:bg-white border border-[#E5DCCE]'
      }`}
      title={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#C25610]" />
      ) : (
        <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
      )}
    </button>
  );
};
