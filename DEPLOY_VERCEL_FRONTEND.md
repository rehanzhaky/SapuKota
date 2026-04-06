# ▲ Deploy Frontend SapuKota ke Vercel

Panduan lengkap deploy frontend (React + Vite) ke Vercel

## ✅ Persiapan

- [x] Project sudah di GitHub
- [x] Backend sudah deployed di Railway (ada backend URL)
- [ ] Akun Vercel ([vercel.com](https://vercel.com))
- [ ] Akun GitHub (untuk login Vercel)

---

## 📝 Langkah 1: Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Sign Up"** atau **"Login"**
3. Pilih **"Continue with GitHub"**
4. Authorize Vercel untuk akses repository GitHub Anda

---

## 📦 Langkah 2: Import Project dari GitHub

### 2.1 Add New Project

1. Di Vercel dashboard, klik **"Add New..."** → **"Project"**
2. Pilih **"Import Git Repository"**
3. Cari dan pilih repository **SapuKota**
4. Klik **"Import"**

### 2.2 Configure Project

Vercel akan mendeteksi framework secara otomatis. Pastikan settings berikut:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` (auto-detected) |
| **Root Directory** | `frontend` |
| **Build Command** | `npm run build` (auto) |
| **Output Directory** | `dist` (auto) |
| **Install Command** | `npm install` (auto) |

### 2.3 Set Root Directory

**PENTING:** Karena frontend ada di folder `frontend/`:

1. Klik **"Edit"** di sebelah Root Directory
2. Pilih: `frontend`
3. Centang: **"Include source files outside of the Root Directory in the Build Step"** ❌ (JANGAN dicentang)

---

## 🔐 Langkah 3: Configure Environment Variables

Sebelum deploy, kita harus set environment variable untuk backend URL.

### 3.1 Add Environment Variables

1. Masih di halaman konfigurasi project
2. Scroll ke **"Environment Variables"**
3. Klik **"Add"** atau expand section

### 3.2 Tambahkan Variable

| Key | Value | Keterangan |
|-----|-------|------------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` | Backend Railway URL + `/api` |

**Contoh:**
```
Key: VITE_API_URL
Value: https://sapukota-backend-production.up.railway.app/api
```

⚠️ **PENTING:** 
- Jangan lupa tambahkan `/api` di akhir URL!
- Ganti `your-backend.up.railway.app` dengan URL Railway backend Anda yang sebenarnya
- Dapatkan URL dari Railway: Service Backend → Settings → Domains

### 3.3 Environment untuk Semua Branches

- Environment: Pilih **"Production"**, **"Preview"**, dan **"Development"** (centang semua)
- Ini memastikan API URL tersedia di semua environment

---

## 🚀 Langkah 4: Deploy!

1. Setelah semua konfigurasi selesai, klik **"Deploy"**
2. Vercel akan:
   - Clone repository
   - Install dependencies (`npm install`)
   - Build project (`npm run build`)
   - Deploy ke CDN

### 4.1 Monitor Build Progress

Anda akan melihat build logs real-time:

```bash
Running "npm install"
✓ Installing dependencies...

Running "npm run build"  
✓ Building Vite project...
✓ Dist folder created

Deploying...
✓ Deployment completed!
```

**Build time:** ~2-3 menit

---

## 🌐 Langkah 5: Dapatkan Frontend URL

Setelah deployment selesai:

1. Vercel akan otomatis redirect ke halaman deployment
2. Anda akan melihat:
   ```
   https://sapukota.vercel.app
   ```
   atau
   ```
   https://sapukota-git-main-username.vercel.app
   ```

3. **SIMPAN URL INI!** Anda akan butuh untuk update CORS di Railway backend

4. **Test URL:** Klik URL untuk membuka aplikasi

---

## 🔗 Langkah 6: Update Backend CORS

Frontend Vercel sekarang perlu izin untuk akses backend Railway.

### 6.1 Update FRONTEND_URL di Railway

1. Buka [railway.app](https://railway.app)
2. Pilih project SapuKota
3. Klik service **backend**
4. Tab **"Variables"**
5. Edit variable `FRONTEND_URL`:
   ```
   https://sapukota.vercel.app
   ```
   (Ganti dengan URL Vercel Anda yang sebenarnya)
6. Klik **"Save"**

Railway akan otomatis **redeploy** backend dengan CORS settings baru.

### 6.2 Verify CORS Configuration

Backend code (`backend/src/server.js`) sudah configured untuk menggunakan `FRONTEND_URL`:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
```

Setelah update `FRONTEND_URL`, backend akan allow requests dari Vercel frontend.

---

## 🧪 Langkah 7: Test Deployment

### 7.1 Test Manual

1. Buka URL Vercel: `https://sapukota.vercel.app`
2. Halaman home harus load dengan baik
3. Coba **Login**:
   - Email: `admin@sapukota.id`
   - Password: `admin123` (atau password yang Anda set)
4. Jika login berhasil → ✅ Frontend-Backend connection OK!

### 7.2 Test Features

**Test GPS Tracking:**
- Login sebagai admin
- Buka dashboard DLH
- Cek live tracking map

**Test Reporting:**
- Buat laporan baru
- Upload foto
- Submit

**Test API Connection:**

Buka browser console (F12) dan run:

```javascript
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(data => console.log('API Health:', data))
```

Expected output:
```
API Health: {status: "ok", database: "connected"}
```

---

## ⚙️ Langkah 8: Configure Vercel Settings (Optional)

### 8.1 Custom Domain

Jika punya domain sendiri (contoh: `sapu-kota.com`):

1. Di Vercel project → **"Settings"** → **"Domains"**
2. Klik **"Add"**
3. Masukkan domain: `sapu-kota.com`
4. Configure DNS:

**Untuk Root Domain (sapu-kota.com):**
- Type: `A`
- Name: `@`
- Value: `76.76.21.21` (Vercel IP)

**Untuk www Subdomain:**
- Type: `CNAME`
- Name: `www`
- Value: `cname.vercel-dns.com`

5. Wait untuk DNS propagation (~5-60 menit)

### 8.2 Environment Variables Update

Setelah custom domain aktif, update `FRONTEND_URL` di Railway:

```
https://sapu-kota.com
```

### 8.3 Build & Development Settings

Di **Settings** → **"General"**:

| Setting | Recommended Value |
|---------|------------------|
| **Node.js Version** | 18.x (default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

---

## 🔄 Auto-Deploy dari GitHub

Vercel otomatis deploy setiap kali ada push ke GitHub:

### Main Branch (Production)

```bash
# Edit code
git add .
git commit -m "Update frontend"
git push origin main
```

Vercel otomatis deploy ke production URL: `https://sapukota.vercel.app`

### Preview Deployments

Setiap **pull request** atau **branch push** akan create preview deployment:

```bash
git checkout -b feature/new-button
# Make changes
git push origin feature/new-button
```

Vercel akan deploy ke: `https://sapukota-git-feature-new-button.vercel.app`

---

## 📊 Monitoring & Analytics

### Vercel Dashboard

Monitor deployment di Vercel dashboard:

- **Overview**: Traffic, bandwidth, build status
- **Deployments**: Riwayat semua deployments (production + preview)
- **Analytics**: Visitor stats, page views, performance (Paid feature)
- **Logs**: Runtime logs and errors

### Real-Time Logs

1. Klik project
2. Tab **"Deployments"**
3. Klik deployment terbaru
4. Tab **"Functions"** → View logs

---

## 🐛 Troubleshooting

### Build Failed

**Check Build Logs:**
1. Vercel → Project → **Deployments**
2. Klik failed deployment
3. Tab **"Building"** → Lihat error

**Common Issues:**

1. **Module Not Found**
   - Pastikan semua dependencies ada di `package.json`
   - Root directory harus `frontend`

2. **Build Command Failed**
   - Check `package.json` scripts: harus ada `"build": "vite build"`
   - Test build locally: `cd frontend && npm run build`

3. **Environment Variable Not Found**
   - Pastikan `VITE_API_URL` sudah di-set
   - Restart deployment: **Deployments** → ⋯ (kebab menu) → **Redeploy**

### API Connection Failed

**Error: CORS Policy**

Frontend bisa load tapi API calls gagal dengan error:
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**Solution:**
1. Pastikan `FRONTEND_URL` di Railway backend sudah correct
2. Harus exact match: `https://sapukota.vercel.app` (no trailing slash)
3. Redeploy Railway backend after updating

**Error: API URL Not Defined**

Check environment variable:

1. Vercel → Project → **Settings** → **Environment Variables**
2. Pastikan `VITE_API_URL` ada
3. Jika tidak ada, tambahkan dan redeploy

**Test API URL:**

Buka browser console dan run:
```javascript
console.log(import.meta.env.VITE_API_URL)
```

Should output:
```
https://your-backend.up.railway.app/api
```

### 404 on Page Refresh

Single Page Application (SPA) routing issue.

**Solution:** Vercel sudah auto-handle ini untuk Vite projects. Jika masih ada masalah, create `vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

Tapi biasanya **TIDAK PERLU** untuk Vite projects.

### Map Not Loading

Leaflet map tidak muncul.

**Check:**
1. Browser console untuk errors
2. Leaflet CSS sudah diimport di `index.html` atau component
3. GPS permissions granted di browser

### Image Upload Failed

**Check Backend Logs:**
- Railway backend → **Logs**
- Look for upload errors

**Common Causes:**
- Backend `uploads/` folder issues
- File size limits
- CORS preventing file upload

---

## 💡 Tips & Best Practices

### 1. Preview Branches

Test perubahan sebelum deploy ke production:

```bash
git checkout -b preview/test-feature
git push origin preview/test-feature
```

Vercel akan create preview URL. Share dengan team untuk review!

### 2. Environment Variables per Branch

Set different API URLs untuk preview vs production:

1. **Settings** → **Environment Variables**
2. Pilih environment: "Production" only atau "Preview" only
3. Bisa test backend staging di preview deployments

### 3. Build Optimization

**Reduce Build Time:**

`.vercelignore` file (optional):
```
node_modules
.git
*.log
```

**Reduce Bundle Size:**

Check bundle analyzer:
```bash
npm run build -- --analyze
```

### 4. Caching & Performance

Vercel otomatis:
- Edge caching untuk static assets
- Image optimization
- CDN distribution worldwide

### 5. Monitoring

Install Vercel Analytics (optional):

```bash
cd frontend
npm install @vercel/analytics
```

`main.jsx`:
```javascript
import { Analytics } from '@vercel/analytics/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>
);
```

---

## ✅ Deployment Checklist

- [ ] Vercel account created & connected to GitHub
- [ ] Project imported from GitHub
- [ ] Root directory set to `frontend`
- [ ] `VITE_API_URL` environment variable configured
- [ ] Build completed successfully
- [ ] Frontend URL generated
- [ ] `FRONTEND_URL` updated di Railway backend
- [ ] Login tested successfully
- [ ] API connection verified
- [ ] GPS features working
- [ ] Image upload working
- [ ] Custom domain configured (optional)

---

## 🎯 Next Steps

Setelah frontend berhasil deployed:

1. ✅ **Test End-to-End**: Semua fitur (login, laporan, GPS tracking)
2. ✅ **Monitor Logs**: Railway backend + Vercel frontend
3. ✅ **Setup Custom Domain**: Jika punya (optional)
4. ✅ **Share dengan Team**: Untuk testing
5. ✅ **Create Admin & Petugas Accounts**: Via admin dashboard

---

## 📞 Support

Jika ada masalah:

1. **Check Vercel Logs** - Build dan runtime errors
2. **Vercel Discord** - [vercel.com/discord](https://vercel.com/discord)
3. **Vercel Docs** - [vercel.com/docs](https://vercel.com/docs)

---

## 📋 Quick Reference

### Important URLs

**Frontend (Vercel):**
```
https://_____________________.vercel.app
```

**Backend (Railway):**
```
https://_____________________.up.railway.app
```

**API Endpoint:**
```
https://_____________________.up.railway.app/api
```

### Environment Variables

**Vercel (`VITE_API_URL`):**
```
https://your-backend.up.railway.app/api
```

**Railway (`FRONTEND_URL`):**
```
https://your-frontend.vercel.app
```

---

## 🚀 Deployment Complete!

Your SapuKota app is now live:

- ✅ Frontend: Vercel (Global CDN, Auto-SSL, DDoS protection)
- ✅ Backend: Railway (Auto-scaling, MySQL database, 24/7 uptime)
- ✅ Auto-deploy: Every git push

**Share your app:** `https://sapukota.vercel.app` 🎉
