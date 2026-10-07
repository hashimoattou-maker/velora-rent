<?php
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$name = trim($b['name'] ?? ''); $email = trim($b['email'] ?? '');
$pass = $b['pass'] ?? ''; $phone = trim($b['phone'] ?? '');
$city = trim($b['city'] ?? ''); $cin = trim($b['cin'] ?? ''); $lic = trim($b['license'] ?? '');
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) vr_fail('Invalid name/email (min 6-char password)');
$st = $pdo->prepare('SELECT id FROM users WHERE email=?');
$st->execute([$email]);
if ($st->fetch()) vr_fail('Email already registered', 409);
$st = $pdo->prepare('INSERT INTO users (name,email,phone,city,cin,license_no,pass_hash,points) VALUES (?,?,?,?,?,?,?,350)');
$st->execute([$name, $email, $phone, $city, $cin, $lic, password_hash($pass, PASSWORD_DEFAULT)]);
$uid = (int)$pdo->lastInsertId();
$tok = vr_issue_token($pdo, $uid);
$u = $pdo->query("SELECT * FROM users WHERE id=$uid")->fetch();
vr_ok(['token' => $tok, 'user' => vr_public_user($u)]);
