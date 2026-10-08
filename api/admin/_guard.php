<?php
// Velora Rent — admin guard: ADMIN_KEY (api/.admin.php on server, NEVER in git) → short-lived tokens.
require __DIR__ . '/../config.php';

function vr_admin_key() {
  $k = getenv('VR_ADMIN_KEY') ?: '';
  $f = __DIR__ . '/.admin.php';
  if (file_exists($f)) {
    if (function_exists('vr_parse_php_array')) {
      $c = vr_parse_php_array($f, ['key']);
      if (!empty($c['key'])) return $c['key'];
    } else {
      $c = include $f;
      if (is_array($c)) $k = $c['key'] ?? $k;
      elseif (is_string($c)) $k = $c;
    }
  }
  return $k;
}
function vr_admin_ensure($pdo) {
  $pdo->exec("CREATE TABLE IF NOT EXISTS admin_tokens (token VARCHAR(128) PRIMARY KEY, expires_at DATETIME NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4");
}
function vr_admin($pdo) {
  vr_admin_ensure($pdo);
  $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (stripos($h, 'Bearer ') !== 0) vr_fail('Unauthorized', 401);
  $tok = substr($h, 7);
  if (!preg_match('/^[a-f0-9]{64}$/', $tok)) vr_fail('Unauthorized', 401);
  $st = $pdo->prepare('SELECT token FROM admin_tokens WHERE token=? AND expires_at > NOW()');
  $st->execute([$tok]);
  if (!$st->fetch()) vr_fail('Unauthorized', 401);
}
