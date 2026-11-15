import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Compass, 
  Clock, 
  MapPin, 
  Car, 
  ShieldCheck, 
  Printer, 
  Bookmark, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar, 
  Users, 
  HeartHandshake, 
  Sparkles, 
  PhoneCall, 
  Droplet,
  ArrowRight,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import { Temple, VisitPlan } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const VisitorPlannerPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const preselectedTempleId = queryParams.get('templeId');

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  // Form states
  const [visitDate, setVisitDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().slice(0, 10);
  });
  const [arrivalTime, setArrivalTime] = useState('06:00 AM');
  const [visitorCount, setVisitorCount] = useState<number>(3);
  const [hasElderly, setHasElderly] = useState(false);
  const [hasChildren, setHasChildren] = useState(false);
  const [wheelchairNeeded, setWheelchairNeeded] = useState(false);
  const [transportMode, setTransportMode] = useState('Private Car');
  const [notes, setNotes] = useState('');

  // Generated Plan
  const [generatedPlan, setGeneratedPlan] = useState<VisitPlan | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
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
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [preselectedTempleId]);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemple) return;

    setGenerating(true);
    setSavedSuccess(false);

    try {
      const res = await api.createVisitPlan({
        userId: user?._id,
        templeId: selectedTemple._id,
        templeName: selectedTemple.name,
        visitDate,
        visitorCount,
        arrivalTime,
        hasElderly,
        hasChildren,
        transportMode,
        wheelchairNeeded,
        notes
      });

      if (res.data) {
        setGeneratedPlan(res.data);
        setSavedSuccess(true);
      }
    } catch (err) {
      console.error('Failed to generate visit plan:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingState message="Loading visitor trip planner & temple data..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('services.planner')}</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <Compass className="w-3.5 h-3.5 text-amber-300" />
            {t('planner.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('planner.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1.5 leading-relaxed">
            {t('planner.subtitle')}
          </p>
        </div>
      </div>

      {/* Input Form Section */}
      <form onSubmit={handleGeneratePlan} className="bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
            1. {t('planner.selectTemple')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {temples.map(tItem => {
              const isSelected = selectedTemple?._id === tItem._id;
              return (
                <div
                  key={tItem._id}
                  onClick={() => setSelectedTemple(tItem)}
                  className={`cursor-pointer p-3.5 rounded-xl border transition-all text-left flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#C25610] bg-[#FFF8F0] shadow-xs ring-2 ring-[#C25610]/20'
                      : 'border-[#E8DEC8] bg-[#FAF7F2] hover:border-stone-400'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mt-0.5 shrink-0 ${isSelected ? 'text-[#C25610]' : 'text-stone-400'}`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-semibold truncate ${isSelected ? 'text-[#6D1B13]' : 'text-stone-800'}`}>
                      {tItem.name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate mt-0.5">
                      {tItem.city}, {tItem.state}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#E8DEC8]">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('planner.visitDate')} *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().slice(0, 10)}
              value={visitDate}
              onChange={e => setVisitDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('planner.arrivalTime')}
            </label>
            <select
              value={arrivalTime}
              onChange={e => setArrivalTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="05:00 AM">05:00 AM (Early Dawn Suprabhatam)</option>
              <option value="06:00 AM">06:00 AM (Morning Best Arrival)</option>
              <option value="07:30 AM">07:30 AM (Morning Darshan)</option>
              <option value="09:30 AM">09:30 AM (Mid-Morning Session)</option>
              <option value="04:00 PM">04:00 PM (Evening Session Arrival)</option>
              <option value="06:00 PM">06:00 PM (Sandhya Aarti Session)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('planner.visitorCount')}
            </label>
            <select
              value={visitorCount}
              onChange={e => setVisitorCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 15].map(cnt => (
                <option key={cnt} value={cnt}>
                  {cnt} {cnt === 1 ? 'Devotee' : 'Devotees (Family/Group)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Accessibility & Special Needs Checkboxes */}
        <div className="pt-4 border-t border-[#E8DEC8] space-y-3">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
            Family & Accessibility Preferences
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] cursor-pointer hover:border-stone-400">
              <input
                type="checkbox"
                checked={hasElderly}
                onChange={e => setHasElderly(e.target.checked)}
                className="w-4 h-4 text-[#C25610] rounded focus:ring-0"
              />
              <span className="text-xs text-stone-700 font-medium">
                {t('planner.elderlyTraveling')}
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] cursor-pointer hover:border-stone-400">
              <input
                type="checkbox"
                checked={hasChildren}
                onChange={e => setHasChildren(e.target.checked)}
                className="w-4 h-4 text-[#C25610] rounded focus:ring-0"
              />
              <span className="text-xs text-stone-700 font-medium">
                {t('planner.childrenTraveling')}
              </span>
            </label>

            <label className="flex items-center gap-2.5 p-3 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] cursor-pointer hover:border-stone-400">
              <input
                type="checkbox"
                checked={wheelchairNeeded}
                onChange={e => setWheelchairNeeded(e.target.checked)}
                className="w-4 h-4 text-[#C25610] rounded focus:ring-0"
              />
              <span className="text-xs text-stone-700 font-medium">
                {t('planner.wheelchairNeeded')}
              </span>
            </label>
          </div>
        </div>

        {/* Mode of travel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E8DEC8]">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {t('planner.transportMode')}
            </label>
            <select
              value={transportMode}
              onChange={e => setTransportMode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="Private Car / Four-Wheeler">Private Car / Four-Wheeler (Needs Parking)</option>
              <option value="Train / Public Bus Devasthanam Shuttle">Train / Public Bus Devasthanam Shuttle</option>
              <option value="Hired Taxi / Cab">Hired Taxi / Cab (Drop & Pick up)</option>
              <option value="Pedestrian Footpath / Sopanam Path">Sacred Pedestrian Footpath / Trekking</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Special Requests or Notes (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Need tonsuring assistance, Annadanam lunch preference"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#E8DEC8]">
          <button
            type="submit"
            disabled={generating}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{generating ? 'Calculating Itinerary...' : t('planner.generateBtn')}</span>
          </button>
        </div>
      </form>

      {/* Generated Visit Plan Result Display */}
      {generatedPlan && (
        <div className="bg-white rounded-2xl border-2 border-[#C25610]/40 p-6 sm:p-8 shadow-md space-y-6">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#C25610] bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Pilgrim Plan
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-temple-heading text-[#6D1B13]">
                {generatedPlan.templeName} — Visit Plan
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Visit Date: <span className="font-semibold text-stone-800">{generatedPlan.visitDate}</span> | Group: <span className="font-semibold text-stone-800">{generatedPlan.visitorCount} Devotees</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>{t('planner.printBtn')}</span>
              </button>
              <Link
                to={`/booking?templeId=${generatedPlan.templeId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Book Pooja for This Day</span>
              </Link>
            </div>
          </div>

          {/* Key Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Recommended Arrival
              </span>
              <p className="text-xs font-bold text-[#6D1B13] mt-1">
                {generatedPlan.summary.recommendedArrival}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Estimated Duration
              </span>
              <p className="text-xs font-bold text-stone-800 mt-1">
                {generatedPlan.summary.estimatedDuration}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Parking Zone
              </span>
              <p className="text-xs font-bold text-stone-800 mt-1 truncate">
                {generatedPlan.summary.parkingZone}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Prasadam & Annadanam
              </span>
              <p className="text-xs font-bold text-stone-800 mt-1">
                {generatedPlan.summary.prasadamCounter}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Emergency & First Aid
              </span>
              <p className="text-xs font-bold text-stone-800 mt-1 truncate">
                {generatedPlan.summary.emergencyDesk}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2]">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                Dress Code
              </span>
              <p className="text-xs font-bold text-stone-800 mt-1 truncate">
                {generatedPlan.summary.dressCodeSummary}
              </p>
            </div>
          </div>

          {/* Chronological Itinerary Steps */}
          <div>
            <h3 className="text-sm font-bold text-[#6D1B13] uppercase tracking-wider mb-3">
              Personalized Chronological Itinerary
            </h3>
            <div className="relative border-l-2 border-[#E8DEC8] ml-3 space-y-5 py-2">
              {generatedPlan.itinerary.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-[#C25610] border-2 border-white shadow-xs" />
                  <div className="p-3.5 rounded-xl border border-[#E8DEC8] bg-[#FFFBF5]">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#6D1B13]">{step.title}</span>
                      <span className="text-[11px] font-semibold text-[#C25610] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Special Advice for Elderly / Children */}
          {(generatedPlan.hasElderly || generatedPlan.hasChildren || generatedPlan.wheelchairNeeded) && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 text-xs text-amber-900">
              <p className="font-bold flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-700" />
                Senior Citizen & Family Assistance Notes:
              </p>
              <ul className="list-disc list-inside space-y-1 text-stone-700">
                {generatedPlan.hasElderly && <li>Report to Senior Citizen Queue gate with valid Age Proof (Aadhaar/Senior ID card) for accelerated darshan.</li>}
                {generatedPlan.wheelchairNeeded && <li>Free wheelchair assistance is stationed right at the main entrance gate. Devasthanam volunteers will escort up to the sanctum corridor.</li>}
                {generatedPlan.hasChildren && <li>Infant milk feeding rooms and drinking water points are stationed every 100 meters along all queue lines.</li>}
              </ul>
            </div>
          )}

          {/* Footer Save notice */}
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>This visit plan is automatically saved to your profile for easy access anytime.</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
