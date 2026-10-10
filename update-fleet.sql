-- Velora Rent — agency fleets. SAFE. Import once in phpMyAdmin.
ALTER TABLE cars ADD COLUMN IF NOT EXISTS owner_user_id INT UNSIGNED NULL;
ALTER TABLE cars ADD INDEX IF NOT EXISTS idx_owner (owner_user_id);
