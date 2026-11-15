import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle,
  QrCode,
  Flame,
  Info,
  Building2,
  Users
} from 'lucide-react';
import { api } from '../services/api';
import { Temple, Pooja, Booking } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const PoojaBookingPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Selected query params if coming from a temple page
  const queryParams = new URLSearchParams(location.search);
  const preselectedTempleId = queryParams.get('templeId');
  const preselectedPoojaId = queryParams.get('poojaId');

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [selectedPooja, setSelectedPooja] = useState<Pooja | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState<string>('06:00 AM - 07:00 AM');
  const [devoteeName, setDevoteeName] = useState(user?.name || '');
  const [gotram, setGotram] = useState('');
  const [nakshatram, setNakshatram] = useState('');
  const [personCount, setPersonCount] = useState<number>(2);
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [sankalpam, setSankalpam] = useState('Family Health, Peace & Prosperity');
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Available Time Slots
  const timeSlots = [
    { slot: '05:30 AM - 06:30 AM', label: 'Brahma Muhurtham (Early Dawn)', capacity: '6 slots available' },
    { slot: '06:30 AM - 07:30 AM', label: 'Pratahkaala Seva (Morning Pooja)', capacity: '8 slots available' },
    { slot: '08:30 AM - 09:30 AM', label: 'Madhyahna Darshan Slot', capacity: '12 slots available' },
    { slot: '11:00 AM - 12:00 PM', label: 'Abhishekam & Archana Slot', capacity: '4 slots available' },
    { slot: '05:00 PM - 06:00 PM', label: 'Sandhya Aarti & Special Seva', capacity: '9 slots available' },
    { slot: '07:00 PM - 08:00 PM', label: 'Ekantha Seva / Night Harathi', capacity: '5 slots available' }
  ];

  // Load temples
  useEffect(() => {
    setLoading(true);
    api.getTemples()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTemples(res.data);
          let match = res.data[0];
          if (preselectedTempleId) {
            const found = res.data.find(t => t._id === preselectedTempleId || t.slug === preselectedTempleId);
            if (found) match = found;
          }
          setSelectedTemple(match);
        }
      })
      .catch(err => console.error('Failed to load temples:', err))
      .finally(() => setLoading(false));
  }, [preselectedTempleId]);

  // Load poojas when selected temple changes
  useEffect(() => {
    if (!selectedTemple) return;
    api.getTemplePoojas(selectedTemple._id)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setPoojas(res.data);
          if (preselectedPoojaId) {
            const matchPooja = res.data.find(p => p._id === preselectedPoojaId);
            if (matchPooja) {
              setSelectedPooja(matchPooja);
              return;
            }
          }
          setSelectedPooja(res.data[0]);
        } else {
          setPoojas([]);
          setSelectedPooja(null);
        }
      })
      .catch(err => console.error('Failed to load poojas:', err));
  }, [selectedTemple, preselectedPoojaId]);

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedTemple || !selectedPooja) {
      setErrorMsg('Please select a temple and pooja.');
      return;
    }
    if (!devoteeName.trim() || !phone.trim() || !email.trim()) {
      setErrorMsg('Please provide devotee name, phone number, and email.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.createBooking({
        userId: user?._id,
        templeId: selectedTemple._id,
        templeName: selectedTemple.name,
        poojaId: selectedPooja._id,
        poojaName: selectedPooja.name,
        date: selectedDate,
        slot: selectedSlot,
        devoteeName: devoteeName.trim(),
        gotram: gotram.trim() || 'Kasyapa',
        nakshatram: nakshatram.trim() || 'Rohini',
        personCount,
        phone: phone.trim(),
        email: email.trim(),
        sankalpam: sankalpam.trim(),
        amount: (selectedPooja.price || 0) * personCount,
        paymentMode: 'Demo Online',
        status: 'Confirmed'
      });

      if (res.data) {
        setConfirmedBooking(res.data);
        setStep(4);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Booking submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState message="Loading pooja schedules & booking slots..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <Link to="/services" className="hover:text-[#E07A28] transition-colors">{t('nav.services')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('services.poojaBooking')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 flex items-center justify-center pointer-events-none">
          <Flame className="w-64 h-64 text-amber-300" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {t('booking.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('booking.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1.5 leading-relaxed">
            {t('booking.subtitle')}
          </p>
        </div>
      </div>

      {/* Step Indicators */}
      {step < 4 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <button
            type="button"
            onClick={() => setStep(1)}
            className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              step === 1
                ? 'bg-[#6D1B13] text-white border-[#6D1B13] shadow-xs'
                : 'bg-white text-stone-600 border-[#E8DEC8] hover:border-[#C25610]'
            }`}
          >
            {t('booking.step1')}
          </button>
          <button
            type="button"
            onClick={() => { if (selectedTemple && selectedPooja) setStep(2); }}
            className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              step === 2
                ? 'bg-[#6D1B13] text-white border-[#6D1B13] shadow-xs'
                : 'bg-white text-stone-600 border-[#E8DEC8] hover:border-[#C25610]'
            }`}
          >
            {t('booking.step2')}
          </button>
          <button
            type="button"
            onClick={() => { if (selectedTemple && selectedPooja) setStep(3); }}
            className={`py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
              step === 3
                ? 'bg-[#6D1B13] text-white border-[#6D1B13] shadow-xs'
                : 'bg-white text-stone-600 border-[#E8DEC8] hover:border-[#C25610]'
            }`}
          >
            {t('booking.step3')}
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-500 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Select Temple & Seva */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              1. Choose Sacred Temple Shrine
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {temples.map(temple => {
                const isSelected = selectedTemple?._id === temple._id;
                return (
                  <div
                    key={temple._id}
                    onClick={() => setSelectedTemple(temple)}
                    className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left flex items-start gap-3 ${
                      isSelected
                        ? 'border-[#C25610] bg-[#FFF8F0] shadow-xs ring-2 ring-[#C25610]/20'
                        : 'border-[#E8DEC8] bg-[#FAF7F2] hover:border-stone-400'
                    }`}
                  >
                    <Building2 className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-[#C25610]' : 'text-stone-400'}`} />
                    <div className="min-w-0">
                      <p className={`text-xs font-semibold truncate ${isSelected ? 'text-[#6D1B13]' : 'text-stone-800'}`}>
                        {temple.name}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate mt-0.5">
                        {temple.city}, {temple.state}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t border-[#E8DEC8] pt-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                2. Select Preferred Pooja / Seva
              </label>
              <span className="text-xs text-stone-500">{poojas.length} Sevas Available</span>
            </div>

            {poojas.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DEC8]">
                No specific poojas listed for this temple yet. You can still select walk-in darshan.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {poojas.map(pooja => {
                  const isSelected = selectedPooja?._id === pooja._id;
                  return (
                    <div
                      key={pooja._id}
                      onClick={() => setSelectedPooja(pooja)}
                      className={`cursor-pointer p-4 rounded-xl border transition-all text-left space-y-2 ${
                        isSelected
                          ? 'border-[#C25610] bg-[#FFF8F0] ring-2 ring-[#C25610]/20 shadow-xs'
                          : 'border-[#E8DEC8] bg-white hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-[#8C2518] mb-1">
                            {pooja.category}
                          </span>
                          <h4 className="text-xs sm:text-sm font-bold text-[#6D1B13]">
                            {pooja.name}
                          </h4>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-[#C25610]">
                            {pooja.price > 0 ? `₹${pooja.price}` : 'Free'}
                          </span>
                          <p className="text-[10px] text-stone-400">per person</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {pooja.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-stone-500 pt-1 border-t border-[#F2EDE4]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          {pooja.time || 'Morning Ritual'}
                        </span>
                        <span>•</span>
                        <span>{pooja.duration || '45 mins'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E8DEC8]">
            <button
              type="button"
              disabled={!selectedTemple || !selectedPooja}
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <span>{t('common.next')}: Date & Slots</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Select Date & Time Slot */}
      {step === 2 && (
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#E8DEC8]">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#6D1B13]">
                {selectedPooja?.name}
              </h3>
              <p className="text-xs text-stone-500">{selectedTemple?.name} ({selectedTemple?.city})</p>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-xs text-[#C25610] hover:underline font-medium"
            >
              Change Seva
            </button>
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Auspicious Date
            </label>
            <div className="relative max-w-sm">
              <input
                type="date"
                min={new Date().toISOString().slice(0, 10)}
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm font-medium bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              />
            </div>
          </div>

          {/* Time Slots */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Select Available Seva Time Slot
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {timeSlots.map(({ slot, label, capacity }) => {
                const isSelected = selectedSlot === slot;
                return (
                  <div
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`cursor-pointer p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#C25610] bg-[#FFF8F0] ring-2 ring-[#C25610]/20 shadow-xs'
                        : 'border-[#E8DEC8] bg-[#FAF7F2] hover:border-stone-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-[#6D1B13]' : 'text-stone-800'}`}>
                        {slot}
                      </span>
                      <Clock className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C25610]' : 'text-stone-400'}`} />
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1">{label}</p>
                    <span className="inline-block mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {capacity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8DEC8]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E8DEC8] hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.back')}</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <span>{t('common.next')}: Devotee Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Devotee Details Form */}
      {step === 3 && (
        <form onSubmit={handleConfirmBooking} className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
          <div className="border-b border-[#E8DEC8] pb-4">
            <h3 className="text-base font-bold text-[#6D1B13]">
              Devotee & Sankalpam Details
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Enter the names of devotees participating in the sacred pooja.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.devoteeName')} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Sharma"
                  value={devoteeName}
                  onChange={e => setDevoteeName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.persons')} (1 to 6)
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <select
                  value={personCount}
                  onChange={e => setPersonCount(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Person' : 'Persons'}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.gotram')}
              </label>
              <input
                type="text"
                placeholder="e.g. Kasyapa, Bharadwaja, Vashishta"
                value={gotram}
                onChange={e => setGotram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.nakshatram')}
              </label>
              <input
                type="text"
                placeholder="e.g. Rohini, Ashwini, Krittika"
                value={nakshatram}
                onChange={e => setNakshatram(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.phone')} *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {t('booking.email')} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="devotee@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('booking.sankalpam')}
            </label>
            <input
              type="text"
              placeholder="e.g. Family Prosperity, Children Education, Health & Longevity"
              value={sankalpam}
              onChange={e => setSankalpam(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            />
          </div>

          {/* Booking Summary Box */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Temple & Seva:</span>
              <span className="font-semibold text-[#6D1B13]">{selectedTemple?.name} — {selectedPooja?.name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-600">Selected Date & Time:</span>
              <span className="font-semibold text-stone-800">{selectedDate} ({selectedSlot})</span>
            </div>
            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E8DEC8]">
              <span className="font-bold text-stone-700">Total Contribution:</span>
              <span className="font-bold text-base text-[#C25610]">
                {((selectedPooja?.price || 0) * personCount) > 0 ? `₹${(selectedPooja?.price || 0) * personCount}` : 'Free Devotee Seva'}
              </span>
            </div>
          </div>

          {/* College Project Demo Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{t('booking.demoNotice')}</span>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#E8DEC8]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E8DEC8] hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('common.back')}</span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'Confirming...' : t('booking.confirmBtn')}</span>
            </button>
          </div>
        </form>
      )}

      {/* STEP 4: Confirmation & Digital Pass */}
      {step === 4 && confirmedBooking && (
        <div className="bg-white rounded-2xl border-2 border-[#C25610]/40 p-6 sm:p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-emerald-100 border-2 border-emerald-400 text-emerald-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-temple-heading text-[#6D1B13]">
              {t('booking.successTitle')}
            </h2>
            <p className="text-xs text-stone-500">
              Your digital seva pass has been issued. Please save or print this confirmation.
            </p>
          </div>

          {/* Printable Ticket Pass Placard */}
          <div className="border border-[#E8DEC8] rounded-2xl bg-[#FFFBF5] p-5 sm:p-6 relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="space-y-3 flex-1 text-left w-full">
                <div className="inline-block px-3 py-1 rounded bg-[#6D1B13] text-amber-300 text-xs font-bold font-mono">
                  {t('booking.idLabel')}: {confirmedBooking.bookingId}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-[#6D1B13]">
                    {confirmedBooking.templeName}
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">
                    {confirmedBooking.poojaName}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-[#E8DEC8]">
                  <div>
                    <span className="text-stone-500 block">Date & Time Slot:</span>
                    <span className="font-semibold text-stone-800">{confirmedBooking.date}</span>
                    <p className="text-[11px] text-[#C25610]">{confirmedBooking.slot}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Primary Devotee:</span>
                    <span className="font-semibold text-stone-800">{confirmedBooking.devoteeName}</span>
                    <p className="text-[11px] text-stone-500">Gotram: {confirmedBooking.gotram || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Number of Devotees:</span>
                    <span className="font-semibold text-stone-800">{confirmedBooking.personCount} Persons</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Pass Status:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed & Active
                    </span>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-stone-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-200/50">
                  <p className="font-medium text-amber-900">Reporting Instructions:</p>
                  <p>Please report at the Temple Seva Reporting Counter 30 minutes prior to your slot. Traditional dress code mandatory.</p>
                </div>
              </div>

              {/* QR Code Placard */}
              <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-[#E8DEC8] shadow-xs shrink-0 text-center">
                {confirmedBooking.qrDataUrl ? (
                  <img
                    src={confirmedBooking.qrDataUrl}
                    alt="Seva Pass QR"
                    className="w-36 h-36 object-contain"
                  />
                ) : (
                  <QrCode className="w-36 h-36 text-[#6D1B13]" />
                )}
                <span className="text-[10px] text-stone-500 font-medium mt-1">
                  Scan at Seva Counter Gate
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-sm font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>{t('booking.downloadPass')}</span>
            </button>
            <Link
              to="/profile?tab=bookings"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs transition-colors"
            >
              <span>{t('booking.viewMyBookings')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() => {
                setConfirmedBooking(null);
                setStep(1);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C25610] text-[#C25610] hover:bg-orange-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              <span>{t('booking.bookAnother')}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
