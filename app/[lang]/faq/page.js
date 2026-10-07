'use client';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { FAQS } from '@/lib/data';
import { CircleHelp } from 'lucide-react';
export default function Faq({ params }) { const lang = params.lang; const t = dict[lang]; return (<><Navbar lang={lang} /><div className="page"><h1><span className="ic"><CircleHelp size={22} /></span>{t.faq_t}</h1>{FAQS.map((f, i) => <details key={i} className="card" style={{ marginBottom: 10 }}><summary><b>{f.q}</b></summary><p className="mut">{f.a}</p></details>)}</div><Footer lang={lang} /></>); }
