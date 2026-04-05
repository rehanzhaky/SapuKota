-- Migration: Add GPS tracking fields to users table
-- Created: 2026-04-05
-- Description: Add fields to track real-time GPS location of petugas
-- For MySQL, run this command:
-- mysql -h localhost -u root -p sapukota < migrations/add_user_gps_tracking.sql

ALTER TABLE users
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 8) NULL COMMENT 'Current GPS latitude of petugas',
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 8) NULL COMMENT 'Current GPS longitude of petugas',
ADD COLUMN IF NOT EXISTS last_location_update TIMESTAMP NULL COMMENT 'Last time GPS location was updated';
