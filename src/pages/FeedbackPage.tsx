import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Send,
  BarChart3,
  Heart
} from 'lucide-react';
import { api } from '../services/api';
import { Feedback, Temple } from '../types';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string>('temple_tirumala_01');
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([]);
  const [stats, setStats] = useState<{ averageRating: number; totalCount: number; usefulPercent: number; breakdown: Record<number, number> }>({
    averageRating: 4.8,
    totalCount: 4,
    usefulPercent: 100,
    breakdown: { 5: 3, 4: 1, 3: 0, 2: 0, 1: 0 }
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form states
  const [overallRating, setOverallRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [useful, setUseful] = useState<boolean>(true);
  const [navigationRating, setNavigationRating] = useState<number>(5);
  const [facilitiesRating, setFacilitiesRating] = useState<number>(5);
  const [experienceText, setExperienceText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [userName, setUserName] = useState(user?.name || '');
  const [userEmail, setUserEmail] = useState(user?.email || '');

  useEffect(() => {
    Promise.all([
      api.getTemples(),
      api.getFeedback(),
      api.getFeedbackStats().catch(() => ({ data: stats }))
    ])
      .then(([tRes, fbRes, sRes]) => {
        if (tRes.data) {
          setTemples(tRes.data);
          if (tRes.data.length > 0) setSelectedTempleId(tRes.data[0]._id);
        }
        if (fbRes.data) setFeedbackList(fbRes.data);
        if (sRes.data) setStats(sRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!experienceText.trim()) return;

    setSubmitting(true);
    try {
      const selectedTemple = temples.find(t => t._id === selectedTempleId);
      const res = await api.createFeedback({
        userId: user?._id,
        userName: userName.trim() || 'Visiting Devotee',
        userEmail: userEmail.trim() || undefined,
        templeId: selectedTempleId,
        templeName: selectedTemple?.name || 'Temple Shrine',
        overallRating,
        useful,
        navigationRating,
        facilitiesRating,
        experienceText: experienceText.trim(),
        suggestions: suggestions.trim() || undefined
      });

      if (res.data) {
        setFeedbackList([res.data, ...feedbackList]);
        setSubmittedSuccess(true);
        setExperienceText('');
        setSuggestions('');
      }
    } catch (err) {
      console.error('Failed to submit feedback:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels: Record<number, string> = {
    1: 'Poor Experience',
    2: 'Fair / Needs Improvement',
    3: 'Good Pilgrimage',
    4: 'Very Satisfying',
    5: 'Divine & Blissful Experience'
  };

  if (loading) {
    return <LoadingState message="Loading devotee feedback & experience system..." />;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#E07A28] transition-colors">{t('nav.home')}</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#6D1B13] font-semibold">{t('feedback.title')}</span>
      </nav>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#6D1B13] via-[#8C2518] to-[#6D1B13] rounded-2xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-amber-300/30">
            <MessageSquare className="w-3.5 h-3.5 text-amber-300" />
            {t('feedback.title')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-amber-50">
            {t('feedback.title')}
          </h1>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1.5 leading-relaxed">
            {t('feedback.subtitle')}
          </p>
        </div>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
          </div>
          <div>
            <span className="text-2xl font-bold text-[#6D1B13]">{stats.averageRating} / 5</span>
            <p className="text-xs text-stone-500">Average Devotee Rating</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-700">{stats.usefulPercent}%</span>
            <p className="text-xs text-stone-500">Found Information Useful</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 text-[#C25610] flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-bold text-stone-800">{feedbackList.length}</span>
            <p className="text-xs text-stone-500">Total Devotee Reviews</p>
          </div>
        </div>
      </div>

      {/* Form or Thank You Card */}
      {submittedSuccess ? (
        <div className="bg-white rounded-2xl border-2 border-emerald-400/50 p-8 shadow-sm text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[#6D1B13]">
            {t('feedback.thankYou')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            {t('feedback.thankYouDesc')}
          </p>
          <button
            type="button"
            onClick={() => setSubmittedSuccess(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] text-white text-xs font-semibold shadow-xs hover:bg-[#8C2518] transition-colors cursor-pointer"
          >
            <span>Submit Another Feedback</span>
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8DEC8] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-[#E8DEC8] pb-4">
            <h3 className="text-base font-bold text-[#6D1B13]">
              {t('feedback.ratingPrompt')}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Please rate your recent visit to help fellow devotees plan their pilgrimage.
            </p>
          </div>

          {/* Temple Selector */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
              Temple Visited *
            </label>
            <div className="relative">
              <select
                value={selectedTempleId}
                onChange={e => setSelectedTempleId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-[#FAF7F2] focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              >
                {temples.map(t => (
                  <option key={t._id} value={t._id}>
                    {t.name} ({t.city}, {t.state})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Overall 5-Star Rating */}
          <div className="p-4 rounded-xl bg-[#FAF7F2] border border-[#E8DEC8] text-center space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {t('feedback.overallRating')}
            </label>
            <div className="flex items-center justify-center gap-2 py-1">
              {[1, 2, 3, 4, 5].map(star => {
                const filled = (hoverRating || overallRating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setOverallRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        filled ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-semibold text-[#6D1B13]">
              {ratingLabels[hoverRating || overallRating]}
            </p>
          </div>

          {/* Was Information Useful? */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t('feedback.usefulQuestion')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setUseful(true)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    useful
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-2 ring-emerald-400/20'
                      : 'bg-white text-stone-600 border-[#E8DEC8]'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{t('feedback.yes')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUseful(false)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    !useful
                      ? 'bg-rose-50 text-rose-800 border-rose-400 ring-2 ring-rose-400/20'
                      : 'bg-white text-stone-600 border-[#E8DEC8]'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5 text-rose-500" />
                  <span>{t('feedback.no')}</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t('feedback.navigationRating')}
              </label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNavigationRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        navigationRating >= star ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                {t('feedback.facilityRating')}
              </label>
              <div className="flex items-center gap-1 py-1">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFacilitiesRating(star)}
                    className="p-1 cursor-pointer"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        facilitiesRating >= star ? 'text-amber-400 fill-amber-400' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Devotee Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Sharma"
                value={userName}
                onChange={e => setUserName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Your Email (Optional)
              </label>
              <input
                type="email"
                placeholder="devotee@example.com"
                value={userEmail}
                onChange={e => setUserEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
              />
            </div>
          </div>

          {/* Experience description */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('feedback.shareExperience')} *
            </label>
            <textarea
              required
              rows={3}
              placeholder="Tell other pilgrims about queue wait times, darshan clarity, footwear counters, or cleanliness..."
              value={experienceText}
              onChange={e => setExperienceText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            />
          </div>

          {/* Suggestions */}
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              {t('feedback.suggestions')}
            </label>
            <textarea
              rows={2}
              placeholder="Any features you'd like added to Temple Ease to make your visit smoother?"
              value={suggestions}
              onChange={e => setSuggestions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8DEC8] text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#C25610]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E8DEC8]">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs sm:text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4 text-amber-300" />
              <span>{submitting ? 'Submitting...' : t('feedback.submitBtn')}</span>
            </button>
          </div>
        </form>
      )}

      {/* Devotee Reviews Listing */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-[#6D1B13]">
          Recent Devotee Experiences & Reviews
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {feedbackList.map(fb => (
            <div
              key={fb._id}
              className="p-5 rounded-2xl border border-[#E8DEC8] bg-white shadow-xs space-y-3 text-left"
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#6D1B13]">
                    {fb.templeName}
                  </h4>
                  <p className="text-[11px] text-stone-500">{fb.userName}</p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  <span className="text-xs font-bold text-amber-900">{fb.overallRating}.0</span>
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed">
                "{fb.experienceText}"
              </p>

              {fb.suggestions && (
                <div className="p-2.5 rounded-lg bg-[#FAF7F2] border border-[#F2EDE4] text-[11px] text-stone-600">
                  <span className="font-semibold text-stone-800">Suggestion:</span> {fb.suggestions}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-[#F2EDE4]">
                <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                {fb.useful && (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-emerald-600" />
                    Verified Useful
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
