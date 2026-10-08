'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Navbar, Footer, CarCard } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS, COMPANIES, CITIES, REVIEWS } from '@/lib/data';
import {
  Search, MapPin, Star, ShieldCheck, Zap, KeyRound, Route, BadgeCheck,
  CreditCard, Gift, Ticket, Building2, ArrowRight, Quote, CheckCircle2, Headset,
} from 'lucide-react';

const SVC_ICON = { payments: CreditCard, insurance: ShieldCheck, loyalty: Gift, 'gift-cards': Ticket, identity: BadgeCheck, companies: Building2 };

export default function Landing({ params }) {
  const lang = params.lang; const t = dict[lang];
  const [city, setCity] = useState('');
  return (<>
    <Navbar lang={lang} />
    <div className="hero-wrap"><div className="hero">
      <div>
        <span className="badge"><span className="dot" />{t.hero_badge}</span>
        <h1>Votre clé. Votre route.<br /><span className="g">Votre Velora.</span></h1>
        <p className="sub">{t.hero_sub}</p>
        <div className="card" style={{ marginTop: 18, background: 'rgba(255,255,255,.96)' }}>
          <form className="search" action={`/${lang}/cars`} style={{ boxShadow: 'none', padding: 0 }}>
            <select name="city" value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">{t.search.pickup} — {t.search.all}</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" name="start" required />
            <input type="date" name="end" required />
            <button className="btn"><Search size={16} /> {t.search.btn}</button>
          </form>
        </div>
        <div className="kpi" style={{ marginTop: 16 }}>
          <div><KeyRound size={14} /> {t.how[0]}</div>
          <div><BadgeCheck size={14} /> {t.how[1]}</div>
          <div><Route size={14} /> {t.how[2]}</div>
        </div>
      </div>
      <div style={{ minWidth: 0 }}>
        <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900" alt="Velora" style={{ width: '100%', maxWidth: '100%', borderRadius: 26, boxShadow: '0 30px 70px -20px #000000aa', border: '1px solid #ffffff22' }} />
        <div className="card" style={{ marginTop: -42, marginInline: 22, position: 'relative', display: 'flex', gap: 12, alignItems: 'center', background: '#ffffff', border: '1px solid #e8eaf3' }}>
          <span style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#4f46e5,#a855f7)', display: 'grid', placeItems: 'center', color: '#fff', flex: 'none' }}><ShieldCheck size={21} /></span>
          <div style={{ minWidth: 0 }}><b style={{ display: 'block', color: '#0d122b', fontSize: 15 }}>4.9/5 — 12 400+ locations</b><span style={{ color: '#4b5470', fontSize: 13.5 }}>Paiement CMI & cash • Assistance 24/7</span></div>
        </div>
      </div>
    </div></div>

    <div className="section">
      <h2><span className="ic"><Zap size={19} /></span>{t.featured}</h2>
      <div className="grid" style={{ padding: '18px 0' }}>{CARS.slice(0, 6).map((c) => <CarCard key={c.id} lang={lang} car={c} />)}</div>
      <div style={{ textAlign: 'center', marginTop: 6 }}><Link className="btn" href={`/${lang}/cars`}>{t.see_all} <ArrowRight size={16} /></Link></div>
    </div>

    <div className="section"><h2><span className="ic"><ShieldCheck size={19} /></span>{t.services_title}</h2><p className="mut">{t.services_sub}</p>
      <div className="svc-grid">{t.svcs.map((s) => {
        const I = SVC_ICON[s.slug] || Zap;
        return <Link key={s.slug} href={`/${lang}/services/${s.slug}`} className="svc"><span className="sic"><I size={22} /></span><b>{s.t}</b><p className="mut">{s.d}</p></Link>;
      })}</div></div>

    <div className="section"><h2><span className="ic"><Building2 size={19} /></span>{t.companies_title}</h2><div className="svc-grid">
      {COMPANIES.map((c) => <div key={c.name} className="card card-h"><img src={c.img} style={{ width: '100%', height: 135, objectFit: 'cover', borderRadius: 14 }} /><b style={{ display: 'block', marginTop: 10 }}>{c.name}</b><div className="mut" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><span><MapPin size={12} /> {c.city}</span><span>{c.cars} 🚗</span><span><Star size={12} /> {c.rating}</span></div></div>)}
    </div><div style={{ marginTop: 14 }}><Link className="btn" href={`/${lang}/partner`}><Building2 size={16} /> {t.become}</Link></div></div>

    <div className="section"><h2><span className="ic"><Quote size={19} /></span>{t.reviews_title}</h2><div className="svc-grid">
      {REVIEWS.map((r, i) => <div key={i} className="card card-h"><div style={{ color: '#f59e0b', display: 'flex', gap: 2 }}>{Array.from({ length: r.s }).map((_, k) => <Star key={k} size={14} fill="currentColor" />)}</div><b>{r.n}</b><p className="mut">{r.x}</p></div>)}
    </div></div>

    <div className="section"><div className="dark" style={{ textAlign: 'center' }}>
      <Headset size={40} style={{ opacity: .9 }} />
      <h2 style={{ justifyContent: 'center' }}>{t.cta_title}</h2><p style={{ color: '#d7cdf5' }}>{t.cta_sub}</p>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 8 }}>
        <Link className="btn" href={`/${lang}/register`} style={{ background: '#fff', color: '#2b1a5e', boxShadow: 'none' }}><CheckCircle2 size={16} /> {t.nav.register}</Link>
        <Link className="btn-ghost" href={`/${lang}/cars`}><Search size={16} /> {t.see_all}</Link>
      </div></div></div>
    <Footer lang={lang} />
  </>);
}
