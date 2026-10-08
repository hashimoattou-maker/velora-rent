'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { serverAvailable } from '@/lib/api';
import { LogIn, KeyRound, AlertTriangle } from 'lucide-react';
function Inner({ lang }) {
  const t = dict[lang]; const router = useRouter(); const sp = useSearchParams();
  const { login, loginServer } = useStore() || {};
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState('');
  const go = async (e) => {
    e.preventDefault(); setErr('');
    const next = sp.get('next') || `/${lang}/dashboard`;
    try {
      if (await serverAvailable()) { await loginServer(email, pass); router.push(next); return; }
    } catch (ex) { setErr(ex.message || 'Login failed'); return; }
    login({ name: email.split('@')[0] || 'Client Velora', email, city: 'Casablanca' });
    router.push(next);
  };
  return (<div className="page" style={{ maxWidth: 480 }}><div className="card"><h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><KeyRound size={22} />{t.auth.login_t}</h2><p className="mut">{t.auth.out}</p>
    {err && <div className="alert err"><AlertTriangle size={16} /> {err}</div>}
    <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
      <label>{t.auth.email}<input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" /></label>
      <label>{t.auth.pass}<input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
      <button className="btn"><LogIn size={15} /> {t.auth.go}</button></form>
    <p><Link href={`/${lang}/forgot`}>{t.forgot_t}</Link></p>
    <p><Link href={`/${lang}/register`}>{t.auth.nohave}</Link></p></div></div>);
}
export default function Login({ params }) {
  const lang = params.lang;
  return (<><Navbar lang={lang} /><Suspense><Inner lang={lang} /></Suspense><Footer lang={lang} /></>);
}
