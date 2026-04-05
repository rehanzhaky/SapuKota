-- Add GPS tracking fields for petugas task acceptance and completion
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP NULL COMMENT 'Waktu petugas menerima/mengacc tugas',
ADD COLUMN IF NOT EXISTS accept_latitude DECIMAL(10, 8) NULL COMMENT 'Latitude posisi petugas saat menerima tugas',
ADD COLUMN IF NOT EXISTS accept_longitude DECIMAL(11, 8) NULL COMMENT 'Longitude posisi petugas saat menerima tugas',
ADD COLUMN IF NOT EXISTS complete_latitude DECIMAL(10, 8) NULL COMMENT 'Latitude posisi petugas saat menyelesaikan tugas',
ADD COLUMN IF NOT EXISTS complete_longitude DECIMAL(11, 8) NULL COMMENT 'Longitude posisi petugas saat menyelesaikan tugas';

