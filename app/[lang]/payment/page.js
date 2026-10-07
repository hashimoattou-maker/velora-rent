'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CheckCircle2, Clock, Ticket, Search } from 'lucide-react';
function Inner({ lang }) {
  const t = dict[lang]; const sp = useSearchParams();
  const code = sp.get('code'); const total = sp.get('total'); const pay = sp.get('pay');
  return (<div className="page" style={{ maxWidth: 560 }}><div className="card" style={{ textAlign: 'center' }}>
    <div style={{ width: 76, height: 76, borderRadius: '50%', margin: '0 auto', display: 'grid', placeItems: 'center', background: pay === 'now' ? '#ecfdf5' : '#fffbeb', border: pay === 'now' ? '2px solid #a7f3d0' : '2px solid #fde68a' }}>
      {pay === 'now' ? <CheckCircle2 size={36} color="#059669" /> : <Clock size={36} color="#b45309" />}</div>
    <h2>{pay === 'now' ? t.payment_ok : t.payment_fail}</h2>
    <p className="mut">{t.booking.success}</p>
    <div className="alert ok"><Ticket size={16} /> {t.booking.code}: <b>{code}</b> • 💰 {total} DH • {pay === 'now' ? t.booking.paid : t.booking.pending} (CMI simulé)</div>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
      <Link className="btn" href={`/${lang}/bookings`}>{t.booking.mybookings}</Link>
      <Link className="btn-light" href={`/${lang}/cars`}><Search size={15} /> {t.see_all}</Link>
    </div></div></div>);
}
export default function Payment({ params }) {
  const lang = params.lang;
  return (<><Navbar lang={lang} /><Suspense><Inner lang={lang} /></Suspense><Footer lang={lang} /></>);
}
