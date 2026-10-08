'use client';
import { useEffect, useRef, useState } from 'react';
import { MailCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { api } from '@/lib/api';

// 6-box OTP input like Panda. If demoCode is set (local demo, no email), it is shown and accepted.
export default function VerifyCode({ t, email, onVerified, demoCode = null }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [cool, setCool] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    if (demoCode) return;
    send(true);
  }, []);
  useEffect(() => {
    if (cool <= 0) return;
    const id = setTimeout(() => setCool(cool - 1), 1000);
    return () => clearTimeout(id);
  }, [cool]);

  const errMsg = (m) => ({
    code_wrong: t.v_code_wrong, code_expired: t.v_expired, too_many: t.v_many,
    wait_60s: t.v_wait, mail_failed: t.v_mail, no_account: m,
  }[m] || m);

  const send = async (first = false) => {
    setErr('');
    if (demoCode) return;
    try { await api.sendCode(email); setCool(60); }
    catch (e) { if (!first) setErr(errMsg(e.message)); }
  };

  const setD = (i, v) => {
    v = v.replace(/\D/g, '').slice(-1);
    const n = [...digits]; n[i] = v; setDigits(n);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const onPaste = (e) => {
    const txt = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
    if (!txt) return;
    e.preventDefault();
    const n = [...digits];
    txt.split('').forEach((ch, k) => { n[k] = ch; });
    setDigits(n);
    refs.current[Math.min(txt.length, 5)]?.focus();
  };

  const verify = async (e) => {
    e?.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) return;
    setErr(''); setBusy(true);
    try {
      if (demoCode) {
        if (code !== demoCode) throw new Error(t.v_code_wrong);
        onVerified(null);
      } else {
        await onVerified(code);
      }
    } catch (ex) { setErr(errMsg(ex.message)); }
    setBusy(false);
  };

  return (
    <div style={{ textAlign: 'center', display: 'grid', gap: 12 }}>
      <div style={{ width: 72, height: 72, borderRadius: 22, background: '#0d122b', display: 'grid', placeItems: 'center', color: '#fff', margin: '0 auto' }}>
        <MailCheck size={34} />
      </div>
      <h2 style={{ margin: 0 }}>{t.v_title}</h2>
      <p className="mut">{t.v_sent} <b dir="ltr">{email}</b></p>
      {demoCode && <div className="alert ok" style={{ justifyContent: 'center' }}>Demo code : <b style={{ letterSpacing: 4, fontSize: 18 }}>{demoCode}</b></div>}
      {err && <div className="alert err" style={{ justifyContent: 'center' }}><AlertTriangle size={16} /> {err}</div>}
      <form onSubmit={verify}>
        <div className="otp" dir="ltr">
          {digits.map((d, i) => (
            <input key={i} ref={(el) => (refs.current[i] = el)} value={d} inputMode="numeric" maxLength={1}
              onChange={(e) => setD(i, e.target.value)} onKeyDown={(e) => onKey(i, e)} onPaste={onPaste} />
          ))}
        </div>
        <button className="btn" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }} disabled={busy || digits.join('').length !== 6}>
          {busy ? '…' : t.v_btn}
        </button>
      </form>
      <button className="btn-light" style={{ justifyContent: 'center' }} disabled={cool > 0 || !!demoCode} onClick={() => send()}>
        <RefreshCw size={15} /> {cool > 0 ? `${t.v_resend} (${cool}s)` : t.v_resend}
      </button>
    </div>
  );
}
