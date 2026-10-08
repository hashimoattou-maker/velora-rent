-- Velora Rent — real KYC (document uploads + review status). SAFE. Import once in phpMyAdmin.
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_front TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS id_back TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS license_img TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS identity_status ENUM('none','pending','verified','rejected') DEFAULT 'none';
UPDATE users SET identity_status='verified', identity_verified=1 WHERE identity_verified=1;
