<?php
// Admin: send a test email, return the DETAILED result (for SMTP debugging).
require __DIR__ . '/_guard.php';
require __DIR__ . '/../lib/mailer.php';
vr_require_method('POST');
$pdo = vr_db();
vr_admin($pdo);
$b = vr_body();
$to = trim($b['to'] ?? '');
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) vr_fail('Invalid email');
$c = vr_mail_cfg();
$info = ['host' => $c['host'], 'port' => $c['port'], 'user_set' => $c['user'] !== '', 'pass_set' => $c['pass'] !== '', 'from' => $c['from']];
if (empty($c['host']) || empty($c['user']) || empty($c['pass'])) vr_fail('smtp_not_configured', 400, ['cfg' => $info]);
$html = '<div style="font-family:Arial;padding:20px"><h2>Velora Rent — test email ✅</h2><p>Si tu lis ceci, SMTP marche.</p></div>';
try {
  $ok = vr_smtp_send($to, 'Velora Rent — test', $html);
  vr_ok(['sent' => $ok, 'via' => 'smtp', 'cfg' => $info]);
} catch (Exception $e) {
  vr_fail('smtp_error: ' . $e->getMessage(), 500, ['cfg' => $info]);
}
