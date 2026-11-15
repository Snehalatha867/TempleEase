import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  MapPin, 
  Users, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Award
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3 border-b border-[#E8DEC8] pb-8">
        <span className="text-xs font-bold text-[#E07A28] uppercase tracking-widest bg-[#EFE7D8] px-3 py-1 rounded-full border border-[#DACDB8]">
          Community Service Project
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold font-temple-heading text-[#3A1412] tracking-tight">
          About Temple Ease
        </h1>
        <p className="text-base text-stone-600 max-w-2xl mx-auto font-serif italic">
          One Platform. Many Temples. Everything a Devotee Needs.
        </p>
      </div>

      {/* Mission & Background */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-[#E07A28]" />
          <h2 className="text-xl font-bold font-temple-heading text-[#3A1412]">
            Our Purpose & Social Mission
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          <strong>Temple Ease</strong> was conceived and developed as an <strong>Engineering College Community Service Project</strong>. India is home to hundreds of ancient, magnificent, and spiritually profound temples, each governed by unique centuries-old traditions, morning-to-night ritual schedules, dress codes, queue tokens, and parking facilities.
        </p>
        <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          First-time pilgrims and elderly devotees frequently struggle to find consolidated, verified information without having to navigate dozens of separate websites, decipher contradictory blogs, or rely on hearsay. Temple Ease bridges this divide by providing a unified digital guide where verified schedules, parking rules, nearby medical emergency contacts, and prasadam details are accessible in one dignified space.
        </p>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFE7D8] text-[#7B1D16] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
            1. Verified Official Data
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            All records are drawn directly from official temple administrative trusts (such as TTD, Srisailam Devasthanam, HR&CE Tamil Nadu, and State Endowments Departments). We never present fabricated schedules or unauthorized numbers.
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFE7D8] text-[#7B1D16] flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
            2. First-Time Devotee Friendly
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Special emphasis is placed on pragmatic visitor assistance: exact dress code rules for men and women, free footwear counters, wheelchair assistance, and multi-tier queue guidelines.
          </p>
        </div>

        <div className="bg-[#FAF7F2] rounded-2xl border border-[#E8DEC8] p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#EFE7D8] text-[#7B1D16] flex items-center justify-center">
            <QrCode className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
            3. Instant QR Access
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Devotees on site can scan dynamic QR codes stationed at gopurams and entrances to immediately load that temple&apos;s real-time schedule without mandatory sign-up or app downloads.
          </p>
        </div>
      </div>

      {/* Official Inspiration & Source Credits */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
          Institutional Inspiration & Verified Sources
        </h3>
        <p className="text-xs text-stone-600 leading-relaxed">
          Temple Ease adapts the comprehensive information architecture of leading spiritual institutions while maintaining an original, modern digital identity:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <a
            href="https://www.tirumala.org/"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] hover:border-[#7B1D16] transition-colors flex items-center justify-between"
          >
            <span>Tirumala Tirupati Devasthanams (TTD)</span>
            <span className="text-[10px] text-[#7B1D16] font-semibold">tirumala.org ↗</span>
          </a>

          <a
            href="https://tms.ap.gov.in/"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] hover:border-[#7B1D16] transition-colors flex items-center justify-between"
          >
            <span>AP Endowments Department</span>
            <span className="text-[10px] text-[#7B1D16] font-semibold">tms.ap.gov.in ↗</span>
          </a>

          <a
            href="https://www.srisailadevasthanam.org/"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] hover:border-[#7B1D16] transition-colors flex items-center justify-between"
          >
            <span>Srisailam Devasthanam</span>
            <span className="text-[10px] text-[#7B1D16] font-semibold">srisailadevasthanam.org ↗</span>
          </a>

          <a
            href="https://kanakadurgamma.org/"
            target="_blank"
            rel="noreferrer"
            className="p-3 bg-[#FAF7F2] rounded-xl border border-[#EFE7D8] hover:border-[#7B1D16] transition-colors flex items-center justify-between"
          >
            <span>Kanaka Durga Temple Indrakeeladri</span>
            <span className="text-[10px] text-[#7B1D16] font-semibold">kanakadurgamma.org ↗</span>
          </a>
        </div>
      </div>

      {/* Call to action */}
      <div className="bg-[#4D100A] text-white rounded-2xl p-8 text-center space-y-4">
        <h3 className="text-xl font-bold font-temple-heading">
          Explore India&apos;s Sacred Temples Today
        </h3>
        <p className="text-xs sm:text-sm text-[#E5D2BA] max-w-xl mx-auto">
          Start your spiritual journey by discovering temple histories, pooja timings, and parking amenities across India.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            to="/temples"
            className="px-6 py-2.5 bg-[#E07A28] hover:bg-[#C25610] text-white text-xs font-semibold rounded-full shadow-md transition-colors"
          >
            Browse All Temples
          </Link>
          <Link
            to="/contact"
            className="px-6 py-2.5 bg-transparent border border-white/40 hover:bg-white/10 text-white text-xs font-semibold rounded-full transition-colors"
          >
            Contact Pilgrim Desk
          </Link>
        </div>
      </div>
    </div>
  );
};
