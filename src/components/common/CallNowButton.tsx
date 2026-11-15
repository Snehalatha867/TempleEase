import React from 'react';
import { PhoneCall } from 'lucide-react';

interface CallNowButtonProps {
  phone: string;
  label?: string;
  variant?: 'danger' | 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const CallNowButton: React.FC<CallNowButtonProps> = ({
  phone,
  label = 'Call Now',
  variant = 'danger',
  size = 'md'
}) => {
  // Clean phone string for tel: link
  const cleanNumber = phone.replace(/[^0-9+]/g, '');

  const variantStyles = {
    danger: 'bg-rose-700 hover:bg-rose-800 text-white shadow-xs',
    primary: 'bg-[#C25610] hover:bg-[#9A3A08] text-white shadow-xs',
    secondary: 'bg-[#F4EFE6] hover:bg-[#EDE5D8] text-[#3A1412] border border-[#E5DCCE]'
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs font-semibold gap-2',
    lg: 'px-5 py-2.5 text-sm font-bold gap-2.5'
  };

  return (
    <a
      href={`tel:${cleanNumber}`}
      className={`inline-flex items-center justify-center rounded-lg transition-colors whitespace-nowrap shrink-0 ${variantStyles[variant]} ${sizeStyles[size]}`}
      title={`Call ${phone}`}
    >
      <PhoneCall className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'} />
      <span>{label}</span>
    </a>
  );
};
