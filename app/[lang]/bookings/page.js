'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { Ticket, XCircle, BadgeCheck, Clock } from 'lucide-react';
export default function Bookings({ params }) {
  const lang = params.lang; const t = dict[lang]; const { bookings, cancelBooking } = useStore() || { bookings: [] };
  return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><Ticket size={22} /></span>{t.booking.mybookings}</h1>
    {(bookings || []).length === 0 ? <div className="card">{t.booking.empty}</div> :
    (bookings || []).map((b) => <div key={b.code} className="card card-h" style={{ marginBottom: 12 }}>
      <b>{b.code}</b> — {b.car} • {b.start} → {b.end} • {b.days}j • <b>{b.total} DH</b> • {b.status === 'paid' ? <span style={{ color: '#059669', fontWeight: 700, display: 'inline-flex', gap: 5, alignItems: 'center' }}><BadgeCheck size={15} />{t.booking.paid}</span> : <span style={{ color: '#b45309', fontWeight: 700, display: 'inline-flex', gap: 5, alignItems: 'center' }}><Clock size={15} />{t.booking.pending}</span>}
      <div style={{ marginTop: 8 }}><button className="btn-light" onClick={() => cancelBooking(b.code)}><XCircle size={15} /> {t.booking.cancel}</button></div></div>)}
  </div><Footer lang={lang} /></>);
}
