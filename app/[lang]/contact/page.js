'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { serverAvailable, api } from '@/lib/api';
import { Headset, MapPin, Phone, Mail, CheckCircle2, Send, Siren } from 'lucide-react';
export default function Contact({ params }) {
  const lang = params.lang; const t = dict[lang]; const [ok, setOk] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try { if (await serverAvailable()) await api.form({ kind: 'contact', name: fd.get('n'), contact: fd.get('c'), message: fd.get('m') }); } catch {}
    setOk(true);
  };
  return (<><Navbar lang={lang} /><div className="page"><div className="row"><div className="card"><h1><span className="ic"><Headset size={22} /></span>{t.contact_t}</h1><p className="mut" style={{ display: 'grid', gap: 6 }}><span><MapPin size={13} /> Bd Anfa, Casablanca</span><span><Phone size={13} /> +212 6 61 00 00 00</span><span><Mail size={13} /> hello@velora-rent.ma</span><span>7j/7 8h–22h</span></p>
  {ok ? <div className="alert ok"><CheckCircle2 size={17} /> Message envoyé ! Réponse sous 2h.</div> :
  <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={send}><input required name="n" placeholder="Nom" /><input required name="c" placeholder="Email / Téléphone" /><textarea name="m" rows={4} placeholder="Message…" /><button className="btn"><Send size={15} /> {t.send}</button></form>}</div>
  <div className="dark"><h3 style={{ display: 'flex', gap: 8, alignItems: 'center' }}><Siren size={20} /> Support Center 24/7</h3><p style={{ color: '#d7cdf5' }}>Urgence route ? +212 6 62 00 00 00 (WhatsApp). Dépannage + voiture relais inclus assurance tous risques.</p><p style={{ color: '#d7cdf5' }}>Paiements : CMI • Visa • Cash • Virement</p></div></div></div><Footer lang={lang} /></>);
}
