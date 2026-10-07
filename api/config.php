<?php
// Velora Rent — shared bootstrap (Hostinger PHP + MySQL, no framework needed)
header('Content-Type: application/json; charset=utf-8');

// --- DB credentials: api/.db.php on server (NEVER in git) or env vars ---
$DB_HOST = getenv('VR_DB_HOST') ?: 'localhost';
$DB_NAME = getenv('VR_DB_NAME') ?: '';
$DB_USER = getenv('VR_DB_USER') ?: '';
$DB_PASS = getenv('VR_DB_PASS') ?: '';
$local = __DIR__ . '/.db.php';
if (file_exists($local)) {
  $c = include $local;
  if (is_array($c)) {
    $DB_HOST = $c['host'] ?? $DB_HOST;
    $DB_NAME = $c['name'] ?? $DB_NAME;
    $DB_USER = $c['user'] ?? $DB_USER;
    $DB_PASS = $c['pass'] ?? $DB_PASS;
  }
}

function vr_fail($msg, $code = 400) {
  http_response_code($code);
  echo json_encode(['ok' => false, 'error' => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}
function vr_ok($data = []) {
  echo json_encode(array_merge(['ok' => true], $data), JSON_UNESCAPED_UNICODE);
  exit;
}
function vr_body() {
  $b = json_decode(file_get_contents('php://input'), true);
  if (!is_array($b)) $b = [];
  return array_merge($_GET, $_POST, $b);
}
function vr_db() {
  global $DB_HOST, $DB_NAME, $DB_USER, $DB_PASS;
  if ($DB_NAME === '' || $DB_USER === '') vr_fail('DB not configured (.db.php)', 500);
  try {
    $pdo = new PDO("mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4", $DB_USER, $DB_PASS, [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
  } catch (Exception $e) { vr_fail('DB connection failed', 500); }
}
function vr_require_method($m) {
  if ($_SERVER['REQUEST_METHOD'] !== $m) vr_fail('Method not allowed', 405);
}
function vr_user($pdo) {
  $h = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
  if (stripos($h, 'Bearer ') !== 0) return null;
  $tok = substr($h, 7);
  if (!preg_match('/^[a-f0-9]{64}$/', $tok)) return null;
  $st = $pdo->prepare('SELECT u.* FROM tokens t JOIN users u ON u.id=t.user_id WHERE t.token=? AND t.expires_at > NOW()');
  $st->execute([$tok]);
  return $st->fetch() ?: null;
}
function vr_issue_token($pdo, $uid) {
  $tok = bin2hex(random_bytes(32));
  $st = $pdo->prepare("INSERT INTO tokens (token, user_id, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))");
  $st->execute([$tok, $uid]);
  return $tok;
}
function vr_public_user($u) {
  return ['id' => (int)$u['id'], 'name' => $u['name'], 'email' => $u['email'], 'phone' => $u['phone'],
    'city' => $u['city'], 'points' => (int)$u['points'], 'identity_verified' => (bool)$u['identity_verified']];
}
