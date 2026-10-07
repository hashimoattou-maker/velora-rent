'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
export default function Contact({ params }) { const lang = params.lang; const t = dict[lang]; const [ok, setOk] = useState(false);
  return (<><Navbar lang={lang} /><div className="page"><div className="row"><div className="card"><h1>📞 {t.contact_t}</h1><p className="mut">📍 Bd Anfa, Casablanca • 📞 +212 6 61 00 00 00 • ✉️ hello@velora-rent.ma • 7j/7 8h–22h</p>
  {ok ? <div className="alert">✅ Message envoyé ! Réponse sous 2h.</div> :
  <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={(e) => { e.preventDefault(); setOk(true); }}><input required placeholder="Nom" /><input required placeholder="Email / Téléphone" /><textarea rows={4} placeholder="Message…" /><button className="btn">{t.send}</button></form>}</div>
  <div className="dark"><h3>🆘 Support Center 24/7</h3><p>Urgence route ? +212 6 62 00 00 00 (WhatsApp). Dépannage + voiture relais inclus assurance tous risques.</p><p>Paiements : CMI • Visa • Cash • Virement</p></div></div></div><Footer lang={lang} /></>); }
