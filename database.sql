-- ============================================================
-- Velora Rent — MySQL schema (Hostinger: hPanel → Databases → phpMyAdmin → Import)
-- Charset: utf8mb4 (AR/FR support). Import ONCE, then create api/.db.php on server.
-- ============================================================
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(40) DEFAULT '',
  city VARCHAR(80) DEFAULT '',
  cin VARCHAR(60) DEFAULT '',
  license_no VARCHAR(60) DEFAULT '',
  pass_hash VARCHAR(255) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  identity_verified TINYINT(1) NOT NULL DEFAULT 0,
  role ENUM('client','company') DEFAULT 'client',
  agency VARCHAR(150) DEFAULT '',
  avatar TEXT DEFAULT '',
  provider VARCHAR(20) DEFAULT 'email',
  email_verified TINYINT(1) NOT NULL DEFAULT 0,
  id_front TEXT DEFAULT '',
  id_back TEXT DEFAULT '',
  license_img TEXT DEFAULT '',
  identity_status ENUM('none','pending','verified','rejected') DEFAULT 'none',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tokens (
  token VARCHAR(128) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS companies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  city VARCHAR(80) DEFAULT '',
  cars INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 4.5,
  phone VARCHAR(40) DEFAULT '',
  img TEXT,
  address VARCHAR(255) DEFAULT '',
  lat DECIMAL(10,7) NULL,
  lng DECIMAL(10,7) NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cars (
  slug VARCHAR(60) PRIMARY KEY,
  brand VARCHAR(60) NOT NULL,
  model VARCHAR(80) NOT NULL,
  year INT NOT NULL,
  type VARCHAR(40) NOT NULL,
  price INT NOT NULL,
  seats INT DEFAULT 5,
  gear VARCHAR(20) DEFAULT 'Manuelle',
  fuel VARCHAR(20) DEFAULT 'Diesel',
  rating DECIMAL(2,1) DEFAULT 4.5,
  trips INT DEFAULT 0,
  city VARCHAR(80) DEFAULT '',
  company VARCHAR(120) DEFAULT '',
  img TEXT,
  tags VARCHAR(200) DEFAULT '',
  active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS bookings (
  code VARCHAR(16) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  car_slug VARCHAR(60) NOT NULL,
  car_label VARCHAR(160) NOT NULL,
  city VARCHAR(80) DEFAULT '',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days INT NOT NULL,
  total INT NOT NULL,
  pay ENUM('now','cash') DEFAULT 'cash',
  status ENUM('paid','pending','cancelled') DEFAULT 'pending',
  full_name VARCHAR(120) DEFAULT '',
  phone VARCHAR(40) DEFAULT '',
  email VARCHAR(190) DEFAULT '',
  id_number VARCHAR(60) DEFAULT '',
  pickup VARCHAR(120) DEFAULT '',
  dropoff VARCHAR(120) DEFAULT '',
  driver2 TINYINT(1) DEFAULT 0,
  driver2_name VARCHAR(120) DEFAULT '',
  insurance ENUM('none','full') DEFAULT 'none',
  pay_method ENUM('cash','card','transfer') DEFAULT 'cash',
  gift_code VARCHAR(32) DEFAULT '',
  gift_discount INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS gift_cards (
  code VARCHAR(32) PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  amount INT NOT NULL,
  used TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS reviews (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  rating TINYINT DEFAULT 5,
  text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS messages (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) DEFAULT '',
  contact VARCHAR(190) DEFAULT '',
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS partner_apps (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  agency VARCHAR(150) NOT NULL,
  city VARCHAR(80) DEFAULT '',
  phone VARCHAR(40) DEFAULT '',
  cars INT DEFAULT 0,
  address VARCHAR(255) DEFAULT '',
  message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_tokens (
  token VARCHAR(128) PRIMARY KEY,
  expires_at DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS email_codes (
  email VARCHAR(190) PRIMARY KEY,
  code CHAR(6) NOT NULL,
  expires_at DATETIME NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS settings (
  `k` VARCHAR(80) PRIMARY KEY,
  `v` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- ---------------- Seed: companies ----------------
INSERT INTO companies (name, city, cars, rating, phone, img, address, lat, lng) VALUES
('Atlas Drive','Casablanca',48,4.7,'+212 6 61 00 00 01','https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600','Bd Anfa, Casablanca',33.5731,-7.5898),
('Sahara Cars','Marrakech',36,4.8,'+212 6 61 00 00 02','https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600','Av. Mohammed V, Marrakech',31.6295,-7.9811),
('Velora Premium','Casablanca',22,5.0,'+212 6 61 00 00 03','https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600','Corniche Ain Diab, Casablanca',33.5880,-7.6110),
('Nord Auto','Tanger',29,4.6,'+212 6 61 00 00 04','https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600','Av. Mohammed VI, Tanger',35.7595,-5.8340');

-- ---------------- Seed: cars ----------------
INSERT INTO cars (slug, brand, model, year, type, price, seats, gear, fuel, rating, trips, city, company, img, tags) VALUES
('dacia-logan','Dacia','Logan',2023,'Berline',250,5,'Manuelle','Diesel',4.6,312,'Casablanca','Atlas Drive','/cars/dacia-logan.jpg','Eco,Top vente'),
('dacia-duster','Dacia','Duster 4x4',2024,'SUV',380,5,'Manuelle','Diesel',4.8,198,'Marrakech','Sahara Cars','/cars/dacia-duster.jpg','SUV,Désert'),
('clio-5','Renault','Clio 5',2023,'Citadine',280,5,'Manuelle','Essence',4.7,421,'Rabat','Atlas Drive','/cars/clio-5.jpg','Ville'),
('peugeot-208','Peugeot','208 GT-Line',2024,'Citadine',320,5,'Auto','Essence',4.9,156,'Casablanca','Velora Premium','/cars/peugeot-208.jpg','Premium'),
('golf-8','Volkswagen','Golf 8',2023,'Berline',450,5,'Auto','Diesel',4.8,203,'Tanger','Nord Auto','/cars/golf-8.jpg','Confort'),
('tucson','Hyundai','Tucson',2024,'SUV',550,5,'Auto','Hybride',4.9,132,'Agadir','Sahara Cars','/cars/tucson.jpg','Famille'),
('mercedes-c','Mercedes','Classe C',2024,'Luxe',950,5,'Auto','Essence',5.0,87,'Casablanca','Velora Premium','/cars/mercedes-c.jpg','Luxe,Chauffeur'),
('range-evoque','Range Rover','Evoque',2023,'Luxe',1100,5,'Auto','Diesel',4.9,64,'Marrakech','Velora Premium','/cars/range-evoque.jpg','Luxe'),
('toyota-hiace','Toyota','Hiace 9pl',2022,'Van',700,9,'Manuelle','Diesel',4.5,143,'Fès','Atlas Drive','/cars/toyota-hiace.jpg','Groupe'),
('tesla-3','Tesla','Model 3',2024,'Électrique',800,5,'Auto','Électrique',4.9,98,'Rabat','Nord Auto','/cars/tesla-3.jpg','Éco,Électrique'),
('kia-picanto','Kia','Picanto',2023,'Citadine',220,5,'Manuelle','Essence',4.4,287,'Essaouira','Sahara Cars','/cars/kia-picanto.jpg','Budget'),
('bmw-x3','BMW','X3 xDrive',2024,'SUV',890,5,'Auto','Diesel',4.9,76,'Casablanca','Velora Premium','/cars/bmw-x3.jpg','Premium');

-- ---------------- Seed: reviews ----------------
INSERT INTO reviews (name, rating, text) VALUES
('Salma B. — Casablanca',5,'Service parfait, voiture propre, livraison à l’aéroport à l’heure. Je recommande Velora !'),
('Yassine E. — Rabat',5,'أحسن موقع كراء جربت، الثمن واضح بلا مفاجآت والتأمين شامل.'),
('Julien M. — Paris',5,'Booked from France, paid online, Duster waiting at Marrakech airport. Flawless.'),
('Khadija R. — Agadir',4,'Points fidélité + surclassement offert. Très pro.');
