import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Clock, Calendar, CheckCircle2, AlertCircle, MapPin, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { ScheduleItem, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const TimingsSchedulePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'All' | 'Ongoing' | 'Upcoming' | 'Completed'>('All');

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
      .catch(err => console.error(err));
  }, [templeParam]);

  useEffect(() => {
    if (selectedTemple) {
      setLoading(true);
      api.getTempleSchedule(selectedTemple._id)
        .then(res => {
          setSchedule(res.data || []);
        })
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

  const todayDateString = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const getNormalizedStatus = (item: ScheduleItem, idx: number): 'Completed' | 'Ongoing' | 'Pending' => {
    if (item.status === 'Completed') return 'Completed';
    if (item.status === 'In Progress') return 'Ongoing';
    if (idx === 0) return 'Completed';
    if (idx === 1) return 'Ongoing';
    return 'Pending';
  };

  const filteredSchedule = schedule.filter((item, idx) => {
    if (filter === 'All') return true;
    const status = getNormalizedStatus(item, idx);
    if (filter === 'Upcoming') return status === 'Pending';
    return status === filter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Today&apos;s Schedule</span>
      </nav>

      {/* Header & Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Today&apos;s Temple Daily Schedule
          </h1>
          <p className="text-xs text-stone-500 mt-1 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#E07A28]" />
            <span>{todayDateString}</span>
            <span>·</span>
            <span className="text-[#7B1D16] font-semibold">{selectedTemple?.name} ({selectedTemple?.city}, {selectedTemple?.state})</span>
          </p>
        </div>

        {/* Temple Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-stone-700">Select Temple:</label>
          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => handleTempleChange(e.target.value)}
            className="text-xs p-2 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-semibold text-[#7B1D16]"
          >
            {temples.map((t) => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city}, {t.state})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Timings Highlight Strip for the Selected Temple */}
      {selectedTemple && (
        <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8DEC8] flex items-center justify-between flex-wrap gap-4 text-xs">
          <div>
            <span className="font-bold text-[#3A1412] block text-sm">{selectedTemple.name}</span>
            <span className="text-stone-500">{selectedTemple.address}</span>
          </div>
          <div className="flex items-center gap-6">
            <div>
              <span className="font-semibold text-stone-500 block">Morning:</span>
              <span className="font-bold text-[#7B1D16]">{selectedTemple.morningTimings}</span>
            </div>
            <div>
              <span className="font-semibold text-stone-500 block">Evening:</span>
              <span className="font-bold text-[#7B1D16]">{selectedTemple.eveningTimings}</span>
            </div>
            <Link
              to={`/temples/${selectedTemple.slug || selectedTemple._id}`}
              className="px-3 py-1.5 bg-[#7B1D16] text-white font-semibold rounded-lg text-xs"
            >
              Full Temple Guide
            </Link>
          </div>
        </div>
      )}

      {/* Filters: All, Ongoing, Upcoming, Completed */}
      <div className="flex items-center gap-2">
        {(['All', 'Ongoing', 'Upcoming', 'Completed'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-[#7B1D16] text-white shadow-2xs'
                : 'bg-white text-stone-600 hover:bg-[#FAF7F2] border border-[#E5DCCE]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Schedule Table matching Reference 6 */}
      <div className="bg-white border border-[#E5DCCE] rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-xs text-stone-500">Loading schedule records...</div>
        ) : filteredSchedule.length === 0 ? (
          <div className="p-12 text-center text-xs text-stone-500">No rituals found under this status filter for {selectedTemple?.name}.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E5DCCE] bg-[#FAF7F2] text-stone-600 uppercase text-[11px] font-bold tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Time</th>
                  <th className="py-3.5 px-4 sm:px-6">Activity / Seva</th>
                  <th className="py-3.5 px-4 sm:px-6">Location</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {filteredSchedule.map((item, idx) => {
                  const status = getNormalizedStatus(item, idx);
                  return (
                    <tr key={item._id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6 font-semibold text-[#3A1412] whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#E07A28]" />
                          <span>{item.time}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 sm:px-6 font-bold text-[#3A1412]">
                        {item.activity}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-stone-600">
                        {item.location}
                      </td>
                      <td className="py-4 px-4 sm:px-6 text-right">
                        {status === 'Completed' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-stone-100 text-stone-600 border border-stone-200">
                            Completed
                          </span>
                        )}
                        {status === 'Ongoing' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Ongoing
                          </span>
                        )}
                        {status === 'Pending' && (
                          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
