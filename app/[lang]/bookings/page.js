'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
export default function Bookings({ params }) {
  const lang = params.lang; const t = dict[lang]; const { bookings, cancelBooking } = useStore() || { bookings: [] };
  return (<><Navbar lang={lang} /><div className="page"><h1>📋 {t.booking.mybookings}</h1>
    {(bookings || []).length === 0 ? <div className="card">{t.booking.empty}</div> :
    (bookings || []).map((b) => <div key={b.code} className="card" style={{ marginBottom: 10 }}>
      <b>{b.code}</b> — {b.car} • {b.start} → {b.end} • {b.days}j • <b>{b.total} DH</b> • {b.status === 'paid' ? '✅ ' + t.booking.paid : '⏳ ' + t.booking.pending}
      <div style={{ marginTop: 8 }}><button className="btn-ghost" style={{ color: '#111', borderColor: '#ccc' }} onClick={() => cancelBooking(b.code)}>❌ {t.booking.cancel}</button></div></div>)}
  </div><Footer lang={lang} /></>);
}
