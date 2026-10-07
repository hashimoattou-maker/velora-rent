'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
export default function Register({ params }) {
  const lang = params.lang; const t = dict[lang]; const router = useRouter(); const { login } = useStore() || {};
  const [f, setF] = useState({ name: '', email: '', phone: '', city: 'Casablanca', cin: '', license: '', pass: '' });
  const go = (e) => { e.preventDefault(); login({ name: f.name, email: f.email, city: f.city }); router.push(`/${lang}/dashboard`); };
  const S = (k, ph, ty = 'text') => <label>{t.auth[k] || k}<input required={k !== 'cin'} type={ty} value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={ph} /></label>;
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 560 }}><div className="card"><h2>{t.auth.reg_t}</h2>
    <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
      {S('name', 'Mohamed Alaoui')}{S('email', 'you@mail.com', 'email')}{S('phone', '+212 6…')}{S('city', 'Casablanca')}{S('cin', 'AB123456')}{S('license', 'Permis N°')}{S('pass', '••••••', 'password')}
      <button className="btn">{t.auth.go}</button></form>
    <p><Link href={`/${lang}/login`}>{t.auth.have}</Link></p></div></div><Footer lang={lang} /></>);
}
