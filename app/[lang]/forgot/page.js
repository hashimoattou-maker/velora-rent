'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { KeyRound, CheckCircle2, Send } from 'lucide-react';
export default function Forgot({ params }) { const lang = params.lang; const t = dict[lang]; const [ok, setOk] = useState(false);
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 480 }}><div className="card"><h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><KeyRound size={22} /> {t.forgot_t}</h2>
  {ok ? <div className="alert ok"><CheckCircle2 size={16} /> Lien envoyé par email (démo).</div> :
  <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={(e) => { e.preventDefault(); setOk(true); }}><input required type="email" placeholder="Email" /><button className="btn"><Send size={15} /> Envoyer le lien</button></form>}</div></div><Footer lang={lang} /></>); }
