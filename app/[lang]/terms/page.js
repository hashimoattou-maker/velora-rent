'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
export default function Terms({ params }) { const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1>📄 {t.terms_t}</h1><div className="card"><p>1. Âge 21+ (25+ luxe), permis +2 ans. 2. Caution 3000–15000 DH. 3. 200 km/j inclus. 4. Annulation gratuite 48h. 5. Paiement CMI sécurisé / cash. 6. Assurance base incluse, tous risques en option.</p></div></div><Footer lang={lang} /></>); }
