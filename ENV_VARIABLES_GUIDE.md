# 🔐 Environment Variables - Railway Backend & Vercel Frontend

Referensi lengkap semua environment variables yang diperlukan untuk deployment.

---

## 🚂 Railway Backend Environment Variables

Setup di: Railway → Backend Service → Tab **"Variables"**

### Required Variables

| Variable Name | Value / Source | Keterangan |
|---------------|----------------|------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Port backend (Railway akan override dengan $PORT) |
| `DB_HOST` | **Dari MySQL service** | Railway MySQL host |
| `DB_PORT` | **Dari MySQL service** | Railway MySQL port (biasanya 3306) |
| `DB_USER` | **Dari MySQL service** | Railway MySQL username |
| `DB_PASSWORD` | **Dari MySQL service** | Railway MySQL password |
| `DB_NAME` | **Dari MySQL service** | Railway MySQL database name |
| `JWT_SECRET` | **Generate random string** | Secret untuk JWT authentication |
| `FRONTEND_URL` | `https://sapukota.vercel.app` | Vercel frontend URL (untuk CORS) |

### Cara Mendapatkan MySQL Credentials

1. Di Railway, klik **MySQL service** (bukan backend service)
2. Pergi ke tab **"Variables"**
3. Salin nilai dari variables berikut:
   - `MYSQL_HOST` → Copy ke `DB_HOST`
   - `MYSQL_PORT` → Copy ke `DB_PORT`
   - `MYSQL_USER` → Copy ke `DB_USER`
   - `MYSQL_PASSWORD` → Copy ke `DB_PASSWORD`
   - `MYSQL_DATABASE` → Copy ke `DB_NAME`

### Generate JWT_SECRET

Pilih salah satu cara:

**Cara 1 - Terminal/Command Line:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Cara 2 - Online Generator:**
- Buka: [randomkeygen.com](https://randomkeygen.com)
- Pilih "CodeIgniter Encryption Keys"
- Copy string yang dihasilkan

**Cara 3 - Manual Random String:**
Minimal 32 karakter, kombinasi huruf, angka, simbol:
```
7f3a9b2c8d4e6f1a5b9c3d7e2f8a4b6c1d9e2f7a3b8c5d6e
```

### Example Configuration

```env
# Railway Backend Environment Variables
NODE_ENV=production
PORT=3000

# Database (dari Railway MySQL service)
DB_HOST=containers-us-west-123.railway.app
DB_PORT=6543
DB_USER=railway
DB_PASSWORD=abc123xyz456
DB_NAME=railway

# Security
JWT_SECRET=7f3a9b2c8d4e6f1a5b9c3d7e2f8a4b6c1d9e2f7a3b8c5d6e

# Frontend (Vercel URL)
FRONTEND_URL=https://sapukota.vercel.app
```

⚠️ **PENTING:**
- Jangan commit `.env` dengan values asli ke GitHub!
- Values di atas hanya contoh - gunakan values Anda sendiri
- `FRONTEND_URL` harus EXACT match dengan Vercel URL (no trailing slash)

---

## ▲ Vercel Frontend Environment Variables

Setup di: Vercel → Project Config → Section **"Environment Variables"**

### Required Variables

| Variable Name | Value | Keterangan |
|---------------|-------|------------|
| `VITE_API_URL` | `https://your-backend.up.railway.app/api` | Railway backend API URL |

### Cara Mendapatkan Backend URL

1. Di Railway, klik **Backend service** (bukan MySQL)
2. Pergi ke tab **"Settings"**
3. Scroll ke section **"Domains"**
4. Jika belum ada, klik **"Generate Domain"**
5. Copy URL yang dibuat (contoh: `https://sapukota-backend-production.up.railway.app`)
6. **Tambahkan `/api` di akhir!**

### Example Configuration

**Di Vercel Environment Variables:**

```
Key: VITE_API_URL
Value: https://sapukota-backend-production.up.railway.app/api
```

⚠️ **PENTING:**
- **HARUS** pakai prefix `VITE_` untuk Vite environment variables
- **HARUS** tambahkan `/api` di akhir URL backend
- Pilih environment: **Production**, **Preview**, dan **Development** (centang semua)

---

## 🔄 Update Environment Variables

### Update Railway Backend Variables

Jika perlu update (misal: ganti `FRONTEND_URL` setelah dapat Vercel URL):

1. Railway → Backend service
2. Tab **"Variables"**
3. Klik variable yang mau di-edit
4. Update value
5. Klik **"Update Variable"** atau klik di luar input box
6. Railway akan **auto-redeploy** backend

**Redeploy time:** ~1-2 menit

### Update Vercel Frontend Variables

Jika perlu update (misal: ganti backend URL):

1. Vercel → Project → **Settings**
2. Tab **"Environment Variables"**
3. Cari variable yang mau di-update
4. Klik **⋯** (three dots) → **Edit**
5. Update value → **Save**
6. **Redeploy diperlukan:**
   - Tab **"Deployments"**
   - Klik **⋯** on latest deployment
   - **"Redeploy"**

**Redeploy time:** ~2-3 menit

---

## 🧪 Verify Environment Variables

### Verify Railway Backend

**Method 1 - Via Railway CLI:**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Check environment variables
railway variables
```

**Method 2 - Via Logs:**

Tambahkan debug log di `backend/src/server.js` (temporary):

```javascript
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- DB_HOST:', process.env.DB_HOST ? '✓ Set' : '✗ Missing');
console.log('- JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ Missing');
console.log('- FRONTEND_URL:', process.env.FRONTEND_URL);
```

Deploy, then check logs:
- Railway → Backend → **Deployments** → Latest → **View Logs**

**Method 3 - Via API Call:**

Create health endpoint (already exists in your code):

```bash
curl https://your-backend.up.railway.app/api/health
```

Expected:
```json
{"status":"ok","database":"connected"}
```

Jika response OK → environment variables correct!

### Verify Vercel Frontend

**Method 1 - Browser Console:**

1. Buka aplikasi Vercel: `https://your-frontend.vercel.app`
2. Buka DevTools (F12)
3. Console tab
4. Run:

```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

Expected output:
```
API URL: https://your-backend.up.railway.app/api
```

**Method 2 - Test API Call:**

Di browser console:

```javascript
fetch(import.meta.env.VITE_API_URL + '/health')
  .then(r => r.json())
  .then(data => console.log('Backend Health:', data))
  .catch(err => console.error('Connection Error:', err));
```

Expected:
```
Backend Health: {status: "ok", database: "connected"}
```

---

## 🐛 Common Issues

### Issue 1: Backend Can't Connect to Database

**Symptoms:**
- Backend logs: `Error: connect ECONNREFUSED`
- API returns 500 errors

**Check:**
```bash
# Via Railway CLI
railway variables

# Verify these are set:
# - DB_HOST
# - DB_USER
# - DB_PASSWORD
# - DB_NAME
```

**Fix:**
Copy correct values dari MySQL service variables.

### Issue 2: CORS Error

**Symptoms:**
- Frontend console: `blocked by CORS policy`
- API calls fail from Vercel but work from Postman

**Check:**
- `FRONTEND_URL` di Railway backend harus exact match Vercel URL
- No trailing slash: `https://sapukota.vercel.app` ✅
- Wrong: `https://sapukota.vercel.app/` ❌

**Fix:**
```bash
# Railway Backend Variables
FRONTEND_URL=https://sapukota.vercel.app
```

Redeploy backend after update.

### Issue 3: Frontend API Calls Return 404

**Symptoms:**
- API calls go to wrong URL
- Network tab shows wrong backend URL

**Check:**
```javascript
// Browser console
console.log(import.meta.env.VITE_API_URL);
```

**Fix:**
1. Vercel → Settings → Environment Variables
2. Check `VITE_API_URL` value
3. Must end with `/api`: `https://backend.railway.app/api`
4. Redeploy Vercel

### Issue 4: JWT Token Invalid

**Symptoms:**
- Login works but protected routes fail
- `401 Unauthorized` errors

**Check:**
- `JWT_SECRET` di Railway backend
- Must be long random string (32+ chars)

**Fix:**
Generate new secret and update `JWT_SECRET` di Railway.

### Issue 5: Environment Variables Not Updating

**Railway:**
- Update variable → Auto-redeploy triggered
- Wait 1-2 minutes untuk redeploy selesai
- Check **Deployments** tab untuk status

**Vercel:**
- Update variable → Manual redeploy required
- **Deployments** → ⋯ → **Redeploy**
- Wait 2-3 minutes

---

## 📋 Quick Checklist

### Before Deploying

- [ ] All values prepared (JWT_SECRET generated, etc.)
- [ ] Backend deployed di Railway
- [ ] MySQL database running di Railway
- [ ] Backend URL obtained dari Railway

### Railway Backend Setup

- [ ] `NODE_ENV` = `production`
- [ ] `DB_HOST` (dari MySQL service)
- [ ] `DB_PORT` (dari MySQL service)
- [ ] `DB_USER` (dari MySQL service)
- [ ] `DB_PASSWORD` (dari MySQL service)
- [ ] `DB_NAME` (dari MySQL service)
- [ ] `JWT_SECRET` (generated random string)
- [ ] `FRONTEND_URL` (Vercel URL - isi setelah Vercel deploy)

### Vercel Frontend Setup

- [ ] `VITE_API_URL` = Railway backend URL + `/api`
- [ ] Environment selected: Production, Preview, Development (all)

### After Deployment

- [ ] Backend health check OK (`/api/health`)
- [ ] Frontend loads without errors
- [ ] API calls work (test login)
- [ ] No CORS errors in console
- [ ] GPS features working

---

## 💡 Tips

### 1. Save Environment Variables Template

Create `.env.example` files (safe to commit):

**backend/.env.example:**
```env
NODE_ENV=production
PORT=3000
DB_HOST=your_railway_mysql_host
DB_PORT=your_railway_mysql_port
DB_USER=your_railway_mysql_user
DB_PASSWORD=your_railway_mysql_password
DB_NAME=your_railway_mysql_database
JWT_SECRET=your_generated_jwt_secret
FRONTEND_URL=https://your-frontend.vercel.app
```

**frontend/.env.example:**
```env
VITE_API_URL=https://your-backend.up.railway.app/api
```

### 2. Use Different Values for Staging

Jika deploy staging environment:

**Production:**
```
FRONTEND_URL=https://sapukota.vercel.app
```

**Staging:**
```
FRONTEND_URL=https://sapukota-staging.vercel.app
```

### 3. Never Commit Real Values

```bash
# .gitignore (should already have these)
.env
.env.local
.env.production
.env.railway
```

### 4. Backup Configuration

Simpan semua environment variables di password manager atau note app (encrypted!).

### 5. Test Changes Locally First

Before deploying:

```bash
# Backend
cd backend
cp .env.example .env
# Edit .env with production values
npm run dev

# Frontend  
cd frontend
cp .env.example .env
# Edit .env with production values
npm run dev
```

Test locally untuk memastikan values correct.

---

## 📞 Quick Reference

| Platform | Where to Set | Variable Name | Value Format |
|----------|--------------|---------------|--------------|
| Railway Backend | Variables tab | `DB_HOST` | From MySQL service |
| Railway Backend | Variables tab | `DB_USER` | From MySQL service |
| Railway Backend | Variables tab | `DB_PASSWORD` | From MySQL service |
| Railway Backend | Variables tab | `DB_NAME` | From MySQL service |
| Railway Backend | Variables tab | `JWT_SECRET` | Random 32+ chars |
| Railway Backend | Variables tab | `FRONTEND_URL` | `https://app.vercel.app` |
| Vercel Frontend | Settings → Env Vars | `VITE_API_URL` | `https://backend.railway.app/api` |

---

**Setup Complete! 🎉**

Backend ↔️ Frontend communication configured!
