<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
vr_ok(['users' => $pdo->query('SELECT id,name,email,phone,city,points,identity_verified,created_at FROM users ORDER BY id DESC LIMIT 200')->fetchAll()]);
