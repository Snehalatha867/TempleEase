import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#4D100A] text-[#F3E8D8] border-t-2 border-[#D4AF37]/40">
      {/* Top Value Banner matching reference image */}
      <div className="border-b border-[#D4AF37]/20 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xl">🪷</span>
            <span className="font-serif italic text-lg sm:text-xl tracking-wider text-[#FFD88A]">
              Faith &nbsp;·&nbsp; Knowledge &nbsp;·&nbsp; Convenience
            </span>
            <span className="text-xl">🪷</span>
          </div>

          <div className="text-xs text-[#E5D2BA] tracking-wide">
            Temple Ease © 2025 | All Rights Reserved
          </div>
        </div>
      </div>

      {/* Main Multi-Temple Directory Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-temple-heading text-white">Temple Ease</span>
            </div>
            <p className="text-[#DACDB8] leading-relaxed max-w-sm">
              A centralized digital platform bringing verified temple information across India into one accessible destination. Built as an Engineering College Community Service Project to guide first-time visitors and devout pilgrims.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-[#FFD88A] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Verified data from official temple trusts & government endowment portals</span>
            </div>
          </div>

          {/* Popular Temples */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 border-b border-[#D4AF37]/30 pb-1">
              Prominent Temples
            </h4>
            <ul className="space-y-2 text-[#DACDB8]">
              <li><Link to="/temples/tirumala-venkateswara" className="hover:text-white transition-colors">Sri Venkateswara (Tirumala)</Link></li>
              <li><Link to="/temples/srisailam-mallikarjuna" className="hover:text-white transition-colors">Mallikarjuna Swamy (Srisailam)</Link></li>
              <li><Link to="/temples/madurai-meenakshi-amman" className="hover:text-white transition-colors">Meenakshi Amman (Madurai)</Link></li>
              <li><Link to="/temples/puri-jagannath-temple" className="hover:text-white transition-colors">Jagannath Temple (Puri)</Link></li>
              <li><Link to="/temples/somnath-temple-gujarat" className="hover:text-white transition-colors">Somnath Temple (Gujarat)</Link></li>
              <li><Link to="/temples/kashi-vishwanath-varanasi" className="hover:text-white transition-colors">Kashi Vishwanath (Varanasi)</Link></li>
            </ul>
          </div>

          {/* Visitor Services */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 border-b border-[#D4AF37]/30 pb-1">
              Visitor Services
            </h4>
            <ul className="space-y-2 text-[#DACDB8]">
              <li><Link to="/timings" className="hover:text-white transition-colors">Timings & Pooja Schedule</Link></li>
              <li><Link to="/map" className="hover:text-white transition-colors">Interactive Temple Map</Link></li>
              <li><Link to="/parking" className="hover:text-white transition-colors">Parking & Facilities</Link></li>
              <li><Link to="/hospitals" className="hover:text-white transition-colors">Nearby Hospitals</Link></li>
              <li><Link to="/emergency" className="hover:text-white transition-colors">Emergency Help Numbers</Link></li>
              <li><Link to="/guidelines" className="hover:text-white transition-colors">Dress Code & Guidelines</Link></li>
            </ul>
          </div>

          {/* Explore & Trust */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3 border-b border-[#D4AF37]/30 pb-1">
              Community Project
            </h4>
            <ul className="space-y-2 text-[#DACDB8]">
              <li><Link to="/about" className="hover:text-white transition-colors">About Temple Ease</Link></li>
              <li><Link to="/temples" className="hover:text-white transition-colors">Multi-Temple Directory</Link></li>
              <li><Link to="/qr" className="hover:text-white transition-colors">QR Code Access</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Pilgrim Desk</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Temple Trust Portal</Link></li>
            </ul>
            <div className="mt-4 pt-3 border-t border-[#D4AF37]/20 flex items-center gap-1.5 text-[10px] text-[#DACDB8]">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-red-400 fill-current" />
              <span>for Devotees across India</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
