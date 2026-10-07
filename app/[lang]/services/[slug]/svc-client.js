'use client';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
const INFO = {
  payments: { e: '💳', body: 'Payez par CMI, carte bancaire, virement ou cash à la livraison. Facture + reçu automatiques. Remboursement annulation 72h.' },
  insurance: { e: '🛡️', body: 'Base incluse + Tous risques 99 DH/j : franchise réduite, bris de glace, assistance 24/7 partout au Maroc.' },
  loyalty: { e: '🎁', body: '1 DH = 1 point. 2000 pts = -15%, 5000 pts = journée offerte + surclassement.' },
  'gift-cards': { e: '💝', body: 'Cartes 500/1000/2000 DH valables 12 mois, utilisables en 1 clic dans Mon espace.' },
  identity: { e: '🪪', body: 'Uploadez CIN + permis, validation sous 2h ouvrées. Obligatoire avant remise des clés.' },
  companies: { e: '🏢', body: 'Dashboard agence : ajout voitures illimité, calendrier, revenus, 8% commission après 3 mois offerts.' },
};
export function SvcClient({ lang, slug }) {
  const t = dict[lang];
  const s = t.svcs.find((x) => x.slug === slug) || t.svcs[0];
  const info = INFO[slug] || { e: '✨', body: s.d };
  return (<><Navbar lang={lang} /><div className="page"><Link href={`/${lang}/services`}>← Services</Link>
    <div className="card" style={{ marginTop: 10 }}><div style={{ fontSize: 48 }}>{info.e}</div><h1>{s.t}</h1><p>{s.d}</p><p>{info.body}</p>
    <Link className="btn" href={`/${lang}/cars`}>{t.book_now} →</Link></div></div><Footer lang={lang} /></>);
}
