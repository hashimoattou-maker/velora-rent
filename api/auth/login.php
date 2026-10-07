<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$email = trim($b['email'] ?? ''); $pass = $b['pass'] ?? '';
$st = $pdo->prepare('SELECT * FROM users WHERE email=?');
$st->execute([$email]);
$u = $st->fetch();
if (!$u || !password_verify($pass, $u['pass_hash'])) vr_fail('Invalid email or password', 401);
$tok = vr_issue_token($pdo, (int)$u['id']);
vr_ok(['token' => $tok, 'user' => vr_public_user($u)]);
