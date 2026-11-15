import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Sparkles, 
  Filter, 
  Plus, 
  AlertCircle,
  Building2,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { CalendarEvent, Temple } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const TempleCalendarPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTempleId, setSelectedTempleId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Month navigation (Default to November 2026 as in mockup or current date)
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 10, 1)); // November 2026
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-11-15');

  // Admin Add Event Modal
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTempleId, setNewTempleId] = useState('all');
  const [newDate, setNewDate] = useState('2026-11-15');
  const [newTime, setNewTime] = useState('06:00 AM – 08:00 AM');
  const [newCategory, setNewCategory] = useState<'Festival' | 'Pooja' | 'Special Seva' | 'Timing Change' | 'Announcement'>('Special Seva');
  const [newDesc, setNewDesc] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [savingEvent, setSavingEvent] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getTemples(),
      api.getCalendarEvents()
    ])
      .then(([tRes, evRes]) => {
        if (tRes.data) setTemples(tRes.data);
        if (evRes.data) setEvents(evRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Filter events
  const filteredEvents = events.filter(ev => {
    if (selectedTempleId !== 'all' && ev.templeId !== 'all' && ev.templeId !== selectedTempleId) {
      return false;
    }
    if (selectedCategory !== 'all' && ev.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  // Events for selected date
  const eventsForSelectedDate = filteredEvents.filter(ev => ev.date === selectedDateStr);

  // Check if a day has events
  const hasEventOnDay = (day: number) => {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return filteredEvents.some(ev => ev.date === dStr);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDate || !newTime || !newDesc.trim()) return;

    setSavingEvent(true);
    try {
      const templeName = newTempleId === 'all'
        ? 'All Temples'
        : (temples.find(t => t._id === newTempleId)?.name || 'Temple');

      const res = await api.createCalendarEvent({
        templeId: newTempleId,
        templeName,
        title: newTitle.trim(),
        date: newDate,
        time: newTime.trim(),
        category: newCategory,
        description: newDesc.trim(),
        location: newLocation.trim() || undefined,
        priority: 'Normal'
      });

      if (res.data) {
        setEvents([...events, res.data]);
        setAdminModalOpen(false);
        setNewTitle('');
        setNewDesc('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingEvent(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading sacred temple calendar & festivals..." />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('services.calendar')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <CalendarIcon className="w-3.5 h-3.5 text-amber-300" />
            {t('calendar.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('calendar.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
            {t('calendar.subtitle')}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setAdminModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#6D1B13] text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Event (Admin)</span>
          </button>
        )}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Temple Filter */}
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-400" />
            <select
              value={selectedTempleId}
              onChange={e => setSelectedTempleId(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="all">All Temples in India</option>
              {temples.map(t => (
                <option key={t._id} value={t._id}>{t.name} ({t.city})</option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="all">All Event Categories</option>
              <option value="Special Seva">Special Sevas</option>
              <option value="Festival">Festivals & Utsavams</option>
              <option value="Pooja">Daily & Periodic Poojas</option>
              <option value="Timing Change">Temple Timing Changes</option>
              <option value="Announcement">Temple Announcements</option>
            </select>
          </div>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Showing <span className="font-bold text-[#6D1B13]">{filteredEvents.length}</span> listed religious events
        </div>
      </div>

      {/* Main Grid: Calendar on Left, Selected Day Events on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive Calendar (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
          
          {/* Month Navigation */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E8DEC8]">
            <h2 className="text-base sm:text-lg font-bold text-[#6D1B13]">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg border border-[#E8DEC8] hover:bg-stone-50 text-stone-600 transition-colors"
                title="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg border border-[#E8DEC8] hover:bg-stone-50 text-stone-600 transition-colors"
                title="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-stone-400 uppercase py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {/* Blank offset days */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`blank-${i}`} className="h-12 sm:h-14 rounded-xl bg-transparent" />
            ))}

            {/* Days of month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const hasEvents = hasEventOnDay(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-12 sm:h-14 rounded-xl border flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#6D1B13] text-white border-[#6D1B13] shadow-xs'
                      : hasEvents
                      ? 'bg-amber-50/70 border-amber-300 text-[#6D1B13] font-semibold hover:border-[#C25610]'
                      : 'bg-[#FAF7F2] border-[#E8DEC8] text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <span className="text-xs sm:text-sm">{day}</span>
                  {hasEvents && (
                    <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-amber-300' : 'bg-[#C25610]'}`} />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-3 border-t border-[#E8DEC8] text-[11px] text-stone-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C25610]" />
              <span>Days with Special Seva / Festival</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#6D1B13]" />
              <span>Selected Date</span>
            </div>
          </div>
        </div>

        {/* Right Column: Events on Selected Date (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8DEC8] p-6 shadow-xs space-y-4">
          <div className="border-b border-[#E8DEC8] pb-3">
            <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
              {t('calendar.eventsOn')}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-[#6D1B13] mt-0.5">
              {new Date(selectedDateStr + 'T00:00:00').toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
          </div>

          {eventsForSelectedDate.length === 0 ? (
            <div className="p-8 text-center text-xs text-stone-500 bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DEC8] space-y-2">
              <Sparkles className="w-6 h-6 text-stone-400 mx-auto" />
              <p>{t('calendar.noEvents')}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {eventsForSelectedDate.map(ev => {
                const categoryColor =
                  ev.category === 'Festival'
                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                    : ev.category === 'Special Seva'
                    ? 'bg-amber-100 text-amber-900 border-amber-200'
                    : ev.category === 'Timing Change'
                    ? 'bg-blue-100 text-blue-900 border-blue-200'
                    : 'bg-emerald-100 text-emerald-900 border-emerald-200';

                return (
                  <div
                    key={ev._id}
                    className="p-4 rounded-xl border border-[#E8DEC8] bg-[#FFFBF5] space-y-2 hover:shadow-xs transition-shadow text-left"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${categoryColor}`}>
                        {ev.category}
                      </span>
                      <span className="text-[11px] font-bold text-[#C25610] flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#C25610]" />
                        {ev.time}
                      </span>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-[#6D1B13]">
                      {ev.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed">
                      {ev.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-[#F2EDE4]">
                      <span className="font-medium text-stone-700 truncate max-w-[200px]">
                        {ev.templeName}
                      </span>
                      {ev.location && (
                        <span className="flex items-center gap-1 text-stone-500">
                          <MapPin className="w-3 h-3" />
                          {ev.location}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Quick link to book seva */}
          <div className="pt-3 border-t border-[#E8DEC8]">
            <Link
              to="/booking"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Book Pooja / Seva for this Date</span>
            </Link>
          </div>
        </div>

      </div>

      {/* Admin Add Event Modal */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8DEC8]">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="text-base font-bold text-[#6D1B13]">
                Publish Sacred Calendar Event
              </h3>
              <button
                type="button"
                onClick={() => setAdminModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Temple
                </label>
                <select
                  value={newTempleId}
                  onChange={e => setNewTempleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                >
                  <option value="all">All Temples / National Observance</option>
                  {temples.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Karthika Deepotsavam & Maha Deepam"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Event Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Time / Timings *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 6:00 AM – 8:00 AM"
                    value={newTime}
                    onChange={e => setNewTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                  >
                    <option value="Special Seva">Special Seva</option>
                    <option value="Festival">Festival</option>
                    <option value="Pooja">Daily / Periodic Pooja</option>
                    <option value="Timing Change">Timing Change</option>
                    <option value="Announcement">Announcement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Outer Prakaram"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Details of rituals, darshan guidelines, and pilgrim instructions..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DEC8] text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={savingEvent}
                  className="px-5 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {savingEvent ? 'Saving...' : 'Publish Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
