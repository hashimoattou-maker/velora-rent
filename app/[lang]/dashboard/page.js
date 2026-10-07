'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
export default function Dashboard({ params }) {
  const lang = params.lang; const t = dict[lang]; const s = useStore() || {};
  return (<><Navbar lang={lang} /><div className="page">
    <h1>👋 {s.user?.name || 'Guest'} — {t.nav.dashboard}</h1>
    <div className="row">
      <div className="card"><h3>⭐ {t.loyalty_box}</h3><p style={{ fontSize: 32, fontWeight: 900, color: '#b8860b' }}>{s.points} pts</p><p className="mut">1 DH = 1 pt • -15% dès 2000 pts</p></div>
      <div className="card"><h3>🛡️ {t.identity_box}</h3><p>{s.identity ? t.verified : t.not_verified}</p>
        {!s.identity && <button className="btn" onClick={() => s.verifyIdentity().catch((e) => alert(e.message))}>Vérifier (CIN + permis) — 5 min</button>}</div>
    </div>
    <div className="card" style={{ marginTop: 14 }}><h3>🎁 {t.gift_box}</h3>
      {(s.gifts || []).map((g) => <span key={g.code} className="tag">{g.code} — {g.amount} DH</span>)}
      <div style={{ marginTop: 8 }}><button className="btn-ghost" style={{ color: '#111', borderColor: '#ccc' }} onClick={() => s.addGift(500).catch((e) => alert(e.message))}>+ Générer carte 500 DH</button></div></div>
    <div className="card" style={{ marginTop: 14 }}><h3>📋 {t.booking.mybookings} ({(s.bookings || []).length})</h3>
      {(s.bookings || []).length === 0 ? <p className="mut">{t.booking.empty}</p> :
      <table className="table"><thead><tr><th>{t.booking.code}</th><th>Voiture</th><th>Jours</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>{s.bookings.map((b) => <tr key={b.code}><td>{b.code}</td><td>{b.car}</td><td>{b.days}</td><td>{b.total} DH</td><td>{b.status}</td></tr>)}</tbody></table>}</div>
  </div><Footer lang={lang} /></>);
}
