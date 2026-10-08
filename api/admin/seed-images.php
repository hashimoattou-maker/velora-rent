<?php
// One-click sync of verified car photos (admin only). Safe: UPDATEs only.
require __DIR__ . '/_guard.php';
$pdo = vr_db();
vr_admin($pdo);
$map = [
  'dacia-logan' => 'https://upload.wikimedia.org/wikipedia/commons/0/02/2021_Dacia_Logan_III_%28rear%29.jpg',
  'dacia-duster' => 'https://unsplash.com/photos/1EFn8clp5Do/download?w=900&q=80',
  'clio-5' => 'https://unsplash.com/photos/lIxbWUJIxko/download?w=900&q=80',
  'peugeot-208' => 'https://unsplash.com/photos/1NwpPHILCFM/download?w=900&q=80',
  'golf-8' => 'https://unsplash.com/photos/wWZIm8vleB0/download?w=900&q=80',
  'tucson' => 'https://unsplash.com/photos/9TUHjKs81I8/download?w=900&q=80',
  'mercedes-c' => 'https://unsplash.com/photos/L0Y0YSmqiKM/download?w=900&q=80',
  'range-evoque' => 'https://unsplash.com/photos/soJS_Ce49AI/download?w=900&q=80',
  'toyota-hiace' => 'https://unsplash.com/photos/eEG5zGeftB8/download?w=900&q=80',
  'tesla-3' => 'https://unsplash.com/photos/L1_XWJ_bRSM/download?w=900&q=80',
  'kia-picanto' => 'https://unsplash.com/photos/lb4Ed7w7PJo/download?w=900&q=80',
  'bmw-x3' => 'https://unsplash.com/photos/c8BqSLr5xQg/download?w=900&q=80',
];
$st = $pdo->prepare('UPDATE cars SET img=? WHERE slug=?');
$n = 0;
foreach ($map as $slug => $img) { $st->execute([$img, $slug]); $n += $st->rowCount(); }
vr_ok(['updated' => $n]);
