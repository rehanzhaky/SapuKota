-- Add latitude and longitude columns to reports table
ALTER TABLE reports 
ADD COLUMN latitude DECIMAL(10, 8) NULL AFTER location,
ADD COLUMN longitude DECIMAL(11, 8) NULL AFTER latitude;
