# 🆓 Panduan Deploy SapuKota - 100% GRATIS

Kamu bisa hosting aplikasi ini **GRATIS** menggunakan kombinasi platform berikut:

---

## 🎯 Rekomendasi Terbaik: Railway.app

**Railway.app** menyediakan:
- ✅ Node.js backend - GRATIS
- ✅ MySQL database - GRATIS
- ✅ $5 credit/bulan - GRATIS
- ✅ Custom domain support
- ✅ Auto-deploy dari GitHub
- ✅ SSL/HTTPS otomatis

### 📊 Free Tier Limits:
- **$5 credit/bulan** (~500 jam runtime)
- **1GB RAM**
- **1GB Storage**
- **100GB Bandwidth**

**Cukup untuk:**
- Testing & development
- Low-medium traffic (<1000 user/hari)
- Portfolio project

---

## 🚀 Option 1: Railway (FULL-STACK - Paling Mudah)

### Step 1: Persiapan Git Repository
```bash
# Di komputer local
cd /Users/ree/Documents/SapuKota

# Initialize git (jika belum)
git init
git add .
git commit -m "Initial commit"

# Push ke GitHub
git remote add origin https://github.com/YOUR_USERNAME/SapuKota.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy ke Railway

1. **Sign Up Railway**
   - Buka [railway.app](https://railway.app)
   - Login dengan GitHub
   - Gratis, tidak perlu kartu kredit

2. **Create New Project**
   - Klik "New Project"
   - Pilih "Deploy from GitHub repo"
   - Pilih repository `SapuKota`

3. **Add MySQL Database**
   - Klik "+ New"
   - Pilih "Database" → "Add MySQL"
   - Railway otomatis provision database

4. **Configure Backend Service**
   - Klik service backend
   - Di tab "Settings":
     - **Root Directory**: `backend`
     - **Start Command**: `npm start`
     - **Build Command**: `npm install`
   
   - Di tab "Variables", tambahkan:
     ```
     DB_HOST=${{MYSQLHOST}}
     DB_USER=${{MYSQLUSER}}
     DB_PASSWORD=${{MYSQLPASSWORD}}
     DB_NAME=${{MYSQLDATABASE}}
     DB_PORT=${{MYSQLPORT}}
     JWT_SECRET=railway_generated_secret_12345678901234567890
     NODE_ENV=production
     PORT=5000
     ```
   
   - Klik "Add Variable" untuk yang belum ada
   - Railway otomatis connect ke MySQL database

5. **Configure Frontend Service**
   - Klik "+ New"
   - Pilih "GitHub Repo" (same repo)
   - Di tab "Settings":
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Start Command**: `npx serve -s dist -l $PORT`
   
   - Di tab "Variables", tambahkan:
     ```
     VITE_API_URL=https://your-backend-url.railway.app/api
     ```
   - Ganti `your-backend-url` dengan domain backend dari Railway

6. **Run Migrations**
   - Klik service backend
   - Tab "Deploy Logs"
   - Tunggu deploy selesai
   - Klik tab "Settings" → "Service" → tambahkan di "Deploy Command":
     ```bash
     npm install && node -e "const {sequelize} = require('./src/models'); sequelize.sync({alter: true}).then(() => console.log('DB synced'));"
     ```
   - Atau connect via Railway CLI dan run migrations manual

7. **Add Custom Domain**
   - Di service frontend, tab "Settings"
   - Scroll ke "Domains"
   - Klik "Generate Domain" (dapat subdomain Railway gratis)
   - Atau klik "Custom Domain" untuk pakai domain kamu
   
   **Setup Custom Domain:**
   - Masukkan domain: `sapukota.yourdomain.com`
   - Railway kasih CNAME record
   - Tambahkan CNAME di DNS provider domain kamu:
     ```
     Type: CNAME
     Name: sapukota (atau subdomain pilihan kamu)
     Value: [value yang dikasih Railway]
     TTL: 3600
     ```
   - Tunggu DNS propagate (5-15 menit)
   - SSL otomatis aktif!

### Step 3: Create Admin User
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run seeder
railway run node src/seeders/createAdmin.js
```

---

## 🎨 Option 2: Vercel (Frontend) + Railway (Backend+DB)

**Vercel** bagus untuk frontend React:
- Build & deploy otomatis
- Global CDN super cepat
- Unlimited bandwidth
- Custom domain gratis

### Deploy Frontend ke Vercel

1. **Sign Up Vercel**
   - Buka [vercel.com](https://vercel.com)
   - Login dengan GitHub

2. **Import Project**
   - Klik "Add New" → "Project"
   - Import `SapuKota` dari GitHub
   - **Root Directory**: `frontend`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app/api
   ```

4. **Add Custom Domain**
   - Di project settings → "Domains"
   - Tambahkan: `www.yourdomain.com`
   - Follow DNS setup instructions

### Deploy Backend ke Railway
- Follow langkah Railway di atas (hanya backend + MySQL)

---

## 🌈 Option 3: Render.com (Alternative Railway)

**Render** mirip Railway, juga gratis:

### Free Tier:
- ✅ Web services gratis
- ✅ PostgreSQL gratis (500MB)
- ⚠️ Services sleep after 15 min inactive (cold start ~30 detik)

### Setup:

1. **Sign Up Render**
   - [render.com](https://render.com)
   - Login dengan GitHub

2. **Create PostgreSQL Database** (gratis lebih stabil daripada MySQL)
   - Dashboard → "New" → "PostgreSQL"
   - Name: `sapukota-db`
   - Free tier
   - Copy Internal Database URL

3. **Update Backend untuk PostgreSQL**
   ```bash
   # Di local
   cd backend
   npm install pg pg-hstore
   ```
   
   Edit `backend/src/config/database.js`:
   ```javascript
   // Tambahkan support PostgreSQL
   const config = {
     // ... existing config
     dialect: process.env.DB_DIALECT || 'mysql',
     dialectOptions: process.env.DB_DIALECT === 'postgres' ? {
       ssl: { rejectUnauthorized: false }
     } : {}
   };
   ```

4. **Create Web Service (Backend)**
   - "New" → "Web Service"
   - Connect GitHub repo
   - Name: `sapukota-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - Environment Variables:
     ```
     DATABASE_URL=[paste from step 2]
     JWT_SECRET=your_secret_here
     NODE_ENV=production
     ```

5. **Create Static Site (Frontend)**
   - "New" → "Static Site"
   - Connect GitHub repo
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://sapukota-backend.onrender.com/api
     ```

6. **Custom Domain**
   - Di frontend service → "Settings" → "Custom Domain"
   - Add: `www.yourdomain.com`
   - Setup CNAME di DNS provider

---

## 🔧 Option 4: Setup Domain yang Sudah Kamu Punya

Kalau kamu punya domain (misal dari Niagahoster, Hostinger domain, etc):

### A. Domain → Railway/Vercel/Render

1. **Login ke DNS Management** (di provider domain kamu)

2. **Add CNAME Record:**
   ```
   Type: CNAME
   Name: @ (untuk root domain) atau www
   Value: [dari Railway/Vercel/Render]
   TTL: 3600
   ```

3. **Contoh untuk Railway:**
   - Railway kasih: `sapukota-production-xxx.up.railway.app`
   - Di DNS kamu:
     ```
     Type: CNAME
     Name: www
     Value: sapukota-production-xxx.up.railway.app
     TTL: 3600
     ```

4. **Untuk Root Domain (@):**
   - Beberapa provider tidak support CNAME untuk root
   - Gunakan ALIAS atau ANAME (jika tersedia)
   - Atau gunakan subdomain (www, app, sapukota)

### B. Domain → Cloudflare (GRATIS + CDN)

**Bonus:** Gunakan Cloudflare untuk DNS (gratis):

1. **Add Site ke Cloudflare**
   - Buka [cloudflare.com](https://cloudflare.com)
   - Sign up gratis
   - "Add a Site" → masukkan domain kamu
   - Pilih Free Plan

2. **Update Nameservers**
   - Cloudflare kasih 2 nameservers
   - Login ke domain provider kamu
   - Ganti nameservers ke yang dikasih Cloudflare
   - Contoh:
     ```
     ns1.cloudflare.com
     ns2.cloudflare.com
     ```
   - Tunggu propagasi (24 jam max, biasanya <1 jam)

3. **Setup DNS di Cloudflare**
   - Add CNAME untuk Railway/Vercel:
     ```
     Type: CNAME
     Name: www
     Target: your-app.railway.app
     Proxy: ON (orange cloud)
     ```

4. **Benefits Cloudflare:**
   - ✅ Global CDN gratis
   - ✅ DDoS protection
   - ✅ Caching otomatis
   - ✅ Analytics
   - ✅ SSL/HTTPS gratis

---

## 📦 Modifikasi Code untuk Production

### 1. Update `backend/src/config/database.js`

Tambahkan support untuk connection string (Railway/Render):

```javascript
const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

// Railway/Render menggunakan DATABASE_URL
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql', // atau 'postgres' untuk Render
    dialectOptions: {
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    },
    logging: false
  });
} else {
  // Local development
  sequelize = new Sequelize(
    process.env.DB_NAME || 'sapukota',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false
    }
  );
}

module.exports = { sequelize };
```

### 2. Update `frontend/src/services/api.js`

Gunakan environment variable untuk API URL:

```javascript
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ... rest of the file
```

### 3. Tambahkan `serve` package untuk frontend

```bash
cd frontend
npm install --save-dev serve
```

Update `frontend/package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "serve -s dist -l $PORT"
  }
}
```

---

## 📊 Perbandingan Platform Gratis

| Platform | Backend | Database | Frontend | Domain | SSL | Deploy |
|----------|---------|----------|----------|--------|-----|--------|
| **Railway** | ✅ Node.js | ✅ MySQL | ✅ Static | ✅ Custom | ✅ Auto | GitHub |
| **Vercel** | ⚠️ Serverless | ❌ | ✅ Fastest | ✅ Custom | ✅ Auto | GitHub |
| **Render** | ✅ Node.js | ✅ PostgreSQL | ✅ Static | ✅ Custom | ✅ Auto | GitHub |
| **Netlify** | ⚠️ Functions | ❌ | ✅ Static | ✅ Custom | ✅ Auto | GitHub |

**Legend:**
- ✅ Full support gratis
- ⚠️ Limited (serverless only)
- ❌ Tidak tersedia gratis

---

## 🎯 Rekomendasi Berdasarkan Kebutuhan

### Untuk Portfolio/Demo:
👉 **Railway** - Paling mudah, satu platform untuk semua

### Untuk Speed/Performance:
👉 **Vercel (Frontend) + Railway (Backend)**

### Untuk Long-term:
👉 **Cloudflare Pages + Railway** - Fastest CDN + reliable backend

### Untuk Belajar:
👉 **Railway** - Dashboard paling user-friendly

---

## 💡 Tips Hemat Credit Railway

Railway free tier dapat **$5/bulan**:

1. **Sleep Inactive Services:**
   - Services otomatis sleep setelah gak ada traffic
   - First request wake up (~5 detik)

2. **Gunakan Cron Job:**
   - Ping aplikasi tiap 10-14 menit (cron-job.org gratis)
   - Keep service tetap awake di jam sibuk

3. **Optimize Resources:**
   - Hapus console.log di production
   - Use PM2 atau cluster mode
   - Compress images

4. **Monitor Usage:**
   - Dashboard Railway → "Usage"
   - Lihat credit consumption

---

## ✅ Kesimpulan - Pilihan Terbaik Untukmu

Karena kamu punya domain, ini setup terbaik **100% GRATIS**:

```
Domain kamu → Cloudflare (DNS + CDN) → Railway (Full-stack)
```

**Langkah-langkah:**
1. Deploy ke Railway (backend + frontend + MySQL)
2. Setup Cloudflare untuk domain
3. Point domain ke Railway
4. Done! HTTPS otomatis aktif

**Total biaya: Rp 0,-** ✨

**Bandwidth:** Unlimited (Cloudflare)  
**Uptime:** 99%+  
**Speed:** Cepat (Global CDN)

---

## 🆘 Butuh Bantuan?

Pilih platform yang kamu mau, nanti saya bantu step-by-step detail untuk deploy! 🚀

**Platform pilihan kamu:**
- [ ] Railway (recommended)
- [ ] Vercel + Railway
- [ ] Render
- [ ] Lainnya?
