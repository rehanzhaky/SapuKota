-- Migration: Add petugas tracking fields
-- Created: 2026-03-31
-- Description: Add fields to track when petugas arrives at location and their GPS coordinates
-- Status: ✅ Applied on 2026-03-31

-- For MySQL, run this command:
-- mysql -h localhost -u root -p sapukota < migrations/add_petugas_tracking.sql

ALTER TABLE reports
ADD COLUMN arrived_at DATETIME NULL COMMENT 'Timestamp when petugas arrived at location',
ADD COLUMN petugas_latitude DECIMAL(10, 8) NULL COMMENT 'Petugas GPS latitude when checking in',
ADD COLUMN petugas_longitude DECIMAL(11, 8) NULL COMMENT 'Petugas GPS longitude when checking in';
