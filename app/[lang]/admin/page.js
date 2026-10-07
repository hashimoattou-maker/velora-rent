'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { admin, getAdminToken, setAdminToken } from '@/lib/api';

const TABS = [['stats', '📊 Stats'], ['bookings', '📋 Réservations'], ['clients', '👥 Clients'], ['cars', '🚗 Voitures'], ['inbox', '✉️ Messages']];

export default function Admin({ params }) {
  const lang = params.lang;
  const [tok, setTok] = useState(typeof window !== 'undefined' ? getAdminToken() : null);
  const [key, setKey] = useState('');
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('stats');
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState('');

  const load = async (t = tab, f = filter) => {
    setErr('');
    try {
      if (t === 'stats') setData(await admin.overview());
      if (t === 'bookings') setData(await admin.bookings(f));
      if (t === 'clients') setData(await admin.users());
      if (t === 'cars') setData(await admin.cars());
      if (t === 'inbox') setData(await admin.inbox());
    } catch (e) {
      if ((e.message || '').includes('401')) { setAdminToken(null); setTok(null); }
      else setErr(e.message);
    }
  };

  const doLogin = async (e) => {
    e.preventDefault(); setErr('');
    try {
      const r = await admin.login(key);
      setAdminToken(r.token); setTok(r.token); setKey('');
      setData(await admin.overview());
    } catch (e) { setErr(e.message); }
  };

  const setStatus = async (code, status) => {
    await admin.setBooking(code, status);
    load('bookings', filter);
  };
  const setCar = async (slug, patch) => {
    await admin.setCar(slug, patch);
    load('cars');
  };

  if (!tok) return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 440 }}>
    <div className="card"><h2>🔐 Admin Velora</h2><p className="mut">Clé secrète (fichier <code>api/.admin.php</code> sur serveur).</p>
      {err && <div className="alert" style={{ background: '#fdecec', borderColor: '#f5a3a3' }}>❌ {err}</div>}
      <form onSubmit={doLogin} className="field" style={{ display: 'grid', gap: 10 }}>
        <input type="password" required value={key} onChange={(e) => setKey(e.target.value)} placeholder="Clé admin…" />
        <button className="btn">Entrer</button></form></div>
  </div><Footer lang={lang} /></>);

  return (<><Navbar lang={lang} /><div className="page">
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <h1 style={{ marginInlineEnd: 'auto' }}>🔐 Admin — Velora Rent</h1>
      <button className="btn-ghost" style={{ color: '#111', borderColor: '#ccc' }} onClick={() => { setAdminToken(null); setTok(null); setData(null); }}>Déconnexion</button>
      <button className="btn" onClick={() => load()}>↻ Actualiser</button>
    </div>
    {err && <div className="alert" style={{ background: '#fdecec', borderColor: '#f5a3a3' }}>❌ {err}</div>}
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '12px 0' }}>
      {TABS.map(([v, l]) => <button key={v} className={tab === v ? 'btn' : 'btn-ghost'} style={tab === v ? {} : { color: '#111', borderColor: '#ccc' }} onClick={() => { setTab(v); setData(null); setTimeout(() => load(v, v === 'bookings' ? filter : ''), 0); }}>{l}</button>)}
      {tab === 'bookings' && <select value={filter} onChange={(e) => { setFilter(e.target.value); load('bookings', e.target.value); }}>
        <option value="">Tous statuts</option><option value="pending">⏳ pending</option><option value="paid">✅ paid</option><option value="cancelled">❌ cancelled</option></select>}
    </div>

    {!data && <div className="card">Chargement… <button className="btn" onClick={() => load()}>Charger</button></div>}

    {tab === 'stats' && data?.stats && <>
      <div className="svc-grid">
        <div className="card"><b>👥 Clients</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.users}</p></div>
        <div className="card"><b>📋 Réservations</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.bookings}</p></div>
        <div className="card"><b>💰 Revenus (paid)</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.revenue} DH</p></div>
        <div className="card"><b>⏳ En attente</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.pending}</p></div>
        <div className="card"><b>✉️ Messages</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.messages}</p></div>
        <div className="card"><b>🤝 Partenaires</b><p style={{ fontSize: 30, fontWeight: 900 }}>{data.stats.partners}</p></div>
      </div>
      <div className="card" style={{ marginTop: 12 }}><h3>Dernières réservations</h3>
        <table className="table"><thead><tr><th>Code</th><th>Voiture</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>{(data.recent || []).map((b) => <tr key={b.code}><td>{b.code}</td><td>{b.car_label}</td><td>{b.total} DH</td><td>{b.status}</td></tr>)}</tbody></table></div>
    </>}

    {tab === 'bookings' && data?.bookings && <div className="card"><table className="table">
      <thead><tr><th>Code</th><th>Client</th><th>Voiture</th><th>Période</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>{data.bookings.map((b) => <tr key={b.code}>
        <td><b>{b.code}</b><br /><small className="mut">{b.phone}</small></td><td>{b.client}</td><td>{b.car_label}<br /><small className="mut">{b.city}</small></td>
        <td>{b.start_date} → {b.end_date} ({b.days}j)</td><td><b>{b.total} DH</b> ({b.pay})</td><td>{b.status}</td>
        <td><select defaultValue={b.status} onChange={(e) => setStatus(b.code, e.target.value)}>
          <option value="pending">pending</option><option value="paid">paid</option><option value="cancelled">cancelled</option></select></td></tr>)}</tbody></table></div>}

    {tab === 'clients' && data?.users && <div className="card"><table className="table">
      <thead><tr><th>#</th><th>Nom</th><th>Email / Tél</th><th>Ville</th><th>Points</th><th>KYC</th></tr></thead>
      <tbody>{data.users.map((u) => <tr key={u.id}><td>{u.id}</td><td>{u.name}</td><td>{u.email}<br /><small className="mut">{u.phone}</small></td><td>{u.city}</td><td>{u.points}</td><td>{u.identity_verified ? '✅' : '—'}</td></tr>)}</tbody></table></div>}

    {tab === 'cars' && data?.cars && <div className="card"><table className="table">
      <thead><tr><th>Voiture</th><th>Ville</th><th>Prix/j</th><th>Actif</th></tr></thead>
      <tbody>{data.cars.map((c) => <tr key={c.slug}><td>{c.brand} {c.model} ⭐{c.rating}</td><td>{c.city}</td>
        <td><input type="number" defaultValue={c.price} style={{ width: 90 }} onBlur={(e) => { if (+e.target.value !== c.price) setCar(c.slug, { price: +e.target.value }); }} /> DH</td>
        <td><input type="checkbox" defaultChecked={!!+c.active} onChange={(e) => setCar(c.slug, { active: e.target.checked ? 1 : 0 })} /></td></tr>)}</tbody></table></div>}

    {tab === 'inbox' && data?.messages && <div className="row">
      <div className="card"><h3>✉️ Contact ({data.messages.length})</h3>{data.messages.map((m) => <div key={m.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}><b>{m.name}</b> <small className="mut">{m.contact} • {m.created_at}</small><p className="mut">{m.message}</p></div>)}</div>
      <div className="card"><h3>🤝 Partenaires ({data.partners.length})</h3>{(data.partners || []).map((p) => <div key={p.id} style={{ borderBottom: '1px solid #eee', padding: '8px 0' }}><b>{p.agency}</b> <small className="mut">{p.city} • {p.phone} • {p.cars} voitures</small><p className="mut">{p.message}</p></div>)}</div>
    </div>}
  </div><Footer lang={lang} /></>);
}
