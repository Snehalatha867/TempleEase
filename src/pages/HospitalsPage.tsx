import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HeartPulse, MapPin, Navigation, PhoneCall, ShieldCheck, Ambulance } from 'lucide-react';
import { api } from '../services/api';
import { Hospital, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const HospitalsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  const templeParam = searchParams.get('temple');

  useEffect(() => {
    api.getTemples().then(res => {
      if (res.data && res.data.length > 0) {
        setTemples(res.data);
        let target = res.data[0];
        if (templeParam) {
          const found = res.data.find(t => t._id === templeParam || t.slug === templeParam);
          if (found) target = found;
        }
        setSelectedTemple(target);
      }
    }).catch(() => {});
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleHospitals(selectedTemple._id)
        .then(res => setHospitals(res.data || []))
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Nearby Hospitals</span>
      </nav>

      {/* Header & Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Nearby Hospitals & Medical Facilities
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Emergency trauma care, casualty wards and ambulance services near {selectedTemple?.name}
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

      {/* Quick Ambulance Emergency Banner */}
      <div className="bg-[#FFF5EE] border border-[#7B1D16]/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#7B1D16] text-white flex items-center justify-center shrink-0">
            <Ambulance className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#3A1412]">24/7 Pilgrim Ambulance Emergency Line</h3>
            <p className="text-xs text-stone-600">Immediate response life-support ambulance network stationed at the temple gates.</p>
          </div>
        </div>

        <a
          href="tel:108"
          className="px-5 py-2 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-xs shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5" />
          <span>Call Ambulance (108)</span>
        </a>
      </div>

      {/* Hospitals Cards Grid */}
      {loading ? (
        <LoadingState message="Loading medical centres..." />
      ) : hospitals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DCCE] p-12 text-center text-xs text-stone-500">
          No hospital records listed for {selectedTemple?.name}. In an emergency, dial 108 or 112 directly.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hospitals.map((hosp) => (
            <div
              key={hosp._id}
              className="bg-white border border-[#E5DCCE] rounded-2xl p-6 shadow-xs hover:border-[#7B1D16] transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    24/7 Casualty Active
                  </span>
                  <span className="text-xs font-semibold text-stone-500">{hosp.distance}</span>
                </div>

                <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
                  {hosp.name}
                </h3>

                <p className="text-xs text-stone-600 flex items-start gap-1.5">
                  <MapPin className="w-4 h-4 text-[#E07A28] shrink-0 mt-0.5" />
                  <span>{hosp.address}</span>
                </p>

                <div className="pt-2">
                  <span className="text-[11px] font-bold text-stone-700 block mb-1">Available Specialties:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.facilities.map((f, i) => (
                      <span key={i} className="text-[10px] bg-[#FAF7F2] border border-[#E5DCCE] text-stone-600 px-2 py-0.5 rounded-md">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
                <a
                  href={`tel:${hosp.phone.replace(/[^0-9+]/g, '')}`}
                  className="flex-1 py-2 px-3 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call Hospital: {hosp.phone}</span>
                </a>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${hosp.latitude},${hosp.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 text-stone-600 hover:text-[#7B1D16] bg-[#FAF7F2] border border-[#E5DCCE] rounded-xl transition-colors"
                  title="Navigate via GPS"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
