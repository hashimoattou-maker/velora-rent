'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
import { serverAvailable, api } from '@/lib/api';
import { Handshake, CheckCircle2, Send } from 'lucide-react';
export default function Partner({ params }) {
  const lang = params.lang; const t = dict[lang]; const [ok, setOk] = useState(false);
  const send = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try { if (await serverAvailable()) await api.form({ kind: 'partner', agency: fd.get('a'), city: fd.get('v'), address: fd.get('ad'), phone: fd.get('p'), cars: fd.get('n'), message: fd.get('m') }); } catch {}
    setOk(true);
  };
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 600 }}><div className="card">
    <h1><span className="ic"><Handshake size={22} /></span>{t.become}</h1><p className="mut">{t.become_sub}</p>
    {ok ? <div className="alert ok"><CheckCircle2 size={17} /> Demande reçue ! On vous appelle sous 24h.</div> :
    <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={send}>
      <input required name="a" placeholder="Nom agence *" /><input required name="v" placeholder="Ville *" /><input required name="ad" placeholder="Adresse (rue, quartier) *" /><input required name="p" placeholder="Téléphone *" /><input required name="n" type="number" placeholder="Nombre voitures *" /><textarea name="m" placeholder="Message" rows={3} /><button className="btn"><Send size={15} /> Envoyer ma candidature</button>
    </form>}</div></div><Footer lang={lang} /></>);
}
