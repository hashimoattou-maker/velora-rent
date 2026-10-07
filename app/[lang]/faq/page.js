'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { FAQS, REVIEWS } from '@/lib/data';
export function Faq({ params }) { const lang = params.lang; const t = dict[lang]; return (<><Navbar lang={lang} /><div className="page"><h1>❓ {t.faq_t}</h1>{FAQS.map((f, i) => <details key={i} className="card" style={{ marginBottom: 8 }}><summary><b>{f.q}</b></summary><p className="mut">{f.a}</p></details>)}</div><Footer lang={lang} /></>); }
export default Faq;
