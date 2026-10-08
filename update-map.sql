-- Velora Rent — agencies map migration. SAFE (ALTER + UPDATE only). Import once in phpMyAdmin.
ALTER TABLE companies ADD COLUMN IF NOT EXISTS lat DECIMAL(10,7) NULL;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS lng DECIMAL(10,7) NULL;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS address VARCHAR(255) DEFAULT '';
ALTER TABLE partner_apps ADD COLUMN IF NOT EXISTS address VARCHAR(255) DEFAULT '';

UPDATE companies SET lat=33.5731000, lng=-7.5898000, address='Bd Anfa, Casablanca' WHERE name='Atlas Drive';
UPDATE companies SET lat=31.6295000, lng=-7.9811000, address='Av. Mohammed V, Marrakech' WHERE name='Sahara Cars';
UPDATE companies SET lat=33.5880000, lng=-7.6110000, address='Corniche Ain Diab, Casablanca' WHERE name='Velora Premium';
UPDATE companies SET lat=35.7595000, lng=-5.8340000, address='Av. Mohammed VI, Tanger' WHERE name='Nord Auto';
