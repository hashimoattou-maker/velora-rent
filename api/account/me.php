<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$st = $pdo->prepare('SELECT code,amount,used FROM gift_cards WHERE user_id=? ORDER BY created_at DESC');
$st->execute([$u['id']]);
vr_ok(['user' => vr_public_user($pdo->query('SELECT * FROM users WHERE id=' . (int)$u['id'])->fetch()), 'gifts' => $st->fetchAll()]);
