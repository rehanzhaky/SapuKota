# 🚂 Deploy Backend SapuKota ke Railway

Panduan lengkap deploy backend (Node.js + MySQL) ke Railway.app

## ✅ Persiapan

- [x] Project sudah di GitHub
- [ ] Akun Railway ([railway.app](https://railway.app))
- [ ] Akun GitHub (untuk login Railway)

---

## 📝 Langkah 1: Login ke Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"** atau **"Start a New Project"**
3. Pilih **"Login with GitHub"**
4. Authorize Railway untuk akses GitHub Anda

---

## 📦 Langkah 2: Deploy Backend dari GitHub

### 2.1 Create New Project

1. Di dashboard Railway, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository **SapuKota** Anda
4. Railway akan otomatis detect bahwa ini adalah Node.js project

### 2.2 Configure Root Directory

**PENTING:** Karena backend ada di folder `backend/`, kita perlu set root directory:

1. Setelah project dibuat, klik service backend Anda
2. Pergi ke tab **"Settings"**
3. Cari **"Root Directory"**
4. Isi dengan: `backend`
5. Klik **"Save"**

### 2.3 Configure Build & Start Command

Railway biasanya auto-detect, tapi pastikan:

1. Di **Settings** → **"Build Command"**:
   ```bash
   npm install
   ```

2. Di **Settings** → **"Start Command"**:
   ```bash
   npm start
   ```

---

## 🗄️ Langkah 3: Tambahkan MySQL Database

### 3.1 Add MySQL Service

1. Di project Railway Anda, klik **"+ New"**
2. Pilih **"Database"**
3. Pilih **"Add MySQL"**
4. Railway akan otomatis provision MySQL database

### 3.2 Connect Database ke Backend

Railway otomatis membuat environment variables untuk MySQL:

- `MYSQL_URL` - Connection string lengkap
- `MYSQL_HOST` - Host database
- `MYSQL_PORT` - Port (biasanya 3306)
- `MYSQL_USER` - Username
- `MYSQL_PASSWORD` - Password
- `MYSQL_DATABASE` - Nama database

**TAPI**, kode kita menggunakan format berbeda. Kita akan set manual di langkah berikutnya.

---

## 🔐 Langkah 4: Set Environment Variables

### 4.1 Buka Variables Tab

1. Klik service **backend** Anda (bukan MySQL)
2. Pergi ke tab **"Variables"**
3. Klik **"+ New Variable"**

### 4.2 Tambahkan Variables Berikut

**Salin MySQL credentials dari MySQL service:**

1. Klik MySQL service
2. Pergi ke tab **"Variables"**
3. Salin nilai `MYSQL_HOST`, `MYSQL_PORT`, dll.

**Tambahkan di backend service:**

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `NODE_ENV` | `production` | Environment mode |
| `PORT` | `3000` | Port backend (bisa default) |
| `DB_HOST` | `[salin dari MYSQL_HOST]` | Host MySQL dari Railway |
| `DB_PORT` | `[salin dari MYSQL_PORT]` | Port MySQL (biasanya 3306) |
| `DB_USER` | `[salin dari MYSQL_USER]` | Username MySQL |
| `DB_PASSWORD` | `[salin dari MYSQL_PASSWORD]` | Password MySQL |
| `DB_NAME` | `[salin dari MYSQL_DATABASE]` | Nama database |
| `JWT_SECRET` | `[generate random string]` | Secret untuk JWT |
| `FRONTEND_URL` | `https://sapukota.vercel.app` | URL Vercel frontend Anda (isi nanti) |

#### Generate JWT_SECRET

Gunakan salah satu cara berikut:

**Cara 1 - Di Terminal:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Cara 2 - Online:**
Buka [randomkeygen.com](https://randomkeygen.com) dan salin "CodeIgniter Encryption Keys"

**Contoh hasil:**
```
7f3a9b2c8d4e6f1a5b9c3d7e2f8a4b6c
```

### 4.3 Save Variables

Setelah semua diisi, Railway akan otomatis **redeploy** backend Anda.

---

## 🗃️ Langkah 5: Jalankan Database Migration

### 5.1 Connect ke MySQL Railway

**Cara 1 - Menggunakan Railway CLI (Recommended):**

1. Install Railway CLI:
   ```bash
   npm install -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link ke project:
   ```bash
   railway link
   ```
   Pilih project SapuKota Anda.

4. Connect ke MySQL:
   ```bash
   railway connect MySQL
   ```
   
   Ini akan membuka MySQL shell langsung ke database Railway.

**Cara 2 - Menggunakan MySQL Client:**

1. Get MySQL credentials dari Railway:
   - Klik MySQL service → tab **"Connect"**
   - Salin connection command

2. Connect menggunakan command tersebut:
   ```bash
   mysql -h [MYSQL_HOST] -u [MYSQL_USER] -p[MYSQL_PASSWORD] [MYSQL_DATABASE]
   ```

### 5.2 Run Migration Files

Setelah connect ke MySQL, jalankan migration files satu per satu:

```sql
-- 1. Update reports table
source /path/to/migrations/update_reports_table.sql;

-- 2. Add coordinates to reports
source /path/to/migrations/add_coordinates_to_reports.sql;

-- 3. Add petugas tracking
source /path/to/migrations/add_petugas_tracking.sql;

-- 4. Add petugas GPS tracking
source /path/to/migrations/add_petugas_gps_tracking.sql;
```

**ATAU** copy-paste isi file SQL langsung ke MySQL shell.

### 5.3 Verify Migration

Cek apakah tabel sudah dibuat:

```sql
SHOW TABLES;
DESCRIBE reports;
DESCRIBE users;
DESCRIBE petugas_locations;
```

---

## 👤 Langkah 6: Buat Admin User

Gunakan Railway CLI untuk menjalankan seeder:

```bash
railway run npm run seed:admin
```

**ATAU** jalankan query SQL manual di MySQL:

```sql
INSERT INTO users (
  nama, 
  email, 
  password, 
  role, 
  createdAt, 
  updatedAt
) VALUES (
  'Admin DLH',
  'admin@sapukota.id',
  '$2a$10$YourHashedPasswordHere',
  'admin_dlh',
  NOW(),
  NOW()
);
```

**Untuk hash password:**

1. Gunakan online bcrypt generator: [bcrypt-generator.com](https://bcrypt-generator.com)
2. Masukkan password yang diinginkan (contoh: `admin123`)
3. Pilih rounds: **10**
4. Salin hash yang dihasilkan
5. Paste di query SQL di atas

---

## 🌐 Langkah 7: Dapatkan Backend URL

1. Klik service backend di Railway
2. Pergi ke tab **"Settings"**
3. Scroll ke **"Domains"**
4. Klik **"Generate Domain"**
5. Railway akan memberikan URL seperti:
   ```
   https://sapukota-backend-production.up.railway.app
   ```

6. **SIMPAN URL INI** - Anda akan butuh untuk setup Vercel frontend!

---

## 🧪 Langkah 8: Test Backend API

Test beberapa endpoint untuk memastikan backend berjalan:

### Test Health Check

```bash
curl https://your-backend-url.railway.app/api/health
```

Expected response:
```json
{"status":"ok","database":"connected"}
```

### Test Login

```bash
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sapukota.id",
    "password": "admin123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGc..."
  }
}
```

### Test dengan Postman

1. Buka Postman
2. Create new request
3. Method: `POST`
4. URL: `https://your-backend-url.railway.app/api/auth/login`
5. Body (JSON):
   ```json
   {
     "email": "admin@sapukota.id",
     "password": "admin123"
   }
   ```
6. Send

---

## 🔧 Langkah 9: Update CORS untuk Vercel

Setelah Anda punya Vercel frontend URL, update CORS di backend:

### 9.1 Edit server.js via GitHub

1. Buka repo GitHub Anda
2. Edit file `backend/src/server.js`
3. Cari bagian CORS configuration:

```javascript
// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
```

### 9.2 Update Environment Variable

1. Kembali ke Railway
2. Klik backend service → tab **"Variables"**
3. Edit `FRONTEND_URL`:
   ```
   https://sapukota.vercel.app
   ```
   (Ganti dengan URL Vercel Anda yang sebenarnya)

4. Save - Railway akan auto-redeploy

---

## ✅ Checklist Deployment

- [ ] Backend deployed di Railway
- [ ] MySQL database running
- [ ] Environment variables configured
- [ ] Database migrations executed
- [ ] Admin user created
- [ ] Backend URL generated
- [ ] API endpoints tested (login, health check)
- [ ] CORS configured for Vercel frontend

---

## 🐛 Troubleshooting

### Backend Crash / Won't Start

**Check Logs:**
1. Klik backend service di Railway
2. Pergi ke tab **"Deployments"**
3. Klik deployment terbaru
4. Lihat logs untuk error messages

**Common Issues:**

1. **Database Connection Failed**
   - Pastikan `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` benar
   - Salin dari MySQL service variables

2. **Port Already in Use**
   - Railway otomatis assign port via `$PORT`
   - Pastikan server.js menggunakan: `const PORT = process.env.PORT || 3000;`

3. **Module Not Found**
   - Pastikan `package.json` ada di folder `backend/`
   - Check Root Directory setting: harus `backend`

### Database Connection Issues

**Verify MySQL is Running:**
1. Klik MySQL service
2. Tab **"Deployments"** - harus ada "Active" deployment
3. Tab **"Metrics"** - harus ada activity

**Test Connection Manually:**
```bash
railway connect MySQL
```

Jika berhasil connect, database OK.

### Migration Failed

**Error: File Not Found**

Copy-paste isi file SQL langsung ke MySQL shell instead of using `source` command.

**Error: Table Already Exists**

Drop table dan re-run migration:
```sql
DROP TABLE IF EXISTS petugas_locations;
-- Then re-run migration
```

### API Returns 500 Error

**Check Backend Logs:**
- Tab "Deployments" → Latest deployment → View logs
- Look for stack traces

**Common Causes:**
- Missing environment variables
- Database connection failed
- Missing tables (migration not run)

---

## 💡 Tips

### 1. Auto-Deploy dari GitHub

Railway otomatis deploy setiap kali ada push ke GitHub:

1. Edit code di local
2. `git add .`
3. `git commit -m "Update backend"`
4. `git push origin main`
5. Railway otomatis detect dan deploy!

### 2. View Real-Time Logs

```bash
railway logs
```

### 3. Custom Domain (Optional)

Jika punya domain sendiri:

1. Backend service → **Settings** → **Domains**
2. Klik **"Custom Domain"**
3. Masukkan subdomain: `api.sapu-kota.com`
4. Configure DNS:
   - Type: `CNAME`
   - Name: `api`
   - Value: `[railway-backend-url].up.railway.app`

### 4. Environment Variables Best Practice

Simpan di `.env.example` (jangan commit values!):

```env
# Production values (Railway)
NODE_ENV=production
PORT=3000
DB_HOST=[from Railway MySQL]
DB_PORT=3306
DB_USER=[from Railway MySQL]
DB_PASSWORD=[from Railway MySQL]
DB_NAME=[from Railway MySQL]
JWT_SECRET=[your secret]
FRONTEND_URL=https://sapukota.vercel.app
```

---

## 📊 Monitoring

### Railway Dashboard

Monitor backend di Railway dashboard:

- **Deployments**: Riwayat deploy
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time logs
- **Variables**: Environment variables

### Resource Usage

Railway free tier:
- **$5/month credit**
- Cukup untuk backend 24/7 dengan traffic rendah-medium
- Monitor usage di dashboard

---

## 🎯 Next Steps

Setelah backend berhasil deployed:

1. ✅ **Deploy Frontend ke Vercel** (lihat `DEPLOY_VERCEL_FRONTEND.md`)
2. ✅ **Update FRONTEND_URL** di Railway backend variables
3. ✅ **Test end-to-end**: Vercel frontend → Railway backend
4. ✅ **Setup custom domain** (optional)

---

## 📞 Support

Jika ada masalah:

1. **Check Railway Logs** - 90% masalah bisa dilihat di logs
2. **Railway Discord** - [discord.gg/railway](https://discord.gg/railway)
3. **Railway Docs** - [docs.railway.app](https://docs.railway.app)

---

**Backend URL Anda:**
```
https://_____________________.up.railway.app
```

**Simpan URL ini untuk setup Vercel frontend!** 🚀
