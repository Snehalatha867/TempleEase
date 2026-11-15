import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  AlertTriangle, 
  Info, 
  Calendar, 
  Building2, 
  Filter, 
  Plus, 
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Announcement, Temple } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const AnnouncementsPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedTempleId, setSelectedTempleId] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');

  // Admin Add Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [templeId, setTempleId] = useState('all');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Urgent' | 'Important' | 'Notice' | 'General'>('Important');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.getAnnouncements(),
      api.getTemples()
    ])
      .then(([aRes, tRes]) => {
        if (aRes.data) setAnnouncements(aRes.data);
        if (tRes.data) setTemples(tRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter(item => {
    if (selectedTempleId !== 'all' && item.templeId !== 'all' && item.templeId !== selectedTempleId) {
      return false;
    }
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) {
      return false;
    }
    return true;
  });

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    try {
      const templeName = templeId === 'all'
        ? 'All Temples'
        : (temples.find(t => t._id === templeId)?.name || 'Temple');

      const res = await api.createAnnouncement({
        templeId,
        templeName,
        title: title.trim(),
        description: description.trim(),
        priority,
        publishDate: new Date().toISOString().slice(0, 10),
        expiryDate: expiryDate || undefined,
        active: true
      });

      if (res.data) {
        setAnnouncements([res.data, ...announcements]);
        setModalOpen(false);
        setTitle('');
        setDescription('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading temple notices & announcements..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('services.announcements')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <Bell className="w-3.5 h-3.5 text-amber-300" />
            {t('announcements.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('announcements.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-xl">
            {t('announcements.subtitle')}
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#6D1B13] text-xs sm:text-sm font-bold shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Announcement</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-[#E8DEC8] p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-stone-400" />
            <select
              value={selectedTempleId}
              onChange={e => setSelectedTempleId(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="all">All Temples</option>
              {temples.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={selectedPriority}
              onChange={e => setSelectedPriority(e.target.value)}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-[#E8DEC8] bg-[#FAF7F2] text-stone-700 focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent Alerts</option>
              <option value="Important">Important Notices</option>
              <option value="Notice">Public Notices</option>
              <option value="General">General Updates</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-stone-500 font-medium">
          {filtered.length} Announcements Active
        </span>
      </div>

      {/* Announcement List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500 bg-white rounded-2xl border border-dashed border-[#E8DEC8]">
            No announcements found matching the current filters.
          </div>
        ) : (
          filtered.map(item => {
            const isUrgent = item.priority === 'Urgent';
            const isImportant = item.priority === 'Important';

            const badgeBg = isUrgent
              ? 'bg-rose-100 text-rose-800 border-rose-300'
              : isImportant
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-blue-100 text-blue-900 border-blue-300';

            return (
              <div
                key={item._id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all text-left space-y-3 bg-white shadow-xs ${
                  isUrgent ? 'border-rose-200 ring-2 ring-rose-200/50' : 'border-[#E8DEC8]'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${badgeBg}`}>
                      {item.priority}
                    </span>
                    <span className="text-xs font-semibold text-[#6D1B13]">
                      {item.templeName || 'All Temples'}
                    </span>
                  </div>

                  <span className="text-xs text-stone-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    Published: {item.publishDate}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-[#6D1B13]">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {item.description}
                </p>

                {item.expiryDate && (
                  <div className="pt-2 border-t border-[#F2EDE4] text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Valid until: {item.expiryDate}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Add Announcement Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-[#E8DEC8]">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <h3 className="text-base font-bold text-[#6D1B13]">
                Publish Important Announcement
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Temple
                </label>
                <select
                  value={templeId}
                  onChange={e => setTempleId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                >
                  <option value="all">All Temples / System-Wide Alert</option>
                  {temples.map(t => (
                    <option key={t._id} value={t._id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Announcement Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Temple Timings Changed on 15 Nov Due to Festival"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="Important">Important</option>
                    <option value="Notice">Notice</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={e => setExpiryDate(e.target.value)}
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
                  rows={4}
                  placeholder="Write clear instructions for visiting pilgrims..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8DEC8] text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8DEC8]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E8DEC8] text-xs font-medium text-stone-600 hover:bg-stone-50"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs disabled:opacity-50"
                >
                  {submitting ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
