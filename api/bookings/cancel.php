<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$b = vr_body();
$code = preg_replace('/[^A-Z0-9-]/', '', $b['code'] ?? '');
$st = $pdo->prepare("UPDATE bookings SET status='cancelled' WHERE code=? AND user_id=?");
$st->execute([$code, $u['id']]);
vr_ok(['cancelled' => $st->rowCount() > 0]);
