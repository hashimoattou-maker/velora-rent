<?php
// Public diagnostic (no secrets exposed): tells why the API can't reach the DB.
header('Content-Type: application/json; charset=utf-8');
require __DIR__ . '/config.php';
$out = ['ok' => true, 'db_file' => file_exists(__DIR__ . '/.db.php'), 'keys' => [], 'connect' => 'skipped'];
if ($out['db_file']) {
  $c = vr_parse_php_array(__DIR__ . '/.db.php', ['host', 'name', 'user', 'pass']);
  foreach (['host', 'name', 'user', 'pass'] as $k) if (!empty($c[$k])) $out['keys'][] = $k;
}
global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
if ($DB_NAME === '' || $DB_USER === '') {
  $out['connect'] = 'no_credentials';
} else {
  try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $n = $pdo->query('SELECT COUNT(*) c FROM cars')->fetch()['c'];
    $out['connect'] = 'ok';
    $out['cars'] = (int)$n;
  } catch (Exception $e) {
    $msg = $e->getMessage();
    if (stripos($msg, 'Access denied') !== false) $msg = 'access_denied (user/password faux)';
    elseif (stripos($msg, 'Unknown database') !== false) $msg = 'unknown_database (smiya DB ghalta)';
    elseif (stripos($msg, 'getaddrinfo') !== false || stripos($msg, 'Unknown MySQL server host') !== false) $msg = 'bad_host (host ghaleet)';
    else $msg = 'error';
    $out['connect'] = $msg;
  }
}
echo json_encode($out, JSON_UNESCAPED_UNICODE);
