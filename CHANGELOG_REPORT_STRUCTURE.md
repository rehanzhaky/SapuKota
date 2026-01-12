# Summary Perubahan Struktur Laporan

## Perubahan yang Telah Dilakukan

### 1. Backend Model (`backend/src/models/Report.js`)
✅ Menghapus field:
- `reporter_name`
- `reporter_phone`
- `reporter_email`
- `category`

✅ Menambahkan field:
- `title` (VARCHAR 255, NOT NULL)

✅ Field yang dipertahankan:
- `location` (TEXT, NOT NULL)
- `latitude` (DECIMAL)
- `longitude` (DECIMAL)
- `description` (TEXT, NOT NULL)
- `photo` (VARCHAR)
- `status` (ENUM)
- `createdAt` (DATETIME) - Auto timestamp
- `updatedAt` (DATETIME) - Auto timestamp

### 2. Backend Controller (`backend/src/controllers/reportController.js`)
✅ Update `createReport`:
- Menerima: title, location, latitude, longitude, description, photo
- Menghapus: reporter_name, reporter_phone, reporter_email, category

✅ Update `getAllReports`:
- Menghapus filter `category`
- Update search query untuk menggunakan `title` instead of `reporter_name`

### 3. Frontend Form (`frontend/src/pages/Home.jsx`)
✅ Update form fields:
- Judul Laporan (title) - Input text
- Lokasi - Dengan tombol GPS untuk mendapatkan coordinates
- Deskripsi Laporan - Textarea
- Upload Foto - Drag & drop atau pilih file

✅ Fitur GPS:
- Request permission untuk akses lokasi device
- Ambil latitude dan longitude otomatis
- Tampilkan koordinat di form

✅ Update tampilan recent reports:
- Menampilkan title sebagai heading
- Menampilkan location sebagai subheading
- Menghapus kategori
- Mempertahankan timestamp

### 4. Database Schema (`database.sql`)
✅ Update struktur tabel `reports`
✅ Update sample data
✅ Update view `active_reports_summary`
✅ Menghapus index `idx_category`

### 5. Migration Script (`backend/migrations/update_reports_table.sql`)
✅ Script SQL untuk update database existing

## Cara Menggunakan

### Step 1: Update Database
```bash
# Login to MySQL
mysql -u root -p

# Backup data lama (optional)
USE sapu_kota;
CREATE TABLE reports_backup AS SELECT * FROM reports;

# Hapus data lama jika tidak diperlukan
TRUNCATE TABLE reports;

# Run migration
source backend/migrations/update_reports_table.sql;
# atau
mysql -u root -p sapu_kota < backend/migrations/update_reports_table.sql
```

### Step 2: Restart Backend Server
```bash
cd backend
npm start
```

### Step 3: Test Form
1. Buka homepage
2. Klik tombol "Laporkan"
3. Isi form:
   - Judul Laporan: "Sampah di Jl. Sudirman"
   - Klik tombol "📍 Ambil Lokasi" (allow permission)
   - Deskripsi: "Tumpukan sampah..."
   - Upload foto
4. Submit

## Files yang Diubah
✅ `/backend/src/models/Report.js`
✅ `/backend/src/controllers/reportController.js`
✅ `/frontend/src/pages/Home.jsx`
✅ `/database.sql`
✅ `/backend/migrations/update_reports_table.sql` (new)
✅ `/UPDATE_DATABASE.md` (new)

## Files yang Perlu Diupdate di Masa Depan (Jika Diperlukan)
⚠️ `/frontend/src/pages/BuatLaporan.jsx` - Masih menggunakan category
⚠️ `/frontend/src/pages/Laporan.jsx` - Masih ada filter category
⚠️ `/frontend/src/pages/HomeShadcn.jsx` - Masih menampilkan category
⚠️ `/frontend/src/pages/admin/DashboardDLH.jsx` - Masih ada reportsByCategory

Note: File-file di atas tidak diubah karena tidak ada di requirements saat ini. Jika halaman tersebut digunakan, perlu diupdate juga.

## Testing Checklist
- [ ] Database migration berhasil
- [ ] Backend server running tanpa error
- [ ] Form modal muncul saat klik "Laporkan"
- [ ] GPS button berfungsi dan mendapatkan koordinat
- [ ] Form validation berjalan (semua field required)
- [ ] Submit berhasil dan data tersimpan ke database
- [ ] Recent reports menampilkan data dengan benar
- [ ] Timestamp otomatis tercatat (createdAt, updatedAt)
