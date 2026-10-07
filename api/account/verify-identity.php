<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
// Demo KYC: mark verified (in production, check uploaded CIN/license here)
$pdo->prepare('UPDATE users SET identity_verified=1 WHERE id=?')->execute([$u['id']]);
vr_ok(['verified' => true]);
