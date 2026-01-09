-- ============================================
-- SapuKota.id Database Schema
-- ============================================

-- Create Database
CREATE DATABASE IF NOT EXISTS sapukota_db;
USE sapukota_db;

-- ============================================
-- Table: users
-- ============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin_dlh', 'petugas') NOT NULL DEFAULT 'petugas',
  `phone` VARCHAR(20) DEFAULT NULL,
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Table: reports
-- ============================================
CREATE TABLE IF NOT EXISTS `reports` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `reporter_name` VARCHAR(255) NOT NULL,
  `reporter_phone` VARCHAR(20) NOT NULL,
  `reporter_email` VARCHAR(255) DEFAULT NULL,
  `location` TEXT NOT NULL,
  `latitude` DECIMAL(10, 8) DEFAULT NULL,
  `longitude` DECIMAL(11, 8) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `category` ENUM('sampah_rumah_tangga', 'sampah_industri', 'sampah_elektronik', 'sampah_bangunan', 'lainnya') NOT NULL DEFAULT 'sampah_rumah_tangga',
  `photo` VARCHAR(255) DEFAULT NULL,
  `status` ENUM('pending', 'approved', 'assigned', 'in_progress', 'completed', 'rejected') NOT NULL DEFAULT 'pending',
  `assigned_to` INT DEFAULT NULL,
  `admin_notes` TEXT DEFAULT NULL,
  `completion_photo` VARCHAR(255) DEFAULT NULL,
  `completion_notes` TEXT DEFAULT NULL,
  `completed_at` DATETIME DEFAULT NULL,
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_category` (`category`),
  INDEX `idx_assigned_to` (`assigned_to`),
  INDEX `idx_created_at` (`createdAt`),
  CONSTRAINT `fk_reports_assigned_to` 
    FOREIGN KEY (`assigned_to`) 
    REFERENCES `users` (`id`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Insert Default Admin User
-- Password: admin123 (hashed with bcrypt)
-- ============================================
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `status`) 
VALUES (
  'Admin DLH',
  'admin@sapukota.id',
  '$2b$10$YourHashedPasswordHere',  -- Ganti dengan hash dari bcrypt
  'admin_dlh',
  '081234567890',
  'active'
) ON DUPLICATE KEY UPDATE `name` = `name`;

-- ============================================
-- Sample Data (Optional - untuk testing)
-- ============================================

-- Sample Petugas Users
INSERT INTO `users` (`name`, `email`, `password`, `role`, `phone`, `status`) VALUES
('Petugas A', 'petugas1@sapukota.id', '$2b$10$YourHashedPasswordHere', 'petugas', '081234567891', 'active'),
('Petugas B', 'petugas2@sapukota.id', '$2b$10$YourHashedPasswordHere', 'petugas', '081234567892', 'active'),
('Petugas C', 'petugas3@sapukota.id', '$2b$10$YourHashedPasswordHere', 'petugas', '081234567893', 'active')
ON DUPLICATE KEY UPDATE `name` = `name`;

-- Sample Reports
INSERT INTO `reports` (
  `reporter_name`, `reporter_phone`, `reporter_email`, 
  `location`, `latitude`, `longitude`, 
  `description`, `category`, `status`
) VALUES
('John Doe', '081234567890', 'john@example.com', 'Jl. Sudirman No. 123, Jakarta', -6.200000, 106.816666, 'Tumpukan sampah di pinggir jalan', 'sampah_rumah_tangga', 'pending'),
('Jane Smith', '081234567891', 'jane@example.com', 'Jl. Thamrin No. 45, Jakarta', -6.195000, 106.823000, 'Sampah elektronik bekas', 'sampah_elektronik', 'approved'),
('Bob Wilson', '081234567892', 'bob@example.com', 'Jl. Gatot Subroto No. 78, Jakarta', -6.210000, 106.830000, 'Puing bangunan', 'sampah_bangunan', 'assigned'),
('Alice Brown', '081234567893', 'alice@example.com', 'Jl. Rasuna Said No. 90, Jakarta', -6.220000, 106.840000, 'Sampah industri', 'sampah_industri', 'in_progress'),
('Charlie Davis', '081234567894', 'charlie@example.com', 'Jl. HR Rasuna Said No. 12, Jakarta', -6.225000, 106.845000, 'Sampah rumah tangga menumpuk', 'sampah_rumah_tangga', 'completed')
ON DUPLICATE KEY UPDATE `reporter_name` = `reporter_name`;

-- ============================================
-- Indexes for Performance
-- ============================================
-- Already created above in table definitions

-- ============================================
-- Views (Optional - untuk reporting)
-- ============================================

-- View: Active Reports Summary
CREATE OR REPLACE VIEW `active_reports_summary` AS
SELECT 
  r.id,
  r.reporter_name,
  r.location,
  r.category,
  r.status,
  r.createdAt,
  u.name AS assigned_petugas_name
FROM reports r
LEFT JOIN users u ON r.assigned_to = u.id
WHERE r.status NOT IN ('completed', 'rejected')
ORDER BY r.createdAt DESC;

-- View: Petugas Performance
CREATE OR REPLACE VIEW `petugas_performance` AS
SELECT 
  u.id,
  u.name,
  u.email,
  u.phone,
  COUNT(r.id) AS total_tasks,
  SUM(CASE WHEN r.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks,
  SUM(CASE WHEN r.status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_tasks,
  SUM(CASE WHEN r.status = 'assigned' THEN 1 ELSE 0 END) AS pending_tasks
FROM users u
LEFT JOIN reports r ON u.id = r.assigned_to
WHERE u.role = 'petugas' AND u.status = 'active'
GROUP BY u.id, u.name, u.email, u.phone
ORDER BY completed_tasks DESC;

-- ============================================
-- Stored Procedures (Optional)
-- ============================================

DELIMITER $$

-- Procedure: Get Dashboard Statistics
CREATE PROCEDURE IF NOT EXISTS `get_dashboard_stats`()
BEGIN
  SELECT 
    COUNT(*) AS total_reports,
    SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending_reports,
    SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) AS approved_reports,
    SUM(CASE WHEN status = 'assigned' THEN 1 ELSE 0 END) AS assigned_reports,
    SUM(CASE WHEN status = 'in_progress' THEN 1 ELSE 0 END) AS in_progress_reports,
    SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed_reports,
    SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) AS rejected_reports
  FROM reports;
END$$

DELIMITER ;

-- ============================================
-- Triggers (Optional - untuk audit log)
-- ============================================

-- Trigger: Update completed_at when status changes to completed
DELIMITER $$

CREATE TRIGGER IF NOT EXISTS `update_completed_at` 
BEFORE UPDATE ON `reports`
FOR EACH ROW
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    SET NEW.completed_at = NOW();
  END IF;
END$$

DELIMITER ;

-- ============================================
-- Grant Permissions (Optional)
-- ============================================
-- GRANT ALL PRIVILEGES ON sapukota_db.* TO 'sapukota_user'@'localhost' IDENTIFIED BY 'your_password';
-- FLUSH PRIVILEGES;

-- ============================================
-- End of Schema
-- ============================================

