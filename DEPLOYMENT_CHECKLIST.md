# ✅ Deployment Checklist - Railway.app

Ikuti checklist ini untuk deploy SapuKota ke Railway.app (100% GRATIS!)

---

## 📝 Pre-Deployment

### Persiapan Git & GitHub
- [ ] Install Git di komputer
- [ ] Punya akun GitHub (buat gratis di github.com)
- [ ] Code sudah di folder `/Users/ree/Documents/SapuKota`

### Push ke GitHub
```bash
cd /Users/ree/Documents/SapuKota

# Init git (skip jika sudah ada)
git init
git add .
git commit -m "Initial commit - ready for Railway"

# Buat repo di GitHub (github.com/new), lalu:
git remote add origin https://github.com/USERNAME/SapuKota.git
git branch -M main
git push -u origin main
```
- [ ] Repository SapuKota sudah di GitHub
- [ ] Bisa lihat code di `github.com/USERNAME/SapuKota`

---

## 🚂 Railway Setup

### Account & Login
- [ ] Buka railway.app
- [ ] Klik "Login" → "Login with GitHub"
- [ ] Authorize Railway
- [ ] Masuk ke Railway dashboard

### Create Project
- [ ] Klik "+ New Project"
- [ ] Pilih "Provision MySQL"
- [ ] MySQL database created ✅

---

## 🔧 Backend Deployment

### Deploy Backend Service
- [ ] Di project, klik "+ New"
- [ ] Pilih "GitHub Repo" → select "SapuKota"
- [ ] Railway deploy otomatis

### Configure Backend
- [ ] Klik backend service
- [ ] Tab "Settings":
  - [ ] Service Name: `sapukota-backend`
  - [ ] Root Directory: `backend`
  - [ ] Start Command: `npm start` (should be auto-detected)

### Setup Environment Variables
- [ ] Tab "Variables" → klik "+ New Variable"
- [ ] Add variables:
  ```
  NODE_ENV=production
  JWT_SECRET=railway_secret_key_123456789_ganti_dengan_random_string
  PORT=5000
  ```

### Connect Database
- [ ] Tab "Variables" → "+ Reference"
- [ ] Select MySQL service
- [ ] Map variables:
  - [ ] `MYSQLHOST` → `DB_HOST`
  - [ ] `MYSQLPORT` → `DB_PORT`
  - [ ] `MYSQLDATABASE` → `DB_NAME`
  - [ ] `MYSQLUSER` → `DB_USER`
  - [ ] `MYSQLPASSWORD` → `DB_PASSWORD`

### Generate Backend URL
- [ ] Tab "Settings" → scroll to "Domains"
- [ ] Klik "Generate Domain"
- [ ] Copy URL: `https://__________.up.railway.app`
- [ ] Save URL ini untuk frontend config

### Test Backend
- [ ] Buka browser: `https://[BACKEND_URL]/api/health`
- [ ] Should see: `{"status":"OK","message":"SapuKota API is running"}`

---

## 🗄️ Database Migration

### Option 1: Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link
# Select: sapukota-backend service

# Run migration
railway run node -e "require('./src/models').sequelize.sync({alter:true})"

# Create admin
railway run node src/seeders/createAdmin.js
```

- [ ] Railway CLI installed
- [ ] Project linked
- [ ] Migrations executed
- [ ] Admin user created

### Option 2: Auto Migration (Alternative)
- [ ] Backend service → Settings
- [ ] Custom Start Command:
  ```
  node -e "const s=require('./src/models').sequelize;s.sync({alter:true}).then(()=>require('./src/server'))"
  ```
- [ ] Save & redeploy

---

## 🎨 Frontend Deployment

### Deploy Frontend Service
- [ ] Di project, klik "+ New"
- [ ] Pilih "GitHub Repo" → same "SapuKota" repo
- [ ] Railway create new service

### Configure Frontend
- [ ] Klik frontend service
- [ ] Tab "Settings":
  - [ ] Service Name: `sapukota-frontend`
  - [ ] Root Directory: `frontend`
  - [ ] Build Command: `npm install && npm run build`
  - [ ] Start Command: `npx serve -s dist -l $PORT`

### Setup API URL
- [ ] Tab "Variables" → "+ New Variable"
- [ ] Add:
  ```
  VITE_API_URL=https://[BACKEND_URL]/api
  ```
  Ganti `[BACKEND_URL]` dengan URL backend dari step sebelumnya

### Generate Frontend URL
- [ ] Tab "Settings" → "Domains"
- [ ] Klik "Generate Domain"
- [ ] Copy URL: `https://__________.up.railway.app`

### Test Frontend
- [ ] Buka frontend URL di browser
- [ ] Homepage muncul ✅
- [ ] No console errors

---

## 🧪 Testing

### Functional Tests
- [ ] Homepage loads
- [ ] Peta muncul dengan markers
- [ ] Bisa klik "Buat Laporan"
- [ ] Form buat laporan muncul
- [ ] Bisa login sebagai admin
- [ ] Dashboard admin muncul
- [ ] Peta tracking petugas muncul
- [ ] Bisa assign laporan ke petugas

### API Tests
- [ ] `/api/health` returns OK
- [ ] `/api/reports/recent` returns data
- [ ] `/api/users/petugas/count` returns count
- [ ] Login returns token
- [ ] Protected routes require auth

---

## 🌐 Custom Domain (Optional)

### If You Have Domain
- [ ] Frontend service → Settings → Domains
- [ ] Klik "Custom Domain"
- [ ] Enter: `www.yourdomain.com` or `sapukota.yourdomain.com`
- [ ] Railway gives CNAME value

### Update DNS
- [ ] Login to domain provider (Niagahoster, etc)
- [ ] Add CNAME record:
  ```
  Type: CNAME
  Name: www (or sapukota)
  Value: [value from Railway]
  TTL: 3600
  ```
- [ ] Save DNS changes
- [ ] Wait 5-30 minutes for propagation
- [ ] Check: dnschecker.org

### SSL Certificate
- [ ] Railway auto-provisions SSL
- [ ] Domain now HTTPS 🔒
- [ ] Test: `https://www.yourdomain.com`

---

## 📊 Post-Deployment

### Monitor Health
- [ ] Check Railway dashboard → Metrics
- [ ] CPU usage normal (<50%)
- [ ] Memory usage normal (<500MB)
- [ ] No errors in logs

### Check Credit Usage
- [ ] Dashboard → Profile → "Usage"
- [ ] Monitor monthly credit consumption
- [ ] Should be within $5 free tier

### Setup Monitoring (Optional)
- [ ] Add UptimeRobot (free uptime monitoring)
- [ ] Add Google Analytics to frontend
- [ ] Setup error tracking (Sentry free tier)

---

## 🎉 Success Criteria

### ✅ Deployment Successful If:
- [x] Backend accessible via HTTPS
- [x] Frontend accessible via HTTPS
- [x] Can create reports
- [x] Can login as admin
- [x] Database connected
- [x] No errors in console
- [x] GPS features working
- [x] Custom domain working (if setup)

### 📈 Performance Checks:
- [ ] Page load < 3 seconds
- [ ] API response < 1 second
- [ ] Images load properly
- [ ] Maps render correctly
- [ ] Mobile responsive

---

## 🔄 Update Workflow

### After Code Changes:
```bash
# Local
git add .
git commit -m "Update feature X"
git push origin main
```

- [ ] Railway auto-detects push
- [ ] Auto-deploys new version
- [ ] Check deploy logs for success
- [ ] Test updated features

---

## 📝 Important URLs to Save

```
GitHub Repo: https://github.com/USERNAME/SapuKota
Railway Dashboard: https://railway.app/project/YOUR_PROJECT_ID

Backend URL: https://__________.up.railway.app
Frontend URL: https://__________.up.railway.app
Custom Domain: https://www.yourdomain.com (if applicable)

Admin Login:
Email: _______________
Password: _______________
```

---

## 🆘 If Something Goes Wrong

### Backend Won't Start
1. Check logs: Service → Deploy Logs
2. Check environment variables
3. Check database connection
4. Run: `railway logs --service sapukota-backend`

### Frontend Shows Error
1. Check VITE_API_URL is correct
2. Check backend is running
3. Check console for errors
4. Redeploy frontend

### Database Connection Error
1. Check MySQL service is running
2. Check environment variables are mapped
3. Test connection: `railway run mysql -h $DB_HOST -u $DB_USER -p`

### Out of Credit
1. Check usage: Dashboard → Usage
2. Upgrade to Pro plan ($5/month)
3. Or optimize: reduce runtime, add sleep

---

## ✨ Next Steps After Deployment

- [ ] Share URL with friends/client
- [ ] Add to portfolio website
- [ ] Write documentation
- [ ] Create demo video
- [ ] Get user feedback
- [ ] Plan next features

---

**🎊 CONGRATULATIONS! 🎊**

Aplikasi kamu sudah **LIVE** dan bisa diakses dari seluruh dunia!

**Free, Fast, and Professional** 🚀
