import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  QrCode, 
  Download, 
  Printer, 
  Smartphone, 
  Clock, 
  Sparkles, 
  MapPin, 
  ShieldAlert, 
  BookOpen,
  Share2,
  Check,
  Camera,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';
import { Temple } from '../types';

export const QrPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [targetUrl, setTargetUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [simulatedScan, setSimulatedScan] = useState(false);

  const navigate = useNavigate();
  const templeParam = searchParams.get('temple');

  useEffect(() => {
    api.getTemples()
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTemples(res.data);
          let target = res.data[0];
          if (templeParam) {
            const found = res.data.find(t => t._id === templeParam || t.slug === templeParam);
            if (found) target = found;
          }
          setSelectedTemple(target);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleQr(selectedTemple._id)
        .then(res => {
          setQrDataUrl(res.qrDataUrl);
          setTargetUrl(res.url);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedTemple]);

  const handleDownload = () => {
    if (!qrDataUrl || !selectedTemple) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `${selectedTemple.slug || 'temple'}-ease-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScanSimulation = () => {
    setSimulatedScan(true);
    setTimeout(() => {
      if (selectedTemple) {
        navigate(`/temples/${selectedTemple.slug || selectedTemple._id}`);
      }
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">QR Code Access System</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Temple Ease QR Placard System
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Generate and scan individual digital placards for any temple in India
          </p>
        </div>

        {/* Temple Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-700">Select Temple:</label>
          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => {
              const found = temples.find(t => t._id === e.target.value);
              if (found) setSelectedTemple(found);
            }}
            className="text-xs p-2.5 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-semibold text-[#7B1D16]"
          >
            {temples.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city}, {t.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main 2-Column Card */}
      <div className="bg-white border border-[#E8DEC8] rounded-2xl p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: QR Code Display Card */}
        <div className="md:col-span-5 flex flex-col items-center text-center p-6 bg-[#FAF7F2] rounded-2xl border border-[#E5DCCE]">
          <div className="w-10 h-10 rounded-full bg-[#EFE7D8] text-[#7B1D16] flex items-center justify-center mb-3">
            <QrCode className="w-5 h-5" />
          </div>

          <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
            {selectedTemple?.name}
          </h3>
          <p className="text-[11px] text-[#E07A28] font-medium mt-0.5 mb-4">
            {selectedTemple?.city}, {selectedTemple?.state}
          </p>

          <div className="p-3 bg-white rounded-2xl shadow-sm border border-stone-200 inline-block mb-3">
            {loading ? (
              <div className="w-56 h-56 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#7B1D16] animate-spin" />
              </div>
            ) : qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`${selectedTemple?.name} QR`}
                className="w-56 h-56 rounded-xl"
              />
            ) : (
              <div className="w-56 h-56 flex items-center justify-center text-xs text-stone-400">
                Generating QR...
              </div>
            )}
          </div>

          <p className="text-[11px] text-stone-500 max-w-xs leading-relaxed">
            Scan with any smartphone camera or QR reader to instantly view today&apos;s verified timings and pooja schedule.
          </p>

          {simulatedScan && (
            <div className="mt-3 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              Placard Scanned! Redirecting to Temple...
            </div>
          )}

          <div className="w-full mt-4 pt-3 border-t border-stone-200/80 flex items-center justify-center gap-2">
            <button
              onClick={handleScanSimulation}
              className="py-2 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Simulate Scan</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl"
              title="Download QR"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-xl"
              title="Print Placard"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Information & Devotee Benefits */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B1D16] bg-[#EFE7D8] px-2.5 py-0.5 rounded-full">
              Mobile-First Physical Placards
            </span>
            <h2 className="text-xl sm:text-2xl font-bold font-temple-heading text-[#3A1412] mt-2">
              Instant Access Without Login
            </h2>
            <p className="text-xs text-stone-600 mt-1 leading-relaxed">
              Temple Ease placards are installed at entrance gopurams, queue complexes, and parking plazas to empower devotees with verified digital guidance.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
              <div className="p-2 bg-[#EFE7D8] text-[#7B1D16] rounded-lg shrink-0 mt-0.5">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3A1412]">Live Ritual Schedules</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Check which seva is ongoing, when gates close, and upcoming aarti timings in real time.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
              <div className="p-2 bg-[#EFE7D8] text-[#7B1D16] rounded-lg shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3A1412]">Wayfinding & Free Amenities</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Locate free RO water stations, annadanam dining halls, tonsuring centers, and footwear depots.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE]">
              <div className="p-2 bg-[#EFE7D8] text-[#7B1D16] rounded-lg shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#3A1412]">One-Touch Emergency Helplines</h4>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Direct dial to local police outposts, 108 ambulance dispatch, and temple vigilance control rooms.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#EDE5D8] border border-[#DACDB8] text-[#3A1412] text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <Share2 className="w-4 h-4 text-[#7B1D16]" />
              <span>{copied ? 'Link Copied!' : 'Copy Temple Link'}</span>
            </button>

            <Link
              to={`/temples/${selectedTemple?.slug || selectedTemple?._id}`}
              className="py-2.5 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs"
            >
              <span>Open {selectedTemple?.name} Guide</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
