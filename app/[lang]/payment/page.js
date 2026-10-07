'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
function Inner({ lang }) {
  const t = dict[lang]; const sp = useSearchParams();
  const code = sp.get('code'); const total = sp.get('total'); const pay = sp.get('pay');
  return (<div className="page" style={{ maxWidth: 560 }}><div className="card" style={{ textAlign: 'center' }}>
    <div style={{ fontSize: 56 }}>{pay === 'now' ? '✅' : '⏳'}</div>
    <h2>{pay === 'now' ? t.payment_ok : t.payment_fail}</h2>
    <p className="mut">{t.booking.success}</p>
    <div className="alert">🎫 {t.booking.code}: <b>{code}</b> • 💰 {total} DH • {pay === 'now' ? t.booking.paid : t.booking.pending} (CMI simulé)</div>
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 14 }}>
      <Link className="btn" href={`/${lang}/bookings`}>{t.booking.mybookings}</Link>
      <Link className="btn-ghost" style={{ color: '#111', borderColor: '#ccc' }} href={`/${lang}/cars`}>{t.see_all}</Link>
    </div></div></div>);
}
export default function Payment({ params }) {
  const lang = params.lang;
  return (<><Navbar lang={lang} /><Suspense><Inner lang={lang} /></Suspense><Footer lang={lang} /></>);
}
