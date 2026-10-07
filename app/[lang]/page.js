'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, CarCard } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS, COMPANIES, CITIES, REVIEWS } from '@/lib/data';

export default function Landing({ params }) {
  const lang = params.lang; const t = dict[lang];
  const [city, setCity] = useState('');
  return (<>
    <Navbar lang={lang} />
    <div className="topbar"><div className="hero">
      <div>
        <span className="badge">{t.hero_badge}</span>
        <h1>{t.hero_title}</h1>
        <p>{t.hero_sub}</p>
        <div className="card" style={{ marginTop: 16 }}>
          <form className="search" action={`/${lang}/cars`}>
            <select name="city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">{t.search.pickup} — {t.search.all}</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" name="start" required />
            <input type="date" name="end" required />
            <button className="btn">🔍 {t.search.btn}</button>
          </form>
        </div>
        <div className="kpi" style={{ marginTop: 14 }}>
          {t.how.map((h, i) => <div key={i}>✅ {i + 1}. {h}</div>)}
        </div>
      </div>
      <div><img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900" alt="Velora" style={{ width: '100%', borderRadius: 24, boxShadow: '0 20px 60px #0008' }} />
        <div className="card" style={{ marginTop: -40, marginInline: 20, position: 'relative' }}>⭐ <b>4.9/5</b> — 12 400+ locations • Paiement CMI & cash • Assistance 24/7</div>
      </div>
    </div></div>
    <div className="section"><h2>{t.featured}</h2><div className="grid" style={{ padding: 0 }}>{CARS.slice(0, 6).map((c) => <CarCard key={c.id} lang={lang} car={c} />)}</div>
      <div style={{ textAlign: 'center', marginTop: 14 }}><Link className="btn" href={`/${lang}/cars`}>{t.see_all} →</Link></div></div>
    <div className="section"><h2>{t.services_title}</h2><p className="mut">{t.services_sub}</p>
      <div className="svc-grid">{t.svcs.map((s) => <Link key={s.slug} href={`/${lang}/services/${s.slug}`} className="svc"><b>✨ {s.t}</b><p className="mut">{s.d}</p></Link>)}</div></div>
    <div className="section"><h2>{t.companies_title}</h2><div className="svc-grid">
      {COMPANIES.map((c) => <div key={c.name} className="card"><img src={c.img} style={{ width: '100%', height: 130, objectFit: 'cover', borderRadius: 12 }} /><b>{c.name}</b><div className="mut">📍 {c.city} • 🚗 {c.cars} • ⭐ {c.rating}</div></div>)}
    </div><div style={{ marginTop: 12 }}><Link className="btn" href={`/${lang}/partner`}>🤝 {t.become}</Link></div></div>
    <div className="section"><h2>{t.reviews_title}</h2><div className="svc-grid">{REVIEWS.map((r, i) => <div key={i} className="card">⭐ {r.s}/5<br /><b>{r.n}</b><p className="mut">{r.x}</p></div>)}</div></div>
    <div className="section"><div className="dark" style={{ textAlign: 'center' }}><h2>{t.cta_title}</h2><p>{t.cta_sub}</p><Link className="btn" href={`/${lang}/register`}>{t.nav.register}</Link></div></div>
    <Footer lang={lang} />
  </>);
}
