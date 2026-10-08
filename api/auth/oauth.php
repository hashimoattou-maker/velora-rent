<?php
// OAuth config — keys live in api/.oauth.php on server (NEVER in git) or env vars.
// Google + Facebook apps are FREE. Apple needs a paid Apple Developer account ($99/yr).
// .oauth.php format: <?php return ['google_client_id'=>'...', 'facebook_app_id'=>'...', 'facebook_app_secret'=>'...'];
function vr_oauth_cfg() {
  $c = ['google_client_id' => getenv('VR_GOOGLE_CLIENT_ID') ?: '', 'facebook_app_id' => getenv('VR_FACEBOOK_APP_ID') ?: '', 'facebook_app_secret' => getenv('VR_FACEBOOK_APP_SECRET') ?: ''];
  $f = __DIR__ . '/.oauth.php';
  if (file_exists($f)) {
    $o = include $f;
    if (is_array($o)) foreach ($o as $k => $v) if (isset($c[$k])) $c[$k] = $v;
  }
  return $c;
}
