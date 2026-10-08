'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS } from '@/lib/data';
import { useStore } from '@/lib/store';
import { CalendarCheck, MapPin, ShieldCheck, CheckCircle2, Star, Rocket, Users, Cog, Fuel, Building2, Heart } from 'lucide-react';

export function DetailClient({ lang, id }) {
  const t = dict[lang]; const router = useRouter();
  const car = CARS.find((c) => c.id === id);
  const { user, addBooking, favs, setFavs } = useStore() || { favs: [] };
  const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [gps, setGps] = useState(false); const [baby, setBaby] = useState(false); const [full, setFull] = useState(true);
  const [pay, setPay] = useState('now');
  if (!car) return <p>Not found</p>;
  const isFav = (favs || []).includes(car.id);
  const toggleFav = () => {
    const n = isFav ? favs.filter((f) => f !== car.id) : [...(favs || []), car.id];
    setFavs(n);
    try { localStorage.setItem('velora_favs', JSON.stringify(n)); } catch {}
  };
  const days = start && end ? Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000)) : 1;
  const total = days * car.price + (gps ? days * 40 : 0) + (baby ? days * 30 : 0) + (full ? days * 99 : 0);
  const book = async () => {
    if (!user) { router.push(`/${lang}/login?next=/${lang}/cars/${car.id}`); return; }
    try {
      const r = await addBooking({ car_slug: car.id, car: car.brand + ' ' + car.model, city: car.city, start, end, days, total, pay, gps, baby, full, status: pay === 'now' ? 'paid' : 'pending' });
      router.push(`/${lang}/payment?code=${r.code}&total=${r.total}&pay=${pay}`);
    } catch (e) { alert('Erreur: ' + (e.message || e)); }
  };
  const specs = [
    [Users, t.sp_places, car.seats], [Cog, t.sp_gear, car.gear],
    [Fuel, t.sp_fuel, car.fuel], [MapPin, t.sp_city, car.city],
  ];
  return (<><Navbar lang={lang} /><div className="page"><div className="row">
    <div>
      <img src={car.img} style={{ width: '100%', borderRadius: 20 }} />
      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
          <div><h2 style={{ margin: 0 }}>{car.brand} {car.model} {car.year}</h2>
            <p className="mut" style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Building2 size={13} /> {car.company} • <Star size={13} /> {car.rating} ({car.trips})</p></div>
          <button className={'fav-btn' + (isFav ? ' on' : '')} onClick={toggleFav}><Heart size={16} fill={isFav ? 'currentColor' : 'none'} /> {isFav ? t.fav_ok : t.fav_add}</button>
        </div>
        <div className="specs">
          {specs.map(([I, l, v], i) => <div key={i} className="spec"><span className="sic"><I size={19} /></span><div><small>{l}</small><b>{v}</b></div></div>)}
        </div>
        <p style={{ display: 'grid', gap: 6, marginTop: 12 }}>{(t.feat || []).map((x) => <span key={x} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><CheckCircle2 size={15} color="#059669" /> {x}</span>)}</p>
      </div>
    </div>
    <div className="card"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CalendarCheck size={19} />{t.booking.title}</h3>
      <div className="field" style={{ display: 'grid', gap: 10 }}>
        <label>{t.search.start}<input type="date" value={start} onChange={(e) => setStart(e.target.value)} /></label>
        <label>{t.search.end}<input type="date" value={end} onChange={(e) => setEnd(e.target.value)} /></label>
        <label><input type="checkbox" checked={gps} onChange={(e) => setGps(e.target.checked)} /> {t.booking.gps}</label>
        <label><input type="checkbox" checked={baby} onChange={(e) => setBaby(e.target.checked)} /> {t.booking.baby}</label>
        <label><input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} /> {t.booking.insurance_full}</label>
        <label><input type="radio" name="p" checked={pay === 'now'} onChange={() => setPay('now')} /> {t.booking.pay}</label>
        <label><input type="radio" name="p" checked={pay === 'cash'} onChange={() => setPay('cash')} /> {t.booking.pay_cash}</label>
        <div className="alert ok">📅 {days} j × {car.price} DH = <b>{total} DH</b> ({t.total})</div>
        <button className="btn" onClick={book}><Rocket size={16} /> {t.book_now} — {total} DH</button>
      </div></div>
  </div></div><Footer lang={lang} /></>);
}
