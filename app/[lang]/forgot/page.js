'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
export default function Forgot({ params }) { const lang = params.lang; const [ok, setOk] = useState(false);
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 480 }}><div className="card"><h2>🔑 Mot de passe oublié</h2>
  {ok ? <div className="alert">✅ Lien envoyé par email (démo).</div> :
  <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={(e) => { e.preventDefault(); setOk(true); }}><input required type="email" placeholder="Email" /><button className="btn">Envoyer le lien</button></form>}</div></div><Footer lang={lang} /></>); }
