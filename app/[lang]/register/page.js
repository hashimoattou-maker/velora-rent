'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar, Footer } from '@/components/ui';
import { TypeCards, SocialButtons } from '@/components/AuthUI';
import VerifyCode from '@/components/VerifyCode';
import { dict } from '@/lib/i18n';
import { useStore } from '@/lib/store';
import { serverAvailable } from '@/lib/api';
import { UserPlus, AlertTriangle } from 'lucide-react';

export default function Register({ params }) {
  const lang = params.lang; const t = dict[lang]; const router = useRouter();
  const { login, registerServer, verifyServer } = useStore() || {};
  const [role, setRole] = useState('client');
  const [f, setF] = useState({ name: '', email: '', phone: '', city: 'Casablanca', cin: '', license: '', pass: '', agency: '', address: '', cars: '' });
  const [err, setErr] = useState('');
  const [step, setStep] = useState(null); // {email, demo?}
  const done = () => router.push(`/${lang}/dashboard`);
  const go = async (e) => {
    e.preventDefault(); setErr('');
    try {
      if (await serverAvailable()) {
        const r = await registerServer({ ...f, role });
        setStep({ email: r.email || f.email }); // VerifyCode auto-sends the OTP
        return;
      }
    } catch (ex) { setErr(ex.message || 'Signup failed'); return; }
    // Local demo: show the code on screen (no email backend)
    const demo = String(Math.floor(100000 + Math.random() * 900000));
    login({ name: f.name, email: f.email, city: f.city, role, _pending: true });
    setStep({ email: f.email, demo });
  };
  const verified = async (code) => {
    if (step?.demo) {
      const u = { name: f.name, email: f.email, city: f.city, role };
      login(u); done(); return;
    }
    await verifyServer(step.email, code); done();
  };
  return (
    <div className="page" style={{ maxWidth: 560 }}>
      {!step && (<>
        <h1 style={{ justifyContent: 'center', textAlign: 'center' }}>{t.auth.reg_t}</h1>
        <p className="mut" style={{ textAlign: 'center' }}>{t.acct_sub}</p>
      </>)}
      <div className="card" style={{ display: 'grid', gap: 12 }}>
        {!step ? (<>
          <TypeCards t={t} role={role} setRole={setRole} />
          {err && <div className="alert err"><AlertTriangle size={16} /> {err}</div>}
          <SocialButtons t={t} role={role} onDone={done} onError={setErr} />
          <div className="divider">{t.or_x}</div>
          <form onSubmit={go} className="field" style={{ display: 'grid', gap: 10 }}>
            {role === 'company' && (<>
              <label>{t.agency_name}<input required value={f.agency} onChange={(e) => setF({ ...f, agency: e.target.value })} /></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <label>{t.addr_label}<input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
                <label>{t.cars_count}<input type="number" min="1" value={f.cars} onChange={(e) => setF({ ...f, cars: e.target.value })} /></label>
              </div>
            </>)}
            <label>{t.auth.name}<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label>{t.auth.email}<input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <label>{t.auth.phone}<input required value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
              <label>{t.auth.city}<input required value={f.city} onChange={(e) => setF({ ...f, city: f.city })} /></label>
            </div>
            <label>{t.auth.pass}<input required type="password" minLength={6} value={f.pass} onChange={(e) => setF({ ...f, pass: e.target.value })} /></label>
            <button className="btn" style={{ justifyContent: 'center' }}><UserPlus size={15} /> {t.auth.go}</button>
          </form>
          <p style={{ textAlign: 'center' }}><Link href={`/${lang}/login`}>{t.auth.have}</Link></p>
        </>) : (
          <VerifyCode t={t} email={step.email} demoCode={step.demo || null} onVerified={verified} />
        )}
      </div>
    </div>
  );
}
