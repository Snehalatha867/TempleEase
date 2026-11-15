import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading verified temple information...' 
}) => {
  return (
    <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-[#F4EFE6] flex items-center justify-center text-[#C25610] shadow-xs">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#4A3E39]">{message}</p>
      <p className="text-xs text-stone-500">Connecting to Temple Ease database...</p>
    </div>
  );
};

export const CardSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i} 
          className="bg-white border border-[#E5DCCE] rounded-xl p-6 shadow-xs animate-pulse space-y-4"
        >
          <div className="h-4 bg-stone-200 rounded w-1/3"></div>
          <div className="h-6 bg-stone-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-stone-200 rounded"></div>
            <div className="h-3 bg-stone-200 rounded w-5/6"></div>
          </div>
          <div className="h-8 bg-stone-100 rounded w-full pt-4"></div>
        </div>
      ))}
    </div>
  );
};
