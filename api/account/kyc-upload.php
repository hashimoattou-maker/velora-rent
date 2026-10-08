<?php
// KYC document upload: CIN front/back + driver's license. Images only, ≤5MB, stored in uploads/kyc/.
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);

$type = $_POST['type'] ?? '';
$col = ['front' => 'id_front', 'back' => 'id_back', 'license' => 'license_img'][$type] ?? null;
if (!$col) vr_fail('Bad type (front/back/license)');
if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) vr_fail('Upload failed');

$f = $_FILES['file'];
if ($f['size'] > 5 * 1024 * 1024) vr_fail('File too big (5MB max)');
$info = @getimagesize($f['tmp_name']);
$allowed = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
if (!$info || !isset($allowed[$info[2]])) vr_fail('Image only (JPG/PNG/WEBP)');

$dir = __DIR__ . '/../../uploads/kyc';
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) vr_fail('Storage error', 500);
@file_put_contents(dirname($dir) . '/.htaccess', "Options -Indexes\n");
@file_put_contents($dir . '/.htaccess', "Options -Indexes\n");
$name = 'u' . (int)$u['id'] . '_' . $type . '_' . bin2hex(random_bytes(6)) . '.' . $allowed[$info[2]];
if (!@move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) vr_fail('Storage error', 500);

$path = 'uploads/kyc/' . $name;
try {
  $pdo->prepare("UPDATE users SET $col=? WHERE id=?")->execute([$path, $u['id']]);
} catch (Exception $e) {
  // columns missing (migration not imported) — still report upload ok with path
  vr_ok(['path' => $path, 'migrated' => false]);
}
vr_ok(['path' => $path]);
