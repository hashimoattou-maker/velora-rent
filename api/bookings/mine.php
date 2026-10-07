<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$st = $pdo->prepare('SELECT code,car_slug,car_label AS car,city,start_date AS `start`,end_date AS `end`,days,total,pay,status,created_at FROM bookings WHERE user_id=? AND status != \'cancelled\' ORDER BY created_at DESC');
$st->execute([$u['id']]);
vr_ok(['bookings' => $st->fetchAll()]);
