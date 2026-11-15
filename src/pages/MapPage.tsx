import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  MapPin, 
  Car, 
  HeartPulse, 
  Shield, 
  Bus, 
  Bath, 
  Navigation, 
  ExternalLink,
  Layers,
  ArrowRight,
  Sparkles,
  Loader2,
  Compass
} from 'lucide-react';
import { api } from '../services/api';
import { Temple } from '../types';

export const MapPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [temples, setTemples] = useState<Temple[]>([]);
  const [selectedTemple, setSelectedTemple] = useState<Temple | null>(null);
  const [loading, setLoading] = useState(true);
  const [stateFilter, setStateFilter] = useState('All');
  const [states, setStates] = useState<string[]>([]);
  const [mapType, setMapType] = useState<'Map' | 'Satellite'>('Map');

  const templeParam = searchParams.get('temple');

  useEffect(() => {
    // Load metadata
    api.getMetadata().then(res => {
      if (res.data) setStates(res.data.states);
    }).catch(() => {});

    // Load temples
    api.getTemples().then(res => {
      if (res.data && res.data.length > 0) {
        setTemples(res.data);
        if (templeParam) {
          const found = res.data.find(t => t._id === templeParam || t.slug === templeParam);
          setSelectedTemple(found || res.data[0]);
        } else {
          setSelectedTemple(res.data[0]);
        }
      }
    }).catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [templeParam]);

  const handleTempleSelect = (temple: Temple) => {
    setSelectedTemple(temple);
    const next = new URLSearchParams(searchParams);
    next.set('temple', temple.slug || temple._id);
    setSearchParams(next);
  };

  const filteredTemples = stateFilter === 'All'
    ? temples
    : temples.filter(t => t.state === stateFilter);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-[#7B1D16] animate-spin mb-2" />
        <p className="text-xs text-stone-500">Loading Temple Maps of India...</p>
      </div>
    );
  }

  const lat = selectedTemple?.latitude || 13.6833;
  const lon = selectedTemple?.longitude || 79.3497;

  const nearbyPlaces = [
    { name: 'Parking Area', distance: selectedTemple?.parking?.[0]?.distance || '0.4 km', icon: Car, color: 'text-blue-600 bg-blue-50' },
    { name: 'Nearest Hospital', distance: selectedTemple?.hospitals?.[0]?.distance || '1.2 km', icon: HeartPulse, color: 'text-rose-600 bg-rose-50' },
    { name: 'Police Assistance', distance: '0.8 km', icon: Shield, color: 'text-indigo-600 bg-indigo-50' },
    { name: 'Transit / Bus Station', distance: '1.5 km', icon: Bus, color: 'text-amber-600 bg-amber-50' },
    { name: 'Restrooms & Cloakroom', distance: '0.1 km', icon: Bath, color: 'text-emerald-600 bg-emerald-50' }
  ];

  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.02}%2C${lat - 0.015}%2C${lon + 0.02}%2C${lat + 0.015}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-stone-500 font-medium">
        <Link to="/" className="hover:text-[#7B1D16] transition-colors">Home</Link>
        <span className="text-stone-300">/</span>
        <span className="text-[#3A1412] font-semibold">Temple Map & Navigation</span>
      </nav>

      {/* Header with Temple Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-[#E8DEC8] pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-temple-heading text-[#3A1412]">
            Temple Map & Visitor Navigation
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Explore verified GPS coordinates, walking distances, and nearby emergency amenities
          </p>
        </div>

        {/* Temple & State Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
            className="text-xs p-2 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-medium"
          >
            <option value="All">All States</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select
            value={selectedTemple?._id || ''}
            onChange={(e) => {
              const found = temples.find(t => t._id === e.target.value);
              if (found) handleTempleSelect(found);
            }}
            className="text-xs p-2 bg-white border border-[#DACDB8] rounded-xl outline-hidden focus:border-[#7B1D16] font-semibold text-[#7B1D16]"
          >
            {filteredTemples.map(t => (
              <option key={t._id} value={t._id}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 2-Column Split matching reference layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Map Canvas */}
        <div className="lg:col-span-8 bg-white border border-[#E5DCCE] rounded-2xl p-4 shadow-xs space-y-3">
          
          {/* Map Top Bar Controls */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 p-1 bg-[#FAF7F2] rounded-xl border border-[#E5DCCE] text-xs font-semibold">
              <button
                onClick={() => setMapType('Map')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  mapType === 'Map' ? 'bg-white text-[#3A1412] shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType('Satellite')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  mapType === 'Satellite' ? 'bg-white text-[#3A1412] shadow-2xs font-bold' : 'text-stone-600'
                }`}
              >
                Satellite
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-600">
              <span className="font-semibold text-[#7B1D16]">{selectedTemple?.name}</span>
              <span>·</span>
              <span>GPS: {lat.toFixed(4)}° N, {lon.toFixed(4)}° E</span>
            </div>
          </div>

          {/* Map Embed Container */}
          <div className="relative h-[440px] w-full rounded-xl overflow-hidden border border-[#E5DCCE] bg-[#E5E0D8]">
            <iframe
              title="Temple Map Frame"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={osmUrl}
              className="w-full h-full filter saturate-[1.1]"
            />

            {/* Overlaid Temple Pill */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs border border-[#E5DCCE] p-2.5 rounded-xl shadow-md max-w-xs flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#E07A28] text-white flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#3A1412] truncate">{selectedTemple?.name}</p>
                <p className="text-[10px] text-stone-500 truncate">{selectedTemple?.address}</p>
              </div>
            </div>
          </div>

          {/* Map Footer Note */}
          <div className="flex items-center justify-between text-xs text-stone-500 pt-1">
            <span>OpenStreetMap Cartography · GPS Calibrated</span>
            <Link
              to={`/temples/${selectedTemple?.slug || selectedTemple?._id}`}
              className="text-[#7B1D16] font-semibold hover:underline flex items-center gap-1"
            >
              <span>View Full {selectedTemple?.name} Guide</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Right Column: Nearby Places Directory matching reference */}
        <div className="lg:col-span-4 bg-white border border-[#E5DCCE] rounded-2xl p-5 shadow-xs space-y-5">
          <div>
            <h3 className="text-base font-bold font-temple-heading text-[#3A1412]">
              Nearby Pilgrim Facilities
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Approximate distances from {selectedTemple?.name}
            </p>
          </div>

          {/* Nearby places list */}
          <div className="space-y-3">
            {nearbyPlaces.map((place) => {
              const IconComp = place.icon;
              return (
                <div 
                  key={place.name} 
                  className="p-3 bg-[#FAF7F2] hover:bg-[#F4EFE6] border border-[#E5DCCE] rounded-xl flex items-center justify-between transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${place.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#3A1412]">{place.name}</h4>
                      <p className="text-[11px] text-stone-500">Verified pilgrim zone</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#7B1D16]">{place.distance}</span>
                </div>
              );
            })}
          </div>

          {/* Direct Action Buttons */}
          <div className="pt-2 space-y-2.5">
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-[#7B1D16] hover:bg-[#5E140E] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Navigation className="w-4 h-4" />
              <span>Get Turn-by-Turn Directions</span>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${lat},${lon}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#EDE5D8] border border-[#DACDB8] text-[#3A1412] text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-stone-500" />
              <span>Open in Google Maps App</span>
            </a>
          </div>

          {/* Other Temples in this State */}
          <div className="pt-3 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-700 block mb-2">
              Other Temples in {selectedTemple?.state}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {temples
                .filter(t => t.state === selectedTemple?.state && t._id !== selectedTemple?._id)
                .slice(0, 4)
                .map(t => (
                  <button
                    key={t._id}
                    onClick={() => handleSelectTemple(t)}
                    className="text-[10px] px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#EFE7D8] border border-stone-200 rounded-lg text-stone-700 font-medium"
                  >
                    {t.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );

  function handleSelectTemple(t: Temple) {
    handleTempleSelect(t);
  }
};
