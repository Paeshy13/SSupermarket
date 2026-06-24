'use client';
import { useEffect, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';

// Samrat Supermarket coordinates in Nyeri Town
const SAMRAT_LOCATION = { lat: -0.4169, lng: 36.9508 };

export default function GoogleMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { translate: tr } = useApp();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_GOOGLE_MAPS_API_KEY') {
      setError(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    (window as unknown as Record<string, unknown>).initMap = () => {
      if (!mapRef.current) return;
      const map = new (window as unknown as { google: { maps: { Map: new (...a: unknown[]) => unknown; Marker: new (...a: unknown[]) => unknown; InfoWindow: new (...a: unknown[]) => unknown } } }).google.maps.Map(mapRef.current, {
        center: SAMRAT_LOCATION,
        zoom: 16,
        mapTypeControl: false,
      });
      const marker = new (window as unknown as { google: { maps: { Map: new (...a: unknown[]) => unknown; Marker: new (...a: unknown[]) => unknown; InfoWindow: new (...a: unknown[]) => unknown } } }).google.maps.Marker({
        position: SAMRAT_LOCATION,
        map,
        title: 'Samrat Supermarket',
        animation: 2,
      });
      const info = new (window as unknown as { google: { maps: { Map: new (...a: unknown[]) => unknown; Marker: new (...a: unknown[]) => unknown; InfoWindow: new (...a: unknown[]) => unknown } } }).google.maps.InfoWindow({
        content: '<div style="padding:8px"><strong>🛒 Samrat Supermarket</strong><br>Nyeri Town, Kenya<br><small>Mon–Sat: 8AM–8PM | Sun: 9AM–6PM</small></div>',
      });
      (marker as unknown as { addListener: (e: string, cb: () => void) => void }).addListener('click', () => (info as unknown as { open: (m: unknown, mk: unknown) => void }).open(map, marker));
      (info as unknown as { open: (m: unknown, mk: unknown) => void }).open(map, marker);
      setLoaded(true);
    };

    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  if (error) {
    return (
      <div className="w-full h-80 bg-gray-100 rounded-2xl flex flex-col items-center justify-center text-center p-8">
        <div className="text-5xl mb-4">📍</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Samrat Supermarket</h3>
        <p className="text-gray-600 mb-1">Nyeri Town, Nyeri County, Kenya</p>
        <p className="text-gray-500 text-sm mb-4">Opposite Nyeri Town Hall · Near KCB Bank</p>
        <a
          href="https://www.google.com/maps/search/Nyeri+Town+Kenya/@-0.4169,36.9508,16z"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition text-sm font-semibold"
        >
          📍 {tr('directions')}
        </a>
        <p className="text-xs text-gray-400 mt-4">Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable interactive map</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-80 rounded-2xl overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full" />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-3">🗺️</div>
            <p className="text-gray-500">Loading map...</p>
          </div>
        </div>
      )}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${SAMRAT_LOCATION.lat},${SAMRAT_LOCATION.lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg hover:bg-green-600 transition"
      >
        📍 {tr('directions')}
      </a>
    </div>
  );
}
