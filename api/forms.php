<?php
require __DIR__ . '/config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$kind = ($b['kind'] ?? 'contact') === 'partner' ? 'partner' : 'contact';
if ($kind === 'partner') {
  $row = [substr(trim($b['agency'] ?? $b['name'] ?? ''), 0, 150), substr(trim($b['city'] ?? ''), 0, 80),
    substr(trim($b['phone'] ?? ''), 0, 40), (int)($b['cars'] ?? 0), substr(trim($b['address'] ?? ''), 0, 255), substr(trim($b['message'] ?? ''), 0, 2000)];
  try {
    $pdo->prepare('INSERT INTO partner_apps (agency,city,phone,cars,address,message) VALUES (?,?,?,?,?,?)')->execute($row);
  } catch (Exception $e) {
    // DB without the map migration: store address inside message
    $row[5] = '[Adresse: ' . $row[4] . '] ' . $row[5];
    $pdo->prepare('INSERT INTO partner_apps (agency,city,phone,cars,message) VALUES (?,?,?,?,?)')->execute([$row[0], $row[1], $row[2], $row[3], $row[5]]);
  }
} else {
  $pdo->prepare('INSERT INTO messages (name,contact,message) VALUES (?,?,?)')->execute([
    substr(trim($b['name'] ?? ''), 0, 120), substr(trim($b['contact'] ?? $b['email'] ?? ''), 0, 190),
    substr(trim($b['message'] ?? ''), 0, 3000)]);
}
vr_ok(['saved' => true]);
