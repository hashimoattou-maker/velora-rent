'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { dict } from '@/lib/i18n';
import {
  Zap, Car, Building2, Sparkles, Star, Mail, LogIn, UserPlus, LayoutDashboard,
  Ticket, LogOut, Globe, MapPin, Users, Fuel, Cog, ArrowRight, Heart, Phone, Send, AtSign, Camera, Share2,
} from 'lucide-react';

export function langFromPath(p) {
  const s = (p || '/').split('/').filter(Boolean)[0];
  return ['fr', 'ar', 'en'].includes(s) ? s : 'fr';
}
export function withLang(p, lang) {
  const parts = (p || '/').split('/').filter(Boolean);
  if (['fr', 'ar', 'en'].includes(parts[0])) parts.shift();
  return '/' + lang + (parts.length ? '/' + parts.join('/') : '');
}

const icon = (C, s = 15) => <C size={s} strokeWidth={2.2} />;

export function Navbar({ lang }) {
  const t = dict[lang]; const path = usePathname(); const router = useRouter();
  const { user, logout } = useStore() || {};
  const L = (href, label, I) => <Link href={withLang(href, lang)} style={{ opacity: path?.includes(href) ? 1 : .8 }}>{icon(I)}{label}</Link>;
  return (
    <div className="topbar"><div className="nav">
      <Link href={`/${lang}`} className="logo"><span className="mark"><Zap size={18} /></span>VELORA <em>RENT</em></Link>
      <div className="links">
        {L('/cars', t.nav.cars, Car)}{L('/companies', t.nav.companies, Building2)}{L('/services', t.nav.services, Sparkles)}{L('/reviews', t.nav.reviews, Star)}{L('/contact', t.nav.contact, Mail)}
        {user ? <>{L('/dashboard', t.nav.dashboard, LayoutDashboard)}{L('/bookings', t.nav.bookings, Ticket)}<a href="#" onClick={(e) => { e.preventDefault(); logout(); router.push(`/${lang}`); }}>{icon(LogOut)}{t.nav.logout}</a></>
        : <>{L('/login', t.nav.login, LogIn)}<Link href={withLang('/register', lang)} className="btn">{icon(UserPlus, 15)}{t.nav.register}</Link></>}
        <span className="lang">
          {['fr', 'ar', 'en'].map((l) => <button key={l} className={l === lang ? 'on' : ''} onClick={() => router.push(withLang(path, l))}>{l.toUpperCase()}</button>)}
        </span>
      </div>
    </div></div>
  );
}

export function Footer({ lang }) {
  const t = dict[lang];
  return <div className="footer"><div className="in">
    <div>
      <div className="logo"><span className="mark"><Zap size={18} /></span>VELORA <em>RENT</em></div>
      <p style={{ fontSize: 14 }}>{t.tagline}</p>
      <div className="kpi"><div>{icon(Star, 14)} 4.9/5</div><div>{icon(Car, 14)} 2400+</div><div>{icon(MapPin, 14)} 9 villes</div></div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        {[AtSign, Camera, Share2].map((S, i) => <a key={i} href="#" style={{ width: 36, height: 36, borderRadius: 12, background: '#ffffff12', display: 'grid', placeItems: 'center' }}><S size={16} /></a>)}
      </div>
    </div>
    <div><b>Velora</b><br /><Link href={`/${lang}/about`}>{t.nav.about}</Link><br /><Link href={`/${lang}/companies`}>{t.nav.companies}</Link><br /><Link href={`/${lang}/partner`}>{icon(Heart, 13)}{t.become}</Link></div>
    <div><b>Services</b><br /><Link href={`/${lang}/services/payments`}>Payments</Link><br /><Link href={`/${lang}/services/insurance`}>Insurance</Link><br /><Link href={`/${lang}/services/loyalty`}>Loyalty</Link></div>
    <div><b>Help</b><br /><Link href={`/${lang}/faq`}>FAQ</Link><br /><Link href={`/${lang}/contact`}>{icon(Phone, 13)}Contact</Link><br /><Link href={`/${lang}/terms`}>Terms</Link></div>
  </div><div style={{ textAlign: 'center', padding: '0 0 20px', fontSize: 13 }}>{t.footer_rights}</div></div>;
}

export function CarCard({ lang, car }) {
  const t = dict[lang];
  return <div className="car">
    <div className="im">
      <img src={car.img} alt={car.brand} loading="lazy" />
      <span className="pricetag">{car.price} DH<small style={{ opacity: .75 }}> {t.per_day}</small></span>
    </div>
    <div className="pad">
      <div>{(car.tags || []).map((x) => <span key={x} className="tag">{x}</span>)}</div>
      <b style={{ fontSize: 16 }}>{car.brand} {car.model} • {car.year}</b>
      <div className="meta">
        <span><MapPin size={13} /> {car.city}</span>
        <span><Star size={13} /> {car.rating} ({car.trips})</span>
        <span><Users size={13} /> {car.seats} {t.seats}</span>
        <span><Cog size={13} /> {car.gear}</span>
        <span><Fuel size={13} /> {car.fuel}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
        <span className="mut">{car.company}</span>
        <Link href={`/${lang}/cars/${car.id}`} className="btn">{t.details}<ArrowRight size={15} /></Link>
      </div>
    </div>
  </div>;
}

export function H1({ children }) {
  return <h1>{children}</h1>;
}
export { Send };
