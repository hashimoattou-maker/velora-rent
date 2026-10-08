<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $status = in_array($b['status'] ?? '', ['verified', 'rejected'], true) ? $b['status'] : 'pending';
  $st = $pdo->prepare('UPDATE users SET identity_status=?, identity_verified=? WHERE id=?');
  $st->execute([$status, $status === 'verified' ? 1 : 0, (int)($b['user_id'] ?? 0)]);
  vr_ok(['updated' => $st->rowCount() > 0]);
}
vr_ok(['kyc' => $pdo->query("SELECT id,name,email,phone,identity_status,id_front,id_back,license_img,created_at FROM users WHERE identity_status IN ('pending','verified','rejected') ORDER BY FIELD(identity_status,'pending','rejected','verified'), id DESC LIMIT 100")->fetchAll()]);
