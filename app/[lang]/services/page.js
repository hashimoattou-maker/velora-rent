'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { Sparkles, CreditCard, ShieldCheck, Gift, Ticket, BadgeCheck, Building2, Zap, ArrowRight } from 'lucide-react';
export default function Services({ params }) {
  const lang = params.lang; const t = dict[lang];
  const icons = { payments: CreditCard, insurance: ShieldCheck, loyalty: Gift, 'gift-cards': Ticket, identity: BadgeCheck, companies: Building2 };
  return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><Sparkles size={22} /></span>{t.services_title}</h1><p className="mut">{t.services_sub}</p>
    <div className="svc-grid">{t.svcs.map((s) => {
      const I = icons[s.slug] || Zap;
      return <Link key={s.slug} href={`/${lang}/services/${s.slug}`} className="svc"><span className="sic"><I size={22} /></span><b>{s.t}</b><p className="mut">{s.d}</p><span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', color: '#6d28d9', fontWeight: 700, fontSize: 13 }}>{t.details} <ArrowRight size={14} /></span></Link>;
    })}</div>
  </div><Footer lang={lang} /></>);
}
