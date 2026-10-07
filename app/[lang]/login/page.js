'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
function Inner({ lang }) {
  const t = dict[lang]; const router = useRouter(); const sp = useSearchParams();
  const { login } = useStore() || {}; const [email, setEmail] = useState(''); const [pass, setPass] = useState('');
  const go = (e) => { e.preventDefault(); login({ name: email.split('@')[0] || 'Client Velora', email, city: 'Casablanca' }); router.push(sp.get('next') || `/${lang}/dashboard`); };
  return (<div className="page" style={{ maxWidth: 480 }}><div className="card"><h2>{t.auth.login_t}</h2><p className="mut">{t.auth.out}</p>
    <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
      <label>{t.auth.email}<input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" /></label>
      <label>{t.auth.pass}<input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
      <button className="btn">{t.auth.go}</button></form>
    <p><Link href={`/${lang}/forgot`}>Mot de passe oublié ?</Link></p>
    <p><Link href={`/${lang}/register`}>{t.auth.nohave}</Link></p></div></div>);
}
export default function Login({ params }) {
  const lang = params.lang;
  return (<><Navbar lang={lang} /><Suspense><Inner lang={lang} /></Suspense><Footer lang={lang} /></>);
}
