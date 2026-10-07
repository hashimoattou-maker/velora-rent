<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
$b = vr_body();
$slug = preg_replace('/[^a-z0-9-]/', '', $b['slug'] ?? $b['id'] ?? '');
$st = $pdo->prepare('SELECT * FROM cars WHERE slug=? AND active=1');
$st->execute([$slug]);
$c = $st->fetch();
if (!$c) vr_fail('Car not found', 404);
$c['tags'] = $c['tags'] !== '' ? explode(',', $c['tags']) : [];
$c['id'] = $c['slug'];
vr_ok(['car' => $c]);
