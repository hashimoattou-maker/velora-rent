<?php
// Update own profile (name/phone/city).
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$b = vr_body();
$sets = []; $args = [];
foreach (['name' => 120, 'phone' => 40, 'city' => 80] as $k => $mx) {
  if (array_key_exists($k, $b)) { $sets[] = "$k=?"; $args[] = substr(trim((string)$b[$k]), 0, $mx); }
}
if (!$sets) vr_fail('Nothing to update');
$args[] = $u['id'];
$pdo->prepare('UPDATE users SET ' . implode(',', $sets) . ' WHERE id=?')->execute($args);
$nu = $pdo->query('SELECT * FROM users WHERE id=' . (int)$u['id'])->fetch();
vr_ok(['user' => vr_public_user($nu)]);
