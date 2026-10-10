<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $id = (int)($b['id'] ?? 0);
  if ($id <= 0) vr_fail('Bad id');
  if (($b['action'] ?? '') === 'delete') {
    $pdo->prepare('DELETE FROM users WHERE id=?')->execute([$id]);
    vr_ok(['deleted' => true]);
  }
  $sets = []; $args = [];
  foreach (['name' => 120, 'phone' => 40, 'city' => 80, 'points' => 0] as $k => $mx) {
    if (array_key_exists($k, $b)) {
      $sets[] = "$k=?";
      $args[] = $k === 'points' ? max(0, (int)$b[$k]) : substr(trim((string)$b[$k]), 0, $mx);
    }
  }
  if (!$sets) vr_fail('Nothing to update');
  $args[] = $id;
  $st = $pdo->prepare('UPDATE users SET ' . implode(',', $sets) . ' WHERE id=?');
  $st->execute($args);
  vr_ok(['updated' => true]);
}
vr_ok(['users' => $pdo->query('SELECT id,name,email,phone,city,points,identity_verified,role,agency,created_at FROM users ORDER BY id DESC LIMIT 200')->fetchAll()]);
