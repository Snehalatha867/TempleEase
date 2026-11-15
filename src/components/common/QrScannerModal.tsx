import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, QrCode, ArrowRight, Download, Printer, Camera, CheckCircle2, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { Temple } from '../../types';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({ isOpen, onClose }) => {
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [scanningSimulated, setScanningSimulated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) {
      setScanningSimulated(false);
      return;
    }

    api.getTemples({ limit: 20 })
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTemples(res.data);
          setSelectedTemple(res.data[0]);
        }
      })
      .catch(() => {});
  }, [isOpen]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleQr(selectedTemple._id)
        .then(res => {
          setQrDataUrl(res.qrDataUrl);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [selectedTemple]);

  if (!isOpen) return null;

  const handleSimulateScan = () => {
    setScanningSimulated(true);
    setTimeout(() => {
      if (selectedTemple) {
        onClose();
        navigate(`/temples/${selectedTemple.slug || selectedTemple._id}`);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#E5DCCE] shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 rounded-full"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="w-12 h-12 rounded-full bg-[#EFE7D8] text-[#7B1D16] flex items-center justify-center mx-auto mb-2">
            <QrCode className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-temple-heading text-[#3A1412]">
            Temple QR Access Point
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Scan a placard at any temple gopuram or select a temple below to view verified timings, poojas, and parking instantly without logging in.
          </p>
        </div>

        {/* Temple Selector */}
        <div className="mb-4">
          <label className="block text-xs font-bold text-stone-700 mb-1.5">
            Select Temple Placard
          </label>
          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => {
              const found = temples.find(t => t._id === e.target.value);
              if (found) setSelectedTemple(found);
            }}
            className="w-full text-xs p-2.5 bg-[#FAF7F2] border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16]"
          >
            {temples.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city}, {t.state})
              </option>
            ))}
          </select>
        </div>

        {/* QR Code Container */}
        <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#DACDB8] text-center mb-5 flex flex-col items-center">
          {loading ? (
            <div className="w-48 h-48 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#7B1D16] animate-spin" />
            </div>
          ) : qrDataUrl ? (
            <div className="relative group">
              <img
                src={qrDataUrl}
                alt="Temple QR"
                className="w-48 h-48 rounded-xl bg-white p-2 shadow-sm border border-stone-200"
              />
              <div className="mt-2 text-xs font-semibold text-[#7B1D16]">
                {selectedTemple?.name}
              </div>
              <p className="text-[11px] text-stone-500">
                Official Digital Visitor Assistance Placard
              </p>
            </div>
          ) : (
            <div className="w-48 h-48 flex items-center justify-center text-xs text-stone-400">
              Generating Placard...
            </div>
          )}

          {scanningSimulated && (
            <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>Placard Scanned! Redirecting to Temple...</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateScan}
            disabled={scanningSimulated || !selectedTemple}
            className="flex-1 py-2.5 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Camera className="w-4 h-4" />
            <span>Simulate Scan & Open Guide</span>
          </button>

          {qrDataUrl && (
            <a
              href={qrDataUrl}
              download={`${selectedTemple?.slug || 'temple'}-qr.png`}
              className="p-2.5 bg-[#FAF7F2] hover:bg-[#EFE7D8] text-stone-700 border border-[#DACDB8] rounded-xl flex items-center justify-center transition-colors"
              title="Download QR Image"
            >
              <Download className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
