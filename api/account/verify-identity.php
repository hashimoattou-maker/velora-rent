<?php
// Submit KYC for admin review (requires the 3 documents). Admin approves via dashboard.
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$st = $pdo->prepare('SELECT id_front,id_back,license_img FROM users WHERE id=?');
$st->execute([$u['id']]);
$d = $st->fetch();
if (!$d || !$d['id_front'] || !$d['id_back'] || !$d['license_img']) vr_fail('docs_missing');
try {
  $pdo->prepare("UPDATE users SET identity_status='pending' WHERE id=?")->execute([$u['id']]);
} catch (Exception $e) { vr_fail('migrate_first (update-kyc.sql)'); }
vr_ok(['status' => 'pending']);
