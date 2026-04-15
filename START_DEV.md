# Cara Menjalankan Development

## 1. Start Backend (Terminal 1)
```bash
cd backend
npm start
# Atau: npm run dev
```
Backend harus running di **http://localhost:5000**

## 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend akan running di **http://localhost:3000**

## Cek Jika Image Tidak Muncul

### Debug 1: Cek Backend Running
Buka: http://localhost:5000/api/health

Jika error, backend tidak running → start backend dulu

### Debug 2: Cek Image URL
Buka browser console (F12) → Network tab → reload halaman admin
Lihat request ke `/uploads/report-xxx.png`
- Jika status 404 → file tidak ada
- Jika status 502/503 → backend tidak running
- Jika status 200 → gambar berhasil dimuat

### Debug 3: Cek Database
Pastikan kolom `photo` di tabel `reports` tidak NULL:
```sql
SELECT id, title, photo FROM reports WHERE photo IS NOT NULL LIMIT 5;
```

### Debug 4: Test Upload Baru
1. Buat laporan baru dengan upload foto
2. Cek apakah file masuk ke folder `backend/uploads/`
3. Cek di halaman admin apakah muncul
