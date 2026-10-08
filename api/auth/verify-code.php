<?php
// Verify email code → marks user verified + returns login token.
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$email = trim($b['email'] ?? '');
$code = preg_replace('/\D/', '', (string)($b['code'] ?? ''));
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($code) !== 6) vr_fail('Invalid code');
$st = $pdo->prepare('SELECT * FROM email_codes WHERE email=?');
$st->execute([$email]);
$row = $st->fetch();
if (!$row) vr_fail('code_expired');
if (strtotime($row['expires_at']) < time()) { $pdo->prepare('DELETE FROM email_codes WHERE email=?')->execute([$email]); vr_fail('code_expired'); }
if ((int)$row['attempts'] >= 5) vr_fail('too_many');
if (!hash_equals($row['code'], $code)) {
  $pdo->prepare('UPDATE email_codes SET attempts=attempts+1 WHERE email=?')->execute([$email]);
  vr_fail('code_wrong');
}
$pdo->prepare('DELETE FROM email_codes WHERE email=?')->execute([$email]);
$st = $pdo->prepare('SELECT * FROM users WHERE email=?');
$st->execute([$email]);
$u = $st->fetch();
if (!$u) vr_fail('no_account');
try { $pdo->prepare('UPDATE users SET email_verified=1 WHERE id=?')->execute([$u['id']]); } catch (Exception $e) {}
$tok = vr_issue_token($pdo, (int)$u['id']);
$u = $pdo->query('SELECT * FROM users WHERE id=' . (int)$u['id'])->fetch();
vr_ok(['token' => $tok, 'user' => vr_public_user($u)]);
