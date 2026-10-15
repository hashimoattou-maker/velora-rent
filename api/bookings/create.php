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
if ($d2 <= $d1) vr_fail('Invalid dates');
$days = max(1, (int)$d1->diff($d2)->format('%a'));
$total = $days * (int)$car['price'];
if (!empty($b['gps'])) $total += $days * 40;
if (!empty($b['baby'])) $total += $days * 30;
$ins = ($b['insurance'] ?? '') === 'full' ? 'full' : 'none';
if (!isset($b['insurance']) && (!isset($b['full']) || !empty($b['full']))) $ins = 'full';
if ($ins === 'full') $total += $days * 99;
// Gift card: must belong to user and be unused
$discount = 0; $giftCode = strtoupper(trim($b['gift_code'] ?? ''));
if ($giftCode !== '') {
  $st = $pdo->prepare('SELECT * FROM gift_cards WHERE user_id=? AND UPPER(code)=? AND used=0');
  $st->execute([$u['id'], $giftCode]);
  $g = $st->fetch();
  if (!$g) vr_fail('gift_invalid');
  $discount = min((int)$g['amount'], $total);
  $total -= $discount;
  $pdo->prepare('UPDATE gift_cards SET used=1 WHERE code=?')->execute([$g['code']]);
}
$method = in_array($b['pay_method'] ?? '', ['cash', 'card', 'transfer'], true) ? $b['pay_method'] : (($b['pay'] ?? 'cash') === 'now' ? 'card' : 'cash');
$pay = $method === 'card' ? 'now' : 'cash';
$status = $method === 'card' ? 'paid' : 'pending';
$code = 'VR-' . strtoupper(substr(bin2hex(random_bytes(4)), 0, 6));
$full = [
  $code, $u['id'], $slug, $car['brand'] . ' ' . $car['model'], $car['city'],
  $d1->format('Y-m-d'), $d2->format('Y-m-d'), $days, $total, $pay, $status,
  substr(trim($b['full_name'] ?? $u['name'] ?? ''), 0, 120), substr(trim($b['phone'] ?? $u['phone'] ?? ''), 0, 40),
  substr(trim($b['email'] ?? $u['email'] ?? ''), 0, 190), substr(trim($b['idnum'] ?? ''), 0, 60),
  substr(trim($b['pickup'] ?? ''), 0, 120), substr(trim($b['dropoff'] ?? ''), 0, 120),
  !empty($b['driver2']) ? 1 : 0, substr(trim($b['driver2_name'] ?? ''), 0, 120),
  $ins, $method, $giftCode, $discount, substr(trim($b['notes'] ?? ''), 0, 2000),
];
try {
  $st = $pdo->prepare('INSERT INTO bookings (code,user_id,car_slug,car_label,city,start_date,end_date,days,total,pay,status,full_name,phone,email,id_number,pickup,dropoff,driver2,driver2_name,insurance,pay_method,gift_code,gift_discount,notes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
  $st->execute($full);
} catch (Exception $e) {
  // DB without the details migration: legacy insert still works
  $st = $pdo->prepare('INSERT INTO bookings (code,user_id,car_slug,car_label,city,start_date,end_date,days,total,pay,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)');
  $st->execute(array_slice($full, 0, 11));
}
$pdo->prepare('UPDATE users SET points=points+? WHERE id=?')->execute([$total, $u['id']]);
vr_ok(['code' => $code, 'total' => $total, 'days' => $days, 'status' => $status, 'discount' => $discount, 'pay_method' => $method]);
