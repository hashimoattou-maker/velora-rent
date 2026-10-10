'use client';
import { useEffect, useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import CarForm from '@/components/CarForm';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { api, serverAvailable } from '@/lib/api';
import { LayoutDashboard, Trophy, ShieldCheck, Gift, Ticket, BadgeCheck, Building2, UploadCloud, Clock, XCircle, Pencil, Trash2, Plus, Car as CarIcon, UserCog, Check } from 'lucide-react';

function KycCard({ t, s }) {
  const [busy, setBusy] = useState(null);
  const status = s.kycStatus || (s.identity ? 'verified' : 'none');
  const docs = s.kycDocs || {};
  const up = async (type, file) => {
    if (!file) return;
    setBusy(type);
    try { await api.kycUpload(type, file); await s.refreshServer(); }
    catch (e) { alert(e.message); }
    setBusy(null);
  };
  const boxes = [['front', t.kyc_front], ['back', t.kyc_back], ['license', t.kyc_lic]];
  return (
    <div className="card card-h">
      <h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><ShieldCheck size={18} /> {t.identity_box}</h3>
      {status === 'verified' && <p style={{ color: '#059669', fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}><BadgeCheck size={16} />{t.verified}</p>}
      {status === 'pending' && <p style={{ color: '#b45309', fontWeight: 700, display: 'flex', gap: 6, alignItems: 'center' }}><Clock size={16} />{t.kyc_pending}</p>}
      {status === 'rejected' && <div className="alert err"><XCircle size={16} /> {t.kyc_rejected}</div>}
      {(status === 'none' || status === 'rejected') && (<>
        <p className="mut">{t.kyc_hint}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {boxes.map(([k, label]) => (
            <label key={k} style={{ border: '1.5px dashed #c9cfE2', borderRadius: 14, padding: 10, textAlign: 'center', cursor: 'pointer', fontSize: 12, fontWeight: 700 }}>
              {docs[k] ? <img src={'/' + docs[k]} alt={label} style={{ width: '100%', height: 70, objectFit: 'cover', borderRadius: 8 }} /> : <UploadCloud size={22} color="#6d28d9" />}
              <div style={{ marginTop: 4 }}>{busy === k ? '…' : label}</div>
              {docs[k] && <small style={{ color: '#059669' }}>✓</small>}
              <input type="file" accept="image/*" hidden onChange={(e) => up(k, e.target.files[0])} />
            </label>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 10 }} disabled={!docs.front || !docs.back || !docs.license}
          onClick={() => s.verifyIdentity().then(() => s.refreshServer()).catch((e) => alert(e.message === 'docs_missing' ? t.kyc_need : e.message))}>
          <ShieldCheck size={15} /> {t.kyc_submit}
        </button>
      </>)}
    </div>
  );
}

function FleetCard({ t, s }) {
  const [cars, setCars] = useState([]);
  const [form, setForm] = useState(null);
  const load = async () => {
    try { if (!(await serverAvailable())) return; const r = await api.fleet(); setCars(r.cars || []); } catch (e) { alert(e.message); }
  };
  useEffect(() => { load(); }, []);
  const save = async (d) => {
    try {
      if (form?.slug) await api.fleetSave({ ...d, slug: form.slug, action: 'update' });
      else await api.fleetSave({ ...d, action: 'create' });
      setForm(null); load();
    } catch (e) { alert('❌ ' + e.message); }
  };
  const del = async (slug) => {
    if (!confirm(t.confirm_del)) return;
    try { await api.fleetSave({ slug, action: 'delete' }); load(); }
    catch (e) { alert('❌ ' + e.message); }
  };
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
        <h3 style={{ margin: 0, marginInlineEnd: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}><CarIcon size={18} /> {t.myfleet} ({cars.length})</h3>
        <button className="btn sm" onClick={() => setForm({ __new: true })}><Plus size={15} /> {t.add}</button>
      </div>
      {form && <div className="card" style={{ background: '#f8f9fd', marginTop: 10 }}>
        <h3>{form.slug ? t.edit_car + ' : ' + form.brand + ' ' + form.model : t.add_car}</h3>
        <CarForm initial={form.slug ? form : {}} fixedCompany={s.user?.agency || ''} saveLabel={t.save} cancelLabel={t.cancel}
          onCancel={() => setForm(null)} onSubmit={save} />
      </div>}
      <table className="table" style={{ marginTop: 10 }}><thead><tr><th></th><th>Voiture</th><th>Ville</th><th>Prix/j</th><th>Actif</th><th></th></tr></thead>
        <tbody>{cars.map((c) => <tr key={c.slug}>
          <td>{c.img && <img src={c.img} alt="" style={{ width: 64, height: 40, objectFit: 'cover', borderRadius: 8 }} />}</td>
          <td>{c.brand} {c.model}</td><td>{c.city}</td><td><b>{c.price} DH</b></td>
          <td>{+c.active ? '✅' : '—'}</td>
          <td style={{ whiteSpace: 'nowrap' }}>
            <button className="btn-light sm" onClick={() => { setForm(c); window.scrollTo(0, 0); }}><Pencil size={14} /></button>{' '}
            <button className="btn-light sm" onClick={() => del(c.slug)}><Trash2 size={14} /></button>
          </td></tr>)}</tbody></table>
    </div>
  );
}

function ProfileCard({ t, s }) {
  const [f, setF] = useState(null);
  const save = async () => {
    try { await s.updateProfile(f); setF(null); alert(t.saved); }
    catch (e) { alert('❌ ' + e.message); }
  };
  const u = s.user || {};
  return (
    <div className="card card-h">
      <h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><UserCog size={18} /> {t.profile}</h3>
      {f ? (
        <div className="field" style={{ display: 'grid', gap: 8 }}>
          <label>{t.auth.name}<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
          <label>{t.auth.phone}<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
          <label>{t.auth.city}<input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn sm" onClick={save}><Check size={14} /> {t.save}</button>
            <button className="btn-light sm" onClick={() => setF(null)}>{t.cancel}</button>
          </div>
        </div>
      ) : (
        <div>
          <p style={{ margin: '4px 0' }}><b>{u.name}</b><br /><span className="mut">{u.email} • {u.phone} • {u.city}</span></p>
          <button className="btn-light sm" onClick={() => setF({ name: u.name || '', phone: u.phone || '', city: u.city || '' })}><Pencil size={14} /> {t.edit}</button>
        </div>
      )}
    </div>
  );
}

export default function Dashboard({ params }) {
  const lang = params.lang; const t = dict[lang]; const s = useStore() || {};
  const isCompany = s.user?.role === 'company';
  return (<><Navbar lang={lang} /><div className="page">
    <h1><span className="ic"><LayoutDashboard size={22} /></span>{s.user?.name || 'Guest'}</h1>
    {isCompany && <div className="alert ok" style={{ marginBottom: 12 }}><Building2 size={16} /> {s.user?.agency || t.role_company} — {t.become}</div>}
    <div className="row">
      <ProfileCard t={t} s={s} />
      <KycCard t={t} s={s} />
    </div>
    <div className="row" style={{ marginTop: 14 }}>
      <div className="card card-h"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Trophy size={18} color="#b8860b" /> {t.loyalty_box}</h3><p style={{ fontSize: 34, fontWeight: 800, background: 'linear-gradient(90deg,#b8860b,#f59e0b)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>{s.points} pts</p><p className="mut">1 DH = 1 pt • -15% dès 2000 pts</p></div>
      <div className="card card-h"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Gift size={18} /> {t.gift_box}</h3>
        {(s.gifts || []).map((g) => <span key={g.code} className="tag">{g.code} — {g.amount} DH</span>)}
        <div style={{ marginTop: 8 }}><button className="btn-light sm" onClick={() => s.addGift(500).catch((e) => alert(e.message))}>+ 500 DH</button></div></div>
    </div>
    {isCompany && <FleetCard t={t} s={s} />}
    <div className="card" style={{ marginTop: 14 }}><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Ticket size={18} /> {t.booking.mybookings} ({(s.bookings || []).length})</h3>
      {(s.bookings || []).length === 0 ? <p className="mut">{t.booking.empty}</p> :
      <table className="table"><thead><tr><th>{t.booking.code}</th><th>Voiture</th><th>Jours</th><th>Total</th><th>Status</th></tr></thead>
      <tbody>{s.bookings.map((b) => <tr key={b.code}><td>{b.code}</td><td>{b.car}</td><td>{b.days}</td><td>{b.total} DH</td><td>{b.status}</td></tr>)}</tbody></table>}</div>
  </div><Footer lang={lang} /></>);
}
