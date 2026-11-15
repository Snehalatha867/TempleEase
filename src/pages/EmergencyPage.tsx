import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ShieldAlert, 
  Shield, 
  HeartPulse, 
  Flame, 
  PhoneCall, 
  Phone, 
  AlertTriangle,
  HeartHandshake,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { EmergencyContact, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const EmergencyPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

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
      .catch(() => {});
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleEmergency(selectedTemple._id)
        .then(res => setContacts(res.data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [selectedTemple]);

  const handleTempleChange = (templeId: string) => {
    const found = temples.find(t => t._id === templeId);
    if (found) {
      setSelectedTemple(found);
      const next = new URLSearchParams(searchParams);
      next.set('temple', found.slug || found._id);
      setSearchParams(next);
    }
  };

  const topServices = [
    { title: 'Police Emergency', number: '100 / 112', icon: Shield, color: 'text-indigo-600 bg-indigo-50', tel: '100' },
    { title: 'Ambulance Dispatch', number: '108', icon: HeartPulse, color: 'text-rose-600 bg-rose-50', tel: '108' },
    { title: 'Fire & Disaster Rescue', number: '101', icon: Flame, color: 'text-amber-600 bg-amber-50', tel: '101' }
  ];

  const middleServices = [
    { title: 'Temple Security Desk', number: selectedTemple?.phone || '+91 877 227 7777', icon: ShieldAlert, color: 'text-[#7B1D16] bg-[#FFF5EE]', tel: selectedTemple?.phone || '100' },
    { title: 'Women Safety Helpline', number: '1091', icon: HeartHandshake, color: 'text-pink-600 bg-pink-50', tel: '1091' },
    { title: 'National Emergency', number: '112', icon: Phone, color: 'text-emerald-600 bg-emerald-50', tel: '112' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Emergency Contacts</span>
      </nav>

      {/* Header & Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Emergency Help & Helplines
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Get immediate verified assistance when you need it at {selectedTemple?.name}
          </p>
        </div>

        {/* Temple Selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-700">Select Temple:</label>
          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => handleTempleChange(e.target.value)}
            className="text-xs p-2 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-semibold text-[#7B1D16]"
          >
            {temples.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Top 3 Primary Cards matching Reference 9 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {topServices.map((srv) => {
          const IconComp = srv.icon;
          return (
            <div
              key={srv.title}
              className="bg-white border border-[#E5DCCE] rounded-2xl p-6 text-center space-y-3 shadow-xs hover:border-[#7B1D16] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`p-2 rounded-xl ${srv.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#3A1412]">{srv.title}</h3>
              </div>

              <div className="text-2xl font-bold text-[#3A1412] tracking-tight">
                {srv.number}
              </div>

              <a
                href={`tel:${srv.tel}`}
                className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#7B1D16] hover:text-white border border-[#DACDB8] text-[#3A1412] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-[#7B1D16] group-hover:text-white" />
                <span>Call Now</span>
              </a>
            </div>
          );
        })}
      </div>

      {/* Middle 3 Cards matching Reference 9 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {middleServices.map((srv) => {
          const IconComp = srv.icon;
          return (
            <div
              key={srv.title}
              className="bg-white border border-[#E5DCCE] rounded-2xl p-6 text-center space-y-3 shadow-xs hover:border-[#7B1D16] transition-all flex flex-col justify-between"
            >
              <div className="flex items-center justify-center gap-2">
                <div className={`p-2 rounded-xl ${srv.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-[#3A1412] truncate">{srv.title}</h3>
              </div>

              <div className="text-lg font-bold text-[#3A1412] tracking-tight truncate">
                {srv.number}
              </div>

              <a
                href={`tel:${srv.tel.replace(/[^0-9+]/g, '')}`}
                className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#7B1D16] hover:text-white border border-[#DACDB8] text-[#3A1412] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <PhoneCall className="w-4 h-4 text-[#7B1D16]" />
                <span>Call Now</span>
              </a>
            </div>
          );
        })}
      </div>

      {/* Bottom Row: Visitor Help Desk & Safety Alert matching Reference 9 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Help Desk Card */}
        <div className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#3A1412]">
                {selectedTemple?.name} Visitor Help Desk
              </h3>
              <p className="text-xs text-stone-500">
                Lost and found, missing family members, elderly wheelchair assistance
              </p>
            </div>
          </div>

          <div className="text-base font-bold text-[#7B1D16]">
            {selectedTemple?.phone || '+91 877 227 7777'}
          </div>

          <a
            href={`tel:${(selectedTemple?.phone || '').replace(/[^0-9+]/g, '')}`}
            className="w-full py-2.5 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call Help Desk</span>
          </a>
        </div>

        {/* Safety Alert Advisory Card */}
        <div className="bg-[#FFF9EC] border border-[#F4E1BA] rounded-2xl p-6 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-xl text-amber-700 shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wide">
              Devotee Safety Advisory
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed">
              Stay calm and report immediately to the nearest volunteer help desk or security personnel. Do not pay unauthorized middlemen or touts for queue passes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
