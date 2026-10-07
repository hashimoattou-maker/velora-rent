'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { dict } from '@/lib/i18n';

export function langFromPath(p) {
  const s = (p || '/').split('/').filter(Boolean)[0];
  return ['fr', 'ar', 'en'].includes(s) ? s : 'fr';
}
export function withLang(p, lang) {
  const parts = (p || '/').split('/').filter(Boolean);
  if (['fr', 'ar', 'en'].includes(parts[0])) parts.shift();
  return '/' + lang + (parts.length ? '/' + parts.join('/') : '');
}

export function Navbar({ lang }) {
  const t = dict[lang]; const path = usePathname(); const router = useRouter();
  const { user, logout } = useStore() || {};
  const L = (href, label) => <Link href={withLang(href, lang)} style={{ opacity: path?.includes(href) ? 1 : .8 }}>{label}</Link>;
  return (
    <div className="topbar"><div className="nav">
      <Link href={`/${lang}`} className="logo">VELORA <span>RENT</span></Link>
      <div className="links">
        {L('/cars', t.nav.cars)}{L('/companies', t.nav.companies)}{L('/services', t.nav.services)}{L('/reviews', t.nav.reviews)}{L('/contact', t.nav.contact)}
        {user ? <>{L('/dashboard', t.nav.dashboard)}{L('/bookings', t.nav.bookings)}<a href="#" onClick={(e) => { e.preventDefault(); logout(); router.push(`/${lang}`); }}>🚪 {t.nav.logout}</a></>
        : <>{L('/login', t.nav.login)}<Link href={withLang('/register', lang)} className="btn">{t.nav.register}</Link></>}
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
    <div><div className="logo">VELORA <span>RENT</span></div><p>{t.tagline}</p><div className="kpi"><div>⭐ 4.9/5</div><div>🚗 2400+</div><div>🏙️ 9 villes</div></div></div>
    <div><b>Velora</b><br /><Link href={`/${lang}/about`}>{t.nav.about}</Link><br /><Link href={`/${lang}/companies`}>{t.nav.companies}</Link><br /><Link href={`/${lang}/partner`}>{t.become}</Link></div>
    <div><b>Services</b><br /><Link href={`/${lang}/services/payments`}>💳 Payments</Link><br /><Link href={`/${lang}/services/insurance`}>🛡️ Insurance</Link><br /><Link href={`/${lang}/services/loyalty`}>🎁 Loyalty</Link></div>
    <div><b>Help</b><br /><Link href={`/${lang}/faq`}>FAQ</Link><br /><Link href={`/${lang}/contact`}>Contact</Link><br /><Link href={`/${lang}/terms`}>Terms</Link></div>
  </div><div style={{ textAlign: 'center', padding: '0 0 18px' }}>{t.footer_rights}</div></div>;
}

export function CarCard({ lang, car }) {
  const t = dict[lang];
  return <div className="car">
    <img src={car.img} alt={car.brand} loading="lazy" />
    <div className="pad">
      <div>{car.tags?.map((x) => <span key={x} className="tag">{x}</span>)}</div>
      <b>{car.brand} {car.model} • {car.year}</b>
      <div className="mut">📍 {car.city} • {car.company} • ⭐ {car.rating} ({car.trips})</div>
      <div className="mut">{car.seats} {t.seats} • {car.gear} • {car.fuel}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <span className="price">{car.price} DH <small className="mut">{t.per_day}</small></span>
        <Link href={`/${lang}/cars/${car.id}`} className="btn">{t.details}</Link>
      </div>
    </div>
  </div>;
}
