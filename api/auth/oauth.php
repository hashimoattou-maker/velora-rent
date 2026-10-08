<?php
// OAuth config — priority: api/.oauth.php file → DB settings (admin dashboard) → env vars.
// Google + Facebook apps are FREE. Apple needs a paid Apple Developer account ($99/yr).
// .oauth.php format: <?php return ['google_client_id'=>'...', 'facebook_app_id'=>'...', 'facebook_app_secret'=>'...'];
function vr_oauth_cfg() {
  $c = ['google_client_id' => getenv('VR_GOOGLE_CLIENT_ID') ?: '', 'facebook_app_id' => getenv('VR_FACEBOOK_APP_ID') ?: '', 'facebook_app_secret' => getenv('VR_FACEBOOK_APP_SECRET') ?: ''];
  try {
    $h = getenv('VR_DB_HOST') ?: 'localhost';
    $f = __DIR__ . '/../.db.php';
    $db = ['host' => $h, 'name' => getenv('VR_DB_NAME') ?: '', 'user' => getenv('VR_DB_USER') ?: '', 'pass' => getenv('VR_DB_PASS') ?: ''];
    if (file_exists($f)) { $o = include $f; if (is_array($o)) $db = array_merge($db, $o); }
    if ($db['name'] !== '' && $db['user'] !== '') {
      $pdo = new PDO("mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4", $db['user'], $db['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
      foreach ($pdo->query("SELECT `k`,`v` FROM settings WHERE `k` IN ('google_client_id','facebook_app_id','facebook_app_secret')") as $r) {
        if (isset($c[$r['k']]) && $r['v'] !== '') $c[$r['k']] = $r['v'];
      }
    }
  } catch (Exception $e) {}
  $f = __DIR__ . '/.oauth.php';
  if (file_exists($f)) {
    $o = include $f;
    if (is_array($o)) foreach ($o as $k => $v) if (isset($c[$k]) && $v !== '') $c[$k] = $v;
  }
  return $c;
}
