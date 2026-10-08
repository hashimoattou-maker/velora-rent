'use client';
import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { TypeCards, SocialButtons } from '@/components/AuthUI';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { serverAvailable } from '@/lib/api';
import { LogIn, AlertTriangle } from 'lucide-react';

function Inner({ lang }) {
  const t = dict[lang]; const router = useRouter(); const sp = useSearchParams();
  const { login, loginServer } = useStore() || {};
  const [role, setRole] = useState('client');
  const [email, setEmail] = useState(''); const [pass, setPass] = useState(''); const [err, setErr] = useState('');
  const next = sp.get('next') || `/${lang}/dashboard`;
  const done = () => router.push(next);
  const go = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (await serverAvailable()) { await loginServer(email, pass); done(); return; }
    } catch (ex) { setErr(ex.message || 'Login failed'); return; }
    login({ name: email.split('@')[0] || 'Client Velora', email, city: 'Casablanca', role });
    done();
  };
  return (
    <div className="page" style={{ maxWidth: 520 }}>
      <h1 style={{ justifyContent: 'center', textAlign: 'center' }}>{t.nav.login}</h1>
      <p className="mut" style={{ textAlign: 'center' }}>{t.acct_sub}</p>
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        <TypeCards t={t} role={role} setRole={setRole} />
        {err && <div className="alert err"><AlertTriangle size={16} /> {err}</div>}
        <SocialButtons t={t} role={role} onDone={done} onError={setErr} />
        <div className="divider">{t.or_x}</div>
        <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
          <label>{t.auth.email}<input required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@mail.com" /></label>
          <label>{t.auth.pass}<input required type="password" value={pass} onChange={(e) => setPass(e.target.value)} /></label>
          <button className="btn" style={{ justifyContent: 'center' }}><LogIn size={15} /> {t.auth.go}</button>
        </form>
        <p style={{ textAlign: 'center' }}><Link href={`/${lang}/forgot`}>{t.forgot_t}</Link></p>
        <p style={{ textAlign: 'center' }}><Link href={`/${lang}/register`}>{t.auth.nohave}</Link></p>
      </div>
    </div>
  );
}
export default function Login({ params }) {
  const lang = params.lang;
  return (<><Navbar lang={lang} /><Suspense><Inner lang={lang} /></Suspense><Footer lang={lang} /></>);
}
