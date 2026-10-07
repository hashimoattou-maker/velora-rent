<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
vr_ok([
  'messages' => $pdo->query('SELECT * FROM messages ORDER BY id DESC LIMIT 100')->fetchAll(),
  'partners' => $pdo->query('SELECT * FROM partner_apps ORDER BY id DESC LIMIT 100')->fetchAll(),
]);
