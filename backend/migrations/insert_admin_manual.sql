-- Manual insert admin user with bcrypt hashed password for 'admin123'
-- Run this via Railway Dashboard > MySQL service > Query tab

INSERT INTO users (name, email, password, role, phone, status, createdAt, updatedAt)
VALUES (
  'Admin DLH',
  'admin@sapukota.id',
  '$2b$10$nZTFQBmBx0CLp.Ek0iuGN.Q8wmKrWXpQfhQvALI8k2fWzWwCFZR.a',
  'admin_dlh',
  '081234567890',
  'active',
  NOW(),
  NOW()
)
ON DUPLICATE KEY UPDATE
  password = '$2b$10$nZTFQBmBx0CLp.Ek0iuGN.Q8wmKrWXpQfhQvALI8k2fWzWwCFZR.a',
  status = 'active',
  updatedAt = NOW();
