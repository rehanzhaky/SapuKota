# 🚀 Panduan Lengkap Hosting SapuKota

## Backend di Railway + Database MySQL di Railway + Frontend di Vercel

Panduan step-by-step super detail untuk hosting aplikasi SapuKota.

---

## � Quick Fix: Error Paling Sering Terjadi

### Error 1: "No start command detected" ❌

**Fix:** Set **Root Directory = `backend`** di Railway Settings

```
Railway → Service Backend → Settings → Root Directory: backend
```

---

### Error 2: "ECONNREFUSED ::1:3306" ❌

**Fix:** Set environment variables di Backend service

```
Railway → Backend Service → Variables → Raw Editor → Paste:

DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=GENERATE_RANDOM_32_CHARS
FRONTEND_URL=https://sapukota.vercel.app
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

### Error 3: "injecting env (0)" ❌

**Fix:** Variables belum di-set atau di-set di service yang salah

✅ Variables HARUS di **Backend service** (sapukota), BUKAN di MySQL service!

Check: Backend service → Variables → harus ada 4 vars minimum

---

## �📋 Daftar Isi

1. [Persiapan Awal](#1-persiapan-awal)
2. [Deploy Backend ke Railway](#2-deploy-backend-ke-railway)
3. [Setup Database MySQL di Railway](#3-setup-database-mysql-di-railway)
4. [Configure & Test Backend](#4-configure--test-backend)
5. [Deploy Frontend ke Vercel](#5-deploy-frontend-ke-vercel)
6. [Final Configuration](#6-final-configuration)
7. [Testing End-to-End](#7-testing-end-to-end)
8. [Troubleshooting](#8-troubleshooting)

---

## 1. Persiapan Awal

### ✅ Yang Harus Sudah Ada:

- [x] **Kode SapuKota sudah di GitHub**
  - Repository sudah public atau private
  - Semua kode sudah di-push
  
- [ ] **Akun GitHub** (untuk login Railway & Vercel)

- [ ] **Akun Railway** - Gratis!
  - Buka [railway.app](https://railway.app)
  - Klik "Login" → Pilih "Login with GitHub"
  - Authorize Railway

- [ ] **Akun Vercel** - Gratis!
  - Buka [vercel.com](https://vercel.com)
  - Klik "Sign Up" → Pilih "Continue with GitHub"
  - Authorize Vercel

### 📝 Catatan Penting:

- **Railway Free Tier**: $5 kredit gratis per bulan
- **Vercel Free Tier**: 100 GB bandwidth per bulan
- **Waktu yang dibutuhkan**: ~30-45 menit untuk first deployment

---

## 2. Deploy Backend ke Railway

### 2.1 Login ke Railway

1. Buka [railway.app](https://railway.app)
2. Klik **"Login"** (pojok kanan atas)
3. Pilih **"Login with GitHub"**
4. Authorize Railway untuk akses GitHub Anda
5. Anda akan masuk ke Railway Dashboard

### 2.2 Create New Project

1. Di Railway Dashboard, klik **"+ New Project"** (tombol ungu besar)
2. Pilih **"Deploy from GitHub repo"**
3. Akan muncul list repository GitHub Anda
4. Cari dan klik repository **"SapuKota"**
5. Railway akan otomatis membuat project dan detect bahwa ini Node.js app

**Screenshot yang akan Anda lihat:**
```
┌─────────────────────────────────────┐
│ Configure your project              │
│                                     │
│ ⚙️ Node.js detected                 │
│ 📦 Installing dependencies...       │
└─────────────────────────────────────┘
```

### 2.3 Set Root Directory (PENTING!)

Karena backend kita ada di folder `backend/`, bukan di root project:

1. Setelah project terbuat, Anda akan lihat **service card** (kotak dengan nama repo)
2. Klik **service card** tersebut
3. Pergi ke tab **"Settings"** (di menu atas)
4. Scroll ke bawah, cari section **"Service Settings"**
5. Cari field **"Root Directory"**
6. Klik di field tersebut
7. Ketik: `backend` (tanpa slash)
8. Klik area lain atau tekan Enter untuk save

**Before:**
```
Root Directory: (empty)
```

**After:**
```
Root Directory: backend
```

### 2.4 Configure Build Settings

Railway auto-detect dari `package.json`, tapi mari kita pastikan:

1. Masih di tab **"Settings"**
2. Cari section **"Build"**:
   - **Build Command**: `npm install` atau `npm ci` (sudah otomatis)
   - **Watch Paths**: (biarkan kosong)

3. Cari section **"Deploy"**:
   - **Start Command**: `npm start` (sudah otomatis dari package.json)
   - **Custom Domains**: (skip dulu, kita akan set nanti)

4. Jangan ubah apapun kalau sudah benar, Railway sudah pintar

### 2.5 Generate Public URL untuk Backend

1. Masih di tab **"Settings"** service backend
2. Scroll ke section **"Networking"** atau **"Domains"**
3. Klik **"Generate Domain"** atau **"+ New Domain"**
4. Railway akan generate URL seperti:
   ```
   https://sapukota-backend-production.up.railway.app
   ```
5. **COPY & SIMPAN URL INI!** Anda akan butuh nanti untuk frontend

**📝 Catat URL Backend Anda di sini:**
```
Backend URL: https://_________________.up.railway.app
```

---

## 3. Setup Database MySQL di Railway

### 3.1 Add MySQL Service ke Project

1. Kembali ke **Project View** (klik nama project di breadcrumb atas)
2. Di project canvas, klik tombol **"+ New"** atau **"Create"**
3. Pilih **"Database"**
4. Pilih **"Add MySQL"**
5. Railway akan:
   - Provision MySQL instance (~1-2 menit)
   - Auto-generate credentials
   - Create database

**Anda akan lihat 2 service cards:**
```
┌──────────────────┐    ┌──────────────────┐
│   sapukota       │    │      MySQL       │
│   (backend)      │    │   (database)     │
└──────────────────┘    └──────────────────┘
```

### 3.2 Lihat MySQL Credentials

1. Klik **MySQL service card**
2. Pergi ke tab **"Variables"**
3. Anda akan lihat environment variables otomatis:

```
MYSQL_URL=mysql://root:xxxxx@containers-us-west-xxx.railway.app:6379/railway
MYSQL_HOST=containers-us-west-xxx.railway.app
MYSQL_PORT=6379
MYSQL_USER=root
MYSQL_PASSWORD=xxxxxxxxxxxxxxxxx
MYSQL_DATABASE=railway
MYSQLHOST=containers-us-west-xxx.railway.app
MYSQLDATABASE=railway
MYSQLPORT=6379
MYSQLUSER=root
MYSQLPASSWORD=xxxxxxxxxxxxxxxxx
```

**JANGAN TUTUP TAB INI!** Anda akan perlu copy values ini ke backend service.

### 3.3 (Optional) Rename Database

Jika ingin database name yang lebih jelas:

1. Masih di MySQL service → tab **"Variables"**
2. Cari variable **`MYSQL_DATABASE`**
3. Klik value `railway`
4. Edit menjadi: `sapukota_db`
5. Klik **"Update"**

⚠️ **WARNING**: Restart required setelah ubah database name!

---

## 4. Configure & Test Backend

### 4.1 Set Environment Variables di Backend

Ini adalah **langkah paling penting!** Tanpa ini, backend tidak bisa connect ke database.

#### 📍 Visual Layout Railway Dashboard

Sebelum mulai, pahami layout Railway:

```
┌─────────────────────────────────────────────────────┐
│  Railway Dashboard - Project View                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│   ┌──────────────┐      ┌──────────────┐            │
│   │ sapukota     │      │   MySQL      │            │
│   │ (Backend)    │◄────►│ (Database)   │            │
│   │ Node.js      │      │ postgresql   │            │
│   └──────────────┘      └──────────────┘            │
│         ↑                      ↑                    │
│         │                      │                    │
│    (Klik ini)             (Ambil vars               │
│                            dari sini)               │
└─────────────────────────────────────────────────────┘
```

---

#### 🎯 LANGKAH-LANGKAH SUPER DETAIL

### **FASE 1: Ambil MySQL Credentials**

#### 1.1 Buka MySQL Service

1. Di Railway Dashboard, Anda lihat **2 kotak/cards**:
   - Kotak pertama: **Backend service** (nama repo Anda)
   - Kotak kedua: **MySQL** (database)

2. **Klik kotak MySQL** (yang ada icon database/logo MySQL)

3. Setelah klik, akan muncul **side panel** atau **detail page** MySQL service

#### 1.2 Pergi ke Tab Variables

1. Di bagian atas detail MySQL, ada menu tabs:
   ```
   Deployments | Metrics | Variables | Settings | Logs
   ```

2. **Klik tab "Variables"**

3. Anda akan lihat list environment variables yang auto-generated:

```
┌────────────────────────────────────────────────────┐
│ Variables - MySQL                                  │
├────────────────────────────────────────────────────┤
│                                                    │
│ MYSQL_URL                                          │
│ mysql://root:xxxx@containers-us-west.railway...   │
│ [Copy icon]                                        │
│                                                    │
│ MYSQLHOST                                          │
│ containers-us-west-123.railway.app                 │
│ [Copy icon]                                        │
│                                                    │
│ MYSQLPORT                                          │
│ 6379                                               │
│ [Copy icon]                                        │
│                                                    │
│ MYSQLUSER                                          │
│ root                                               │
│ [Copy icon]                                        │
│                                                    │
│ MYSQLPASSWORD                                      │
│ •••••••••••••••••                                  │
│ [Copy icon]                                        │
│                                                    │
│ MYSQLDATABASE                                      │
│ railway                                            │
│ [Copy icon]                                        │
└────────────────────────────────────────────────────┘
```

#### 1.3 Copy MYSQL_URL

**INI YANG KITA BUTUHKAN!**

1. Cari variable bernama **`MYSQL_URL`** (paling atas biasanya)
2. Di sebelah kanan value, ada **icon copy** (dua kotak overlap)
3. **KLIK ICON COPY** tersebut
4. Value akan ter-copy ke clipboard Anda

**Value example:**
```
mysql://root:aB3xD9fK2mN8pQ1vZ6yC:@containers-us-west-199.railway.app:6379/railway
```

⚠️ **JANGAN TUTUP TAB INI DULU!** Kita akan kembali ke sini nanti.

---

### **FASE 2: Set Variables di Backend Service**

#### 2.1 Buka Backend Service

1. **Klik logo Railway** di pojok kiri atas, atau klik nama project di breadcrumb
2. Anda kembali ke **Project View** (lihat 2 kotak: backend & MySQL)
3. **Klik kotak Backend/sapukota** (kotak pertama, bukan MySQL)

#### 2.2 Pergi ke Tab Variables Backend

1. Setelah klik backend service, detail service terbuka
2. Di menu tabs atas, klik **"Variables"**
3. Anda akan lihat halaman variables backend (mungkin kosong atau ada beberapa vars)

```
┌────────────────────────────────────────────────────┐
│ Variables - sapukota                               │
├────────────────────────────────────────────────────┤
│                                                    │
│ [+ New Variable]  [Raw Editor]  [Shared Variables]│
│                                                    │
│ (Variables akan muncul di sini)                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

#### 2.3 Pilih Cara Input Variables

Ada **2 cara** - pilih salah satu:

---

### **CARA A: Menggunakan Raw Editor** ⭐ **RECOMMENDED!**

#### A.1 Klik Raw Editor

1. Di pojok kanan atas section Variables, ada tombol **"Raw Editor"**
2. **Klik tombol tersebut**
3. Akan muncul text editor besar seperti notepad

#### A.2 Generate JWT_SECRET Dulu

Sebelum paste, kita harus buat JWT_SECRET random string.

**Option 1: Pakai Terminal** (paling secure)

Buka terminal di komputer Anda:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7
```

**Copy output ini!**

**Option 2: Pakai Website**

1. Buka [randomkeygen.com](https://randomkeygen.com/) di tab baru
2. Scroll ke **"CodeIgniter Encryption Keys"** atau **"256-bit WPA Key"**
3. Click di random string untuk copy
4. **Copy hasil random string**

#### A.3 Paste ke Raw Editor

Sekarang di Raw Editor Railway, **paste template ini:**

```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=e7cc1ad43f2705f87369eea380b936478713ac28f62f8a381404bca79b8f1a7a
FRONTEND_URL=https://sapukota.vercel.app
```

**⚠️ PENTING - Edit bagian ini:**

1. **Baris 3 - JWT_SECRET:**
   - HAPUS: `PASTE_JWT_SECRET_ANDA_DI_SINI`
   - PASTE: Random string yang Anda generate tadi
   - **Example:**
     ```env
     JWT_SECRET=a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7
     ```

2. **Baris 4 - FRONTEND_URL:**
   - Biarkan dulu: `https://sapukota.vercel.app`
   - Kita akan update nanti setelah deploy frontend ke Vercel

**Hasil akhir example:**
```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7
FRONTEND_URL=https://sapukota.vercel.app
```

#### A.4 Save Variables

1. Setelah paste dan edit, cek lagi **semua sudah benar**
2. Klik tombol **"Update Variables"** atau **"Save"** (biasanya di pojok kanan bawah text editor)
3. Akan muncul konfirmasi: **"Variables updated"**

---

### **CARA B: Satu-per-satu Manual** (lebih lama tapi aman)

Kalau Anda lebih suka input satu per satu:

#### B.1 Tambah Variable Pertama - DATABASE_URL

1. Klik tombol **"+ New Variable"** 
2. Akan muncul 2 input fields:
   ```
   Variable Name: [_______________]
   Value:        [_______________]
   ```

3. **Di field "Variable Name"**, ketik: `DATABASE_URL`
4. **Di field "Value"**, ketik: `${{MySQL.MYSQL_URL}}`
   - ⚠️ **Harus persis seperti ini!**
   - Huruf besar kecil matters: `MySQL` (M besar, S besar, L besar)
   
5. Klik **"Add"** atau tekan **Enter**

#### B.2 Tambah Variable Kedua - NODE_ENV

1. Klik **"+ New Variable"** lagi
2. **Variable Name:** `NODE_ENV`
3. **Value:** `production`
4. Klik **"Add"**

#### B.3 Tambah Variable Ketiga - JWT_SECRET

1. **STOP!** Generate JWT_SECRET dulu (lihat cara di section A.2 di atas)
2. Klik **"+ New Variable"**
3. **Variable Name:** `JWT_SECRET`
4. **Value:** Paste random string yang sudah Anda generate
5. Klik **"Add"**

#### B.4 Tambah Variable Keempat - FRONTEND_URL

1. Klik **"+ New Variable"**
2. **Variable Name:** `FRONTEND_URL`
3. **Value:** `https://sapukota.vercel.app`
4. Klik **"Add"**

#### B.5 Verify Semua Variables

Sekarang di halaman Variables, Anda harus lihat **4 variables:**

```
┌────────────────────────────────────────────────────┐
│ Variables - sapukota                               │
├────────────────────────────────────────────────────┤
│                                                    │
│ DATABASE_URL                                       │
│ ${{MySQL.MYSQL_URL}}                               │
│                                                    │
│ NODE_ENV                                           │
│ production                                         │
│                                                    │
│ JWT_SECRET                                         │
│ a3f8d9e2c1b7a4f8...                                │
│                                                    │
│ FRONTEND_URL                                       │
│ https://sapukota.vercel.app                        │
│                                                    │
└────────────────────────────────────────────────────┘
```

✅ **Kalau semua ada, variables sudah di-set dengan benar!**

---

### **FASE 3: Restart & Redeploy Backend**

#### 3.1 Auto-Restart Triggered

Setelah Anda update variables:

1. Railway akan **otomatis trigger restart** backend service
2. Anda akan lihat notifikasi: **"Service restarting..."** atau **"Deploying..."**
3. **JANGAN tutup browser!** Tunggu proses selesai.

#### 3.2 Monitor Deployment

1. Masih di backend service detail
2. Klik tab **"Deployments"** (di menu atas)
3. Anda akan lihat **list of deployments**
4. Deployment paling atas (newest) akan ada status:
   - 🟡 **"BUILDING"** - sedang build
   - 🟡 **"DEPLOYING"** - sedang deploy
   - 🟢 **"SUCCESS"** - berhasil ✅
   - 🔴 **"FAILED"** - gagal ❌

#### 3.3 Klik Latest Deployment untuk Lihat Logs

1. **Klik deployment paling atas** (yang baru saja running)
2. Akan terbuka **detail deployment** dengan **Build Logs** dan **Deploy Logs**
3. Scroll ke bawah atau tunggu logs streaming

**Expected Logs (GOOD ✅):**

```
[2026-04-07 14:32:15] Building...
[2026-04-07 14:32:20] npm install
[2026-04-07 14:32:45] Dependencies installed
[2026-04-07 14:32:46] Starting deployment...
[2026-04-07 14:32:48] npm start
[2026-04-07 14:32:49] > backend@1.0.0 start
[2026-04-07 14:32:49] > node src/server.js
[2026-04-07 14:32:50] [dotenv@17.2.3] injecting env (4) from .env ← ✅ 4 vars!
[2026-04-07 14:32:51] ✅ Database connected successfully
[2026-04-07 14:32:51] Server running on port 3000
[2026-04-07 14:32:52] ✅ Deployment successful
```

**Key indicators sukses:**
- `injecting env (4)` atau `(5)` - **ADA angka, BUKAN (0)!**
- `✅ Database connected successfully` - **INI HARUS ADA!**
- `Server running on port 3000` - Server started

**Error Logs (BAD ❌):**

```
[dotenv@17.2.3] injecting env (0) from .env  ← ❌ STILL ZERO!
❌ Unable to start server: ConnectionRefusedError
connect ECONNREFUSED ::1:3306
```

Kalau masih error seperti ini, **variables belum ter-apply**. Balik ke FASE 2 dan check lagi.

---

### **FASE 4: Troubleshooting Kalau Masih Error**

#### ❌ Problem: Masih "injecting env (0)"

**Solusi:**

1. **Check variables di backend service** (bukan di MySQL!)
2. Variables harus ada **di backend service**, bukan di MySQL service
3. Kalau salah service, **delete vars di MySQL**, lalu **add di backend**

#### ❌ Problem: "${{MySQL.MYSQL_URL}}" tidak resolved

**Symptoms:**
```
Error: Invalid database URL
Cannot parse: ${{MySQL.MYSQL_URL}}
```

**Solusi:**

1. Railway reference syntax mungkin tidak work
2. **Manual copy-paste** MYSQL_URL dari MySQL service:
   
   a. Klik **MySQL service** → Tab **"Variables"**
   
   b. Cari variable **`MYSQL_URL`** (bukan MYSQLURL, harus MYSQL_URL dengan underscore)
   
   c. **Copy full value** (klik icon copy)
      - Example: `mysql://root:aB3xD9fK2mN8pQ1vZ6yC@containers-us-west-199.railway.app:6379/railway`
   
   d. Klik **backend service** → Tab **"Variables"**
   
   e. Edit variable **`DATABASE_URL`**
   
   f. **Replace** `${{MySQL.MYSQL_URL}}` dengan **full URL** yang Anda copy
   
   g. Click **"Update"** atau save

3. **Redeploy** backend:
   - Tab "Deployments" → Click **"..."** menu di latest deployment
   - Pilih **"Redeploy"**

#### ❌ Problem: Database connection timeout

**Symptoms:**
```
connect ETIMEDOUT
Connection timeout
```

**Solusi:**

1. **Check MySQL service status:**
   - Klik MySQL service
   - Tab "Metrics" atau "Settings"
   - Status harus: **"Active"** (hijau) atau **"Running"**

2. **Kalau status "Crashed" atau "Stopped":**
   - Tab "Settings" → Scroll ke bawah
   - Click **"Restart Service"**
   - Tunggu MySQL restart (~1-2 menit)

3. **Redeploy backend** setelah MySQL running

#### ❌ Problem: "Access denied for user"

**Symptoms:**
```
ER_ACCESS_DENIED_ERROR
Access denied for user 'root'@'...'
```

**Solusi:**

Password salah atau user salah. Check:

1. **Re-copy MYSQL_URL** dari MySQL service (Anda mungkin copy URL yang salah/expired)
2. **Paste lagi** ke backend `DATABASE_URL`
3. **Update variables** dan redeploy

#### 🔐 Generate JWT_SECRET

Gunakan salah satu cara:

**Option A: Random String Generator**
- Buka [randomkeygen.com](https://randomkeygen.com/)
- Pilih "Fort Knox Password" (256-bit key)
- Copy dan paste

**Option B: Terminal/Command Line**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example JWT_SECRET:**
```
JWT_SECRET=a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8
```

### 4.2 Deploy Backend

Setelah env variables di-set:

1. Railway akan **otomatis rebuild dan redeploy** backend
2. Pergi ke tab **"Deployments"** untuk monitor progress
3. Klik deployment terakhir untuk lihat logs
4. Tunggu sampai status jadi **"SUCCESS"** (✅ hijau)

**Build logs:**
```
npm install
npm start
Server running on port 3000
Database connected successfully
```

Kalau ada error, lihat section [Troubleshooting](#8-troubleshooting).

### 4.3 Run Database Migrations

Setelah backend deploy, kita harus setup database schema.

#### Option A: Menggunakan Railway MySQL Console (RECOMMENDED)

1. Klik **MySQL service card**
2. Pergi ke tab **"Data"** atau klik **"Query"**
3. Akan ada MySQL query console
4. Copy-paste isi migration files satu per satu:

**File 1: `migrations/update_reports_table.sql`**

Buka file di project Anda, copy semua isi, paste ke query console, klik **Execute** atau **Run**.

**File 2: `migrations/add_coordinates_to_reports.sql`**

Ulangi proses yang sama.

**File 3: `migrations/add_petugas_tracking.sql`**

Ulangi.

**File 4: `migrations/add_petugas_gps_tracking.sql`**

Ulangi.

**File 5: `migrations/add_user_gps_tracking.sql`**

Ulangi.

#### Option B: Menggunakan Railway CLI (Advanced)

Install Railway CLI:

```bash
npm install -g @railway/cli
```

Login dan link project:

```bash
railway login
cd /Users/ree/Documents/SapuKota/backend
railway link
```

Pilih project dan environment (production).

Connect ke MySQL:

```bash
railway connect MySQL
```

Ini akan buka MySQL shell. Sekarang copy-paste migrations satu per satu.

#### Option C: Menggunakan MySQL Client (DBeaver, TablePlus, dll)

1. Ambil credentials dari Railway MySQL → tab Variables
2. Connect menggunakan:
   - Host: `MYSQL_HOST`
   - Port: `MYSQL_PORT`
   - User: `MYSQL_USER`
   - Password: `MYSQL_PASSWORD`
   - Database: `MYSQL_DATABASE`
3. Run migration files satu per satu

### 4.4 Create Admin User (Seed Database)

Setelah migrations, buat admin user:

#### Menggunakan Railway CLI:

```bash
cd /Users/ree/Documents/SapuKota/backend
railway run npm run seed:admin
```

Output expected:
```
✅ Admin user created successfully!
📧 Email: admin@sapukota.id
🔑 Password: admin123
```

#### Atau Manual via MySQL Console:

```sql
INSERT INTO users (name, email, password, role, phone, created_at, updated_at) 
VALUES (
  'Admin SapuKota', 
  'admin@sapukota.id', 
  '$2a$10$5qGHBWGPVHGKL8l4jKv1VuHC8y.pq9Xp9KO7dwRXXUuoKZ4N8yYTi', 
  'admin', 
  '081234567890',
  NOW(),
  NOW()
);
```

Password hash di atas adalah untuk `admin123`.

### 4.5 Test Backend Endpoint

Test apakah backend sudah running:

**Test 1: Health Check**

```bash
curl https://YOUR_BACKEND_URL.railway.app/api/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "SapuKota API is running",
  "timestamp": "2026-04-06T..."
}
```

**Test 2: Login Endpoint**

```bash
curl -X POST https://YOUR_BACKEND_URL.railway.app/api/auth/login \
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin SapuKota",
    "email": "admin@sapukota.id",
    "role": "admin"
  }
}
```

✅ **Kalau kedua test berhasil, backend Anda sudah LIVE!**

---

## 5. Deploy Frontend ke Vercel

### 5.1 Login ke Vercel

1. Buka [vercel.com](https://vercel.com)
2. Klik **"Sign Up"** atau **"Login"** (pojok kanan atas)
3. Pilih **"Continue with GitHub"** atau **"Login with GitHub"**
4. Authorize Vercel untuk akses repository GitHub Anda
5. Anda akan masuk ke Vercel Dashboard

### 5.2 Import Project dari GitHub

1. Di Vercel Dashboard, klik **"Add New..."** (pojok kanan atas)
2. Pilih **"Project"**
3. Akan muncul halaman **"Import Git Repository"**
4. Cari repository **"SapuKota"**
   - Jika tidak muncul, klik **"Adjust GitHub App Permissions"** untuk grant akses
5. Klik **"Import"** di sebelah repository SapuKota

### 5.3 Configure Project Settings

Vercel akan otomatis detect bahwa ini Vite project. Sekarang configure:

#### A. Set Root Directory

**PENTING!** Frontend ada di folder `frontend/`:

1. Cari section **"Root Directory"**
2. Klik **"Edit"** atau **"Change"**
3. Pilih folder: **`frontend`**
4. Atau ketik manual: `frontend`

⚠️ **JANGAN CENTANG**: "Include source files outside of the Root Directory in the Build Step"

#### B. Framework Preset

- **Framework Preset**: `Vite` (sudah auto-detected, jangan diubah)

#### C. Build & Output Settings

Vercel sudah set otomatis, tapi pastikan:

| Setting | Value | Status |
|---------|-------|--------|
| **Build Command** | `npm run build` | ✅ Auto |
| **Output Directory** | `dist` | ✅ Auto |
| **Install Command** | `npm install` | ✅ Auto |

Jangan ubah apapun di sini kecuali ada error.

### 5.4 Set Environment Variables (CRITICAL!)

Sebelum deploy, kita harus set API URL backend:

1. Scroll ke section **"Environment Variables"**
2. Expand atau klik untuk add variables

**Tambahkan variable berikut:**

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR_BACKEND_URL.railway.app/api` |

⚠️ **PENTING:**
- Ganti `YOUR_BACKEND_URL.railway.app` dengan URL Railway Anda (yang sudah di-copy di step 2.5)
- **WAJIB tambahkan `/api` di akhir URL!**
- Prefix **HARUS** `VITE_` karena ini Vite project

**Example:**
```
Name:  VITE_API_URL
Value: https://sapukota-backend-production.up.railway.app/api
```

**Environment Scope:**
- Centang: ✅ **Production**
- Centang: ✅ **Preview**
- Centang: ✅ **Development**

(Centang semua agar API URL tersedia di all environments)

3. Klik **"Add"** atau **"Save"**

### 5.5 Deploy!

1. Setelah semua konfigurasi selesai, klik **"Deploy"** (tombol besar di bawah)
2. Vercel akan mulai build process:
   ```
   Cloning repository...
   Installing dependencies...
   Running build command...
   Deploying...
   ```
3. Monitor progress di **build logs** (akan muncul otomatis)
4. Tunggu ~2-5 menit

**Build logs example:**
```
[14:32:15] Installing dependencies...
[14:32:45] > npm install
[14:33:20] Dependencies installed
[14:33:21] Building...
[14:33:22] > vite build
[14:33:55] ✓ built in 33s
[14:33:56] Build Completed
[14:33:57] Deploying...
[14:34:10] ✅ Deployment Ready
```

### 5.6 Get Frontend URL

Setelah deployment SUCCESS:

1. Anda akan lihat **"Congratulations!"** atau **checkmark hijau**
2. URL otomatis di-generate:
   ```
   https://sapukota.vercel.app
   ```
   atau
   ```
   https://sapukota-xxxx.vercel.app
   ```
3. **COPY & SIMPAN URL INI!**

**📝 Catat URL Frontend Anda di sini:**
```
Frontend URL: https://_________________.vercel.app
```

### 5.7 (Optional) Custom Domain

Jika punya domain sendiri:

1. Di Vercel project, pergi ke tab **"Settings"**
2. Pilih **"Domains"** di sidebar
3. Klik **"Add"**
4. Ketik domain Anda: `sapukota.com`
5. Follow instruksi untuk update DNS records
6. Tunggu propagation (~24 jam)

Skip step ini kalau cuma mau pakai subdomain Vercel gratis.

---

## 6. Final Configuration

### 6.1 Update FRONTEND_URL di Railway Backend

Sekarang kita punya frontend URL, update backend:

1. Buka **Railway Dashboard**
2. Klik **backend service card**
3. Pergi ke tab **"Variables"**
4. Cari variable **`FRONTEND_URL`**
5. Update valuenya dengan URL Vercel yang baru Anda dapat:
   ```
   FRONTEND_URL=https://sapukota.vercel.app
   ```
   (TANPA trailing slash!)
6. Klik **"Update"** atau save
7. Backend akan **auto-restart**

**Mengapa ini penting?**
- CORS configuration
- Allowed origins untuk API requests
- Security headers

### 6.2 Verify Environment Variables

**Backend (Railway) - Checklist:**
```
✅ NODE_ENV=production
✅ DB_HOST=(dari MySQL service)
✅ DB_PORT=(dari MySQL service)
✅ DB_USER=(dari MySQL service)
✅ DB_PASSWORD=(dari MySQL service)
✅ DB_NAME=(dari MySQL service)
✅ JWT_SECRET=(random 32+ characters)
✅ FRONTEND_URL=(URL Vercel)
```

**Frontend (Vercel) - Checklist:**
```
✅ VITE_API_URL=(Railway backend URL + /api)
```

### 6.3 Check Deployment Status

**Railway Backend:**
1. Tab **"Deployments"** → Latest deployment → Status: ✅ **SUCCESS**
2. Tab **"Logs"** → Lihat: `Server running on port 3000` & `Database connected`

**Vercel Frontend:**
1. Tab **"Deployments"** → Latest deployment → Status: ✅ **Ready**
2. Function logs shows no errors

---

## 7. Testing End-to-End

### 7.1 Test Frontend UI

1. **Buka URL Vercel** di browser
   ```
   https://sapukota.vercel.app
   ```

2. **Pastikan halaman load tanpa error**
   - Tidak ada error di browser console (F12 → Console)
   - UI muncul dengan benar

3. **Test Login** dengan admin credentials:
   - Email: `admin@sapukota.id`
   - Password: `admin123`
   - Klik **"Login"**

4. **Kalau berhasil login:**
   - Anda akan redirect ke dashboard admin
   - Lihat data statistik
   - Menu sidebar muncul

✅ **Login berhasil = Frontend ↔️ Backend connected!**

### 7.2 Test CRUD Operations

**Test Create Report:**

1. Login sebagai user biasa (atau buat user baru via Register)
2. Pergi ke **"Buat Laporan"**
3. Isi form:
   - Judul: "Test Sampah Menumpuk"
   - Kategori: "Sampah Menumpuk"
   - Deskripsi: "Testing create report"
   - Upload foto (optional)
   - Allow location access
4. Klik **"Kirim Laporan"**
5. Check apakah laporan muncul di dashboard

**Test Admin Functions:**

1. Login sebagai admin
2. Dashboard → Lihat statistik update
3. Laporan → Lihat semua laporan
4. Ubah status laporan (Pending → Diproses → Selesai)
5. Lihat TPS map → Markers muncul
6. Kelola User → Lihat list users

**Test Upload:**

1. Buat laporan dengan foto
2. Check apakah foto terupload
3. Check di Railway logs: `File uploaded: uploads/...`

### 7.3 Test Mobile Responsiveness

1. Buka di **mobile browser** atau **DevTools mobile view** (F12 → Toggle device toolbar)
2. Test navigation
3. Test forms
4. Test maps (GPS permission)
5. Test upload foto via camera

### 7.4 Test Performance

**Vercel Frontend:**
- Page load < 3 seconds (pertama kali)
- Navigation instant (karena SPA)
- Assets di-serve dari CDN (cepat global)

**Railway Backend:**
- API response < 500ms
- Database queries optimized

### 7.5 Check Logs

**Railway Backend Logs:**

1. Railway Dashboard → Backend service → Tab **"Logs"**
2. Filter: **"Deploy logs"** atau **"Runtime logs"**
3. Pastikan no errors:
   ```
   ✅ Database connected successfully
   ✅ Server running on port 3000
   ✅ CORS enabled for: https://sapukota.vercel.app
   ```

**Vercel Function Logs:**

1. Vercel Dashboard → Project → Tab **"Logs"**
2. Filter by: **"Functions"** atau **"All"**
3. Check API calls successful (status 200)

---

## 8. Troubleshooting

### ❌ Problem: "No start command detected" di Railway

**Symptoms:**
```
✖ No start command detected
INFO No package manager inferred, using npm default
Specify a start command: https://railpack.com/config/file
```

**Root Cause:**
Railway mencari `package.json` di root project, tapi backend ada di folder `backend/`.

**Solutions:**

1. **Set Root Directory (PALING PENTING!)**
   - Klik service backend di Railway
   - Tab **"Settings"**
   - Scroll ke **"Service Settings"**
   - Field **"Root Directory"**: ketik `backend`
   - Tekan Enter atau klik di luar field
   - Railway akan auto-rebuild ✅

2. **Verify Root Directory**
   - Settings → Root Directory harus: `backend` (tanpa slash `/`)
   - ❌ Bukan: `backend/`
   - ❌ Bukan: `/backend`
   - ❌ Bukan: kosong
   - ✅ Harus: `backend`

3. **Check Rebuild Logs**
   - Tab "Deployments" → Latest deployment
   - Logs harus show:
     ```
     ✓ Found package.json
     ✓ npm install
     ✓ Detected start command: npm start
     ```

4. **Jika Masih Error:**
   - File `backend/railway.json` sudah ada (config manual)
   - Pastikan `backend/package.json` ada script `"start"`
   - Check file structure correct

### ❌ Problem: Backend Build Failed di Railway

**Symptoms:**
```
npm install failed
Module not found
Build error
```

**Solutions:**

1. **Check package.json**
   - Pastikan semua dependencies listed
   - Tidak ada typo di dependency names
   - Version conflicts resolved

2. **Check Root Directory**
   - Settings → Root Directory = `backend` (bukan `backend/`)
   - No typo

3. **Check Node version**
   - Railway auto-detect dari `package.json` → `engines` field
   - Atau tambahkan di `railway.json`:
     ```json
     {
       "build": {
         "builder": "NIXPACKS"
       },
       "deploy": {
         "startCommand": "npm start",
         "restartPolicyType": "ON_FAILURE",
         "restartPolicyMaxRetries": 10
       }
     }
     ```

4. **Redeploy**
   - Tab "Deployments" → Klik **"Redeploy"** di latest deployment
   - Atau push commit baru ke GitHub

### ❌ Problem: Database Connection Failed "ECONNREFUSED ::1:3306"

**Symptoms:**
```
❌ Unable to start server: ConnectionRefusedError
connect ECONNREFUSED ::1:3306
[dotenv@17.2.3] injecting env (0) from .env  ← ZERO variables!
```

**Root Cause:**
- Environment variables **BELUM DI-SET** di backend service
- Backend mencoba connect ke `localhost:3306` (tidak ada)
- `(0)` dalam logs = ZERO env vars loaded

**SOLUSI LENGKAP:**

#### Step 1: Verify MySQL Service Ada dan Running

1. Railway Dashboard → Klik Project
2. Harus ada **2 service cards**: Backend + MySQL
3. Kalau **MySQL service TIDAK ADA:**
   - Klik **"+ New"** atau **"Create"**
   - Pilih **"Database"** → **"Add MySQL"**
   - Tunggu provision selesai (~2 menit)
   
4. Kalau **MySQL service ADA**, check status:
   - Klik MySQL service card
   - Tab **"Settings"** atau lihat di card
   - Status harus: 🟢 **"Active"** atau **"Running"**
   - Kalau 🔴 **"Crashed"**: Tab Settings → Restart Service

#### Step 2: Set Environment Variables di Backend (CRITICAL!)

**Pastikan Anda set variables di BACKEND service, BUKAN di MySQL service!**

1. **Klik backend service card** (sapukota/nama repo, BUKAN MySQL)
2. Tab **"Variables"**
3. Klik **"Raw Editor"** (pojok kanan atas)
4. Paste ini:

```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=GENERATE_RANDOM_STRING_32_CHARS
FRONTEND_URL=https://sapukota.vercel.app
```

5. **Generate JWT_SECRET** (ganti baris ke-3):
   
   **Terminal:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   **Or website:** [randomkeygen.com](https://randomkeygen.com)
   
   **Replace** `GENERATE_RANDOM_STRING_32_CHARS` dengan hasil random string

6. **Klik "Update Variables"**

#### Step 3: Verify Variables Tersimpan

1. Masih di backend service → Tab "Variables"
2. Harus lihat **4 variables:**
   - ✅ DATABASE_URL
   - ✅ NODE_ENV  
   - ✅ JWT_SECRET
   - ✅ FRONTEND_URL

3. **Kalau tidak ada atau jumlahnya salah:**
   - You're in MySQL service! (wrong service)
   - Kembali ke project view
   - Klik **backend service** (card pertama)
   - Ulangi Step 2

#### Step 4: Monitor Redeploy

1. Setelah update variables, Railway auto-restart
2. Tab **"Deployments"**
3. Klik **latest deployment** (paling atas)
4. Watch **Deploy Logs** streaming

**Expected Logs (SUKSES ✅):**
```
npm start
> node src/server.js
[dotenv@17.2.3] injecting env (4) from .env  ← ✅ NOT ZERO!
✅ Database connected successfully
Server running on port 3000
```

**Kalau Masih Error (0) variables:**
```
[dotenv@17.2.3] injecting env (0) from .env  ← ❌ STILL ZERO!
❌ Unable to start server: ECONNREFUSED
```

→ **Variables belum ter-apply!** 
→ Balik ke Step 2, pastikan Anda edit **backend service** bukan MySQL service
→ Atau coba **manual redeploy**: Deployments tab → Click "..." → Redeploy

#### Step 5: Alternative - Manual Database URL (kalau reference syntax tidak work)

Kalau `${{MySQL.MYSQL_URL}}` tidak resolved:

1. **Klik MySQL service** → Tab **"Variables"**
2. Cari **`MYSQL_URL`** (dengan underscore, huruf besar semua)
3. **Copy full value** (click copy icon)
   - Example: `mysql://root:xYz123@containers-us-west-199.railway.app:6379/railway`
4. **Klik backend service** → Tab **"Variables"**  
5. Edit **`DATABASE_URL`** variable
6. **Replace** `${{MySQL.MYSQL_URL}}` dengan URL lengkap yang di-copy
7. **Update variables**
8. Railway will redeploy

#### Step 6: Test Connection

After successful deployment, test backend:

```bash
curl https://YOUR_BACKEND_URL.railway.app/api/health
```

Expected:
```json
{"status":"OK","message":"SapuKota API is running"}
```

✅ **Kalau dapat response ini, database connected!**

---

### ❌ Problem: "Cannot parse DATABASE_URL" atau "Invalid connection string"

**Symptoms:**
```
Error: Invalid database URL format
Cannot parse: ${{MySQL.MYSQL_URL}}
Unexpected token in connection string
```

**Solusi:**

Railway reference syntax (`${{...}}`) tidak work. Harus **manual copy-paste URL**:

1. MySQL service → Variables → Copy **`MYSQL_URL`** (full value, bukan reference)
2. Backend service → Variables → Edit **`DATABASE_URL`**
3. Paste full URL dari step 1
4. Update & redeploy

### ❌ Problem: Frontend menunjukkan "Network Error" atau "API Error"

**Symptoms:**
```
Network Error
Cannot connect to server
CORS error
ERR_CONNECTION_REFUSED
```

**Solutions:**

1. **Check VITE_API_URL**
   - Vercel → Project → Settings → Environment Variables
   - `VITE_API_URL` value:
     - ✅ Correct: `https://sapukota-backend.up.railway.app/api`
     - ❌ Wrong: `https://sapukota-backend.up.railway.app` (missing `/api`)
     - ❌ Wrong: `http://localhost:3000/api` (local URL)

2. **Redeploy Frontend**
   - Setelah update env variable, HARUS redeploy
   - Vercel → Deployments → Klik **"..."** → **"Redeploy"**
   - Atau push commit baru

3. **Check Backend URL Accessible**
   - Buka di browser: `https://YOUR_BACKEND_URL.railway.app/api/health`
   - Expected response: `{"status":"OK",...}`
   - Jika tidak bisa diakses, backend crashed

4. **Check CORS di Backend**
   - Backend code harus allow frontend URL
   - File `server.js` atau CORS config:
     ```js
     const cors = require('cors');
     app.use(cors({
       origin: process.env.FRONTEND_URL || 'http://localhost:5173',
       credentials: true
     }));
     ```

5. **Check Browser Console**
   - F12 → Console tab
   - Network tab → Lihat failed requests
   - Check error message detail

### ❌ Problem: CORS Error di Browser Console

**Symptoms:**
```
Access to XMLHttpRequest blocked by CORS policy
No 'Access-Control-Allow-Origin' header
CORS error
```

**Solutions:**

1. **Update FRONTEND_URL di Railway**
   - Backend service → Variables → `FRONTEND_URL`
   - Value HARUS exact match dengan Vercel URL
   - ✅ `https://sapukota.vercel.app` (no trailing slash)
   - ❌ `https://sapukota.vercel.app/` (trailing slash)

2. **Check Backend CORS Config**
   - File `src/server.js`:
     ```js
     app.use(cors({
       origin: process.env.FRONTEND_URL,
       credentials: true,
       methods: ['GET', 'POST', 'PUT', 'DELETE'],
       allowedHeaders: ['Content-Type', 'Authorization']
     }));
     ```

3. **Restart Backend** setelah update env variable

4. **Clear Browser Cache**
   - Hard reload: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)
   - Atau Incognito/Private mode

### ❌ Problem: Login Gagal - "Invalid Credentials"

**Symptoms:**
```
Login failed
Invalid email or password
401 Unauthorized
```

**Solutions:**

1. **Check Admin User Exists**
   - Railway → MySQL service → Tab "Data" atau "Query"
   - Run query:
     ```sql
     SELECT * FROM users WHERE email = 'admin@sapukota.id';
     ```
   - Jika empty, run seeder lagi: `railway run npm run seed:admin`

2. **Check Password Bcrypt**
   - Password harus bcrypt hashed di database
   - Jangan plain text!

3. **Check JWT_SECRET**
   - Backend service → Variables → `JWT_SECRET` ada dan tidak kosong

4. **Test Login via curl/Postman**
   ```bash
   curl -X POST https://YOUR_BACKEND_URL/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@sapukota.id","password":"admin123"}'
   ```
   - Check response

### ❌ Problem: File Upload Gagal

**Symptoms:**
```
Upload failed
Cannot POST /api/reports
413 Payload Too Large
500 Internal Server Error
```

**Solutions:**

1. **Check Upload Middleware**
   - File `src/middleware/upload.js` configured correctly
   - Max file size: 5MB (adjust if needed)

2. **Check Railway Disk Space**
   - Railway ephemeral filesystem (reset on redeploy)
   - Files uploaded harus disimpan ke persistent storage:
     - Option A: Railway Volume (paid plan)
     - Option B: External storage (AWS S3, Cloudinary, etc.)

3. **Add Persistent Storage (Recommended for Production)**

   **Using Cloudinary (Free tier 25GB):**

   a. Sign up at [cloudinary.com](https://cloudinary.com)
   
   b. Install SDK:
      ```bash
      npm install cloudinary multer-storage-cloudinary
      ```
   
   c. Update upload middleware
   
   d. Add env variables di Railway:
      ```
      CLOUDINARY_CLOUD_NAME=xxx
      CLOUDINARY_API_KEY=xxx
      CLOUDINARY_API_SECRET=xxx
      ```

4. **Test Upload with Small File First**
   - < 1MB
   - Check logs untuk error detail

### ❌ Problem: Railway "Out of Resources" / Credits Habis

**Symptoms:**
```
Service stopped
Out of memory
Build failed - insufficient resources
Credits depleted
```

**Solutions:**

1. **Check Usage**
   - Railway Dashboard → Project → Settings → **"Usage"**
   - Free tier: $5/month
   - Lihat breakdown: CPU, RAM, network

2. **Optimize Backend**
   - Reduce memory usage
   - Optimize queries
   - Add caching

3. **Upgrade Plan**
   - Railway → Settings → **"Upgrade to Pro"**
   - $5/month base + usage-based pricing

4. **Alternative: Split Database**
   - MySQL di **PlanetScale** (free tier)
   - Backend tetap di Railway
   - Update `DB_HOST` to PlanetScale URL

### ❌ Problem: Vercel Build Failed

**Symptoms:**
```
Build failed
Module not found
Cannot find package
```

**Solutions:**

1. **Check Root Directory**
   - Vercel → Settings → General → **Root Directory** = `frontend`

2. **Check package.json**
   - Path: `frontend/package.json` ada
   - Dependencies complete

3. **Check Build Logs**
   - Vercel → Deployments → Klik failed deployment → **"View Build Logs"**
   - Lihat error message detail

4. **Check Node Version**
   - Add `engines` field di `package.json`:
     ```json
     "engines": {
       "node": "20.x"
     }
     ```

5. **Redeploy**
   - Vercel → Deployments → **"Redeploy"**

### ❌ Problem: Halaman Blank/White Screen di Vercel

**Symptoms:**
- Frontend deploy success
- URL accessible tapi halaman putih
- No content shown

**Solutions:**

1. **Check Browser Console** (F12)
   - Lihat JavaScript errors
   - Biasanya: "Uncaught ReferenceError" atau module errors

2. **Check VITE_API_URL**
   - Env variable ada dan correct
   - Redeploy setelah update

3. **Check Build Output**
   - Vercel → Deployments → Latest → **"View Build Logs"**
   - Pastikan `dist` folder ter-generate
   - No errors during build

4. **Check index.html**
   - File `frontend/index.html` exists
   - Correct path to assets

5. **Test Local Build**
   ```bash
   cd frontend
   npm run build
   npm run preview
   ```
   - Jika local OK tapi Vercel tidak, problem di env variables

---

## 📊 Summary & URLs

Setelah selesai, Anda akan punya:

### ✅ Backend (Railway)

- **URL**: `https://sapukota-backend-production.up.railway.app`
- **API**: `https://sapukota-backend-production.up.railway.app/api`
- **Database**: MySQL di Railway (private network)
- **Deployment**: Auto-deploy dari GitHub push

### ✅ Frontend (Vercel)

- **URL**: `https://sapukota.vercel.app`
- **CDN**: Global edge network
- **Deployment**: Auto-deploy dari GitHub push

### ✅ Credentials

**Admin Login:**
- Email: `admin@sapukota.id`
- Password: `admin123`

**⚠️ UBAH PASSWORD SETELAH FIRST LOGIN!**

---

## ✅ Deployment Checklist (Print & Follow)

Copy checklist ini dan centang satu per satu saat deploy:

### **Backend Railway Setup**

```
[ ] 1. Login ke railway.app dengan GitHub
[ ] 2. Create New Project → Deploy from GitHub repo
[ ] 3. Pilih repository SapuKota
[ ] 4. ⚠️ CRITICAL: Set Root Directory = "backend"
    └── Backend service → Settings → Root Directory: backend
[ ] 5. Generate Backend URL
    └── Settings → Networking/Domains → Generate Domain
[ ] 6. Copy & simpan backend URL: _______________________
```

### **MySQL Database Setup**

```
[ ] 7. Add MySQL service ke project
    └── + New → Database → Add MySQL
[ ] 8. Tunggu MySQL provision selesai (~2 menit)
[ ] 9. Check MySQL status = Active/Running ✅
[ ] 10. Buka MySQL service → Tab Variables
[ ] 11. Copy variable MYSQL_URL (untuk step berikutnya)
```

### **Backend Environment Variables**

```
[ ] 12. ⚠️ CRITICAL: Klik BACKEND service (bukan MySQL!)
[ ] 13. Tab Variables → Raw Editor
[ ] 14. Generate JWT_SECRET:
    └── node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
[ ] 15. Paste template ini di Raw Editor:

    DATABASE_URL=${{MySQL.MYSQL_URL}}
    NODE_ENV=production
    JWT_SECRET=[paste_hasil_step_14]
    FRONTEND_URL=https://sapukota.vercel.app

[ ] 16. Ganti JWT_SECRET dengan hasil generate dari step 14
[ ] 17. Click "Update Variables"
[ ] 18. Tunggu auto-redeploy (~2-3 menit)
```

### **Verify Backend Deployment**

```
[ ] 19. Tab Deployments → Klik latest deployment
[ ] 20. Check logs harus ada:
    └── ✅ [dotenv] injecting env (4) from .env
    └── ✅ Database connected successfully
    └── ✅ Server running on port 3000
[ ] 21. Test backend URL:
    └── curl https://YOUR_URL.railway.app/api/health
    └── Expected: {"status":"OK",...}
```

### **Database Schema Setup**

```
[ ] 22. Run migrations (pilih salah satu cara):
    
    Cara A: Railway MySQL Console
    └── MySQL service → Tab Data/Query
    └── Copy-paste isi file migrations/*.sql satu per satu
    
    Cara B: Railway CLI (lebih advanced)
    └── npm install -g @railway/cli
    └── railway login
    └── cd backend && railway link
    └── railway connect MySQL
    └── Copy-paste migrations

[ ] 23. Create admin user:
    └── railway run npm run seed:admin
    └── Atau insert manual via MySQL console
```

### **Frontend Vercel Setup**

```
[ ] 24. Login ke vercel.com dengan GitHub
[ ] 25. Add New → Project → Import repository SapuKota
[ ] 26. ⚠️ CRITICAL: Set Root Directory = "frontend"
[ ] 27. Add Environment Variable:
    └── Name: VITE_API_URL
    └── Value: https://YOUR_BACKEND.railway.app/api
    └── ⚠️ Jangan lupa /api di akhir!
[ ] 28. Centang: Production, Preview, Development (all)
[ ] 29. Click Deploy
[ ] 30. Tunggu build selesai (~3-5 menit)
[ ] 31. Copy & simpan frontend URL: _______________________
```

### **Final Configuration**

```
[ ] 32. Update FRONTEND_URL di Railway:
    └── Backend service → Variables → Edit FRONTEND_URL
    └── Ganti dengan URL Vercel yang baru
    └── Update variables (auto-redeploy)
[ ] 33. Test login di frontend Vercel URL
    └── Email: admin@sapukota.id
    └── Password: admin123
[ ] 34. ✅ Kalau login berhasil = DEPLOYMENT SUCCESS!
```

### **Post-Deployment**

```
[ ] 35. Change admin password via UI
[ ] 36. Test create laporan (dengan foto & GPS)
[ ] 37. Test admin dashboard & statistik
[ ] 38. Test mobile responsive
[ ] 39. Setup monitoring (optional):
    └── UptimeRobot untuk uptime monitoring
    └── Sentry untuk error tracking
[ ] 40. 🎉 Share URL dengan tim/klien!
```

---

## 📞 Troubleshooting Quick Reference

| Error | Quick Fix |
|-------|-----------|
| `No start command detected` | Set Root Directory = `backend` |
| `ECONNREFUSED ::1:3306` | Set environment variables di backend service |
| `injecting env (0)` | Variables belum di-set atau salah service |
| `Access denied for user` | Re-copy MYSQL_URL dari MySQL service |
| `CORS error` | Update FRONTEND_URL di Railway backend |
| `Network Error` frontend | Check VITE_API_URL di Vercel |
| `Cannot POST /api/reports` | Check backend URL accessible |
| Build failed | Check logs detail di Deployments tab |

**Untuk troubleshooting lengkap, lihat Section 8 di bawah.**

---

### ✅ Auto-Deploy Setup

Kedua platform sudah connected ke GitHub:

1. **Push ke branch `main`** → Auto-deploy ke production
2. **Push ke branch lain** → Vercel buat preview deployment (optional)
3. **Monitor di dashboard** masing-masing platform

---

## 🎯 Next Steps

### Security Hardening

1. **Ubah Admin Password**
   - Login → Profile → Change Password

2. **Setup Rate Limiting**
   - Prevent brute force attacks
   - Add `express-rate-limit` middleware

3. **Enable HTTPS Only**
   - Vercel: ✅ Otomatis HTTPS
   - Railway: ✅ Otomatis HTTPS

4. **Environment Variables Security**
   - JANGAN commit `.env` files
   - Use platform env variables only

### Monitoring & Logging

1. **Setup Error Tracking**
   - [Sentry](https://sentry.io) - Free tier
   - Add to frontend & backend

2. **Setup Uptime Monitoring**
   - [UptimeRobot](https://uptimerobot.com) - Free
   - Monitor backend URL setiap 5 menit

3. **Check Logs Regularly**
   - Railway: Backend logs
   - Vercel: Function logs
   - Look for errors atau unusual activity

### Performance Optimization

1. **Enable Caching**
   - API responses caching
   - Static assets caching (Vercel otomatis)

2. **Optimize Images**
   - Compress sebelum upload
   - Use WebP format
   - Lazy loading

3. **Database Indexing**
   - Add indexes ke frequently queried columns
   - Optimize query performance

### Backup & Recovery

1. **Database Backup**
   - Railway MySQL: Export SQL dumps secara berkala
   - Simpan di GitHub atau external storage

2. **Code Backup**
   - ✅ GitHub sudah jadi backup
   - Add tags untuk versions

3. **Disaster Recovery Plan**
   - Document rollback procedures
   - Test restore process

---

## 📞 Support & Resources

### Railway Resources

- **Docs**: [docs.railway.app](https://docs.railway.app)
- **Discord**: Railway Community
- **Status**: [status.railway.app](https://status.railway.app)

### Vercel Resources

- **Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Discord**: Vercel Community
- **Status**: [vercel-status.com](https://www.vercel-status.com/)

### Jika Masih Error

1. **Check logs** di Railway & Vercel
2. **Google error message** exact
3. **Ask di Discord** community (Railway/Vercel)
4. **Create GitHub Issue** di repo ini

---

## 🎉 Selamat!

Aplikasi SapuKota Anda sudah LIVE di internet! 🚀

**Share URL Anda:**
```
https://sapukota.vercel.app
```

---

**Last Updated**: April 6, 2026
**Version**: 1.0.0
