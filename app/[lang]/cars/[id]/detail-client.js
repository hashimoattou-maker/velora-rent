'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CARS } from '@/lib/data';
import { useStore } from '@/lib/store';
import { CalendarCheck, MapPin, ShieldCheck, CheckCircle2, Star, Rocket } from 'lucide-react';
export function DetailClient({ lang, id }) {
  const t = dict[lang]; const router = useRouter();
  const car = CARS.find((c) => c.id === id);
  const { user, addBooking } = useStore() || {};
  const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [gps, setGps] = useState(false); const [baby, setBaby] = useState(false); const [full, setFull] = useState(true);
  const [pay, setPay] = useState('now');
  if (!car) return <p>Not found</p>;
  const days = start && end ? Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000)) : 1;
  const total = days * car.price + (gps ? days * 40 : 0) + (baby ? days * 30 : 0) + (full ? days * 99 : 0);
  const book = async () => {
    if (!user) { router.push(`/${lang}/login?next=/${lang}/cars/${car.id}`); return; }
    try {
      const r = await addBooking({ car_slug: car.id, car: car.brand + ' ' + car.model, city: car.city, start, end, days, total, pay, gps, baby, full, status: pay === 'now' ? 'paid' : 'pending' });
      router.push(`/${lang}/payment?code=${r.code}&total=${r.total}&pay=${pay}`);
    } catch (e) { alert('Erreur: ' + (e.message || e)); }
  };
  return (<><Navbar lang={lang} /><div className="page"><div className="row">
    <div><img src={car.img} style={{ width: '100%', borderRadius: 20 }} /><div className="card" style={{ marginTop: 12 }}>
      <h2 style={{ margin: 0 }}>{car.brand} {car.model} {car.year}</h2>
      <p className="mut" style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><span><MapPin size={13} /> {car.city}</span><span>{car.company}</span><span><Star size={13} /> {car.rating} ({car.trips} trips)</span><span>{car.seats} {t.seats}</span><span>{car.gear}</span><span>{car.fuel}</span></p>
      <p style={{ display: 'grid', gap: 6 }}>{['200 km/j inclus', 'Assurance de base', 'Annulation gratuite 48h', 'Livraison aéroport'].map((x) => <span key={x} style={{ display: 'flex', gap: 8, alignItems: 'center', fontSize: 14 }}><CheckCircle2 size={15} color="#059669" /> {x}</span>)}</p></div></div>
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
