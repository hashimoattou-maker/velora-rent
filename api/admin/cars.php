<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
try { $pdo->exec('ALTER TABLE cars ADD COLUMN IF NOT EXISTS owner_user_id INT UNSIGNED NULL'); } catch (Exception $e) {}

function vr_slug($pdo, $brand, $model) {
  $base = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', $brand . '-' . $model), '-'));
  if ($base === '') $base = 'car';
  do {
    $slug = substr($base, 0, 40) . '-' . substr(bin2hex(random_bytes(3)), 0, 4);
    $st = $pdo->prepare('SELECT slug FROM cars WHERE slug=?');
    $st->execute([$slug]);
  } while ($st->fetch());
  return $slug;
}
$FIELDS = ['brand', 'model', 'year', 'type', 'price', 'seats', 'gear', 'fuel', 'city', 'company', 'img', 'tags', 'active', 'rating', 'trips'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $action = $b['action'] ?? 'update';
  if ($action === 'create') {
    $slug = vr_slug($pdo, $b['brand'] ?? '', $b['model'] ?? '');
    $vals = [$slug];
    foreach (['brand', 'model'] as $k) $vals[] = substr(trim($b[$k] ?? ''), 0, 80);
    $vals[] = (int)($b['year'] ?? date('Y'));
    $vals[] = substr(trim($b['type'] ?? 'Berline'), 0, 40);
    $vals[] = max(50, (int)($b['price'] ?? 200));
    $vals[] = (int)($b['seats'] ?? 5);
    $vals[] = substr(trim($b['gear'] ?? 'Manuelle'), 0, 20);
    $vals[] = substr(trim($b['fuel'] ?? 'Diesel'), 0, 20);
    $vals[] = substr(trim($b['city'] ?? ''), 0, 80);
    $vals[] = substr(trim($b['company'] ?? ''), 0, 120);
    $vals[] = substr(trim($b['img'] ?? ''), 0, 500);
    $vals[] = substr(trim($b['tags'] ?? ''), 0, 200);
    $vals[] = !empty($b['active']) ? 1 : 1;
    $st = $pdo->prepare('INSERT INTO cars (slug,brand,model,year,type,price,seats,gear,fuel,city,company,img,tags,active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
    $st->execute($vals);
    vr_ok(['slug' => $slug]);
  }
  if ($action === 'delete') {
    $slug = preg_replace('/[^a-z0-9-]/', '', $b['slug'] ?? '');
    $pdo->prepare('DELETE FROM cars WHERE slug=?')->execute([$slug]);
    vr_ok(['deleted' => true]);
  }
  // update
  $slug = preg_replace('/[^a-z0-9-]/', '', $b['slug'] ?? '');
  $sets = []; $args = [];
  foreach ($FIELDS as $k) {
    if (array_key_exists($k, $b)) {
      $sets[] = "$k=?";
      $v = $b[$k];
      if (in_array($k, ['price', 'seats', 'year'], true)) $v = (int)$v;
      elseif ($k === 'active') $v = !empty($v) ? 1 : 0;
      elseif ($k === 'rating') $v = (float)$v;
      elseif ($k === 'trips') $v = (int)$v;
      else $v = substr(trim((string)$v), 0, 500);
      $args[] = $v;
    }
  }
  if (!$sets || $slug === '') vr_fail('Nothing to update');
  $args[] = $slug;
  $st = $pdo->prepare('UPDATE cars SET ' . implode(',', $sets) . ' WHERE slug=?');
  $st->execute($args);
  vr_ok(['updated' => $st->rowCount() > 0]);
}
vr_ok(['cars' => $pdo->query('SELECT * FROM cars ORDER BY brand,model')->fetchAll()]);
