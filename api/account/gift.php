<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$b = vr_body();
$amount = max(100, min(5000, (int)($b['amount'] ?? 500)));
$code = 'VELO-' . random_int(1000, 9999);
$st = $pdo->prepare('INSERT INTO gift_cards (code,user_id,amount) VALUES (?,?,?)');
$st->execute([$code, $u['id'], $amount]);
vr_ok(['code' => $code, 'amount' => $amount]);
