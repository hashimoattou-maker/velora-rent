'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS } from '@/lib/data';
import { useStore } from '@/lib/store';
import { CalendarCheck, MapPin, ShieldCheck, CheckCircle2, Star, Rocket, Users, Cog, Fuel, Building2, Heart, User, Phone, Mail, IdCard, Banknote, CreditCard, Landmark, Gift, FileText, Zap } from 'lucide-react';

export function DetailClient({ lang, id }) {
  const t = dict[lang]; const b = t.booking; const router = useRouter();
  const car = CARS.find((c) => c.id === id);
  const { user, addBooking, favs, setFavs, gifts, setGifts } = useStore() || { favs: [], gifts: [] };
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [idnum, setIdnum] = useState('');
  const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [d2, setD2] = useState(false); const [d2name, setD2name] = useState('');
  const [pickup, setPickup] = useState(''); const [dropoff, setDropoff] = useState('');
  const [ins, setIns] = useState('none');
  const [gps, setGps] = useState(false); const [baby, setBaby] = useState(false);
  const [method, setMethod] = useState('cash');
  const [gift, setGift] = useState(''); const [giftOk, setGiftOk] = useState(null);
  const [notes, setNotes] = useState('');
  const [err, setErr] = useState('');
  if (!car) return <p>Not found</p>;
  useEffect(() => {
    if (user?.name && !name) setName(user.name);
    if (user?.phone && !phone) setPhone(user.phone);
    if (user?.email && !email) setEmail(user.email);
  }, [user]);
  useEffect(() => {
    if (!pickup) setPickup(car.city);
    if (!dropoff) setDropoff(car.city);
  }, [car]);
  const isFav = (favs || []).includes(car.id);
  const toggleFav = () => {
    const n = isFav ? favs.filter((f) => f !== car.id) : [...(favs || []), car.id];
    setFavs(n);
    try { localStorage.setItem('velora_favs', JSON.stringify(n)); } catch {}
  };
  const datesOk = !start || !end || (new Date(end) > new Date(start));
  const days = start && end ? Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000)) : 1;
  const base = days * car.price;
  const gpsAmt = gps ? days * 40 : 0;
  const babyAmt = baby ? days * 30 : 0;
  const insAmt = ins === 'full' ? days * 99 : 0;
  const subtotal = base + gpsAmt + babyAmt + insAmt;
  const discount = giftOk?.ok ? Math.min(giftOk.amount, subtotal) : 0;
  const grand = subtotal - discount;
  const checkGift = () => {
    const v = gift.trim().toUpperCase();
    if (!v) { setGiftOk(null); return; }
    const g = (gifts || []).find((x) => (x.code || '').toUpperCase() === v && !x.used);
    setGiftOk(g ? { ok: true, amount: +g.amount || 0 } : { ok: false });
  };
  const book = async () => {
    setErr('');
    if (!user) { router.push(`/${lang}/login?next=/${lang}/cars/${car.id}`); return; }
    if (!name.trim() || !phone.trim()) { setErr(b.err_req); return; }
    if (!start || !end || !(new Date(end) > new Date(start))) { setErr(b.err_dates); return; }
    if (gift.trim() && !giftOk?.ok) { setErr(b.gift_bad); return; }
    try {
      const r = await addBooking({
        car_slug: car.id, car: car.brand + ' ' + car.model, city: car.city,
        start, end, days, total: grand,
        full_name: name.trim(), phone: phone.trim(), email: email.trim(), idnum: idnum.trim(),
        pickup, dropoff, driver2: !!d2, driver2_name: d2 ? d2name.trim() : '',
        insurance: ins, gps, baby, full: ins === 'full',
        pay_method: method, pay: method === 'card' ? 'now' : 'cash',
        gift_code: giftOk?.ok ? gift.trim().toUpperCase() : '', notes: notes.trim(),
        status: method === 'card' ? 'paid' : 'pending',
      });
      if (giftOk?.ok && setGifts) setGifts((p) => (p || []).filter((x) => (x.code || '').toUpperCase() !== gift.trim().toUpperCase()));
      router.push(`/${lang}/payment?code=${r.code}&total=${r.total}&pay=${method === 'card' ? 'now' : 'cash'}`);
    } catch (e) { setErr(e.message === 'gift_invalid' ? b.gift_bad : ('Erreur: ' + (e.message || e))); }
  };
  const specs = [
    [Users, t.sp_places, car.seats], [Cog, t.sp_gear, car.gear],
    [Fuel, t.sp_fuel, car.fuel], [MapPin, t.sp_city, car.city],
  ];
  const payBtn = method === 'card' ? b.btn_card : method === 'bank' ? b.btn_bank : b.btn_cash;
  return (<><Navbar lang={lang} />
  <style>{`.bk-sec{margin-top:14px}.bk-sec>h4{margin:0 0 8px;font-size:14px;display:flex;gap:8px;align-items:center}.opt-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.opt-grid.two{grid-template-columns:1fr 1fr;gap:8px}.opt{border:1.5px solid #e2e6f2;border-radius:14px;padding:10px;display:flex;gap:8px;align-items:center;cursor:pointer;background:#f8f9fd;font-size:13px;font-weight:700}.opt.on{border-color:var(--pri);background:#fff;box-shadow:0 0 0 4px #4f46e522}.opt small{display:block;font-weight:400;color:#68718f}.gift-row{display:flex;gap:8px}.gift-row input{flex:1;text-transform:uppercase}.sum{margin-top:12px;border-top:1px dashed #e2e6f2;padding-top:10px;display:grid;gap:6px;font-size:14px}.sum .line{display:flex;justify-content:space-between}.sum .grand{font-weight:800;font-size:17px}.frm2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:640px){.frm2{grid-template-columns:1fr}.opt-grid{grid-template-columns:1fr}}`}</style>
  <div className="page"><div className="row">
    <div>
      <img src={car.img} style={{ width: '100%', borderRadius: 20 }} />
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div><h2 style={{ margin: 0 }}>{car.brand} {car.model} {car.year}</h2>
            <p className="mut" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Building2 size={13} /> {car.company} • <Star size={13} /> {car.rating} ({car.trips})</p></div>
          <button className={'fav-btn' + (isFav ? ' on' : '')} onClick={toggleFav}><Heart size={16} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? t.fav_ok : t.fav_add}</button>
        </div>
        <p className="mut" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 13 }}><Zap size={14} /> {b.confirm19}</p>
        <p><Link href={`/${lang}/companies`} style={{ fontSize: 14, fontWeight: 700 }}><Building2 size={14} /> {b.profile_company}</Link></p>
        <div className="specs">
          {specs.map(([I, l, v], i) => <div key={i} className="spec"><span className="sic"><I size={19} /></span><div><small>{l}</small><b>{v}</b></div></div>)}
        </div>
        <p style={{ display: 'grid', gap: 6, marginTop: 12 }}>{(t.feat || []).map((x) => <span key={x} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><CheckCircle2 size={15} color="#059669" /> {x}</span>)}</p>
      </div>
    </div>
    <div className="card"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 0 }}><CalendarCheck size={19} />{b.title}</h3>
      <p className="mut" style={{ marginTop: -6 }}>{b.fill}</p>
      {err && <div className="alert err">{err}</div>}
      <div className="field" style={{ display: 'grid', gap: 10 }}>
        <div className="frm2">
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><User size={14} />{b.full_name}</span><input value={name} onChange={(e) => setName(e.target.value)} /></label>
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Phone size={14} />{b.phone}</span><input value={phone} onChange={(e) => setPhone(e.target.value)} dir="ltr" /></label>
        </div>
        <div className="frm2">
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Mail size={14} />{b.email}</span><input value={email} onChange={(e) => setEmail(e.target.value)} dir="ltr" /></label>
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><IdCard size={14} />{b.idnum}</span><input value={idnum} onChange={(e) => setIdnum(e.target.value)} /></label>
        </div>
        <div className="frm2">
          <label>{t.search.start}<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
          <label>{t.search.end}<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        </div>
        {!datesOk && <div className="alert err">{b.err_dates}</div>}
        <p className="mut" style={{ fontSize: 12.5 }}>{b.extend}</p>
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><input type="checkbox" checked={d2} onChange={(e) => setD2(e.target.checked)} /> <Users size={15} /> {b.d2}</label>
        {d2 && <label>{b.d2_name}<input value={d2name} onChange={(e) => setD2name(e.target.value)} placeholder={b.d2_hint} /></label>}
        <div className="frm2">
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><MapPin size={14} />{b.pickup}</span><input value={pickup} onChange={(e) => setPickup(e.target.value)} /></label>
          <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><MapPin size={14} />{b.dropoff}</span><input value={dropoff} onChange={(e) => setDropoff(e.target.value)} /></label>
        </div>
        <div className="bk-sec"><h4><ShieldCheck size={15} />{b.ins}</h4>
          <div className="opt-grid two">
            <div className={'opt' + (ins === 'none' ? ' on' : '')} onClick={() => setIns('none')}><ShieldCheck size={18} /><span>{b.ins_none}<small>{b.ins_none_d} • {b.ins_free}</small></span></div>
            <div className={'opt' + (ins === 'full' ? ' on' : '')} onClick={() => setIns('full')}><ShieldCheck size={18} /><span>{b.insurance_full}</span></div>
          </div>
        </div>
        <div className="bk-sec"><h4>{b.extras}</h4>
          <label style={{ display: 'flex', gap: 8, fontSize: 14 }}><input type="checkbox" checked={gps} onChange={(e) => setGps(e.target.checked)} /> {b.gps}</label>
          <label style={{ display: 'flex', gap: 8, fontSize: 14 }}><input type="checkbox" checked={baby} onChange={(e) => setBaby(e.target.checked)} /> {b.baby}</label>
        </div>
        <div className="bk-sec"><h4><CreditCard size={15} />{b.paym}</h4>
          <div className="opt-grid">
            <div className={'opt' + (method === 'cash' ? ' on' : '')} onClick={() => setMethod('cash')}><Banknote size={18} /><span>{b.pay_cash2}</span></div>
            <div className={'opt' + (method === 'card' ? ' on' : '')} onClick={() => setMethod('card')}><CreditCard size={18} /><span>{b.pay_card}</span></div>
            <div className={'opt' + (method === 'bank' ? ' on' : '')} onClick={() => setMethod('bank')}><Landmark size={18} /><span>{b.pay_bank}</span></div>
          </div>
        </div>
        <div className="bk-sec"><h4><Gift size={15} />{b.gift_t}</h4>
          <div className="gift-row">
            <input value={gift} onChange={(e) => { setGift(e.target.value); setGiftOk(null); }} placeholder="XXXX-XXXX-XXXX-XXXX" dir="ltr" />
            <button type="button" className="btn-light" onClick={checkGift}>{b.gift_check}</button>
          </div>
          {giftOk && <p className="mut" style={{ color: giftOk.ok ? '#059669' : '#b91c1c', fontWeight: 700 }}>{giftOk.ok ? `✓ ${b.gift_ok} — ${giftOk.amount} DH` : `✗ ${b.gift_bad}`}</p>}
        </div>
        <label><span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><FileText size={14} />{b.notes}</span><textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={b.notes_ph} /></label>
        <div className="sum">
          <div className="line"><span>{b.days_n}: {days} {b.day}</span><span>{base} DH</span></div>
          {(gpsAmt > 0) && <div className="line"><span>GPS</span><span>+{gpsAmt} DH</span></div>}
          {(babyAmt > 0) && <div className="line"><span> Baby</span><span>+{babyAmt} DH</span></div>}
          {(insAmt > 0) && <div className="line"><span>{b.ins}</span><span>+{insAmt} DH</span></div>}
          {(discount > 0) && <div className="line" style={{ color: '#059669' }}><span>🎁 −{discount} DH</span></div>}
          <div className="line grand"><span>{b.grand}</span><span>{grand} DH</span></div>
        </div>
        <button className="btn" onClick={book}><Rocket size={16} /> {payBtn} — {grand} DH</button>
      </div></div>
  </div></div><Footer lang={lang} /></>);
}
