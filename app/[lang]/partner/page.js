'use client';
import { useState } from 'react';
import { Navbar, Footer } from '@/components/ui';
import { dict } from '@/lib/i18n';
export default function Partner({ params }) {
  const lang = params.lang; const t = dict[lang]; const [ok, setOk] = useState(false);
  return (<><Navbar lang={lang} /><div className="page" style={{ maxWidth: 600 }}><div className="card">
    <h1>🤝 {t.become}</h1><p className="mut">Publiez vos voitures, recevez des réservations, dashboard + paiements CMI inclus.</p>
    {ok ? <div className="alert">✅ Demande reçue ! On vous appelle sous 24h.</div> :
    <form className="field" style={{ display: 'grid', gap: 10 }} onSubmit={(e) => { e.preventDefault(); setOk(true); }}>
      <input required placeholder="Nom agence *" /><input required placeholder="Ville *" /><input required placeholder="Téléphone *" /><input required type="number" placeholder="Nombre voitures *" /><textarea placeholder="Message" rows={3} /><button className="btn">Envoyer ma candidature</button>
    </form>}</div></div><Footer lang={lang} /></>);
}
