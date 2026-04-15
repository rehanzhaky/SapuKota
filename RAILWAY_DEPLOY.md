# 🚂 Deploy ke Railway.app - Super Cepat (15 menit)

Railway.app adalah platform cloud paling mudah untuk deploy full-stack app. **100% GRATIS** untuk start!

---

## 📋 Yang Kamu Butuhkan

- ✅ Akun GitHub (gratis)
- ✅ Repository GitHub SapuKota (push code kamu)
- ✅ Domain (opsional - Railway kasih subdomain gratis)

---

## 🚀 Langkah Deploy (15 Menit)

### 1️⃣ Push Code ke GitHub (5 menit)

```bash
# Di terminal, di folder SapuKota
cd /Users/ree/Documents/SapuKota

# Initialize Git (skip jika sudah ada .git)
git init

# Add all files
git add .
git commit -m "Ready for Railway deployment"

# Create repo di GitHub, lalu:
git remote add origin https://github.com/YOUR_USERNAME/SapuKota.git
git branch -M main
git push -u origin main
```

### 2️⃣ Sign Up Railway (2 menit)

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"** → **"Login with GitHub"**
3. Authorize Railway
4. ✅ Done! No credit card needed

### 3️⃣ Deploy MySQL Database (1 menit)

1. Di Railway dashboard, klik **"+ New Project"**
2. Pilih **"Provision MySQL"**
3. Railway otomatis create database
4. ✅ Database ready!

### 4️⃣ Deploy Backend (3 menit)

1. Di project yang sama, klik **"+ New"**
2. Pilih **"GitHub Repo"** → pilih repository **SapuKota**
3. Railway detect code dan deploy backend

**Configure Backend:**
1. Klik service yang baru dibuat
2. Tab **"Settings"**:
   - **Service Name**: `sapukota-backend`
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

3. Tab **"Variables"** - klik **"+ New Variable"**, tambahkan:
   ```
   NODE_ENV=production
   JWT_SECRET=railway_secret_123456789012345678901234567890
   PORT=5000
   ```
   
   **⚠️ IMPORTANT: Tambahkan juga Cloudinary credentials** (untuk upload foto):
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
   
   📚 **Belum punya Cloudinary?** Ikuti panduan: [SETUP_CLOUDINARY.md](SETUP_CLOUDINARY.md) (5 menit, GRATIS!)

4. **Connect ke MySQL Database:**
   - Klik tab "Variables" lagi
   - Klik **"+ Reference"** → pilih MySQL service
   - Add these references:
     - `MYSQLHOST` → save as `DB_HOST`
     - `MYSQLPORT` → save as `DB_PORT`
     - `MYSQLDATABASE` → save as `DB_NAME`
     - `MYSQLUSER` → save as `DB_USER`
     - `MYSQLPASSWORD` → save as `DB_PASSWORD`

5. Service otomatis redeploy dengan database connection

### 5️⃣ Run Database Migrations (2 menit)

**Option A: Via Railway Dashboard**
1. Klik backend service → tab **"Console"**
2. Connect to shell (butuh Railway CLI)

**Option B: Via Railway CLI (Recommended)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login (buka browser untuk authorize)
railway login

# Link to your project
railway link

# Select your backend service
# Run migrations
railway run npm run migrate  # jika punya script migrate
# atau
railway run node -e "const {sequelize} = require('./src/models'); sequelize.sync({alter: true})"

# Create admin user
railway run node src/seeders/createAdmin.js
```

**Option C: Automatic Migration (Set in Railway)**
1. Backend service → Settings → Deploy
2. Di **"Custom Start Command"**:
   ```bash
   node -e "const s=require('./src/models').sequelize;s.sync({alter:true}).then(()=>require('./src/server'))"
   ```
3. Save & redeploy

### 6️⃣ Get Backend URL (15 detik)

1. Klik backend service
2. Tab **"Settings"** → scroll ke **"Domains"**
3. Klik **"Generate Domain"**
4. Copy URL (contoh: `sapukota-backend-production.up.railway.app`)
5. ✅ Backend live!

Test: Buka `https://sapukota-backend-production.up.railway.app/api/health`
Should return: `{"status":"OK","message":"SapuKota API is running"}`

### 7️⃣ Deploy Frontend (2 menit)

1. Di Railway project, klik **"+ New"** lagi
2. Pilih **"GitHub Repo"** → same repository **SapuKota**
3. Railway create new service

**Configure Frontend:**
1. Klik service frontend
2. Tab **"Settings"**:
   - **Service Name**: `sapukota-frontend`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npx serve -s dist -l $PORT`

3. Tab **"Variables"**:
   ```
   VITE_API_URL=https://[BACKEND_URL]/api
   ```
   Ganti `[BACKEND_URL]` dengan URL backend dari step 6

4. **Generate Domain:**
   - Tab "Settings" → "Domains"
   - Klik **"Generate Domain"**
   - Copy URL (contoh: `sapukota-frontend.up.railway.app`)

5. ✅ Frontend live!

### 8️⃣ Test Aplikasi

1. Buka frontend URL di browser
2. Test login dengan admin credentials
3. Test buat laporan
4. ✅ All working!

---

## 🌐 Setup Custom Domain (Opsional)

### Kalau Kamu Punya Domain:

1. **Di Railway:**
   - Frontend service → Settings → Domains
   - Klik **"Custom Domain"**
   - Masukkan: `www.yourdomain.com` atau `sapukota.yourdomain.com`
   - Railway kasih CNAME value

2. **Di DNS Provider Kamu:**
   - Login ke domain panel (Niagahoster, Hostinger, etc)
   - Tambah CNAME record:
     ```
     Type: CNAME
     Name: www (atau sapukota)
     Value: [value dari Railway]
     TTL: 3600
     ```
   - Save

3. **Tunggu DNS Propagasi:**
   - Biasanya 5-30 menit
   - Check: https://dnschecker.org

4. **SSL Otomatis:**
   - Railway otomatis provision SSL
   - Domain langsung HTTPS! 🔒

### Setup Root Domain (@):

Beberapa DNS provider tidak support CNAME di root. Solusi:

**Option 1: Gunakan Cloudflare (Gratis + Better)**
```
1. Pindahkan DNS ke Cloudflare (gratis)
2. Add CNAME untuk @ (Cloudflare support ini)
3. Bonus: Global CDN gratis!
```

**Option 2: Gunakan Subdomain**
```
www.yourdomain.com  → Frontend
api.yourdomain.com  → Backend (opsional)
```

---

## 💰 Free Tier Limits

Railway free tier:
- **$5 credit/bulan** (sekitar Rp 75.000)
- Credit reset setiap bulan
- **~500 jam runtime** (cukup untuk 1 backend + 1 frontend 24/7)
- **1GB RAM** per service
- **1GB Storage**
- **100GB Bandwidth**

**Estimasi Usage:**
- Backend 24/7: ~$3-4/bulan
- Frontend 24/7: ~$0.5-1/bulan
- **Total: Masih dalam $5 free tier!** ✅

**Tips Hemat:**
- Services sleep otomatis saat tidak ada traffic
- First request wake up (~2-5 detik)
- Perfect untuk portfolio/demo projects

---

## 🔧 Update Aplikasi Setelah Deploy

Setiap kali kamu push ke GitHub:

```bash
# Local changes
git add .
git commit -m "Update features"
git push origin main
```

Railway **otomatis detect dan deploy**! 🎉

No need manual redeploy!

---

## 📊 Monitor Aplikasi

### Check Logs:
1. Railway dashboard → service → **"Deploy Logs"**
2. Real-time logs saat deploy
3. Atau **"Logs"** tab untuk runtime logs

### Check Metrics:
1. Dashboard → service → **"Metrics"**
2. Lihat:
   - CPU usage
   - Memory usage
   - Network traffic
   - Response times

### Check Credit Usage:
1. Dashboard → klik profile (top right)
2. **"Usage"** → lihat remaining credit
3. Projects → lihat per-project usage

---

## 🐛 Troubleshooting

### Backend Error: Database Connection Failed
```bash
# Check environment variables
1. Service → Variables
2. Pastikan DB_HOST, DB_USER, DB_PASSWORD, DB_NAME ada
3. Check MySQL service running
```

### Frontend Error: Cannot Fetch API
```bash
# Check VITE_API_URL
1. Frontend service → Variables
2. VITE_API_URL harus = https://backend-url.railway.app/api
3. Redeploy frontend setelah update
```

### 500 Error / Blank Page
```bash
# Check logs
railway logs --service sapukota-backend
# atau via dashboard → Logs tab
```

### Database Tables Not Created
```bash
# Run sync manually
railway run node -e "require('./src/models').sequelize.sync({force:false,alter:true})"
```

---

## ✅ Checklist Deploy Sukses

- [ ] Code sudah di GitHub
- [ ] Railway account sudah dibuat
- [ ] MySQL database provisioned
- [ ] Backend deployed & URL generated
- [ ] Database migrations executed
- [ ] Admin user created
- [ ] Frontend deployed with correct VITE_API_URL
- [ ] Frontend URL generated
- [ ] Test login works
- [ ] Test create report works
- [ ] (Opsional) Custom domain setup

---

## 🎉 Selamat!

Aplikasi kamu sudah **LIVE** dan bisa diakses dari mana saja!

**Backend:** `https://your-backend.up.railway.app`  
**Frontend:** `https://your-frontend.up.railway.app`  
**Custom Domain:** `https://www.yourdomain.com` (jika setup)

**Total waktu:** ~15 menit  
**Total biaya:** **Rp 0,-** (free tier)

---

## 🚀 Next Steps

1. **Share link** ke teman/client
2. **Add to portfolio** dengan screenshots
3. **Monitor usage** di Railway dashboard
4. **Update features** (otomatis deploy via Git push)

**Need help?** Tanya aja! 😊
