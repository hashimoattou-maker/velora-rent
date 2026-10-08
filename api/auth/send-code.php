<?php
// Send 6-digit email verification code (10 min expiry, 1/min rate limit). Uses PHP mail().
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$b = vr_body();
$email = trim($b['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) vr_fail('Invalid email');

$pdo->exec('CREATE TABLE IF NOT EXISTS email_codes (email VARCHAR(190) PRIMARY KEY, code CHAR(6) NOT NULL, expires_at DATETIME NOT NULL, attempts INT NOT NULL DEFAULT 0, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');

$st = $pdo->prepare('SELECT updated_at FROM email_codes WHERE email=?');
$st->execute([$email]);
if ($row = $st->fetch()) {
  if (strtotime($row['updated_at']) > time() - 60) vr_fail('wait_60s', 429);
}

$code = str_pad((string)random_int(0, 999999), 6, '0', STR_PAD_LEFT);
$st = $pdo->prepare('REPLACE INTO email_codes (email,code,expires_at,attempts) VALUES (?,?,DATE_ADD(NOW(), INTERVAL 10 MINUTE),0)');
$st->execute([$email, $code]);

$host = $_SERVER['HTTP_HOST'] ?? 'velora-rent.ma';
$from = 'Velora Rent <noreply@' . preg_replace('/^www\./', '', $host) . '>';
$subject = 'Velora Rent — ' . $code . ' رمز التحقق / code';
$body = '<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;border:1px solid #eee;border-radius:16px;padding:28px;text-align:center">'
  . '<h2>Velora Rent</h2><p>رمز التحقق الخاص بك / Votre code de vérification :</p>'
  . '<div style="font-size:42px;font-weight:900;letter-spacing:12px;color:#4f46e5">' . $code . '</div>'
  . '<p style="color:#888">صالح لمدة 10 دقائق • Valable 10 minutes</p></div>';
$headers = "MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\nFrom: $from\r\n";
$sent = @mail($email, $subject, $body, $headers);
if (!$sent) vr_fail('mail_failed', 500);
vr_ok(['sent' => true]);
