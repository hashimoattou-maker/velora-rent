'use client';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { COMPANIES } from '@/lib/data';
import { serverAvailable, api } from '@/lib/api';
import { Building2, MapPin, Star, Car, Phone, Handshake, ArrowRight, List, Map as MapIcon, Search } from 'lucide-react';

const AgencyMap = dynamic(() => import('@/components/AgencyMap'), { ssr: false, loading: () => <div className="card">🗺️ …</div> });

export default function Companies({ params }) {
  const lang = params.lang; const t = dict[lang];
  const [tab, setTab] = useState('map');
  const [q, setQ] = useState('');
  const [list, setList] = useState(COMPANIES);
  useEffect(() => {
    (async () => {
      try { if (await serverAvailable()) { const r = await api.companies(); if (r.companies?.length) setList(r.companies); } } catch {}
    })();
  }, []);
  const filtered = list.filter((c) => !q || (c.name + ' ' + c.city).toLowerCase().includes(q.toLowerCase()));
  return (<><Navbar lang={lang} /><div className="page">
    <h1><span className="ic"><Building2 size={22} /></span>{t.companies_title}</h1>
    <div className="card" style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
      <button className={tab === 'list' ? 'btn sm' : 'btn-light sm'} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTab('list')}><List size={15} /> {t.tab_list}</button>
      <button className={tab === 'map' ? 'btn sm' : 'btn-light sm'} style={{ flex: 1, justifyContent: 'center' }} onClick={() => setTab('map')}><MapIcon size={15} /> {t.tab_map}</button>
    </div>
    {tab === 'map' && <>
      <h2 style={{ fontSize: 24 }}>{t.map_title}</h2><p className="mut">{t.map_sub}</p>
      <div style={{ position: 'relative', marginBottom: 12 }}>
        <Search size={16} style={{ position: 'absolute', insetInlineStart: 14, top: 14, color: '#9aa3b8' }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.map_search}
          style={{ width: '100%', padding: '12px 14px', paddingInlineStart: 40, borderRadius: 14, border: '1.5px solid #e2e6f2', background: '#fff' }} />
      </div>
      <AgencyMap agencies={filtered} lang={lang} />
    </>}
    {tab === 'list' && <div className="svc-grid">{filtered.map((c) => <div key={c.name} className="card card-h"><img src={c.img} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 14 }} /><h3 style={{ margin: '10px 0 4px' }}>{c.name}</h3><p className="mut" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><span><MapPin size={12} /> {c.city}</span><span><Car size={12} /> {c.cars}</span><span><Star size={12} /> {c.rating}</span></p>{c.address && <p className="mut"><MapPin size={12} /> {c.address}</p>}<p className="mut"><Phone size={12} /> {c.phone}</p><Link className="btn sm" href={`/${lang}/cars`}>{t.details} <ArrowRight size={15} /></Link></div>)}</div>}
    <div className="dark" style={{ marginTop: 20, textAlign: 'center' }}><Handshake size={36} /><h3>{t.become} — 0% commission 3 mois</h3><p style={{ color: '#d7cdf5' }}>{t.become_sub}</p><Link className="btn" href={`/${lang}/partner`} style={{ background: '#fff', color: '#2b1a5e', boxShadow: 'none' }}>{t.become}</Link></div>
  </div><Footer lang={lang} /></>);
}
