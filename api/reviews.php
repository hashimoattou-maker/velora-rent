<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $b = vr_body();
  $name = substr(trim($b['name'] ?? 'Anonyme'), 0, 120);
  $rating = max(1, min(5, (int)($b['rating'] ?? 5)));
  $text = substr(trim($b['text'] ?? ''), 0, 2000);
  if ($text === '') vr_fail('Empty review');
  $pdo->prepare('INSERT INTO reviews (name,rating,text) VALUES (?,?,?)')->execute([$name, $rating, $text]);
  vr_ok(['added' => true]);
}
vr_ok(['reviews' => $pdo->query('SELECT name AS n, rating AS s, text AS x FROM reviews ORDER BY id DESC LIMIT 24')->fetchAll()]);
