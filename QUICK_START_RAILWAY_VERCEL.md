# 🚀 Quick Start: Deploy SapuKota (Railway + Vercel)

Panduan singkat deployment backend ke Railway dan frontend ke Vercel.

---

## 📋 Overview

```
┌─────────────────────────────────────────────────────────┐
│                    DEPLOYMENT FLOW                      │
└─────────────────────────────────────────────────────────┘

1️⃣  Deploy Backend ke Railway
    │
    ├─ Create Railway project dari GitHub
    ├─ Add MySQL database
    ├─ Set environment variables
    ├─ Run database migrations
    └─ Get backend URL ✅
         │
         │
2️⃣  Deploy Frontend ke Vercel
    │
    ├─ Import project dari GitHub  
    ├─ Set VITE_API_URL (dari Railway)
    ├─ Deploy
    └─ Get frontend URL ✅
         │
         │
3️⃣  Connect Backend ↔️ Frontend
    │
    ├─ Update FRONTEND_URL di Railway
    └─ Test end-to-end ✅
```

---

## ⚡ Quick Steps

### Step 1: Deploy Backend ke Railway (~15 menit)

1. **Login Railway**
   - [railway.app](https://railway.app)
   - Login with GitHub

2. **Create New Project**
   - New Project → Deploy from GitHub repo
   - Pilih repository SapuKota
   - Set **Root Directory**: `backend`

3. **Add MySQL Database**
   - ➕ New → Database → Add MySQL

4. **Set Environment Variables**
   
   Klik backend service → Tab **Variables** → Tambahkan:
   
   | Variable | Value |
   |----------|-------|
   | `NODE_ENV` | `production` |
   | `DB_HOST` | Salin dari MySQL → `MYSQL_HOST` |
   | `DB_PORT` | Salin dari MySQL → `MYSQL_PORT` |
   | `DB_USER` | Salin dari MySQL → `MYSQL_USER` |
   | `DB_PASSWORD` | Salin dari MySQL → `MYSQL_PASSWORD` |
   | `DB_NAME` | Salin dari MySQL → `MYSQL_DATABASE` |
   | `JWT_SECRET` | [Generate random 32+ chars](https://randomkeygen.com) |
   | `FRONTEND_URL` | `https://sapukota.vercel.app` (isi dulu, update nanti) |

5. **Generate Backend URL**
   - Backend service → Settings → Domains
   - **Generate Domain**
   - **SIMPAN URL INI!** Contoh: `https://sapukota-backend-production.up.railway.app`

6. **Run Database Migrations**
   
   Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   railway login
   railway link
   ```
   
   Connect ke MySQL:
   ```bash
   railway connect MySQL
   ```
   
   Copy-paste isi file migration (.sql) satu per satu:
   - `migrations/update_reports_table.sql`
   - `migrations/add_coordinates_to_reports.sql`
   - `migrations/add_petugas_tracking.sql`
   - `migrations/add_petugas_gps_tracking.sql`

7. **Create Admin User**
   ```bash
   railway run npm run seed:admin
   ```

8. **Test Backend**
   ```bash
   curl https://your-backend-url.railway.app/api/health
   ```
   
   Expected: `{"status":"OK","message":"SapuKota API is running"}`

✅ **Backend deployed!**

---

### Step 2: Deploy Frontend ke Vercel (~10 menit)

1. **Login Vercel**
   - [vercel.com](https://vercel.com)
   - Login with GitHub

2. **Import Project**
   - Add New → Project
   - Import repository SapuKota
   - Set **Root Directory**: `frontend`

3. **Set Environment Variable**
   
   Sebelum deploy, tambahkan:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend.railway.app/api` |
   
   ⚠️ **PENTING:** Tambahkan `/api` di akhir!
   
   Environment: Centang **Production**, **Preview**, **Development** (semua)

4. **Deploy**
   - Klik **Deploy**
   - Wait 2-3 menit

5. **Get Frontend URL**
   - Setelah deploy selesai, URL otomatis dibuat
   - Contoh: `https://sapukota.vercel.app`
   - **SIMPAN URL INI!**

6. **Test Frontend**
   - Buka URL Vercel
   - Coba login:
     - Email: `admin@sapukota.id`
     - Password: `admin123`

✅ **Frontend deployed!**

---

### Step 3: Connect Backend ↔️ Frontend (~2 menit)

1. **Update FRONTEND_URL di Railway**
   - Railway → Backend service → Variables
   - Edit `FRONTEND_URL`:
     ```
     https://sapukota.vercel.app
     ```
     (Ganti dengan URL Vercel Anda yang sebenarnya)
   - Save (Railway auto-redeploy ~1 menit)

2. **Test End-to-End**
   - Buka frontend Vercel
   - Login
   - Test fitur GPS tracking
   - Buat laporan baru

✅ **Deployment complete!**

---

## 📝 Detailed Guides

Untuk step-by-step lengkap dengan troubleshooting:

1. **[DEPLOY_RAILWAY_BACKEND.md](DEPLOY_RAILWAY_BACKEND.md)** - Panduan lengkap Railway backend
2. **[DEPLOY_VERCEL_FRONTEND.md](DEPLOY_VERCEL_FRONTEND.md)** - Panduan lengkap Vercel frontend
3. **[ENV_VARIABLES_GUIDE.md](ENV_VARIABLES_GUIDE.md)** - Referensi environment variables

---

## 🔐 Environment Variables Cheat Sheet

### Railway Backend

```env
NODE_ENV=production
DB_HOST=[from Railway MySQL]
DB_PORT=[from Railway MySQL]
DB_USER=[from Railway MySQL]
DB_PASSWORD=[from Railway MySQL]
DB_NAME=[from Railway MySQL]
JWT_SECRET=[random 32+ chars]
FRONTEND_URL=https://sapukota.vercel.app
```

### Vercel Frontend

```env
VITE_API_URL=https://your-backend.railway.app/api
```

---

## ✅ Deployment Checklist

### Pre-Deployment

- [ ] Project sudah di GitHub
- [ ] Login Railway & Vercel dengan GitHub

### Railway Backend

- [ ] Backend service created dari GitHub
- [ ] Root directory: `backend`
- [ ] MySQL database added
- [ ] Environment variables configured (8 variables)
- [ ] Backend URL generated
- [ ] Database migrations executed
- [ ] Admin user created
- [ ] Health check API works

### Vercel Frontend

- [ ] Frontend project imported dari GitHub
- [ ] Root directory: `frontend`
- [ ] `VITE_API_URL` configured
- [ ] Deployment successful
- [ ] Frontend URL generated
- [ ] Login page loads

### Post-Deployment

- [ ] `FRONTEND_URL` updated di Railway
- [ ] Login works
- [ ] API calls successful (no CORS errors)
- [ ] GPS tracking works
- [ ] Image upload works
- [ ] All features tested

---

## 🐛 Quick Troubleshooting

### Backend won't start

**Check Railway logs:**
- Backend service → Deployments → Latest → View Logs

**Common fixes:**
- Verify all environment variables set
- Check database connection (DB_HOST, DB_USER, etc.)
- Ensure root directory is `backend`

### Frontend can't connect to backend

**CORS Error:**
```
Access to fetch blocked by CORS policy
```

**Fix:**
- Railway backend → Variables → Update `FRONTEND_URL`
- Must be exact: `https://sapukota.vercel.app` (no trailing slash)

**API URL wrong:**

Browser console:
```javascript
console.log(import.meta.env.VITE_API_URL);
```

**Fix:**
- Vercel → Settings → Environment Variables
- Check `VITE_API_URL` ends with `/api`
- Redeploy Vercel

### Database migrations failed

**Connect to Railway MySQL:**
```bash
railway connect MySQL
```

**Copy-paste SQL content** instead of using `source` command.

---

## 🎯 URLs Reference

| Service | URL | Keterangan |
|---------|-----|------------|
| **Backend (Railway)** | `https://_____.railway.app` | API endpoint |
| **Frontend (Vercel)** | `https://_____.vercel.app` | User interface |
| **API Endpoint** | `https://_____.railway.app/api` | For VITE_API_URL |

---

## 💡 Pro Tips

### Auto-Deploy from GitHub

Setelah initial deployment, setiap git push akan auto-deploy:

```bash
git add .
git commit -m "Update features"
git push origin main
```

- Railway: Auto-deploy backend (~1-2 min)
- Vercel: Auto-deploy frontend (~2-3 min)

### View Live Logs

**Railway:**
```bash
railway logs
```

**Vercel:**
- Project → Deployments → Latest → Functions

### Preview Deployments (Vercel)

Test changes sebelum production:

```bash
git checkout -b feature/new-update
git push origin feature/new-update
```

Vercel akan create preview URL untuk review!

---

## 📞 Support Resources

| Platform | Resource |
|----------|----------|
| **Railway** | [docs.railway.app](https://docs.railway.app) |
| **Vercel** | [vercel.com/docs](https://vercel.com/docs) |
| **Discord** | Railway: [discord.gg/railway](https://discord.gg/railway) |
| **Discord** | Vercel: [vercel.com/discord](https://vercel.com/discord) |

---

## 🎉 Success!

Your SapuKota app is now live:

- ✅ Backend: Railway (Node.js + MySQL)
- ✅ Frontend: Vercel (React + Vite)
- ✅ Auto-deploy: Every git push
- ✅ Free tier: $5/month Railway credit + Vercel unlimited

**Share your app:**
```
https://sapukota.vercel.app
```

**Need help?** Check detailed guides:
- [DEPLOY_RAILWAY_BACKEND.md](DEPLOY_RAILWAY_BACKEND.md)
- [DEPLOY_VERCEL_FRONTEND.md](DEPLOY_VERCEL_FRONTEND.md)
- [ENV_VARIABLES_GUIDE.md](ENV_VARIABLES_GUIDE.md)
