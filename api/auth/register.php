<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$name = trim($b['name'] ?? ''); $email = trim($b['email'] ?? '');
$pass = $b['pass'] ?? ''; $phone = trim($b['phone'] ?? '');
$city = trim($b['city'] ?? ''); $cin = trim($b['cin'] ?? ''); $lic = trim($b['license'] ?? '');
$role = ($b['role'] ?? 'client') === 'company' ? 'company' : 'client';
$agency = substr(trim($b['agency'] ?? ''), 0, 150);
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) vr_fail('Invalid name/email (min 6-char password)');
if ($role === 'company' && $agency === '') vr_fail('Agency name required');
$st = $pdo->prepare('SELECT id FROM users WHERE email=?');
$st->execute([$email]);
if ($st->fetch()) vr_fail('Email already registered', 409);
try {
  $st = $pdo->prepare('INSERT INTO users (name,email,phone,city,cin,license_no,pass_hash,points,role,agency) VALUES (?,?,?,?,?,?,?,350,?,?)');
  $st->execute([$name, $email, $phone, $city, $cin, $lic, password_hash($pass, PASSWORD_DEFAULT), $role, $agency]);
} catch (Exception $e) {
  // DB without accounts migration yet
  $st = $pdo->prepare('INSERT INTO users (name,email,phone,city,cin,license_no,pass_hash,points) VALUES (?,?,?,?,?,?,?,350)');
  $st->execute([$name, $email, $phone, $city, $cin, $lic, password_hash($pass, PASSWORD_DEFAULT)]);
}
$uid = (int)$pdo->lastInsertId();
if ($role === 'company') {
  try {
    $pdo->prepare('INSERT INTO partner_apps (agency,city,phone,cars,address,message) VALUES (?,?,?,?,?,?)')->execute([
      $agency, $city, $phone, (int)($b['cars'] ?? 0), substr(trim($b['address'] ?? ''), 0, 255), 'Inscription via site (compte agence).']);
  } catch (Exception $e) {}
}
$tok = vr_issue_token($pdo, $uid);
$u = $pdo->query("SELECT * FROM users WHERE id=$uid")->fetch();
vr_ok(['token' => $tok, 'user' => vr_public_user($u)]);
