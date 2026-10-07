'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
export default function About({ params }) { const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1>💎 {t.about_t}</h1><div className="card"><p><b>Velora Rent</b> — comme MyKey (مفتاحك) mais en mieux : plateforme marocaine qui connecte <b>clients ↔ agences vérifiées</b> pour gérer voitures, réservations, paiements, assurances, fidélité et identité dans une seule app.</p><ul><li>✅ 2 400+ voitures, 40+ agences, 9 villes</li><li>✅ Paiement flexible + assurance + loyalty + gift cards + KYC</li><li>✅ Design premium noir & or, trilingue FR/AR/EN</li></ul></div>
  <div className="card" style={{ marginTop: 12 }}><h3>Company Information</h3><p className="mut">Velora Rent SARL • RC 612340 Casablanca • IF 33554411 • contact@velora-rent.ma</p></div></div><Footer lang={lang} /></>); }
