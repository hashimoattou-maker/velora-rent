'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { COMPANIES } from '@/lib/data';
export default function Companies({ params }) {
  const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1>🏢 {t.companies_title}</h1>
    <div className="svc-grid">{COMPANIES.map((c) => <div key={c.name} className="card"><img src={c.img} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 12 }} /><h3>{c.name}</h3><p className="mut">📍 {c.city} • 🚗 {c.cars} voitures • ⭐ {c.rating}</p><p className="mut">📞 {c.phone}</p><Link className="btn" href={`/${lang}/cars`}>Voir voitures →</Link></div>)}</div>
    <div className="dark" style={{ marginTop: 18, textAlign: 'center' }}><h3>🤝 {t.become} — 0% commission 3 mois</h3><Link className="btn" href={`/${lang}/partner`}>{t.become}</Link></div>
  </div><Footer lang={lang} /></>);
}
