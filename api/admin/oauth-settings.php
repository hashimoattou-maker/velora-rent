<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
$pdo->exec("CREATE TABLE IF NOT EXISTS settings (`k` VARCHAR(80) PRIMARY KEY, `v` TEXT) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $allow = ['google_client_id', 'facebook_app_id', 'facebook_app_secret'];
  $st = $pdo->prepare('REPLACE INTO settings (`k`,`v`) VALUES (?,?)');
  foreach ($allow as $k) {
    if (array_key_exists($k, $b)) $st->execute([$k, substr(trim((string)$b[$k]), 0, 255)]);
  }
  vr_ok(['saved' => true]);
}
$rows = $pdo->query('SELECT `k`,`v` FROM settings')->fetchAll();
$out = [];
foreach ($rows as $r) $out[$r['k']] = $r['v'];
// never expose the secret value — only whether it is set
$out['facebook_app_secret_set'] = !empty($out['facebook_app_secret']);
unset($out['facebook_app_secret']);
vr_ok(['settings' => $out]);
