<?php
require __DIR__ . '/_guard.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$key = vr_admin_key();
if ($key === '') vr_fail('Admin not configured: create api/admin/.admin.php', 500);
if (!hash_equals($key, (string)($b['key'] ?? ''))) vr_fail('Invalid key', 401);
vr_admin_ensure($pdo);
$tok = bin2hex(random_bytes(32));
$pdo->prepare('INSERT INTO admin_tokens (token, expires_at) VALUES (?, DATE_ADD(NOW(), INTERVAL 1 DAY))')->execute([$tok]);
$pdo->query('DELETE FROM admin_tokens WHERE expires_at <= NOW()');
vr_ok(['token' => $tok]);
