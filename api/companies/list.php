<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
vr_ok(['companies' => $pdo->query('SELECT * FROM companies ORDER BY rating DESC')->fetchAll()]);
