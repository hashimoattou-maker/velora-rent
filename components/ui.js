'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { dict } from '@/lib/i18n';
import {
  Zap, Car, Building2, Sparkles, Star, Mail, LogIn, UserPlus, LayoutDashboard,
  Ticket, LogOut, MapPin, Users, Fuel, Cog, ArrowRight, Heart, Phone, Menu, X,
  Home, Gift, CircleUserRound, Globe,
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

const ic = (C, s = 16) => <C size={s} strokeWidth={2.2} />;

function LangSeg({ lang }) {
  const path = usePathname(); const router = useRouter();
  return (
    <span className="lang" role="group" aria-label="Language">
      {['fr', 'ar', 'en'].map((l) => (
        <button key={l} className={l === lang ? 'on' : ''} onClick={() => router.push(withLang(path, l))}>{l.toUpperCase()}</button>
      ))}
    </span>
  );
}

export function Navbar({ lang }) {
  const t = dict[lang]; const path = usePathname(); const router = useRouter();
  const { user, logout } = useStore() || {};
  const [open, setOpen] = useState(false);
  const L = (href, label, I) => (
    <Link key={href} href={withLang(href, lang)} onClick={() => setOpen(false)}
      className={'nlink' + (path?.includes(href) ? ' on' : '')}>{ic(I)}{label}</Link>
  );
  const go = (href) => { setOpen(false); router.push(withLang(href, lang)); };
  return (
    <div className="topbar">
      <div className="nav">
        <Link href={`/${lang}`} className="logo"><span className="mark"><Zap size={18} /></span>VELORA <em>RENT</em></Link>
        <div className="links desk">
          {L('/cars', t.nav.cars, Car)}{L('/companies', t.nav.companies, Building2)}{L('/services', t.nav.services, Sparkles)}{L('/reviews', t.nav.reviews, Star)}{L('/contact', t.nav.contact, Mail)}
          {user ? <>{L('/dashboard', t.nav.dashboard, LayoutDashboard)}{L('/bookings', t.nav.bookings, Ticket)}
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); router.push(`/${lang}`); }}>{ic(LogOut)}{t.nav.logout}</a></>
            : <>{L('/login', t.nav.login, LogIn)}<Link href={withLang('/register', lang)} className="btn sm">{ic(UserPlus, 15)}{t.nav.register}</Link></>}
          <LangSeg lang={lang} />
        </div>
        <div className="mob-bar">
          <LangSeg lang={lang} />
          <button className="menu-btn" aria-label={t.menu} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
        </div>
      </div>
      {open && (
        <div className="mob-panel">
          {L('/cars', t.nav.cars, Car)}{L('/companies', t.nav.companies, Building2)}{L('/services', t.nav.services, Sparkles)}{L('/reviews', t.nav.reviews, Star)}{L('/contact', t.nav.contact, Mail)}
          {user ? <>{L('/dashboard', t.nav.dashboard, LayoutDashboard)}{L('/bookings', t.nav.bookings, Ticket)}
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); setOpen(false); router.push(`/${lang}`); }}>{ic(LogOut)}{t.nav.logout}</a></>
            : <><button className="btn-light full" onClick={() => go('/login')}>{ic(LogIn)}{t.nav.login}</button>
              <button className="btn full" onClick={() => go('/register')}>{ic(UserPlus)}{t.nav.register}</button></>}
        </div>
      )}
    </div>
  );
}

export function BottomBar({ lang }) {
  const t = dict[lang]; const path = usePathname() || '';
  const items = [
    ['/', t.b_home, Home],
    ['/cars', t.b_cars, Car],
    ['/bookings', t.b_book, Ticket],
    ['/dashboard', t.b_gift, Gift],
    ['/login', t.b_account, CircleUserRound],
  ];
  return (
    <nav className="bottombar">
      {items.map(([h, label, I]) => {
        const active = h === '/' ? (path === `/${lang}` || path === `/${lang}/`) : path?.includes(h);
        return <Link key={h} href={withLang(h, lang)} className={active ? 'on' : ''}>{ic(I, 21)}<small>{label}</small></Link>;
      })}
    </nav>
  );
}

export function Footer({ lang }) {
  const t = dict[lang];
  return <><div className="footer"><div className="in">
    <div>
      <div className="logo"><span className="mark"><Zap size={18} /></span>VELORA <em>RENT</em></div>
      <p style={{ fontSize: 14 }}>{t.tagline}</p>
      <div className="kpi"><div>{ic(Star, 14)} 4.9/5</div><div>{ic(Car, 14)} 2400+</div><div>{ic(MapPin, 14)} 9</div></div>
    </div>
    <div><b>{t.foot_velora}</b><br /><Link href={`/${lang}/about`}>{t.nav.about}</Link><br /><Link href={`/${lang}/companies`}>{t.nav.companies}</Link><br /><Link href={`/${lang}/partner`}>{ic(Heart, 13)}{t.become}</Link></div>
    <div><b>{t.foot_services}</b><br /><Link href={`/${lang}/services/payments`}>{t.svcs[0].t}</Link><br /><Link href={`/${lang}/services/insurance`}>{t.svcs[1].t}</Link><br /><Link href={`/${lang}/services/loyalty`}>{t.svcs[2].t}</Link><br /><Link href={`/${lang}/services/gift-cards`}>{t.svcs[3].t}</Link></div>
    <div><b>{t.foot_help}</b><br /><Link href={`/${lang}/faq`}>FAQ</Link><br /><Link href={`/${lang}/contact`}>{ic(Phone, 13)}{t.nav.contact}</Link><br /><Link href={`/${lang}/terms`}>{t.terms_t}</Link></div>
  </div><div style={{ textAlign: 'center', padding: '0 0 20px', fontSize: 13 }}>{t.footer_rights}</div></div><BottomBar lang={lang} /></>;
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
        <Link href={`/${lang}/cars/${car.id}`} className="btn sm">{t.details}<ArrowRight size={15} /></Link>
      </div>
    </div>
  </div>;
}

export function PageShell({ lang, children }) {
  return (<><Navbar lang={lang} />{children}<Footer lang={lang} /><BottomBar lang={lang} /></>);
}
