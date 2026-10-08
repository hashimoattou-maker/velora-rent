'use client';
import { useState } from 'react';
import { Navbar, Footer, CarCard } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS, CITIES } from '@/lib/data';
import { Search, Car as CarIcon, SlidersHorizontal } from 'lucide-react';

const catMatch = (c, cat) => {
  if (cat === 'all') return true;
  if (cat === 'eco') return c.price <= 300;
  if (cat === 'fam') return ['SUV', 'Van', 'Berline'].includes(c.type) && c.seats >= 5 && c.type !== 'Luxe';
  if (cat === 'luxe') return c.type === 'Luxe';
  if (cat === 'suv') return c.type === 'SUV';
  if (cat === 'van') return c.type === 'Van';
  if (cat === 'elec') return c.type === 'Électrique';
  return true;
};

export default function Cars({ params }) {
  const lang = params.lang; const t = dict[lang];
  const [q, setQ] = useState(''); const [city, setCity] = useState(''); const [type, setType] = useState(''); const [max, setMax] = useState(1200); const [sort, setSort] = useState('rating');
  const [cat, setCat] = useState('all');
  const CATS = [['all', t.cat_all], ['eco', t.cat_eco], ['fam', t.cat_fam], ['luxe', t.cat_luxe], ['suv', t.cat_suv], ['van', t.cat_van], ['elec', t.cat_elec]];
  let list = CARS.filter((c) => (!city || c.city === city) && (!type || c.type === type) && c.price <= max && catMatch(c, cat) && (!q || (c.brand + c.model).toLowerCase().includes(q.toLowerCase())));
  if (sort === 'price') list = [...list].sort((a, b) => a.price - b.price); else list = [...list].sort((a, b) => b.rating - a.rating);
  const types = [...new Set(CARS.map((c) => c.type))];
  return (<><Navbar lang={lang} /><div className="page">
    <h1><span className="ic"><CarIcon size={22} /></span>{t.nav.cars} ({list.length})</h1>
    <div className="card" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#68718f', fontWeight: 700 }}><SlidersHorizontal size={16} /></span>
      <span style={{ position: 'relative', flex: '1 1 160px' }}><Search size={15} style={{ position: 'absolute', insetInlineStart: 10, top: 12, color: '#9aa3b8' }} /><input placeholder={t.search_ph} value={q} onChange={(e) => setQ(e.target.value)} style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: 12, border: '1.5px solid #e2e6f2' }} /></span>
      <select value={city} onChange={(e) => setCity(e.target.value)}><option value="">{t.search.all}</option>{CITIES.map((c) => <option key={c}>{c}</option>)}</select>
      <select value={type} onChange={(e) => setType(e.target.value)}><option value="">{t.filters.type}</option>{types.map((x) => <option key={x}>{x}</option>)}</select>
      <label style={{ fontSize: 13 }}>{t.filters.price}: <b>{max} DH</b><input type="range" min="200" max="1200" value={max} onChange={(e) => setMax(+e.target.value)} /></label>
      <select value={sort} onChange={(e) => setSort(e.target.value)}><option value="rating">{t.filters.sort_rating}</option><option value="price">{t.filters.sort_price}</option></select>
    </div>
    <div className="pills" style={{ marginTop: 12 }}>
      {CATS.map(([v, l]) => <button key={v} className={'pill' + (cat === v ? ' on' : '')} onClick={() => setCat(v)}>{l}</button>)}
    </div>
    <div className="grid" style={{ padding: '14px 0' }}>{list.map((c) => <CarCard key={c.id} lang={lang} car={c} />)}</div>
  </div><Footer lang={lang} /></>);
}
