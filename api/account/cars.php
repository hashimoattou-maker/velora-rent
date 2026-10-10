<?php
// Agency fleet: company users manage ONLY their own cars (owner or same agency name).
require __DIR__ . '/../config.php';
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
try { $pdo->exec('ALTER TABLE cars ADD COLUMN IF NOT EXISTS owner_user_id INT UNSIGNED NULL'); } catch (Exception $e) {}
$isAgency = (($u['role'] ?? 'client') === 'company');
$agency = trim($u['agency'] ?? '');

function vr_own_clause($u, $isAgency, $agency) {
  if ($isAgency && $agency !== '') return ['(owner_user_id=? OR company=?)', [(int)$u['id'], $agency]];
  return ['owner_user_id=?', [(int)$u['id']]];
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
  [$w, $a] = vr_own_clause($u, $isAgency, $agency);
  $st = $pdo->prepare("SELECT * FROM cars WHERE $w ORDER BY brand,model");
  $st->execute($a);
  vr_ok(['cars' => $st->fetchAll(), 'agency' => $agency, 'isAgency' => $isAgency]);
}

$b = vr_body();
$action = $b['action'] ?? '';
$slug = preg_replace('/[^a-z0-9-]/', '', $b['slug'] ?? '');

if ($action === 'create') {
  if (!$isAgency) vr_fail('Agencies only', 403);
  if ($agency === '') vr_fail('Agency name missing');
  $base = strtolower(trim(preg_replace('/[^a-z0-9]+/i', '-', ($b['brand'] ?? '') . '-' . ($b['model'] ?? '')), '-'));
  if ($base === '') $base = 'car';
  do {
    $slug = substr($base, 0, 40) . '-' . substr(bin2hex(random_bytes(3)), 0, 4);
    $st = $pdo->prepare('SELECT slug FROM cars WHERE slug=?');
    $st->execute([$slug]);
  } while ($st->fetch());
  $st = $pdo->prepare('INSERT INTO cars (slug,brand,model,year,type,price,seats,gear,fuel,city,company,img,tags,active,owner_user_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  $st->execute([$slug, substr(trim($b['brand'] ?? ''), 0, 60), substr(trim($b['model'] ?? ''), 0, 80),
    (int)($b['year'] ?? date('Y')), substr(trim($b['type'] ?? 'Berline'), 0, 40), max(50, (int)($b['price'] ?? 200)),
    (int)($b['seats'] ?? 5), substr(trim($b['gear'] ?? 'Manuelle'), 0, 20), substr(trim($b['fuel'] ?? 'Diesel'), 0, 20),
    substr(trim($b['city'] ?? ''), 0, 80), $agency, substr(trim($b['img'] ?? ''), 0, 500),
    substr(trim($b['tags'] ?? ''), 0, 200), 1, (int)$u['id']]);
  vr_ok(['slug' => $slug]);
}

// update / delete: must own the car
[$w, $a] = vr_own_clause($u, $isAgency, $agency);
$st = $pdo->prepare("SELECT slug FROM cars WHERE slug=? AND $w");
$st->execute(array_merge([$slug], $a));
if (!$st->fetch()) vr_fail('Not yours', 403);

if ($action === 'delete') {
  $pdo->prepare('DELETE FROM cars WHERE slug=?')->execute([$slug]);
  vr_ok(['deleted' => true]);
}
$F = ['brand' => 60, 'model' => 80, 'year' => 0, 'type' => 40, 'price' => 0, 'seats' => 0, 'gear' => 20, 'fuel' => 20, 'city' => 80, 'img' => 500, 'tags' => 200, 'active' => 0];
$sets = []; $args = [];
foreach ($F as $k => $mx) {
  if (!array_key_exists($k, $b)) continue;
  $sets[] = "$k=?";
  $v = $b[$k];
  if (in_array($k, ['price', 'seats', 'year'], true)) $v = (int)$v;
  elseif ($k === 'active') $v = !empty($v) ? 1 : 0;
  else $v = substr(trim((string)$v), 0, $mx);
  $args[] = $v;
}
if (!$sets) vr_fail('Nothing to update');
$args[] = $slug;
$pdo->prepare('UPDATE cars SET ' . implode(',', $sets) . ' WHERE slug=?')->execute($args);
vr_ok(['updated' => true]);
