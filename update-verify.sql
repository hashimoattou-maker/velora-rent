-- Velora Rent — email OTP verification. SAFE (ALTER + CREATE IF NOT EXISTS). Import once in phpMyAdmin.
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified TINYINT(1) NOT NULL DEFAULT 0;
CREATE TABLE IF NOT EXISTS email_codes (
  email VARCHAR(190) PRIMARY KEY,
  code CHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
-- Social/OAuth emails are pre-verified:
UPDATE users SET email_verified=1 WHERE provider IN ('google','facebook','apple');
