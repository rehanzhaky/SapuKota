# 🐛 Troubleshooting - Foto Tidak Muncul di Production

## ❌ Masalah: "Foto tidak tersedia" di Halaman Admin (Production)

### Penyebab

Railway dan platform cloud lainnya menggunakan **ephemeral filesystem** yang artinya:
- File yang diupload akan **hilang** setiap kali redeploy
- Tidak ada persistent storage untuk file uploads
- Harus pakai cloud storage seperti Cloudinary

### ✅ Solusi: Setup Cloudinary (5 Menit)

**Cloudinary adalah cloud storage dengan FREE tier 25GB!**

Ikuti panduan lengkap di: **[SETUP_CLOUDINARY.md](SETUP_CLOUDINARY.md)**

#### Quick Steps:

1. **Daftar Cloudinary** (2 menit)
   - Buka [cloudinary.com](https://cloudinary.com)
   - Sign up (gratis, no credit card)
   - Get credentials: Cloud Name, API Key, API Secret

2. **Add ke Railway Variables** (2 menit)
   - Railway Dashboard → Backend Service → Variables
   - Tambahkan 3 variables:
     ```
     CLOUDINARY_CLOUD_NAME=your_cloud_name
     CLOUDINARY_API_KEY=your_api_key
     CLOUDINARY_API_SECRET=your_api_secret
     ```

3. **Redeploy** (1 menit)
   - Backend akan otomatis redeploy
   - Tunggu selesai

4. **Test Upload Baru** ✅
   - Buat laporan dengan foto
   - Cek di admin → foto harus muncul!

---

## 🔍 Cek Status Cloudinary

### Di Railway Logs:

**Jika Cloudinary aktif:**
```
✅ Using Cloudinary for file uploads (Production mode)
```

**Jika belum aktif:**
```
ℹ️ Using local file storage (Development mode)
```

### Di Browser Console (F12):

Cek Network tab → image URL:
- ✅ `https://res.cloudinary.com/...` = Cloudinary aktif
- ❌ `/uploads/report-123.png` = Masih local (akan hilang)

---

## ⚠️ Catatan Penting

1. **Foto lama yang sudah diupload SEBELUM setup Cloudinary akan hilang**
   - Railway sudah hapus file karena ephemeral filesystem
   - User harus upload ulang laporan

2. **Foto baru (setelah setup Cloudinary) akan PERMANEN**
   - Tersimpan di Cloudinary cloud storage
   - Tidak akan hilang meskipun redeploy

3. **Development (localhost) tetap pakai local storage**
   - Di development tidak perlu Cloudinary
   - File tersimpan di `backend/uploads/`

---

## 📚 Resources

- [SETUP_CLOUDINARY.md](SETUP_CLOUDINARY.md) - Panduan lengkap setup
- [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md) - Deployment guide
- [Cloudinary Free Tier](https://cloudinary.com/pricing) - 25GB storage gratis

---

**Masih ada masalah?** Contact: sapukotaid@gmail.com / WhatsApp: 0877-2077-5950
