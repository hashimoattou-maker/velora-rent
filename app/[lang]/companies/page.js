'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { COMPANIES } from '@/lib/data';
import { Building2, MapPin, Star, Car, Phone, Handshake, ArrowRight } from 'lucide-react';
export default function Companies({ params }) {
  const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><Building2 size={22} /></span>{t.companies_title}</h1>
    <div className="svc-grid">{COMPANIES.map((c) => <div key={c.name} className="card card-h"><img src={c.img} style={{ width: '100%', height: 150, objectFit: 'cover', borderRadius: 14 }} /><h3 style={{ margin: '10px 0 4px' }}>{c.name}</h3><p className="mut" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><span><MapPin size={12} /> {c.city}</span><span><Car size={12} /> {c.cars}</span><span><Star size={12} /> {c.rating}</span></p><p className="mut"><Phone size={12} /> {c.phone}</p><Link className="btn" href={`/${lang}/cars`}>Voir voitures <ArrowRight size={15} /></Link></div>)}</div>
    <div className="dark" style={{ marginTop: 20, textAlign: 'center' }}><Handshake size={36} /><h3>{t.become} — 0% commission 3 mois</h3><Link className="btn" href={`/${lang}/partner`} style={{ background: '#fff', color: '#2b1a5e', boxShadow: 'none' }}>{t.become}</Link></div>
  </div><Footer lang={lang} /></>);
}
