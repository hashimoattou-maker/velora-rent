<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
$b = vr_body();
$where = ['active=1']; $args = [];
if (!empty($b['city'])) { $where[] = 'city=?'; $args[] = $b['city']; }
if (!empty($b['type'])) { $where[] = 'type=?'; $args[] = $b['type']; }
if (!empty($b['max'])) { $where[] = 'price<=?'; $args[] = (int)$b['max']; }
if (!empty($b['q'])) { $where[] = '(brand LIKE ? OR model LIKE ?)'; $args[] = '%' . $b['q'] . '%'; $args[] = '%' . $b['q'] . '%'; }
$sort = ($b['sort'] ?? '') === 'price' ? 'price ASC' : 'rating DESC';
$st = $pdo->prepare('SELECT * FROM cars WHERE ' . implode(' AND ', $where) . " ORDER BY $sort");
$st->execute($args);
$cars = array_map(function ($c) {
  $c['tags'] = $c['tags'] !== '' ? explode(',', $c['tags']) : [];
  $c['price'] = (int)$c['price']; $c['seats'] = (int)$c['seats'];
  $c['rating'] = (float)$c['rating']; $c['trips'] = (int)$c['trips']; $c['id'] = $c['slug'];
  return $c;
}, $st->fetchAll());
vr_ok(['cars' => $cars]);
