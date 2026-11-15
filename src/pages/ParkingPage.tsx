import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Car, Clock, MapPin, Footprints, Navigation, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Parking, Temple } from '../types';
import { LoadingState } from '../components/common/LoadingState';

export const ParkingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [parkingList, setParkingList] = useState<Parking[]>([]);
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
      api.getTempleParking(selectedTemple._id)
        .then(res => setParkingList(res.data || []))
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

  const defaultParkingImages = [
    '/images/temple_complex_aerial_1794224329595.jpg',
    '/images/temple_hero_gopuram.jpg',
    '/images/temple_sanctum_courtyard_1794224328434.jpg',
    '/images/temple_annadanam_hall_1794224331195.jpg'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb matching Reference 8 */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Parking Information</span>
      </nav>

      {/* Header with Temple Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Parking Information
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Available authorized parking zones for {selectedTemple?.name}
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

      {/* Parking Cards matching Reference 8 */}
      {loading ? (
        <LoadingState message="Loading parking data..." />
      ) : parkingList.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E5DCCE] p-12 text-center text-xs text-stone-500">
          No parking zones recorded yet for {selectedTemple?.name}.
        </div>
      ) : (
        <div className="space-y-4">
          {parkingList.map((park, idx) => (
            <div
              key={park._id}
              className="bg-white border border-[#E5DCCE] rounded-2xl p-4 sm:p-5 shadow-xs hover:border-[#7B1D16] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            >
              {/* Left: Image Thumbnail & Details */}
              <div className="flex items-start gap-4 grow">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 border border-[#E5DCCE] bg-stone-100">
                  <img
                    src={defaultParkingImages[idx % defaultParkingImages.length]}
                    alt={park.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = '/images/default_temple.jpg';
                    }}
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
                      {park.name}
                    </h3>
                    <span className="text-[10px] font-bold text-[#7B1D16] bg-[#EFE7D8] px-2.5 py-0.5 rounded-full">
                      {park.distance}
                    </span>
                  </div>

                  <p className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#E07A28]" />
                    <span>{park.location}</span>
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-stone-600 pt-1">
                    <div>
                      <span className="text-stone-400 block text-[10px]">Capacity:</span>
                      <span className="font-semibold">{park.capacity}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Open Hours:</span>
                      <span className="font-semibold">{park.timing}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Walking Time:</span>
                      <span className="font-semibold">{park.walkingTime}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px]">Fee:</span>
                      <span className="font-semibold text-[#7B1D16]">{park.fee}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: View on Map action */}
              <div className="self-end sm:self-center shrink-0">
                <Link
                  to={`/map?temple=${selectedTemple?.slug || selectedTemple?._id}`}
                  className="px-4 py-2 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>View on Map</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
