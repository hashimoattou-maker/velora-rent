'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { CreditCard, ShieldCheck, Gift, Ticket, BadgeCheck, Building2, Zap, ArrowRight, ArrowLeft } from 'lucide-react';
const INFO = {
  payments: { I: CreditCard, body: 'Payez par CMI, carte bancaire, virement ou cash à la livraison. Facture + reçu automatiques. Remboursement annulation 72h.' },
  insurance: { I: ShieldCheck, body: 'Base incluse + Tous risques 99 DH/j : franchise réduite, bris de glace, assistance 24/7 partout au Maroc.' },
  loyalty: { I: Gift, body: '1 DH = 1 point. 2000 pts = -15%, 5000 pts = journée offerte + surclassement.' },
  'gift-cards': { I: Ticket, body: 'Cartes 500/1000/2000 DH valables 12 mois, utilisables en 1 clic dans Mon espace.' },
  identity: { I: BadgeCheck, body: 'Uploadez CIN + permis, validation sous 2h ouvrées. Obligatoire avant remise des clés.' },
  companies: { I: Building2, body: 'Dashboard agence : ajout voitures illimité, calendrier, revenus, 8% commission après 3 mois offerts.' },
};
export function SvcClient({ lang, slug }) {
  const t = dict[lang];
  const s = t.svcs.find((x) => x.slug === slug) || t.svcs[0];
  const info = INFO[slug] || { I: Zap, body: s.d };
  const I = info.I;
  return (<><Navbar lang={lang} /><div className="page"><Link href={`/${lang}/services`} style={{ display: 'inline-flex', gap: 6, alignItems: 'center', fontWeight: 700, color: '#6d28d9' }}><ArrowLeft size={15} /> Services</Link>
    <div className="card" style={{ marginTop: 12 }}><span style={{ width: 56, height: 56, borderRadius: 17, background: 'linear-gradient(135deg,#eef0ff,#f5efff)', border: '1px solid #e2d9fd', display: 'grid', placeItems: 'center', color: '#6d28d9', marginBottom: 12 }}><I size={26} /></span><h1 style={{ margin: '0 0 8px' }}>{s.t}</h1><p>{s.d}</p><p>{info.body}</p>
    <Link className="btn" href={`/${lang}/cars`}>{t.book_now} <ArrowRight size={15} /></Link></div></div><Footer lang={lang} /></>);
}
