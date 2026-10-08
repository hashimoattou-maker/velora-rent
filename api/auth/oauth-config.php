<?php
// Public OAuth config (app IDs only — no secrets). Frontend uses it to show/enable buttons.
require __DIR__ . '/../config.php';
require __DIR__ . '/oauth.php';
$c = vr_oauth_cfg();
vr_ok(['providers' => [
  'google' => !empty($c['google_client_id']),
  'google_client_id' => $c['google_client_id'],
  'facebook' => !empty($c['facebook_app_id']),
  'facebook_app_id' => $c['facebook_app_id'],
  'apple' => false,
]]);
