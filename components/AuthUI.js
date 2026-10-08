'use client';
import { useEffect, useState } from 'react';
import { User, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useStore } from '@/lib/store';

export function TypeCards({ t, role, setRole }) {
  const cards = [
    ['client', t.role_client, t.role_client_d, User],
    ['company', t.role_company, t.role_company_d, Building2],
  ];
  return (
    <div>
      <label style={{ fontWeight: 700, fontSize: 14 }}>{t.acct_type}</label>
      <div className="type-cards">
        {cards.map(([v, label, sub, I]) => (
          <button type="button" key={v} className={'type-card' + (role === v ? ' on' : '')} onClick={() => setRole(v)}>
            <I size={30} strokeWidth={1.8} /><b>{label}</b><small>{sub}</small>
          </button>
        ))}
      </div>
    </div>
  );
}

const GIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.3H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.3-2.1 3.7-5.2 3.7-8.7z" /><path fill="#34A853" d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.8-5l-3.9 3C3.3 21.3 7.3 24 12 24z" /><path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-3.9-3C.5 8.2 0 10 0 12s.5 3.8 1.3 5.4l3.9-3z" /><path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.7 1.3 6.6l3.9 3c.9-2.8 3.6-4.9 6.8-4.9z" /></svg>
);
const FbIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#1877F2" /><path fill="#fff" d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.1-.1-2.1-.1-2.1 0-3.6 1.3-3.6 3.7V11H8.3v3h2.4v7h2.8z" /></svg>
);
const AppleIcon = () => (
  <svg width="19" height="19" viewBox="0 0 384 512" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" /></svg>
);

let fbLoaded = null;
function loadFacebook(appId) {
  if (fbLoaded) return fbLoaded;
  fbLoaded = new Promise((resolve) => {
    if (window.FB) return resolve(window.FB);
    window.fbAsyncInit = () => { window.FB.init({ appId, cookie: true, xfbml: false, version: 'v19.0' }); resolve(window.FB); };
    const s = document.createElement('script');
    s.src = 'https://connect.facebook.net/en_US/sdk.js'; s.async = true;
    document.head.appendChild(s);
    setTimeout(() => resolve(window.FB || null), 8000);
  });
  return fbLoaded;
}

export function SocialButtons({ t, role, onDone, onError }) {
  const { socialServer } = useStore() || {};
  const [cfg, setCfg] = useState(null);
  const [gisReady, setGisReady] = useState(false);
  useEffect(() => {
    api.oauthConfig().then((r) => setCfg(r.providers)).catch(() => setCfg({}));
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true;
    s.onload = () => setGisReady(true);
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  const google = () => {
    if (!cfg?.google) return onError(t.social_soon);
    if (!gisReady || !window.google) return onError('Google…');
    try {
      window.google.accounts.id.initialize({
        client_id: cfg.google_client_id,
        callback: async (res) => {
          try { const u = await socialServer({ provider: 'google', id_token: res.credential, role }); onDone(u); }
          catch (e) { onError(e.message); }
        },
      });
      window.google.accounts.id.prompt();
    } catch (e) { onError(e.message); }
  };

  const facebook = async () => {
    if (!cfg?.facebook) return onError(t.social_soon);
    const FB = await loadFacebook(cfg.facebook_app_id);
    if (!FB) return onError('Facebook…');
    FB.login(async (resp) => {
      if (!resp.authResponse) return;
      try { const u = await socialServer({ provider: 'facebook', access_token: resp.authResponse.accessToken, role }); onDone(u); }
      catch (e) { onError(e.message); }
    }, { scope: 'email,public_profile' });
  };

  const apple = () => onError(t.social_soon + ' (Apple Developer $99/yr)');

  return (
    <div style={{ display: 'grid', gap: 10 }}>
      <button type="button" className="social-btn" onClick={google}><GIcon /> {t.cont_google}</button>
      <button type="button" className="social-btn" onClick={apple}><AppleIcon /> {t.cont_apple}</button>
      <button type="button" className="social-btn" onClick={facebook}><FbIcon /> {t.cont_fb}</button>
    </div>
  );
}
