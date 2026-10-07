'use client';
import { useState } from 'react';
import { Navbar, Footer, CarCard } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS, CITIES } from '@/lib/data';
export default function Cars({ params }) {
  const lang = params.lang; const t = dict[lang];
  const [q, setQ] = useState(''); const [city, setCity] = useState(''); const [type, setType] = useState(''); const [max, setMax] = useState(1200); const [sort, setSort] = useState('rating');
  let list = CARS.filter((c) => (!city || c.city === city) && (!type || c.type === type) && c.price <= max && (!q || (c.brand + c.model).toLowerCase().includes(q.toLowerCase())));
  if (sort === 'price') list = [...list].sort((a, b) => a.price - b.price); else list = [...list].sort((a, b) => b.rating - a.rating);
  const types = [...new Set(CARS.map((c) => c.type))];
  return (<><Navbar lang={lang} /><div className="page">
    <h1>🚗 {t.nav.cars} ({list.length})</h1>
    <div className="card" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      <input placeholder="Dacia, Golf…" value={q} onChange={(e) => setQ(e.target.value)} style={{ padding: 10, borderRadius: 10, border: '1px solid #ddd' }} />
      <select value={city} onChange={(e) => setCity(e.target.value)}><option value="">{t.search.all}</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={type} onChange={(e) => setType(e.target.value)}><option value="">{t.filters.type}</option>{types.map((x) => <option key={x}>{x}</option>)}</select>
      <label>{t.filters.price}: <b>{max} DH</b><input type="range" min="200" max="1200" value={max} onChange={(e) => setMax(+e.target.value)} /></label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="rating">{t.filters.sort_rating}</option><option value="price">{t.filters.sort_price}</option></select>
    </div>
    <div className="grid" style={{ padding: '18px 0' }}>{list.map((c) => <CarCard key={c.id} lang={lang} car={c} />)}</div>
  </div><Footer lang={lang} /></>);
}
