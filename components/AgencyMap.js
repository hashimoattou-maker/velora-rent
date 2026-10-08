'use client';
import { useEffect, useRef } from 'react';
import 'leaflet/dist/leaflet.css';

// Client-only map (loaded with ssr:false). OpenStreetMap tiles — free, no API key.
export default function AgencyMap({ agencies, lang }) {
  const ref = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      if (cancelled || !ref.current || mapRef.current) return;
      const pts = (agencies || []).filter((a) => a.lat && a.lng).map((a) => [+a.lat, +a.lng]);
      const map = L.map(ref.current, { scrollWheelZoom: true }).setView([31.8, -6.5], 6);
      mapRef.current = map;
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      const bounds = [];
      (agencies || []).filter((a) => a.lat && a.lng).forEach((a) => {
        const icon = L.divIcon({
          className: 'vr-pin',
          html: `<div class="vr-pin-in">🚗</div><div class="vr-pin-label">${a.name}</div>`,
          iconSize: [0, 0],
        });
        L.marker([+a.lat, +a.lng], { icon }).addTo(map)
          .bindPopup(`<b>${a.name}</b><br/>${a.address || ''}<br/>${a.city} • ⭐ ${a.rating} • ${a.cars} 🚗<br/>${a.phone || ''}`);
        bounds.push([+a.lat, +a.lng]);
      });
      if (bounds.length > 1) map.fitBounds(bounds, { padding: [40, 40] });
      else if (bounds.length === 1) map.setView(bounds[0], 12);
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <style>{`
        .vr-pin-in{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#a855f7);display:grid;place-items:center;font-size:19px;border:3px solid #fff;box-shadow:0 8px 20px -4px #7c3aed99;transform:translate(-20px,-40px)}
        .vr-pin-label{position:absolute;top:-14px;left:24px;transform:translateX(-50%);background:#0d122b;color:#fff;font-weight:800;font-size:12px;padding:4px 12px;border-radius:999px;white-space:nowrap;box-shadow:0 6px 16px -4px #0008}
        .leaflet-container{border-radius:22px}
      `}</style>
      <div ref={ref} style={{ height: 420, width: '100%', borderRadius: 22, boxShadow: '0 12px 32px -12px #4f46e533', border: '1px solid #eef0f7' }} />
    </>
  );
}
