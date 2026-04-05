# Fitur Check-In Petugas dengan GPS Tracking

## Overview
Fitur ini memungkinkan petugas untuk menandai bahwa mereka sudah sampai di lokasi tugas dengan menggunakan GPS tracking.

## Fitur yang Ditambahkan

### 1. Database Changes
- **Field baru di tabel `reports`:**
  - `arrived_at`: Timestamp saat petugas check-in di lokasi
  - `petugas_latitude`: Koordinat GPS latitude petugas saat check-in
  - `petugas_longitude`: Koordinat GPS longitude petugas saat check-in

### 2. Backend API
- **Endpoint baru:** `POST /api/reports/:id/checkin`
  - Memerlukan autentikasi petugas
  - Body: `{ latitude: number, longitude: number }`
  - Otomatis mengubah status dari "assigned" ke "in_progress"
  - Menyimpan timestamp dan koordinat GPS petugas

### 3. Frontend - Dashboard Petugas

#### Tombol "Saya Sudah Sampai"
- Muncul di setiap task card yang belum di-check-in
- Menggunakan browser Geolocation API untuk mendapatkan GPS
- Menampilkan loading state saat mengambil GPS
- Otomatis hilang setelah petugas check-in

#### Badge Status "Sudah di lokasi"
- Badge hijau muncul setelah petugas check-in
- Menampilkan waktu kedatangan di detail task
- Visual indicator yang jelas untuk admin dan petugas

## Cara Penggunaan

### Untuk Petugas:
1. Login ke dashboard petugas
2. Lihat daftar tugas aktif
3. Saat sudah sampai di lokasi, klik tombol **"📍 Saya Sudah Sampai"**
4. Browser akan meminta izin akses GPS - klik **Allow/Izinkan**
5. Sistem akan mencatat posisi dan waktu kedatangan
6. Badge **"✓ Sudah di lokasi"** akan muncul di task card
7. Lanjutkan dengan update status tugas seperti biasa

### Untuk Admin:
- Dapat melihat status kedatangan petugas di halaman Kelola Laporan
- Data GPS tersimpan untuk audit trail

## Catatan Teknis
- GPS harus diaktifkan di perangkat petugas
- Browser harus mendukung Geolocation API (Chrome, Firefox, Safari modern)
- Koordinat GPS tersimpan dengan presisi tinggi (8 desimal untuk latitude, 11 untuk longitude)

## Security
- Endpoint check-in dilindungi dengan middleware autentikasi
- Hanya petugas yang ditugaskan yang bisa check-in ke task tersebut
- GPS coordinates diverifikasi di backend

## Migration
Migration sudah dijalankan. Jika perlu dijalankan ulang:
```bash
cd backend
node src/scripts/runMigration.js
```

Atau manual:
```bash
mysql -u [username] -p [database_name] < migrations/add_petugas_tracking.sql
```
