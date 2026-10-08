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

## Backend 100% Hostinger : PHP + MySQL (inclus Business, sans Supabase)

1. **Créer la base :** hPanel → Databases → créez DB + user (notez `host/user/name/pass`)
2. **Importer :** phpMyAdmin → Import → `database.sql` (9 tables + 12 voitures + 4 agences + avis)
3. **Connecter l'API :** File Manager → `public_html/api/` → créez fichier `.db.php` :
```php
<?php
return ['host'=>'localhost','name'=>'uXXXX_velora','user'=>'uXXXX_velora','pass'=>'MOT_DE_PASSE_FORT'];
```
4. Test : `https://domaine.com/api/cars/list.php` → `{"ok":true,"cars":[...]}`
5. Le site détecte l'API tout seul : si dispo → mode serveur (MySQL), sinon mode démo local. Rien à changer côté visiteurs.

## Dashboard Admin (sans phpMyAdmin)

1. File Manager → `public_html/api/admin/` → créez fichier `.admin.php` :
```php
<?php
return ['key' => 'BADAL_HADI_B KELMA_SERIa_TWILA'];
```
2. Ouvrez `https://domaine.com/fr/admin` → entrez la clé → stats, réservations (changer statut paid/pending/cancelled), clients, prix/activation voitures, messages + candidatures partenaires.
3. La clé reste sur le serveur uniquement (jamais dans Git). Tokens admin : 24h, stockés en session navigateur.

## Login social (Google / Facebook / Apple)

1. **Google (FREE)** : console.cloud.google.com → Credentials → OAuth client ID (Web) → Authorized JavaScript origins: `https://domaine.com` → copiez le Client ID
2. **Facebook (FREE)** : developers.facebook.com → Create App → Facebook Login → App Domains: `domaine.com` → copiez App ID + Secret
3. **Apple** : compte développeur payant ($99/an) — pas encore câblé, bouton affiche "bientôt"
4. File Manager → `public_html/api/auth/` → créez `.oauth.php` (modèle: `api/auth/oauth.sample.php`) avec vos IDs
5. Les boutons s'activent seuls. Sans config → message "bientôt disponible", login email marche toujours.
6. Comptes sociaux créés avec `provider=google/facebook`, mot de passe vide, +350 pts bienvenue.

## Déployer sur Hostinger (Shared)
1. `npm run build` → dossier `out/` généré
2. Hostinger → hPanel → File Manager → `public_html` : uploadez **le contenu de `out/`** + dossier **`api/`** (avec `.htaccess` inclus)
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
