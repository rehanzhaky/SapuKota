# ⚡ Quick Start Guide - SapuKota.id

Panduan cepat untuk menjalankan aplikasi dalam 5 menit!

## 📋 Prerequisites

- ✅ Node.js v16+ sudah terinstall
- ✅ MySQL sudah terinstall dan running
- ✅ Terminal/Command Prompt

## 🚀 Langkah-langkah

### 1️⃣ Setup Database (1 menit)

```bash
# Login ke MySQL
mysql -u root -p
# Masukkan password MySQL Anda
```

```sql
-- Buat database
CREATE DATABASE sapukota_db;

-- Cek database sudah dibuat
SHOW DATABASES;

-- Keluar
exit;
```

### 2️⃣ Configure Backend (30 detik)

```bash
# Buka file backend/.env dengan text editor
# Update baris berikut dengan password MySQL Anda:

DB_PASSWORD=your_mysql_password_here
```

**Contoh:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123          # ← Ganti ini!
DB_NAME=sapukota_db
DB_PORT=3306
```

### 3️⃣ Create Admin & Tables (30 detik)

```bash
# Masuk ke folder backend
cd backend

# Jalankan seeder (akan otomatis membuat tables + admin user)
npm run seed:admin
```

**Output yang benar:**
```
🔄 Syncing database...
✅ Database synced successfully

✅ Default admin created successfully
Email: admin@sapukota.id
Password: admin123
```

### 4️⃣ Run Backend (10 detik)

```bash
# Masih di folder backend
npm run dev
```

**Output yang benar:**
```
✅ Database connected successfully
🚀 Server running on port 5000
```

**Jangan tutup terminal ini!** Biarkan backend tetap running.

### 5️⃣ Run Frontend (10 detik)

**Buka terminal BARU**, lalu:

```bash
# Masuk ke folder frontend
cd frontend

# Jalankan frontend
npm run dev
```

**Output yang benar:**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 6️⃣ Buka Browser! 🎉

Buka browser dan akses:
```
http://localhost:3000
```

---

## 🎯 Test Aplikasi

### Test 1: Buat Laporan (Public)

1. Klik tombol **"Buat Laporan"**
2. Isi form:
   - Nama: John Doe
   - Telepon: 081234567890
   - Lokasi: Jl. Sudirman No. 123
   - Deskripsi: Tumpukan sampah di pinggir jalan
   - Kategori: Sampah Rumah Tangga
   - Upload foto (opsional)
3. Klik **"Kirim Laporan"**
4. Lihat laporan di halaman **"Laporan"**

### Test 2: Login Admin

1. Klik **"Login"** di navbar
2. Masukkan:
   - Email: `admin@sapukota.id`
   - Password: `admin123`
3. Klik **"Login"**
4. Anda akan masuk ke **Dashboard Admin DLH**

### Test 3: Kelola Laporan (Admin)

1. Di dashboard, klik **"Kelola Laporan"**
2. Lihat laporan yang baru dibuat
3. Klik **"Review"** pada laporan
4. Ubah status menjadi **"Approved"**
5. Klik **"Simpan"**

### Test 4: Buat Petugas (Admin)

1. Klik **"Kelola Petugas"**
2. Klik **"Tambah Petugas"**
3. Isi form:
   - Nama: Petugas A
   - Email: petugas@sapukota.id
   - Password: petugas123
   - Telepon: 081234567891
4. Klik **"Simpan"**

### Test 5: Login Petugas

1. Logout dari admin
2. Login dengan:
   - Email: `petugas@sapukota.id`
   - Password: `petugas123`
3. Anda akan masuk ke **Dashboard Petugas**

---

## ❌ Troubleshooting

### Backend tidak bisa connect ke database

**Error:** `ECONNREFUSED` atau `Access denied`

**Solusi:**
1. Pastikan MySQL running:
   ```bash
   # Mac (Homebrew)
   brew services list | grep mysql
   brew services start mysql
   
   # Windows (XAMPP)
   # Buka XAMPP Control Panel → Start MySQL
   ```

2. Cek password di `backend/.env` sudah benar

3. Test koneksi manual:
   ```bash
   mysql -u root -p
   # Jika bisa login, berarti MySQL running
   ```

### Port 5000 atau 3000 sudah dipakai

**Solusi:**
```bash
# Kill process di port 5000
lsof -ti:5000 | xargs kill -9

# Kill process di port 3000
lsof -ti:3000 | xargs kill -9
```

### Tables tidak terbuat

**Solusi:**
```bash
# Jalankan ulang seeder
cd backend
npm run seed:admin
```

Atau import manual `database.sql` via phpMyAdmin.

### Frontend tidak bisa fetch data

**Solusi:**
1. Pastikan backend running di http://localhost:5000
2. Check console browser (F12) untuk error
3. Pastikan CORS enabled di backend

---

## 📚 Next Steps

Setelah aplikasi running:

1. ✅ Explore semua fitur
2. ✅ Baca dokumentasi lengkap di `README.md`
3. ✅ Lihat API documentation di `API_REFERENCE.md`
4. ✅ Customize sesuai kebutuhan

---

## 🆘 Butuh Bantuan?

- 📖 Baca `TROUBLESHOOTING.md` untuk masalah umum
- 📖 Baca `SETUP.md` untuk setup detail
- 📖 Baca `INSTALL_MYSQL.md` untuk install MySQL

---

**Selamat! Aplikasi SapuKota.id sudah running!** 🎉

Total waktu setup: **~5 menit**

