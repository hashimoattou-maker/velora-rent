'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { REVIEWS } from '@/lib/data';
export default function Reviews({ params }) { const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1>⭐ {t.reviews_title}</h1><div className="svc-grid">{REVIEWS.concat(REVIEWS).map((r, i) => <div key={i} className="card">{'⭐'.repeat(r.s)}<br /><b>{r.n}</b><p className="mut">{r.x}</p></div>)}</div></div><Footer lang={lang} /></>); }
