<?php
// Social login: verifies Google ID tokens / Facebook access tokens server-side, then finds or creates the user.
require __DIR__ . '/../config.php';
require __DIR__ . '/oauth.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$provider = $b['provider'] ?? '';
$cfg = vr_oauth_cfg();

function vr_http_json($url) {
  $ctx = stream_context_create(['http' => ['timeout' => 10]]);
  $r = @file_get_contents($url, false, $ctx);
  if (!$r) return null;
  return json_decode($r, true);
}

$name = $email = $avatar = '';
if ($provider === 'google') {
  if (empty($cfg['google_client_id'])) vr_fail('Google not configured', 501);
  $tok = (string)($b['id_token'] ?? '');
  if ($tok === '') vr_fail('Missing token', 400);
  $info = vr_http_json('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($tok));
  if (!$info || ($info['aud'] ?? '') !== $cfg['google_client_id'] || empty($info['email'])) vr_fail('Invalid Google token', 401);
  $email = trim($info['email']); $name = trim($info['name'] ?? explode('@', $email)[0]); $avatar = $info['picture'] ?? '';
} elseif ($provider === 'facebook') {
  if (empty($cfg['facebook_app_id'])) vr_fail('Facebook not configured', 501);
  $tok = (string)($b['access_token'] ?? '');
  if ($tok === '') vr_fail('Missing token', 400);
  $me = vr_http_json('https://graph.facebook.com/me?fields=id,name,email,picture&access_token=' . urlencode($tok));
  if (!$me || empty($me['id'])) vr_fail('Invalid Facebook token', 401);
  // Confirm token belongs to our app
  $dbg = vr_http_json('https://graph.facebook.com/debug_token?input_token=' . urlencode($tok) . '&access_token=' . urlencode($cfg['facebook_app_id'] . '|' . $cfg['facebook_app_secret']));
  if (!$dbg || ($dbg['data']['app_id'] ?? '') !== $cfg['facebook_app_id'] || ($dbg['data']['user_id'] ?? '') !== $me['id']) vr_fail('Invalid Facebook token', 401);
  if (empty($me['email'])) vr_fail('Facebook email permission required', 400);
  $email = trim($me['email']); $name = trim($me['name'] ?? explode('@', $email)[0]); $avatar = $me['picture']['data']['url'] ?? '';
} else {
  vr_fail('Provider not supported (Google/Facebook)', 400);
}

$st = $pdo->prepare('SELECT * FROM users WHERE email=?');
$st->execute([$email]);
$u = $st->fetch();
if (!$u) {
  $role = ($b['role'] ?? 'client') === 'company' ? 'company' : 'client';
  try {
    $st = $pdo->prepare("INSERT INTO users (name,email,pass_hash,points,role,avatar,provider) VALUES (?,?,'',350,?,?,?)");
    $st->execute([$name, $email, $role, $avatar, $provider]);
  } catch (Exception $e) {
    $st = $pdo->prepare("INSERT INTO users (name,email,pass_hash,points) VALUES (?,?,'',350)");
    $st->execute([$name, $email]);
  }
  $u = $pdo->query('SELECT * FROM users WHERE id=' . (int)$pdo->lastInsertId())->fetch();
}
$tok = vr_issue_token($pdo, (int)$u['id']);
try { $pdo->prepare('UPDATE users SET email_verified=1 WHERE id=?')->execute([(int)$u['id']]); } catch (Exception $e) {}
$u = $pdo->query('SELECT * FROM users WHERE id=' . (int)$u['id'])->fetch();
vr_ok(['token' => $tok, 'user' => vr_public_user($u)]);
