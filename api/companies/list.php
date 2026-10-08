<?php
require __DIR__ . '/../config.php';
$pdo = vr_db();
try {
  $rows = $pdo->query('SELECT * FROM companies ORDER BY rating DESC')->fetchAll();
} catch (Exception $e) {
  $rows = $pdo->query('SELECT id,name,city,cars,rating,phone,img FROM companies ORDER BY rating DESC')->fetchAll();
}
vr_ok(['companies' => $rows]);
