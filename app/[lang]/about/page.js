'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { Gem, CheckCircle2, Building2 } from 'lucide-react';
export default function About({ params }) { const lang = params.lang; const t = dict[lang];
  return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><Gem size={22} /></span>{t.about_t}</h1><div className="card"><p><b>Velora Rent</b> — comme MyKey (مفتاحك) mais en mieux : plateforme marocaine qui connecte <b>clients ↔ agences vérifiées</b> pour gérer voitures, réservations, paiements, assurances, fidélité et identité dans une seule app.</p><ul style={{ display: 'grid', gap: 8, paddingInlineStart: 4, listStyle: 'none' }}>{['2 400+ voitures, 40+ agences, 9 villes', 'Paiement flexible + assurance + loyalty + gift cards + KYC', 'Design premium, trilingue FR/AR/EN'].map((x) => <li key={x} style={{ display: 'flex', gap: 8, alignItems: 'center' }}><CheckCircle2 size={16} color="#059669" /> {x}</li>)}</ul></div>
  <div className="card" style={{ marginTop: 12 }}><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Building2 size={18} /> Company Information</h3><p className="mut">Velora Rent SARL • RC 612340 Casablanca • IF 33554411 • contact@velora-rent.ma</p></div></div><Footer lang={lang} /></>); }
