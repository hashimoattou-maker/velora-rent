<?php
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
$stats = [
  'users' => (int)$pdo->query('SELECT COUNT(*) c FROM users')->fetch()['c'],
  'bookings' => (int)$pdo->query("SELECT COUNT(*) c FROM bookings WHERE status != 'cancelled'")->fetch()['c'],
  'revenue' => (int)($pdo->query("SELECT COALESCE(SUM(total),0) s FROM bookings WHERE status='paid'")->fetch()['s']),
  'pending' => (int)$pdo->query("SELECT COUNT(*) c FROM bookings WHERE status='pending'")->fetch()['c'],
  'messages' => (int)$pdo->query('SELECT COUNT(*) c FROM messages')->fetch()['c'],
  'partners' => (int)$pdo->query('SELECT COUNT(*) c FROM partner_apps')->fetch()['c'],
];
$recent = $pdo->query('SELECT code,car_label,city,start_date,end_date,days,total,status,created_at FROM bookings ORDER BY created_at DESC LIMIT 8')->fetchAll();
vr_ok(['stats' => $stats, 'recent' => $recent]);
