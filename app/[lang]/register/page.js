'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { serverAvailable } from '@/lib/api';
import { UserPlus, AlertTriangle } from 'lucide-react';
export default function Register({ params }) {
  const lang = params.lang; const t = dict[lang]; const router = useRouter(); const { login, registerServer } = useStore() || {};
  const [f, setF] = useState({ name: '', email: '', phone: '', city: 'Casablanca', cin: '', license: '', pass: '' });
  const [err, setErr] = useState('');
  const go = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (await serverAvailable()) { await registerServer({ ...f }); router.push(`/${lang}/dashboard`); return; }
    } catch (ex) { setErr(ex.message || 'Signup failed'); return; }
    login({ name: f.name, email: f.email, city: f.city }); router.push(`/${lang}/dashboard`);
  };
  const S = (k, ph, ty = 'text') => <label>{t.auth[k] || k}<input required={k !== 'cin'} type={ty} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={ph} /></label>;
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 560 }}><div className="card"><h2 style={{ display: 'flex', gap: 10, alignItems: 'center' }}><UserPlus size={22} />{t.auth.reg_t}</h2>
    {err && <div className="alert err"><AlertTriangle size={16} /> {err}</div>}
    <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
      {S('name', 'Mohamed Alaoui')}{S('email', 'you@mail.com', 'email')}{S('phone', '+212 6…')}{S('city', 'Casablanca')}{S('cin', 'AB123456')}{S('license', 'Permis N°')}{S('pass', '•••••• (min 6)', 'password')}
      <button className="btn"><UserPlus size={15} /> {t.auth.go}</button></form>
    <p><Link href={`/${lang}/login`}>{t.auth.have}</Link></p></div></div><Footer lang={lang} /></>);
}
