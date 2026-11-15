import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Users, 
  Sparkles, 
  Clock, 
  Utensils, 
  Car, 
  HeartPulse, 
  PhoneCall, 
  BookOpen, 
  BellRing, 
  Mail, 
  QrCode, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  RefreshCw,
  Download,
  Printer,
  LogOut,
  Search,
  LayoutDashboard,
  Building2,
  Calendar,
  Layers,
  ArrowLeft,
  ChevronRight,
  Ticket,
  Star,
  ThumbsUp,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { 
  Temple, 
  Pooja, 
  ScheduleItem, 
  Facility, 
  Parking, 
  Hospital, 
  EmergencyContact, 
  Guideline, 
  Announcement, 
  ContactMessage,
  Booking,
  Feedback
} from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const AdminDashboardPage: React.FC = () => {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  type AdminTab = 'dashboard' | 'bookings' | 'feedback' | 'temples' | 'poojas' | 'schedule' | 'facilities' | 'parking' | 'hospitals' | 'emergency' | 'guidelines' | 'announcements' | 'messages' | 'qr';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [stats, setStats] = useState<Record<string, number>>({});
  const [loadingStats, setLoadingStats] = useState(true);

  // Entities
  const [temple, setTemple] = useState<Temple | null>(null);
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTempleId, setSelectedTempleId] = useState<string>('');
  const [poojas, setPoojas] = useState<Pooja[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [parking, setParking] = useState<Parking[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [emergency, setEmergency] = useState<EmergencyContact[]>([]);
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [feedbackStats, setFeedbackStats] = useState<{ averageRating: number; totalCount: number; usefulPercent: number; breakdown: Record<number, number> } | null>(null);

  // Search filter inside table
  const [tableSearch, setTableSearch] = useState('');

  // Modals & Feedback
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // QR state
  const [qrUrl, setQrUrl] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [generatingQr, setGeneratingQr] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        navigate('/login');
      } else if (!isAdmin) {
        navigate('/');
      }
    }
  }, [authLoading, user, isAdmin, navigate]);

  const loadData = async () => {
    try {
      const [
        statsRes,
        templeRes,
        poojaRes,
        schedRes,
        facRes,
        parkRes,
        hospRes,
        emgRes,
        guideRes,
        annRes,
        msgRes,
        bookingsRes,
        feedbackRes,
        fbStatsRes
      ] = await Promise.all([
        api.getAdminStats().then(r => r.data).catch(() => ({})),
        api.getTemples().then(r => r.data).catch(() => []),
        api.getPoojas().then(r => r.data).catch(() => []),
        api.getSchedule().then(r => r.data).catch(() => []),
        api.getFacilities().then(r => r.data).catch(() => []),
        api.getParking().then(r => r.data).catch(() => []),
        api.getHospitals().then(r => r.data).catch(() => []),
        api.getEmergency().then(r => r.data).catch(() => []),
        api.getGuidelines().then(r => r.data).catch(() => []),
        api.getAnnouncements().then(r => r.data).catch(() => []),
        api.getAdminMessages().then(r => r.data).catch(() => []),
        api.getBookings().then(r => r.data).catch(() => []),
        api.getFeedback().then(r => r.data).catch(() => []),
        api.getFeedbackStats().then(r => r.data).catch(() => null)
      ]);

      setStats(statsRes);
      setTemples(templeRes);
      if (templeRes.length > 0 && !selectedTempleId) {
        setSelectedTempleId(templeRes[0]._id);
      }
      setPoojas(poojaRes);
      setSchedule(schedRes);
      setFacilities(facRes);
      setParking(parkRes);
      setHospitals(hospRes);
      setEmergency(emgRes);
      setGuidelines(guideRes);
      setAnnouncements(annRes);
      setMessages(msgRes);
      setBookings(bookingsRes);
      setFeedbacks(feedbackRes);
      setFeedbackStats(fbStatsRes);
      setLoadingStats(false);
    } catch (err) {
      console.error('Error loading admin data:', err);
      setLoadingStats(false);
    }
  };

  const handleCancelBooking = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res = await api.cancelBooking(id);
      setBookings(bookings.map(b => b._id === id ? res.data : b));
      showNotification('Booking status updated to Cancelled.');
    } catch (err: any) {
      showNotification(err.message || 'Failed to cancel booking.', true);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
      setQrUrl(window.location.origin);
      handleGenerateQr(window.location.origin);
    }
  }, [isAdmin]);

  const showNotification = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  const handleGenerateQr = async (urlToUse?: string) => {
    setGeneratingQr(true);
    try {
      const res = await api.generateQr(urlToUse || qrUrl);
      setQrDataUrl(res.qrDataUrl);
    } catch {
      showNotification('Could not generate QR code', true);
    } finally {
      setGeneratingQr(false);
    }
  };

  // CRUD Handlers
  const handleSavePooja = async (poojaData: Partial<Pooja>) => {
    try {
      if (isCreating) {
        const res = await api.createPooja(poojaData);
        setPoojas([...poojas, res.data]);
        showNotification('New Seva ritual created successfully.');
      } else {
        const res = await api.updatePooja(editingItem._id, poojaData);
        setPoojas(poojas.map(p => p._id === editingItem._id ? res.data : p));
        showNotification('Seva details updated.');
      }
      setEditingItem(null);
      setIsCreating(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Operation failed.', true);
    }
  };

  const handleDeletePooja = async (id: string) => {
    if (!confirm('Are you sure you want to delete this seva record?')) return;
    try {
      await api.deletePooja(id);
      setPoojas(poojas.filter(p => p._id !== id));
      showNotification('Seva record deleted from database.');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete seva.', true);
    }
  };

  const handleSaveSchedule = async (itemData: Partial<ScheduleItem>) => {
    try {
      if (isCreating) {
        const res = await api.createSchedule(itemData);
        setSchedule([...schedule, res.data]);
        showNotification('Schedule item added.');
      } else {
        const res = await api.updateSchedule(editingItem._id, itemData);
        setSchedule(schedule.map(s => s._id === editingItem._id ? res.data : s));
        showNotification('Schedule updated.');
      }
      setEditingItem(null);
      setIsCreating(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Operation failed.', true);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Delete this timeline item?')) return;
    try {
      await api.deleteSchedule(id);
      setSchedule(schedule.filter(s => s._id !== id));
      showNotification('Schedule entry removed.');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete.', true);
    }
  };

  const handleSaveAnnouncement = async (annData: Partial<Announcement>) => {
    try {
      if (isCreating) {
        const res = await api.createAnnouncement(annData);
        setAnnouncements([res.data, ...announcements]);
        showNotification('Announcement posted live to Home page.');
      } else {
        const res = await api.updateAnnouncement(editingItem._id, annData);
        setAnnouncements(announcements.map(a => a._id === editingItem._id ? res.data : a));
        showNotification('Announcement updated.');
      }
      setEditingItem(null);
      setIsCreating(false);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Operation failed.', true);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Delete this announcement?')) return;
    try {
      await api.deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a._id !== id));
      showNotification('Announcement deleted.');
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to delete.', true);
    }
  };

  const handleUpdateMessageStatus = async (id: string, status: 'New' | 'Read' | 'Resolved') => {
    try {
      await api.updateMessageStatus(id, status);
      setMessages(messages.map(m => m._id === id ? { ...m, status } : m));
      showNotification(`Inquiry marked as ${status}.`);
      loadData();
    } catch (err: any) {
      showNotification(err.message || 'Failed to update status.', true);
    }
  };

  if (authLoading || loadingStats) {
    return <LoadingState message="Loading administrative console..." />;
  }

  const sidebarLinks: { id: AdminTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'bookings', label: `Seva Bookings (${bookings.length})`, icon: Ticket },
    { id: 'feedback', label: `Visitor Feedback (${feedbacks.length})`, icon: Star },
    { id: 'temples', label: 'Temples', icon: Building2 },
    { id: 'poojas', label: 'Poojas & Sevas', icon: Sparkles },
    { id: 'schedule', label: 'Schedule', icon: Clock },
    { id: 'facilities', label: 'Facilities', icon: Utensils },
    { id: 'parking', label: 'Parking', icon: Car },
    { id: 'hospitals', label: 'Hospitals', icon: HeartPulse },
    { id: 'emergency', label: 'Emergency', icon: PhoneCall },
    { id: 'guidelines', label: 'Guidelines', icon: BookOpen },
    { id: 'announcements', label: 'Announcements', icon: BellRing },
    { id: 'messages', label: `Messages (${stats.unreadMessages || 0})`, icon: Mail },
    { id: 'qr', label: 'Generate QR', icon: QrCode }
  ];

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col md:flex-row">
      
      {/* 1. Dark Blue Sidebar matching Reference 12 & 13 */}
      <aside className="w-full md:w-64 bg-[#1B2430] text-stone-300 shrink-0 flex flex-col justify-between border-r border-[#151D27]">
        <div>
          {/* Sidebar Brand Lockup */}
          <div className="p-5 border-b border-[#242F3E] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#E87325] flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2L9 6H15L12 2Z" />
                <path d="M7 7L5 10H19L17 7H7Z" />
                <path d="M4 11L2 14H22L20 11H4Z" />
                <path d="M4 15V22H8V17H16V22H20V15H4Z" />
              </svg>
            </div>
            <div>
              <span className="font-bold text-base text-white tracking-tight block">Temple Ease</span>
              <span className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase">Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 text-xs">
            {sidebarLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditingItem(null);
                    setIsCreating(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-colors text-left ${
                    isActive
                      ? 'bg-[#E87325] text-white font-semibold shadow-xs'
                      : 'hover:bg-[#253243] text-stone-300 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Logout & Website Return */}
        <div className="p-4 border-t border-[#242F3E] space-y-2">
          <Link
            to="/"
            className="flex items-center gap-2 text-xs text-stone-400 hover:text-white transition-colors px-2 py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Website</span>
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 transition-colors px-2 py-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Administration Canvas */}
      <div className="grow flex flex-col min-w-0">
        
        {/* Top Header matching Reference 12 & 13 */}
        <header className="h-16 bg-white border-b border-[#E5DCCE] px-6 flex items-center justify-between gap-4">
          <div className="relative w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search in management tables..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E5DCCE] rounded-lg focus:outline-hidden focus:border-[#E87325]"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-600 font-medium">Welcome, <strong>Admin</strong></span>
            <div className="w-8 h-8 rounded-full bg-[#E87325] text-white flex items-center justify-center font-bold text-xs shadow-xs">
              A
            </div>
          </div>
        </header>

        {/* Content Container */}
        <main className="p-6 sm:p-8 space-y-6">
          
          {actionSuccess && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shadow-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}
          {actionError && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2 shadow-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
          )}

          {/* ================= VIEW 1: DASHBOARD OVERVIEW matching Reference 12 ================= */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-xl font-bold font-temple-heading text-[#3A1412]">
                Dashboard
              </h1>

              {/* 10 Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
                {[
                  { label: 'Total Users', val: stats.totalUsers ?? 0, icon: Users, color: 'text-blue-600' },
                  { label: 'Total Temples', val: stats.totalTemples ?? temples.length, icon: Building2, color: 'text-emerald-600' },
                  { label: 'Seva Bookings', val: stats.totalBookings ?? bookings.length, icon: Ticket, color: 'text-amber-600' },
                  { label: 'Devotee Rating', val: `${feedbackStats?.averageRating || 4.9} ★`, icon: Star, color: 'text-amber-500' },
                  { label: 'Total Poojas', val: stats.totalPoojas ?? poojas.length, icon: Sparkles, color: 'text-[#E87325]' },
                  { label: 'Total Facilities', val: stats.totalFacilities ?? facilities.length, icon: Utensils, color: 'text-teal-600' },
                  { label: 'Total Hospitals', val: stats.totalHospitals ?? hospitals.length, icon: HeartPulse, color: 'text-rose-600' },
                  { label: 'Total Parking', val: stats.totalParking ?? parking.length, icon: Car, color: 'text-indigo-600' },
                  { label: 'Total Emergency', val: stats.totalEmergency ?? emergency.length, icon: PhoneCall, color: 'text-amber-600' },
                  { label: 'Announcements', val: stats.totalAnnouncements ?? announcements.length, icon: BellRing, color: 'text-purple-600' }
                ].map((st, i) => {
                  const Icon = st.icon;
                  return (
                    <div key={i} className="bg-white border border-[#E5DCCE] rounded-2xl p-4 shadow-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] text-stone-500">
                        <span className="font-semibold truncate">{st.label}</span>
                        <Icon className={`w-3.5 h-3.5 shrink-0 ${st.color}`} />
                      </div>
                      <p className="text-xl font-bold font-temple-heading text-[#3A1412] tabular-nums">
                        {st.val}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Two Column Grid: Activity Chart & Quick Actions matching Reference 12 */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Recent Activity Bar Chart */}
                <div className="lg:col-span-8 bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
                  <h2 className="text-sm font-bold font-temple-heading text-[#3A1412]">
                    Recent Activity
                  </h2>
                  <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-4 border-b border-stone-100">
                    {[
                      { day: 'Mon', h1: '60%', h2: '40%' },
                      { day: 'Tue', h1: '85%', h2: '65%' },
                      { day: 'Wed', h1: '45%', h2: '30%' },
                      { day: 'Thu', h1: '75%', h2: '55%' },
                      { day: 'Fri', h1: '95%', h2: '80%' },
                      { day: 'Sat', h1: '100%', h2: '90%' },
                      { day: 'Sun', h1: '90%', h2: '70%' }
                    ].map((bar, bIdx) => (
                      <div key={bIdx} className="flex flex-col items-center gap-2 grow">
                        <div className="w-full flex items-end justify-center gap-1.5 h-40">
                          <div
                            style={{ height: bar.h1 }}
                            className="w-3 sm:w-4 bg-[#E87325] rounded-t-sm transition-all"
                            title={`Footfall: ${bar.h1}`}
                          ></div>
                          <div
                            style={{ height: bar.h2 }}
                            className="w-3 sm:w-4 bg-[#1B2430] rounded-t-sm transition-all"
                            title={`Sevas: ${bar.h2}`}
                          ></div>
                        </div>
                        <span className="text-[10px] text-stone-400 font-semibold">{bar.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-6 text-xs text-stone-500 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-[#E87325]"></span>
                      <span>Devotee Footfall Influx</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-3 rounded-xs bg-[#1B2430]"></span>
                      <span>Seva Bookings & Queries</span>
                    </span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="lg:col-span-4 bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
                  <h2 className="text-sm font-bold font-temple-heading text-[#3A1412]">
                    Quick Actions
                  </h2>
                  <div className="space-y-2.5">
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="w-full py-2 px-3.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl text-xs font-semibold text-[#8B2500] flex items-center gap-2.5 transition-colors"
                    >
                      <Ticket className="w-4 h-4 text-[#E87325]" />
                      <span>Manage Seva Bookings ({bookings.length})</span>
                    </button>
                    <Link
                      to="/calendar"
                      className="w-full py-2 px-3.5 bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DCCE] rounded-xl text-xs font-semibold text-[#3A1412] flex items-center gap-2.5 transition-colors"
                    >
                      <CalendarDays className="w-4 h-4 text-[#E87325]" />
                      <span>Temple Calendar & Festivals</span>
                    </Link>
                    <button
                      onClick={() => setActiveTab('feedback')}
                      className="w-full py-2 px-3.5 bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DCCE] rounded-xl text-xs font-semibold text-[#3A1412] flex items-center gap-2.5 transition-colors"
                    >
                      <Star className="w-4 h-4 text-amber-500" />
                      <span>View Devotee Reviews ({feedbacks.length})</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('announcements'); setIsCreating(true); }}
                      className="w-full py-2 px-3.5 bg-[#FFF5EE] hover:bg-[#FFE8D6] border border-[#E87325]/30 rounded-xl text-xs font-semibold text-[#E87325] flex items-center gap-2.5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post Announcement Notice</span>
                    </button>
                    <button
                      onClick={() => { setActiveTab('poojas'); setIsCreating(true); }}
                      className="w-full py-2 px-3.5 bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DCCE] rounded-xl text-xs font-semibold text-[#3A1412] flex items-center gap-2.5 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#E87325]" />
                      <span>Add Pooja / Seva</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ================= VIEW: SEVA BOOKINGS ================= */}
          {activeTab === 'bookings' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4 flex-wrap gap-3">
                <div>
                  <h2 className="text-base font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-[#E87325]" />
                    <span>Devotee Seva Bookings ({bookings.length})</span>
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Live reservations submitted by devotees with unique Booking IDs and verification QR codes
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/booking"
                    className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E5DCCE] text-xs font-semibold rounded-xl text-[#3A1412] hover:bg-[#F4EFE6] transition-colors"
                  >
                    + Open Devotee Booking Portal
                  </Link>
                </div>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-500">
                  No devotee seva bookings registered yet.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#F4EFE6] text-stone-500 bg-[#FAF7F2]/60">
                        <th className="py-2.5 px-3 font-semibold">Booking ID</th>
                        <th className="py-2.5 px-3 font-semibold">Devotee Details</th>
                        <th className="py-2.5 px-3 font-semibold">Temple & Pooja</th>
                        <th className="py-2.5 px-3 font-semibold">Visit Date & Slot</th>
                        <th className="py-2.5 px-3 font-semibold">Pass Count</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F4EFE6]">
                      {bookings
                        .filter(b => !tableSearch || 
                          b.bookingId.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          b.devoteeName.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          b.poojaName.toLowerCase().includes(tableSearch.toLowerCase()) ||
                          b.templeName.toLowerCase().includes(tableSearch.toLowerCase())
                        )
                        .map((b) => (
                          <tr key={b._id} className="hover:bg-amber-50/30 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-mono font-bold text-[#E87325] block">{b.bookingId}</span>
                              <span className="text-[10px] text-stone-400">Created: {new Date(b.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-semibold text-stone-800 block">{b.devoteeName}</span>
                              <span className="text-[11px] text-stone-500 block">{b.email}</span>
                              <span className="text-[10px] text-stone-400">{b.phone}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-bold text-stone-800 block">{b.poojaName}</span>
                              <span className="text-[11px] text-stone-500">{b.templeName}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="font-medium text-stone-800 block">{b.date}</span>
                              <span className="text-[11px] text-stone-500">{b.slot}</span>
                            </td>
                            <td className="py-3 px-3">
                              <span className="inline-block px-2 py-0.5 bg-stone-100 rounded-md font-semibold text-stone-700">
                                {b.personCount} {b.personCount === 1 ? 'person' : 'persons'}
                              </span>
                              <span className="text-[11px] text-stone-400 block mt-0.5">
                                {b.amount === 0 ? 'Free' : `₹${b.amount}`}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                b.status === 'Confirmed' 
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}>
                                {b.status === 'Confirmed' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {b.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              {b.status === 'Confirmed' && (
                                <button
                                  onClick={() => handleCancelBooking(b._id)}
                                  className="px-2.5 py-1 text-[11px] font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-md transition-colors"
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ================= VIEW: DEVOTEE FEEDBACK & REVIEWS ================= */}
          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4">
                  <div>
                    <h2 className="text-base font-bold font-temple-heading text-[#3A1412] flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-500 fill-amber-400" />
                      <span>Devotee Feedback & Experience Ratings</span>
                    </h2>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Reviews, satisfaction ratings and navigation feedback submitted by pilgrims
                    </p>
                  </div>
                  <Link
                    to="/feedback"
                    className="px-3 py-1.5 bg-[#FAF7F2] border border-[#E5DCCE] text-xs font-semibold rounded-xl text-[#3A1412] hover:bg-[#F4EFE6] transition-colors"
                  >
                    + Open Devotee Review Form
                  </Link>
                </div>

                {/* Summary Score Banner */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#FAF7F2] p-5 rounded-xl border border-[#E5DCCE]/60">
                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Average Rating</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <span className="text-3xl font-extrabold text-[#3A1412]">{feedbackStats?.averageRating || 4.9}</span>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-500">Based on {feedbackStats?.totalCount || feedbacks.length} verified submissions</span>
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Information Usefulness</span>
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <ThumbsUp className="w-6 h-6 text-emerald-600" />
                      <span className="text-3xl font-extrabold text-emerald-700">{feedbackStats?.usefulPercent || 98}%</span>
                    </div>
                    <span className="text-[11px] text-stone-500">Found Temple Ease information helpful</span>
                  </div>

                  <div className="text-center sm:text-left space-y-1">
                    <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Platform Recommendation</span>
                    <div className="text-3xl font-extrabold text-[#E87325]">100%</div>
                    <span className="text-[11px] text-stone-500">College Community Service Project</span>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold text-stone-600 uppercase tracking-wider">Recent Devotee Feedback</h3>
                  {feedbacks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-stone-500">
                      No feedback entries found.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {feedbacks.map((fb) => (
                        <div key={fb._id} className="p-4 rounded-xl border border-[#E5DCCE] bg-white space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-[#3A1412]">{fb.userName}</span>
                                <span className="text-stone-300">·</span>
                                <span className="text-xs text-stone-500">{fb.templeName}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex text-amber-500">
                                  {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} className={`w-3.5 h-3.5 ${s <= fb.overallRating ? 'fill-current' : 'text-stone-300'}`} />
                                  ))}
                                </div>
                                <span className="text-[11px] font-semibold text-stone-700">{fb.overallRating} / 5</span>
                                {fb.useful && (
                                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">
                                    ✓ Info Useful
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-[11px] text-stone-400 shrink-0">
                              {new Date(fb.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-xs text-stone-700 leading-relaxed italic">
                            "{fb.experienceText}"
                          </p>
                          {fb.suggestions && (
                            <p className="text-[11px] text-stone-500 bg-[#FAF7F2] p-2 rounded-lg border border-[#E5DCCE]/50">
                              <strong className="text-stone-700">Suggestion:</strong> {fb.suggestions}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= VIEW 2: MANAGE TEMPLES matching Reference 13 ================= */}
          {activeTab === 'temples' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4">
                <h2 className="text-base font-bold font-temple-heading text-[#3A1412]">
                  Manage Temples
                </h2>
                <button
                  onClick={() => showNotification('Temple Ease Demo Temple is actively managed.')}
                  className="px-4 py-2 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Temple</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#3A1412] border-b border-[#E5DCCE] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFE6]">
                    {temples.map((t) => (
                      <tr key={t._id} className="hover:bg-[#FAF7F2]/50">
                        <td className="py-3 px-4 font-semibold text-[#3A1412]">
                          <div>
                            <span>{t.name}</span>
                            <span className="block text-[10px] text-[#E07A28] font-normal">{t.deity}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{t.city}, {t.state}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold">
                            {t.verificationStatus === 'Verified from Official Portal' ? 'Verified' : 'Pending'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            to={`/temples/${t.slug || t._id}`}
                            className="text-[11px] font-semibold text-[#7B1D16] hover:underline"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => {
                              setSelectedTempleId(t._id);
                              showNotification(`Selected ${t.name} for resource management.`);
                            }}
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                              selectedTempleId === t._id
                                ? 'bg-[#7B1D16] text-white'
                                : 'bg-[#FAF7F2] text-stone-700 border border-stone-200'
                            }`}
                          >
                            {selectedTempleId === t._id ? 'Selected' : 'Select'}
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(t);
                              setIsCreating(false);
                            }}
                            className="p-1 text-stone-500 hover:text-[#7B1D16]"
                            title="Edit"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-[#F4EFE6] text-xs text-stone-500 flex items-center justify-between">
                <span>Showing {temples.length} verified temples</span>
                {selectedTempleId && (
                  <span className="text-[#7B1D16] font-semibold">
                    Managing: {temples.find(t => t._id === selectedTempleId)?.name}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ================= VIEW 3: POOJAS CRUD ================= */}
          {activeTab === 'poojas' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4">
                <h2 className="text-base font-bold font-temple-heading text-[#3A1412]">
                  Manage Poojas & Sevas ({poojas.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingItem({
                      name: '',
                      category: 'Daily Pooja',
                      description: '',
                      dateOrFrequency: 'Daily',
                      time: '06:00 AM',
                      duration: '45 mins',
                      price: 150,
                      availability: 'Available',
                      instructions: 'Traditional attire required.',
                      significance: '',
                      prasadamDetails: '',
                      active: true
                    });
                    setIsCreating(true);
                  }}
                  className="px-4 py-2 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Pooja</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#3A1412] border-b border-[#E5DCCE] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Seva Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Availability</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFE6]">
                    {poojas.map((p) => (
                      <tr key={p._id} className="hover:bg-[#FAF7F2]/50">
                        <td className="py-3 px-4 font-semibold text-[#3A1412]">{p.name}</td>
                        <td className="py-3 px-4 text-stone-600">{p.category}</td>
                        <td className="py-3 px-4 tabular-nums">{p.time}</td>
                        <td className="py-3 px-4 font-bold tabular-nums">₹{p.price}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            {p.availability}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditingItem(p); setIsCreating(false); }}
                            className="p-1 text-stone-500 hover:text-[#E87325]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeletePooja(p._id)}
                            className="p-1 text-stone-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 4: SCHEDULE CRUD ================= */}
          {activeTab === 'schedule' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4">
                <h2 className="text-base font-bold font-temple-heading text-[#3A1412]">
                  Manage Today&apos;s Daily Schedule ({schedule.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingItem({
                      time: '08:00 AM',
                      activity: '',
                      location: 'Main Sanctum',
                      category: 'Ritual',
                      status: 'Upcoming',
                      active: true
                    });
                    setIsCreating(true);
                  }}
                  className="px-4 py-2 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Schedule</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] text-[#3A1412] border-b border-[#E5DCCE] font-semibold">
                    <tr>
                      <th className="py-3 px-4">Time</th>
                      <th className="py-3 px-4">Activity Title</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4EFE6]">
                    {schedule.map((s) => (
                      <tr key={s._id} className="hover:bg-[#FAF7F2]/50">
                        <td className="py-3 px-4 font-bold text-[#E87325] tabular-nums">{s.time}</td>
                        <td className="py-3 px-4 font-semibold text-[#3A1412]">{s.activity}</td>
                        <td className="py-3 px-4 text-stone-600">{s.location}</td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-semibold">
                            {s.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => { setEditingItem(s); setIsCreating(false); }}
                            className="p-1 text-stone-500 hover:text-[#E87325]"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSchedule(s._id)}
                            className="p-1 text-stone-500 hover:text-rose-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= VIEW 5: ANNOUNCEMENTS ================= */}
          {activeTab === 'announcements' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-4">
                <h2 className="text-base font-bold font-temple-heading text-[#3A1412]">
                  Latest Announcements ({announcements.length})
                </h2>
                <button
                  onClick={() => {
                    setEditingItem({
                      title: '',
                      description: '',
                      priority: 'Notice',
                      publishDate: new Date().toISOString().slice(0, 10),
                      active: true
                    });
                    setIsCreating(true);
                  }}
                  className="px-4 py-2 bg-[#E87325] hover:bg-[#C25610] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Post Announcement</span>
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map((a) => (
                  <div key={a._id} className="p-4 rounded-xl border border-[#E5DCCE] flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-bold text-[#E87325]">{a.priority}</span>
                        <span className="text-stone-300">·</span>
                        <span className="text-stone-500">{a.publishDate}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#3A1412]">{a.title}</h3>
                      <p className="text-xs text-stone-600">{a.description}</p>
                    </div>
                    <div className="space-x-1 shrink-0">
                      <button onClick={() => { setEditingItem(a); setIsCreating(false); }} className="p-1 text-stone-500 hover:text-[#E87325]">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteAnnouncement(a._id)} className="p-1 text-stone-500 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= VIEW 6: MESSAGES ================= */}
          {activeTab === 'messages' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold font-temple-heading text-[#3A1412] border-b border-[#F4EFE6] pb-3">
                Devotee Inquiries ({messages.length})
              </h2>

              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m._id} className="p-4 rounded-xl border border-[#E5DCCE] space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-[#3A1412]">{m.subject}</h3>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdateMessageStatus(m._id, 'Resolved')}
                          className="px-2.5 py-1 text-[11px] bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md"
                        >
                          Mark Resolved
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600">{m.message}</p>
                    <p className="text-[11px] text-stone-400">From: {m.name} ({m.email})</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= VIEW 7: GENERATE QR ================= */}
          {activeTab === 'qr' && (
            <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto text-center space-y-5">
              <h2 className="text-lg font-bold font-temple-heading text-[#3A1412]">
                Generate Temple QR Code
              </h2>
              <p className="text-xs text-stone-500">
                Generate high-resolution printable QR codes for visitor placards
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={qrUrl}
                  onChange={(e) => setQrUrl(e.target.value)}
                  className="grow px-3 py-2 text-xs bg-[#FAF7F2] border rounded-lg"
                />
                <button
                  onClick={() => handleGenerateQr(qrUrl)}
                  className="px-4 py-2 bg-[#E87325] text-white text-xs font-semibold rounded-lg"
                >
                  Regenerate
                </button>
              </div>

              {qrDataUrl && (
                <div className="p-4 bg-white border rounded-xl inline-block shadow-inner">
                  <img src={qrDataUrl} alt="Temple Ease QR" className="w-56 h-56 mx-auto" />
                </div>
              )}

              <div className="flex items-center justify-center gap-3">
                <a
                  href={qrDataUrl}
                  download="Temple_Ease_Admin_QR.png"
                  className="px-4 py-2 bg-[#E87325] text-white text-xs font-semibold rounded-xl flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PNG</span>
                </a>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-[#FAF7F2] border rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Placard</span>
                </button>
              </div>
            </div>
          )}

          {/* Editing Modals (Generic Popup for Seva / Schedule / Announcement) */}
          {editingItem && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 border border-[#E5DCCE] shadow-2xl">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
                    {isCreating ? 'Create New Entry' : 'Edit Entry'}
                  </h3>
                  <button onClick={() => setEditingItem(null)} className="text-stone-400 hover:text-stone-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Title / Name</label>
                    <input
                      type="text"
                      value={editingItem.name || editingItem.activity || editingItem.title || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingItem({
                          ...editingItem,
                          name: val,
                          activity: val,
                          title: val
                        });
                      }}
                      className="w-full px-3 py-2 bg-[#FAF7F2] border rounded-lg"
                    />
                  </div>

                  {editingItem.time !== undefined && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Time</label>
                        <input
                          type="text"
                          value={editingItem.time || ''}
                          onChange={(e) => setEditingItem({ ...editingItem, time: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Price (₹)</label>
                        <input
                          type="number"
                          value={editingItem.price ?? 0}
                          onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                          className="w-full px-3 py-2 bg-[#FAF7F2] border rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  {editingItem.description !== undefined && (
                    <div>
                      <label className="block font-semibold mb-1">Description</label>
                      <textarea
                        rows={3}
                        value={editingItem.description || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                        className="w-full px-3 py-2 bg-[#FAF7F2] border rounded-lg"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button onClick={() => setEditingItem(null)} className="px-4 py-2 border rounded-lg text-xs">
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (activeTab === 'poojas') handleSavePooja(editingItem);
                      else if (activeTab === 'schedule') handleSaveSchedule(editingItem);
                      else if (activeTab === 'announcements') handleSaveAnnouncement(editingItem);
                      else setEditingItem(null);
                    }}
                    className="px-4 py-2 bg-[#E87325] text-white rounded-lg text-xs font-semibold"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
};
