'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { dict } from '@/lib/i18n';

function parseState(s) {
  try {
    const b = (s || '').replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(b));
  } catch { return {}; }
}

export default function FbCallback() {
  const router = useRouter();
  const { socialServer } = useStore() || {};
  const [msg, setMsg] = useState('…');
  const [lang, setLang] = useState('fr');
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const h = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const st = { lang: 'fr', role: 'client', ...parseState(h.get('state') || q.get('state')) };
    setLang(['fr', 'ar', 'en'].includes(st.lang) ? st.lang : 'fr');
    if (q.get('error')) { setMsg('cancelled'); return; }
    const tok = h.get('access_token');
    if (!tok) { setMsg('Facebook…'); return; }
    socialServer({ provider: 'facebook', access_token: tok, role: st.role })
      .then(() => router.push(`/${st.lang || 'fr'}/dashboard`))
      .catch((e) => setMsg(e.message || 'Facebook…'));
  }, []);
  const t = dict[lang] || dict.fr;
  return (
    <div style={{ maxWidth: 440, margin: '80px auto', textAlign: 'center', fontFamily: 'inherit', padding: 20 }}>
      <p style={{ fontSize: 16, fontWeight: 700 }}>
        {msg === 'cancelled' ? t.fb_cancel : msg === '…' ? '…' : msg}
      </p>
      {msg !== '…' && <Link href={`/${lang}/login`} style={{ color: '#4f46e5', fontWeight: 700 }}>{t.nav.login}</Link>}
    </div>
  );
}
