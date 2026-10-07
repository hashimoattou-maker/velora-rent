# 🚗 Velora Rent — comme MyKey, en mieux (FR/AR/EN)

Plateforme location voitures Maroc : inspirée de **mypanda.base44.app (مفتاحك - MyKey)** avec **toutes les fonctionnalités**, design premium noir & or différent, nom **Velora Rent**, trilingue.

## Fonctionnalités ( = MyKey + plus)
- **Auth** : /login /register /forgot, session locale, KYC identité (CIN+permis)
- **Voitures** : 12 voitures, filtres ville/type/prix, tri, fiche détail + calcul prix jours + extras
- **Réservation** : dates, GPS/bébé/assurance, paiement simulé CMI ou cash, code VR-XXXX, annulation
- **Services** : /services/payments, insurance, loyalty (points auto), gift-cards, identity, companies
- **Agences** : 4 partenaires vérifiés + page /partner devenir partenaire
- **Pages** : about, company info, contact/support 24/7, reviews, faq, terms, payment result, dashboard, bookings
- **Langues** : FR/AR (RTL)/EN, switch instantané

## Lancer en local
```bash
npm install
npm run dev   # http://localhost:3000/fr
```

## Déployer sur Hostinger (Shared)
1. `npm run build` → dossier `out/` généré
2. Hostinger → hPanel → File Manager → `public_html` : uploadez **le contenu de `out/`** (avec `.htaccess` inclus)
3. Domaine → https://votredomaine.com/fr

## Hostinger VPS / Node
```bash
npm run build && npm start
```
Ou changez `next.config.js` : retirez `output:'export'` pour mode serveur + API futures.

## Passer en backend réel plus tard
- Remplacez `lib/store.js` (localStorage) par appels API
- Ajoutez CMI réel dans `app/[lang]/cars/[id]/detail-client.js` (fonction `book`)
- Base conseillée : PlanetHoster/MySQL ou Supabase
