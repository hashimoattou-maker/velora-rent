'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { LayoutDashboard, Trophy, ShieldCheck, Gift, Ticket, BadgeCheck } from 'lucide-react';
export default function Dashboard({ params }) {
  const lang = params.lang; const t = dict[lang]; const s = useStore() || {};
  return (<><Navbar lang={lang} /><div className="page">
    <h1><span className="ic"><LayoutDashboard size={22} /></span>{s.user?.name || 'Guest'}</h1>
    <div className="row">
      <div className="card card-h"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Trophy size={18} color="#b8860b" /> {t.loyalty_box}</h3><p style={{ fontSize: 34, fontWeight: 800, background: 'linear-gradient(90deg,#b8860b,#f59e0b)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.points} pts</p><p className="mut">1 DH = 1 pt • -15% dès 2000 pts</p></div>
      <div className="card card-h"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><ShieldCheck size={18} /> {t.identity_box}</h3><p>{s.identity ? <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: '#059669', fontWeight: 700 }}><BadgeCheck size={16} />{t.verified}</span> : t.not_verified}</p>
        {!s.identity && <button className="btn" onClick={() => s.verifyIdentity().catch((e) => alert(e.message))}>Vérifier (CIN + permis) — 5 min</button>}</div>
    </div>
    <div className="card" style={{ marginTop: 14 }}><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Gift size={18} /> {t.gift_box}</h3>
      {(s.gifts || []).map((g) => <span key={g.code} className="tag">{g.code} — {g.amount} DH</span>)}
      <div style={{ marginTop: 8 }}><button className="btn-ghost" style={{ color: '#111', borderColor: '#ccc' }} onClick={() => s.addGift(500).catch((e) => alert(e.message))}>+ Générer carte 500 DH</button></div></div>
    <div className="card" style={{ marginTop: 14 }}><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Ticket size={18} /> {t.booking.mybookings} ({(s.bookings || []).length})</h3>
      {(s.bookings || []).length === 0 ? <p className="mut">{t.booking.empty}</p> :
      <table className="table"><thead><tr><th>{t.booking.code}</th><th>Voiture</th><th>Jours</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>{s.bookings.map((b) => <tr key={b.code}><td>{b.code}</td><td>{b.car}</td><td>{b.days}</td><td>{b.total} DH</td><td>{b.status}</td></tr>)}</tbody></table>}</div>
  </div><Footer lang={lang} /></>);
}
