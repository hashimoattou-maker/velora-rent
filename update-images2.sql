-- Velora Rent — self-hosted car photos (served from /cars/ on your own server, never break).
-- SAFE: only UPDATEs. Import once in phpMyAdmin (after update-images.sql if never imported).
UPDATE cars SET img='/cars/dacia-logan.jpg' WHERE slug='dacia-logan';
UPDATE cars SET img='/cars/dacia-duster.jpg' WHERE slug='dacia-duster';
UPDATE cars SET img='/cars/clio-5.jpg' WHERE slug='clio-5';
UPDATE cars SET img='/cars/peugeot-208.jpg' WHERE slug='peugeot-208';
UPDATE cars SET img='/cars/golf-8.jpg' WHERE slug='golf-8';
UPDATE cars SET img='/cars/tucson.jpg' WHERE slug='tucson';
UPDATE cars SET img='/cars/mercedes-c.jpg' WHERE slug='mercedes-c';
UPDATE cars SET img='/cars/range-evoque.jpg' WHERE slug='range-evoque';
UPDATE cars SET img='/cars/toyota-hiace.jpg' WHERE slug='toyota-hiace';
UPDATE cars SET img='/cars/tesla-3.jpg' WHERE slug='tesla-3';
UPDATE cars SET img='/cars/kia-picanto.jpg' WHERE slug='kia-picanto';
UPDATE cars SET img='/cars/bmw-x3.jpg' WHERE slug='bmw-x3';
