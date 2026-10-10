'use client';
import { useState } from 'react';
import { Save, X, UploadCloud } from 'lucide-react';
import { api } from '@/lib/api';

const TYPES = ['Berline', 'SUV', 'Citadine', 'Luxe', 'Van', 'Électrique'];
const GEARS = ['Manuelle', 'Auto'];
const FUELS = ['Diesel', 'Essence', 'Hybride', 'Électrique'];

// Shared car form (admin FR + agency dashboard). Labels in French (tool UI).
// Props: initial (car or empty), companies (admin list, optional), fixedCompany, saveLabel, cancelLabel, onSubmit(data), onCancel
export default function CarForm({ initial = {}, companies = [], fixedCompany = '', saveLabel = 'Enregistrer', cancelLabel = 'Annuler', onSubmit, onCancel }) {
  const [f, setF] = useState({
    brand: initial.brand || '', model: initial.model || '', year: initial.year || new Date().getFullYear(),
    type: initial.type || 'Berline', price: initial.price || 250, seats: initial.seats || 5,
    gear: initial.gear || 'Manuelle', fuel: initial.fuel || 'Diesel', city: initial.city || 'Casablanca',
    company: fixedCompany || initial.company || '', img: initial.img || '', tags: initial.tags || '',
    active: initial.active === undefined ? 1 : +initial.active,
  });
  const [up, setUp] = useState(false);
  const S = (k, v) => setF({ ...f, [k]: v });
  const upload = async (file) => {
    if (!file) return;
    setUp(true);
    try { const r = await api.uploadCar(file); S('img', '/' + r.path); }
    catch (e) { alert(e.message); }
    setUp(false);
  };
  const go = (e) => { e.preventDefault(); onSubmit(f); };
  const companyField = () => {
    if (fixedCompany) return <label>Agence<input disabled value={fixedCompany} style={{ ...inp, background: '#eef0f7' }} /></label>;
    if (companies.length) return <label>Agence<select value={f.company} onChange={(e) => S('company', e.target.value)} style={inp}><option value="">-</option>{companies.map((c) => <option key={c} value={c}>{c}</option>)}</select></label>;
    return <label>Agence<input value={f.company} onChange={(e) => S('company', e.target.value)} style={inp} /></label>;
  };
  const inp = { width: '100%', padding: '10px 12px', borderRadius: 12, border: '1.5px solid #e2e6f2', background: '#f8f9fd' };
  return (
    <form onSubmit={go} style={{ display: 'grid', gap: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label>Marque*<input required value={f.brand} onChange={(e) => S('brand', e.target.value)} style={inp} placeholder="Dacia" /></label>
        <label>Modèle*<input required value={f.model} onChange={(e) => S('model', e.target.value)} style={inp} placeholder="Logan" /></label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <label>Année<input type="number" min="2000" max="2030" value={f.year} onChange={(e) => S('year', e.target.value)} style={inp} /></label>
        <label>Type<select value={f.type} onChange={(e) => S('type', e.target.value)} style={inp}>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Prix/j (DH)*<input required type="number" min="50" value={f.price} onChange={(e) => S('price', e.target.value)} style={inp} /></label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <label>Places<input type="number" min="2" max="30" value={f.seats} onChange={(e) => S('seats', e.target.value)} style={inp} /></label>
        <label>Boîte<select value={f.gear} onChange={(e) => S('gear', e.target.value)} style={inp}>{GEARS.map((x) => <option key={x}>{x}</option>)}</select></label>
        <label>Carburant<select value={f.fuel} onChange={(e) => S('fuel', e.target.value)} style={inp}>{FUELS.map((x) => <option key={x}>{x}</option>)}</select></label>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <label>Ville*<input required value={f.city} onChange={(e) => S('city', e.target.value)} style={inp} /></label>
        {companyField()}
      </div>
      <label>Photo (URL)<input dir="ltr" value={f.img} onChange={(e) => S('img', e.target.value)} style={inp} placeholder="https://…" /></label>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <label className="btn-light" style={{ cursor: 'pointer' }}><UploadCloud size={15} /> {up ? '…' : 'Uploader photo'}
          <input type="file" accept="image/*" hidden onChange={(e) => upload(e.target.files[0])} /></label>
        {f.img && <img src={f.img.startsWith('/') && !f.img.startsWith('//') && !f.img.startsWith('/api') ? f.img : f.img} alt="" style={{ width: 90, height: 60, objectFit: 'cover', borderRadius: 10, border: '1px solid #e2e6f2' }} />}
        <label style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}>Tags<input value={f.tags} onChange={(e) => S('tags', e.target.value)} style={{ ...inp, width: 140 }} placeholder="Eco, Top" /></label>
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn" style={{ flex: 1, justifyContent: 'center' }}><Save size={15} /> {saveLabel}</button>
        {onCancel && <button type="button" className="btn-light" onClick={onCancel}><X size={15} /> {cancelLabel}</button>}
      </div>
    </form>
  );
}
