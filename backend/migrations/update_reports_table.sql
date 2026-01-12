-- Migration to simplify reports table structure
-- Remove reporter fields and category, add title field

-- Add title column
ALTER TABLE reports ADD COLUMN title VARCHAR(255) AFTER id;

-- Drop old columns
ALTER TABLE reports DROP COLUMN reporter_name;
ALTER TABLE reports DROP COLUMN reporter_phone;
ALTER TABLE reports DROP COLUMN reporter_email;
ALTER TABLE reports DROP COLUMN category;

-- Make title NOT NULL after adding it
ALTER TABLE reports MODIFY title VARCHAR(255) NOT NULL;
