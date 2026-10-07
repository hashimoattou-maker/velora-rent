'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
export default function Services({ params }) {
  const lang = params.lang; const t = dict[lang];
  const icons = { payments: '💳', insurance: '🛡️', loyalty: '🎁', 'gift-cards': '💝', identity: '🪪', companies: '🏢' };
  return (<><Navbar lang={lang} /><div className="page"><h1>✨ {t.services_title}</h1><p className="mut">{t.services_sub}</p>
    <div className="svc-grid">{t.svcs.map((s) => <Link key={s.slug} href={`/${lang}/services/${s.slug}`} className="svc"><div style={{ fontSize: 32 }}>{icons[s.slug] || '✨'}</div><b>{s.t}</b><p className="mut">{s.d}</p></Link>)}</div>
  </div><Footer lang={lang} /></>);
}
