# Update Database Schema

## Perubahan yang Dilakukan

Struktur laporan telah disederhanakan. Field yang diperlukan sekarang hanya:
- **title** - Judul laporan
- **location** - Lokasi (coordinates text)
- **latitude** - Koordinat latitude
- **longitude** - Koordinat longitude
- **description** - Deskripsi laporan
- **photo** - Foto laporan
- **createdAt** - Timestamp otomatis
- **updatedAt** - Timestamp otomatis

Field yang dihapus:
- reporter_name
- reporter_phone
- reporter_email
- category

## Cara Update Database

### Option 1: Menggunakan Migration Script (Recommended)

```bash
cd backend
mysql -u root -p < migrations/update_reports_table.sql
```

### Option 2: Manual via MySQL Console

```sql
-- Login ke MySQL
mysql -u root -p

-- Pilih database
USE sapu_kota;

-- Backup data lama (optional, jika ada data penting)
CREATE TABLE reports_backup AS SELECT * FROM reports;

-- Hapus semua data lama (jika tidak perlu)
TRUNCATE TABLE reports;

-- Add title column
ALTER TABLE reports ADD COLUMN title VARCHAR(255) AFTER id;

-- Drop old columns
ALTER TABLE reports DROP COLUMN reporter_name;
ALTER TABLE reports DROP COLUMN reporter_phone;
ALTER TABLE reports DROP COLUMN reporter_email;
ALTER TABLE reports DROP COLUMN category;

-- Make title NOT NULL
ALTER TABLE reports MODIFY title VARCHAR(255) NOT NULL;
```

### Option 3: Recreate Database (Jika data lama tidak penting)

```bash
# Drop dan recreate database
cd backend
mysql -u root -p

DROP DATABASE IF EXISTS sapu_kota;
CREATE DATABASE sapu_kota;
exit;

# Import schema baru
mysql -u root -p sapu_kota < database.sql
```

## Restart Server

Setelah update database, restart backend server:

```bash
cd backend
npm start
```

## Testing

Test dengan membuat laporan baru melalui form di homepage. Data yang dikirim:
- Judul Laporan
- Lokasi (GPS coordinates)
- Deskripsi
- Foto

Timestamp akan otomatis ditambahkan oleh sistem.
