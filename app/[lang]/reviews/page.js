'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { REVIEWS } from '@/lib/data';
import { Star, Quote } from 'lucide-react';
export default function Reviews({ params }) { const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><Quote size={22} /></span>{t.reviews_title}</h1><div className="svc-grid">{REVIEWS.concat(REVIEWS).map((r, i) => <div key={i} className="card card-h"><div style={{ color: '#f59e0b', display: 'flex', gap: 2 }}>{Array.from({ length: r.s }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}</div><br /><b>{r.n}</b><p className="mut">{r.x}</p></div>)}</div></div><Footer lang={lang} /></>); }
