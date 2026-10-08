-- Velora Rent — account types (client/company). SAFE (ALTER only). Import once in phpMyAdmin.
ALTER TABLE users ADD COLUMN IF NOT EXISTS role ENUM('client','company') DEFAULT 'client';
ALTER TABLE users ADD COLUMN IF NOT EXISTS agency VARCHAR(150) DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar TEXT DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS provider VARCHAR(20) DEFAULT 'email';
