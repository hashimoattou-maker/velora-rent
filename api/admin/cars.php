<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $slug = preg_replace('/[^a-z0-9-]/', '', $b['slug'] ?? '');
  $sets = []; $args = [];
  if (isset($b['price'])) { $sets[] = 'price=?'; $args[] = max(50, (int)$b['price']); }
  if (isset($b['active'])) { $sets[] = 'active=?'; $args[] = !empty($b['active']) ? 1 : 0; }
  if (!$sets || $slug === '') vr_fail('Nothing to update');
  $args[] = $slug;
  $st = $pdo->prepare('UPDATE cars SET ' . implode(',', $sets) . ' WHERE slug=?');
  $st->execute($args);
  vr_ok(['updated' => $st->rowCount() > 0]);
}
vr_ok(['cars' => $pdo->query('SELECT slug,brand,model,price,city,active,rating FROM cars ORDER BY brand,model')->fetchAll()]);
