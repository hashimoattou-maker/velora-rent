<?php
// SMTP mailer (pure PHP, no dependencies) with mail() fallback.
// Config priority: DB settings (admin) → env → mail() fallback.
function vr_mail_cfg() {
  $c = ['host' => getenv('VR_SMTP_HOST') ?: '', 'port' => getenv('VR_SMTP_PORT') ?: '587',
    'user' => getenv('VR_SMTP_USER') ?: '', 'pass' => getenv('VR_SMTP_PASS') ?: '', 'from' => getenv('VR_SMTP_FROM') ?: ''];
  try {
    $h = getenv('VR_DB_HOST') ?: 'localhost';
    $f = __DIR__ . '/.db.php';
    $db = ['host' => $h, 'name' => getenv('VR_DB_NAME') ?: '', 'user' => getenv('VR_DB_USER') ?: '', 'pass' => getenv('VR_DB_PASS') ?: ''];
    if (file_exists($f) && function_exists('vr_parse_php_array')) {
      $o = vr_parse_php_array($f, ['host', 'name', 'user', 'pass']);
      if (is_array($o)) $db = array_merge($db, array_filter($o));
    }
    if (!empty($db['name']) && !empty($db['user'])) {
      $pdo = new PDO("mysql:host={$db['host']};dbname={$db['name']};charset=utf8mb4", $db['user'], $db['pass'], [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
      $map = ['smtp_host' => 'host', 'smtp_port' => 'port', 'smtp_user' => 'user', 'smtp_pass' => 'pass', 'smtp_from' => 'from'];
      foreach ($pdo->query("SELECT `k`,`v` FROM settings WHERE `k` LIKE 'smtp_%'") as $r) {
        if (isset($map[$r['k']]) && $r['v'] !== '') $c[$map[$r['k']]] = $r['v'];
      }
    }
  } catch (Exception $e) {}
  return $c;
}

function vr_smtp_cmd($fp, $cmd, $expect = [250]) {
  if ($cmd !== null) fwrite($fp, $cmd . "\r\n");
  $resp = '';
  while (($line = fgets($fp, 512)) !== false) {
    $resp .= $line;
    if (preg_match('/^\d{3} /', $line)) break;
  }
  $code = (int)substr($resp, 0, 3);
  if (!in_array($code, (array)$expect, true)) throw new Exception('SMTP ' . trim($resp));
  return $resp;
}

function vr_smtp_send($to, $subject, $html) {
  $c = vr_mail_cfg();
  if (empty($c['host']) || empty($c['user'])) return false; // not configured → caller falls back
  $from = $c['from'] !== '' ? $c['from'] : $c['user'];
  $port = (int)($c['port'] ?: 587);
  $scheme = $port === 465 ? 'ssl://' : 'tcp://';
  $fp = @stream_socket_client($scheme . $c['host'] . ':' . $port, $errno, $errstr, 15);
  if (!$fp) throw new Exception('smtp_connect');
  stream_set_timeout($fp, 15);
  $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
  try {
    vr_smtp_cmd($fp, null, [220]);
    vr_smtp_cmd($fp, 'EHLO ' . $host);
    if ($port === 587) {
      vr_smtp_cmd($fp, 'STARTTLS', [220]);
      if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) throw new Exception('tls');
      vr_smtp_cmd($fp, 'EHLO ' . $host);
    }
    vr_smtp_cmd($fp, 'AUTH LOGIN', [334]);
    vr_smtp_cmd($fp, base64_encode($c['user']), [334]);
    vr_smtp_cmd($fp, base64_encode($c['pass']), [235]);
    $fromAddr = preg_match('/<(.+)>/', $from, $m) ? $m[1] : $from;
    vr_smtp_cmd($fp, "MAIL FROM:<$fromAddr>");
    vr_smtp_cmd($fp, "RCPT TO:<$to>", [250, 251]);
    vr_smtp_cmd($fp, 'DATA', [354]);
    $headers = "From: $from\r\nTo: <$to>\r\nSubject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\nMIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\n";
    fwrite($fp, $headers . "\r\n" . $html . "\r\n.\r\n");
    $resp = fgets($fp, 512);
    if ((int)substr($resp, 0, 3) !== 250) throw new Exception('smtp_data');
    fwrite($fp, "QUIT\r\n");
    fclose($fp);
    return true;
  } catch (Exception $e) {
    fclose($fp);
    throw $e;
  }
}

function vr_send_mail($to, $subject, $html) {
  try {
    if (vr_smtp_send($to, $subject, $html)) return true;
  } catch (Exception $e) {
    error_log('SMTP failed: ' . $e->getMessage());
  }
  // fallback: PHP mail()
  $host = $_SERVER['HTTP_HOST'] ?? 'velora-rent.ma';
  $from = 'Velora Rent <noreply@' . preg_replace('/^www\./', '', $host) . '>';
  $headers = "MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\nFrom: $from\r\n";
  return @mail($to, $subject, $html, $headers);
}
