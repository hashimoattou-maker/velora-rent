<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $code = preg_replace('/[^A-Z0-9-]/', '', $b['code'] ?? '');
  $status = in_array($b['status'] ?? '', ['paid', 'pending', 'cancelled'], true) ? $b['status'] : 'pending';
  $st = $pdo->prepare('UPDATE bookings SET status=? WHERE code=?');
  $st->execute([$status, $code]);
  vr_ok(['updated' => $st->rowCount() > 0]);
}
$b = vr_body();
$where = ''; $args = [];
if (!empty($b['status']) && in_array($b['status'], ['paid', 'pending', 'cancelled'], true)) { $where = 'WHERE b.status=?'; $args[] = $b['status']; }
$lim = max(10, min(200, (int)($b['limit'] ?? 50)));
$st = $pdo->prepare("SELECT b.*, u.name AS client, u.phone FROM bookings b LEFT JOIN users u ON u.id=b.user_id $where ORDER BY b.created_at DESC LIMIT $lim");
$st->execute($args);
vr_ok(['bookings' => $st->fetchAll()]);
