# ☁️ Setup Cloudinary untuk Production (FREE!)

## Kenapa Perlu Cloudinary?

Railway, Vercel, Heroku, dan platform cloud lainnya menggunakan **ephemeral filesystem** (temporary storage). Artinya:
- ❌ File yang diupload akan **hilang** setiap kali redeploy atau restart
- ❌ Tidak ada persistent storage di free tier
- ✅ **Solusi**: Gunakan cloud storage seperti Cloudinary

## ✨ Keuntungan Cloudinary

- 🆓 **FREE tier** sangat generous:
  - 25 GB storage
  - 25 GB bandwidth/bulan
  - Transformasi gambar otomatis
- ⚡ CDN global (gambar load cepat di seluruh dunia)
- 🔧 Auto-optimization (compress gambar otomatis)
- 🖼️ Resize & transform gambar on-the-fly
- 🔒 Secure & reliable

---

## 🚀 Cara Setup (5 Menit)

### 1️⃣ Daftar Cloudinary (2 menit)

1. Buka [cloudinary.com](https://cloudinary.com)
2. Klik **"Sign Up for Free"**
3. Pilih cara daftar:
   - Email & password, atau
   - Login with GitHub (lebih cepat)
4. Verifikasi email jika diminta
5. ✅ Akun siap!

### 2️⃣ Get API Credentials (1 menit)

1. Login ke Cloudinary Dashboard
2. Klik **"Settings"** (icon gear) di kanan atas
3. Pilih tab **"Access Keys"**
4. Copy 3 credentials berikut:
   ```
   Cloud Name: dcxxxxxx
   API Key: 123456789012345
   API Secret: abcdefghijklmnopqrstuvwxyz
   ```

**PENTING:** Jangan share API Secret ke siapapun!

### 3️⃣ Setup di Railway Backend (2 menit)

1. Buka Railway Dashboard → pilih project **SapuKota**
2. Klik service **Backend**
3. Tab **"Variables"**
4. Klik **"+ New Variable"**, tambahkan satu per satu:
   ```
   CLOUDINARY_CLOUD_NAME=dcxxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```
5. Service akan otomatis **redeploy**
6. Tunggu deploy selesai (~1-2 menit)

### 4️⃣ Verifikasi Setup (1 menit)

1. Buka aplikasi production Anda
2. Buat laporan baru dengan upload foto
3. Cek di halaman admin → foto harus muncul ✅
4. Cek di Cloudinary Dashboard → Media Library → folder **sapukota-reports**
5. Foto harus muncul di Cloudinary ✅

---

## 🔍 Troubleshooting

### Foto masih tidak muncul?

**1. Cek Railway Logs:**
```
Railway Dashboard → Backend Service → Deployments → Latest → Logs
```

Cari error message seperti:
- `Cloudinary not configured` → credentials salah/tidak ada
- `Invalid API key` → API key salah
- `Upload failed` → ada error lain

**2. Pastikan Environment Variables Sudah Tersimpan:**
```
Railway Dashboard → Backend Service → Variables
```

Harus ada 3 variables:
- ✅ `CLOUDINARY_CLOUD_NAME`
- ✅ `CLOUDINARY_API_KEY`
- ✅ `CLOUDINARY_API_SECRET`

**3. Cek Browser Console (F12):**
- Network tab → cari request image
- Jika URL mulai dengan `https://res.cloudinary.com/...` → berarti Cloudinary aktif ✅
- Jika masih `/uploads/...` → Cloudinary belum aktif ❌

**4. Force Redeploy:**
```
Railway Dashboard → Backend Service → Deployments → Redeploy
```

---

## 🧪 Testing di Development (Optional)

Jika ingin test Cloudinary di local development:

1. Copy file `.env.example` menjadi `.env`:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Edit `.env`, tambahkan Cloudinary credentials:
   ```bash
   CLOUDINARY_CLOUD_NAME=dcxxxxxx
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
   ```

3. Restart backend:
   ```bash
   npm start
   ```

4. Log harus menampilkan:
   ```
   ✅ Using Cloudinary for file uploads (Production mode)
   ```

---

## 📊 Monitoring Usage

1. Login ke Cloudinary Dashboard
2. Klik **"Dashboard"** di sidebar
3. Lihat usage:
   - **Storage**: Berapa GB terpakai (max 25 GB)
   - **Bandwidth**: Transfer data per bulan (max 25 GB/bulan)
   - **Transformations**: Berapa kali gambar di-transform

**Tips:** 
- Free tier 25GB bandwidth biasanya cukup untuk 10,000-50,000 page views/bulan
- Jika mau unlimited, upgrade ke paid plan ($89/bulan)

---

## 🎨 Advanced: Custom Transformations (Optional)

Cloudinary bisa auto-resize dan optimize gambar. Edit [backend/src/config/cloudinary.js](backend/src/config/cloudinary.js):

```javascript
transformation: [
  { width: 1200, height: 1200, crop: 'limit' }, // Max size
  { quality: 'auto:good' }, // Good quality compression
  { fetch_format: 'auto' } // Auto WebP conversion
]
```

Ini akan:
- ✅ Limit image max 1200x1200px
- ✅ Auto compress dengan kualitas bagus
- ✅ Convert ke WebP di browser yang support (lebih kecil 30%)

---

## 🔐 Security Best Practices

1. **Jangan commit credentials ke Git:**
   ```bash
   # File .env sudah di .gitignore, pastikan tidak ke-commit
   ```

2. **Rotate API keys setiap 3-6 bulan:**
   - Cloudinary Dashboard → Settings → Access Keys → Regenerate

3. **Enable unsigned uploads (optional):**
   - Settings → Upload → Unsigned uploading enabled
   - Tambahkan upload preset untuk security

---

## ✅ Checklist Final

- [ ] Cloudinary account created
- [ ] API credentials copied (Cloud Name, API Key, API Secret)
- [ ] Environment variables added to Railway
- [ ] Backend redeployed successfully
- [ ] Test upload foto baru → foto muncul
- [ ] Cek Cloudinary Dashboard → Media Library → foto ada

**Selamat!** 🎉 Foto laporan sekarang akan tersimpan permanen di Cloudinary dan tidak akan hilang lagi!

---

## 💡 FAQ

**Q: Apakah data lama (foto yang sudah diupload) akan muncul?**  
A: Tidak. Foto lama yang diupload sebelum Cloudinary akan hilang karena ephemeral filesystem Railway. Foto **baru** (setelah setup Cloudinary) akan permanen.

**Q: Bagaimana cara migrasi foto lama ke Cloudinary?**  
A: Foto lama sudah hilang dari Railway. User harus upload ulang laporan dengan foto baru.

**Q: Bisa pakai S3/Supabase Storage sebagai alternatif?**  
A: Bisa! Tapi Cloudinary lebih mudah setup dan free tier lebih generous. Jika mau S3, bisa custom middleware.

**Q: Apakah bisa tetap pakai local storage?**  
A: Untuk development (local): bisa.  
Untuk production (Railway/Vercel): TIDAK bisa - file akan hilang setiap redeploy.

**Q: Berapa lama foto tersimpan di Cloudinary free tier?**  
A: **SELAMANYA**, selama akun aktif dan tidak melebihi quota 25GB.

---

## 📚 Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK Guide](https://cloudinary.com/documentation/node_integration)
- [Railway Docs - Ephemeral Filesystem](https://docs.railway.app/reference/ephemeral-filesystem)
- [Image Optimization Best Practices](https://cloudinary.com/blog/image_optimization_best_practices)

---

**Need help?** Contact: sapukotaid@gmail.com
