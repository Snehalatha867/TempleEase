import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  KeyRound, 
  Heart, 
  Trash2, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  ArrowRight,
  Sparkles,
  Compass,
  Printer,
  QrCode,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Favorite, Booking, VisitPlan } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LoadingState } from '../components/common/LoadingState';

export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const initialTab = queryParams.get('tab') as 'bookings' | 'plans' | 'favorites' | 'account' || 'bookings';

  const [activeTab, setActiveTab] = useState<'bookings' | 'plans' | 'favorites' | 'account'>(initialTab);

  // Data states
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [visitPlans, setVisitPlans] = useState<VisitPlan[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Active pass modal for QR display
  const [viewingPass, setViewingPass] = useState<Booking | null>(null);

  // Edit profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    }

    if (isAuthenticated) {
      setDataLoading(true);
      Promise.all([
        api.getFavorites().catch(() => ({ data: [] })),
        api.getBookings({ userId: user?._id }).catch(() => ({ data: [] })),
        api.getVisitPlans(user?._id).catch(() => ({ data: [] }))
      ])
        .then(([favRes, bkRes, plRes]) => {
          if (favRes.data) setFavorites(favRes.data);
          if (bkRes.data) setBookings(bkRes.data);
          if (plRes.data) setVisitPlans(plRes.data);
        })
        .catch(err => console.error(err))
        .finally(() => setDataLoading(false));
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  // Sync tab with query params
  useEffect(() => {
    const tabParam = queryParams.get('tab') as any;
    if (tabParam && ['bookings', 'plans', 'favorites', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    setProfileSaving(true);
    try {
      await updateProfile({ name, phone });
      setProfileSuccess('Profile details updated successfully.');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    setPasswordSaving(true);
    try {
      const res = await api.changePassword({ currentPassword, newPassword, confirmNewPassword });
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleRemoveFavorite = async (id: string) => {
    try {
      await api.removeFavorite(id);
      setFavorites(favorites.filter(f => f._id !== id && f.itemId !== id));
    } catch (err) {
      console.error('Error removing favorite:', err);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!window.confirm('Are you sure you want to cancel this pooja seva booking?')) return;
    try {
      const res = await api.cancelBooking(id);
      if (res.data) {
        setBookings(bookings.map(b => b._id === id ? res.data : b));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePlan = async (id: string) => {
    try {
      await api.deleteVisitPlan(id);
      setVisitPlans(visitPlans.filter(p => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (authLoading) {
    return <LoadingState message="Loading your devotee profile & services..." />;
  }

  if (!user) {
    return null;
  }

  const createdDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Profile Banner */}
      <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border-2 border-[#D4AF37] flex items-center justify-center text-[#C25610] font-bold text-2xl font-temple-heading">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-temple-heading text-[#3A1412]">
                {user.name}
              </h1>
              <span className="text-[11px] font-semibold uppercase px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#C25610] border border-[#E5DCCE]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
              <span>{user.email}</span>
              <span aria-hidden="true">·</span>
              <span>Devotee since {createdDate}</span>
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8DEC8] overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'border-[#6D1B13] text-[#6D1B13] bg-white shadow-2xs'
              : 'border-transparent text-stone-600 hover:text-[#6D1B13]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C25610]" />
          <span>{t('nav.myBookings')} ({bookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'plans'
              ? 'border-[#6D1B13] text-[#6D1B13] bg-white shadow-2xs'
              : 'border-transparent text-stone-600 hover:text-[#6D1B13]'
          }`}
        >
          <Compass className="w-4 h-4 text-[#C25610]" />
          <span>{t('nav.myPlans')} ({visitPlans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('favorites')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'favorites'
              ? 'border-[#6D1B13] text-[#6D1B13] bg-white shadow-2xs'
              : 'border-transparent text-stone-600 hover:text-[#6D1B13]'
          }`}
        >
          <Heart className="w-4 h-4 text-rose-500" />
          <span>{t('nav.myFavourites')} ({favorites.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('account')}
          className={`px-4 py-2.5 rounded-t-xl border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
            activeTab === 'account'
              ? 'border-[#6D1B13] text-[#6D1B13] bg-white shadow-2xs'
              : 'border-transparent text-stone-600 hover:text-[#6D1B13]'
          }`}
        >
          <UserIcon className="w-4 h-4 text-stone-500" />
          <span>Profile & Security</span>
        </button>
      </div>

      {/* ================= TAB 1: MY BOOKINGS ================= */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#6D1B13]">
              Your Reserved Pooja & Seva Passes
            </h2>
            <Link
              to="/booking"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Book New Pooja</span>
            </Link>
          </div>

          {dataLoading ? (
            <p className="text-xs text-stone-500 py-8 text-center">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E8DEC8] p-10 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-600">You do not have any active pooja bookings yet.</p>
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] text-white text-xs font-semibold shadow-xs"
              >
                <span>Book a Pooja / Seva Slot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div
                  key={b._id}
                  className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#6D1B13] bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                        {b.bookingId}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        b.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-stone-100 text-stone-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#6D1B13]">
                      {b.templeName} — {b.poojaName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {b.date}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#C25610]" />
                        {b.slot}
                      </span>
                      <span>·</span>
                      <span>Devotee: <strong>{b.devoteeName}</strong> ({b.personCount} Persons)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-[#F2EDE4]">
                    <button
                      type="button"
                      onClick={() => setViewingPass(b)}
                      className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#6D1B13] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <QrCode className="w-4 h-4 text-[#C25610]" />
                      <span>View QR Pass</span>
                    </button>

                    {b.status === 'Confirmed' && (
                      <button
                        type="button"
                        onClick={() => handleCancelBooking(b._id)}
                        className="px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:text-red-600 hover:bg-red-50 text-xs font-medium transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: MY VISIT PLANS ================= */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#6D1B13]">
              Your Saved Temple Visit Plans
            </h2>
            <Link
              to="/planner"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Create New Plan</span>
            </Link>
          </div>

          {dataLoading ? (
            <p className="text-xs text-stone-500 py-8 text-center">Loading visit plans...</p>
          ) : visitPlans.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E8DEC8] p-10 text-center space-y-3">
              <Compass className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-600">No visit itineraries generated yet.</p>
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] text-white text-xs font-semibold shadow-xs"
              >
                <span>Plan Your Temple Visit</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {visitPlans.map(plan => (
                <div
                  key={plan._id}
                  className="bg-white rounded-2xl border border-[#E8DEC8] p-5 shadow-xs space-y-3 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-[#6D1B13]">
                        {plan.templeName} — Visit Plan
                      </h3>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Planned Date: <span className="font-semibold text-stone-800">{plan.visitDate}</span> | Preferred Arrival: <span className="font-semibold text-[#C25610]">{plan.arrivalTime}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => window.print()}
                        className="p-2 text-stone-500 hover:text-stone-800 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium"
                        title="Print Plan"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(plan._id)}
                        className="p-2 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                        title="Delete Plan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs text-stone-600 pt-2 border-t border-[#F2EDE4]">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Group Composition</span>
                      <span className="font-semibold">{plan.visitorCount} Persons {plan.hasElderly && '(with Senior Citizens)'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Recommended Parking</span>
                      <span className="font-semibold">{plan.summary?.parkingZone || 'Main Lot'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">Prasadam Counter</span>
                      <span className="font-semibold">{plan.summary?.prasadamCounter || 'Active 24x7'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: MY FAVOURITES ================= */}
      {activeTab === 'favorites' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#6D1B13]">
              Your Saved Shrines ({favorites.length})
            </h2>
            <Link
              to="/temples"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold shadow-xs"
            >
              <Compass className="w-3.5 h-3.5 text-amber-300" />
              <span>Explore More Temples</span>
            </Link>
          </div>

          {dataLoading ? (
            <p className="text-xs text-stone-500 py-8 text-center">Loading favourites...</p>
          ) : favorites.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-[#E8DEC8] p-10 text-center space-y-3">
              <Heart className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs text-stone-600">You haven&apos;t saved any favourite shrines yet.</p>
              <Link
                to="/temples"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6D1B13] text-white text-xs font-semibold shadow-xs"
              >
                <span>Browse Temples Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {favorites.map(fav => (
                <div
                  key={fav._id}
                  className="bg-white border border-[#E8DEC8] rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3 text-left hover:border-[#C25610] transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#C25610]">
                      {fav.itemType}
                    </span>
                    <h3 className="text-sm font-bold text-[#6D1B13]">
                      {fav.title}
                    </h3>
                    {fav.details && (
                      <p className="text-xs text-stone-500">{fav.details}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F2EDE4]">
                    <Link
                      to={fav.itemType === 'temple' ? `/temples/${fav.itemId}` : '/temples'}
                      className="text-xs font-bold text-[#6D1B13] hover:text-[#C25610] flex items-center gap-1"
                    >
                      <span>View Info</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleRemoveFavorite(fav.itemId || fav._id)}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 4: PROFILE & SECURITY ================= */}
      {activeTab === 'account' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Edit Profile Form */}
          <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#C25610]" />
              <span>Personal Profile Details</span>
            </h2>

            {profileSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{profileSuccess}</span>
              </div>
            )}
            {profileError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{profileError}</span>
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#C25610] text-[#241F1A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                  Email Address (Login ID)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-stone-100 border border-[#E5DCCE] rounded-lg text-stone-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                  Contact Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#C25610] text-[#241F1A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2 bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {profileSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Save Profile Changes</span>
              </button>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#C25610]" />
              <span>Security & Password</span>
            </h2>

            {passwordSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}
            {passwordError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#C25610] text-[#241F1A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                    New Password (Min 6)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#C25610] text-[#241F1A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3A1412] mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#C25610] text-[#241F1A]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordSaving}
                className="px-5 py-2 bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
              >
                {passwordSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Update Password</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* QR Pass Inspection Modal */}
      {viewingPass && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E8DEC8] text-center">
            <div className="flex items-center justify-between border-b border-[#E8DEC8] pb-3">
              <span className="text-xs font-bold text-[#6D1B13] font-mono">{viewingPass.bookingId}</span>
              <button
                type="button"
                onClick={() => setViewingPass(null)}
                className="text-stone-400 hover:text-stone-600 text-lg leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#6D1B13]">
                {viewingPass.templeName}
              </h3>
              <p className="text-xs text-stone-600 font-semibold">{viewingPass.poojaName}</p>
              <p className="text-xs text-[#C25610] font-medium">{viewingPass.date} ({viewingPass.slot})</p>
            </div>

            <div className="p-4 bg-[#FFFBF5] rounded-xl border border-[#E8DEC8] inline-block mx-auto">
              {viewingPass.qrDataUrl ? (
                <img
                  src={viewingPass.qrDataUrl}
                  alt="QR Pass"
                  className="w-48 h-48 object-contain mx-auto"
                />
              ) : (
                <QrCode className="w-48 h-48 text-[#6D1B13] mx-auto" />
              )}
              <span className="text-[10px] text-stone-500 block mt-1">Scan for Verified Entry</span>
            </div>

            <div className="text-xs text-stone-600 text-left space-y-1 bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DEC8]">
              <p><strong>Primary Devotee:</strong> {viewingPass.devoteeName} ({viewingPass.personCount} Persons)</p>
              <p><strong>Gotram:</strong> {viewingPass.gotram || 'N/A'}</p>
              <p><strong>Status:</strong> <span className="text-emerald-700 font-bold">{viewingPass.status}</span></p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Pass</span>
              </button>
              <button
                type="button"
                onClick={() => setViewingPass(null)}
                className="px-5 py-2 rounded-xl bg-[#6D1B13] hover:bg-[#8C2518] text-white text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
