<?php
// Generic car-photo upload (logged users). Returns path for the car form.
require __DIR__ . '/../config.php';
vr_require_method('POST');
$pdo = vr_db();
$u = vr_user($pdo);
if (!$u) vr_fail('Unauthorized', 401);
if (empty($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) vr_fail('Upload failed');
$f = $_FILES['file'];
if ($f['size'] > 5 * 1024 * 1024) vr_fail('File too big (5MB max)');
$info = @getimagesize($f['tmp_name']);
$allowed = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'];
if (!$info || !isset($allowed[$info[2]])) vr_fail('Image only (JPG/PNG/WEBP)');
$dir = __DIR__ . '/../../uploads/cars';
if (!is_dir($dir) && !@mkdir($dir, 0755, true)) vr_fail('Storage error', 500);
@file_put_contents(dirname($dir) . '/.htaccess', "Options -Indexes\n");
$name = 'car_' . time() . '_' . bin2hex(random_bytes(5)) . '.' . $allowed[$info[2]];
if (!@move_uploaded_file($f['tmp_name'], $dir . '/' . $name)) vr_fail('Storage error', 500);
vr_ok(['path' => 'uploads/cars/' . $name]);
