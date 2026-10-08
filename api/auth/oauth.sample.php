<?php
// COPY to api/auth/.oauth.php on server and fill. NEVER commit (gitignored).
// Google: https://console.cloud.google.com → APIs & Services → Credentials → OAuth client ID (Web) → add your domain to Authorized JavaScript origins.
// Facebook: https://developers.facebook.com → Create App → Facebook Login → add your domain to Valid OAuth Redirect URIs + App Domains.
// Apple: requires paid Apple Developer Program ($99/yr) — not wired yet.
return [
  'google_client_id' => 'PASTE_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  'facebook_app_id' => 'PASTE_FACEBOOK_APP_ID',
  'facebook_app_secret' => 'PASTE_FACEBOOK_APP_SECRET',
];
