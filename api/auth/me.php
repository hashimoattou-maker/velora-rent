<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
vr_ok(['user' => vr_public_user($u)]);
