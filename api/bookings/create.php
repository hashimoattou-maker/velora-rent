<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
$b = vr_body();
$slug = preg_replace('/[^a-z0-9-]/', '', $b['car_slug'] ?? $b['id'] ?? '');
$st = $pdo->prepare('SELECT * FROM cars WHERE slug=? AND active=1');
$st->execute([$slug]);
$car = $st->fetch();
if (!$car) vr_fail('Car not found', 404);
try {
  $d1 = new DateTime($b['start']); $d2 = new DateTime($b['end']);
} catch (Exception $e) { vr_fail('Invalid dates'); }
$days = max(1, (int)$d1->diff($d2)->format('%a'));
$total = $days * (int)$car['price'];
if (!empty($b['gps'])) $total += $days * 40;
if (!empty($b['baby'])) $total += $days * 30;
if (!isset($b['full']) || !empty($b['full'])) $total += $days * 99;
$pay = ($b['pay'] ?? 'cash') === 'now' ? 'now' : 'cash';
$status = $pay === 'now' ? 'paid' : 'pending';
$code = 'VR-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
$st = $pdo->prepare('INSERT INTO bookings (code,user_id,car_slug,car_label,city,start_date,end_date,days,total,pay,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
$st->execute([$code, $u['id'], $slug, $car['brand'] . ' ' . $car['model'], $car['city'], $d1->format('Y-m-d'), $d2->format('Y-m-d'), $days, $total, $pay, $status]);
$pdo->prepare('UPDATE users SET points=points+? WHERE id=?')->execute([$total, $u['id']]);
vr_ok(['code' => $code, 'total' => $total, 'days' => $days, 'status' => $status]);
