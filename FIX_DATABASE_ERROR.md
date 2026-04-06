# 🔧 Fix Error: Database Connection Failed

## ❌ Error yang Anda Alami:

```
❌ Unable to start server: ConnectionRefusedError
connect ECONNREFUSED ::1:3306
[dotenv@17.2.3] injecting env (0) from .env
```

## ✅ Root Cause:

**Environment variables belum di-set di Railway backend service!**

`(0)` = ZERO variables loaded → Backend mencoba connect localhost (tidak ada)

---

## 🚀 Solusi: 5 Langkah Fix

### **Step 1: Pastikan MySQL Service Ada**

Di Railway Dashboard:
- Harus ada **2 kotak**: Backend + MySQL
- Kalau MySQL tidak ada: **+ New → Database → Add MySQL**
- Tunggu provision (~2 menit)

### **Step 2: Klik BACKEND Service (PENTING!)**

⚠️ **Jangan klik MySQL service!**

```
┌──────────────┐      ┌──────────────┐
│ sapukota     │      │   MySQL      │
│ (Backend)    │      │ (Database)   │
└──────────────┘      └──────────────┘
     ↑
  KLIK INI!
```

### **Step 3: Buka Tab Variables**

- Backend service → Tab **"Variables"** (menu atas)
- Klik **"Raw Editor"** (pojok kanan atas)

### **Step 4: Generate JWT Secret**

Buka terminal dan run:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Output example:**
```
a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7
```

**Copy output ini!**

### **Step 5: Paste Template ke Raw Editor**

Di Raw Editor Railway, paste ini:

```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=PASTE_HASIL_STEP_4_DI_SINI
FRONTEND_URL=https://sapukota.vercel.app
```

**Edit baris ke-3:**
- Hapus: `PASTE_HASIL_STEP_4_DI_SINI`
- Paste: Random string dari Step 4

**Hasil akhir example:**
```env
DATABASE_URL=${{MySQL.MYSQL_URL}}
NODE_ENV=production
JWT_SECRET=a3f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7a4f8d9e2c1b7
FRONTEND_URL=https://sapukota.vercel.app
```

Klik **"Update Variables"**

---

## ✅ Verify Fix Berhasil

### 1. Auto-Redeploy Triggered

Railway akan auto-restart backend (~2-3 menit)

### 2. Check Deployment Logs

- Tab **"Deployments"**
- Klik **latest deployment** (paling atas)
- Watch logs streaming

### 3. Expected Logs (SUCCESS ✅):

```
npm start
> node src/server.js

[dotenv@17.2.3] injecting env (4) from .env  ← ✅ 4 variables!
✅ Database connected successfully
Server running on port 3000
```

**Key indicators:**
- `injecting env (4)` atau `(5)` - **BUKAN (0)!**
- `✅ Database connected successfully` - **INI HARUS ADA!**

### 4. Test Backend URL

```bash
curl https://YOUR_BACKEND_URL.railway.app/api/health
```

Expected response:
```json
{"status":"OK","message":"SapuKota API is running"}
```

✅ **Kalau dapat response ini = FIXED!**

---

## ❌ Kalau Masih Error (0) Variables

### Kemungkinan 1: Variables di Service yang Salah

**Check:**
1. Apakah Anda add variables di **MySQL service**? (SALAH!)
2. Variables HARUS di **Backend service** (sapukota)

**Fix:**
1. Kembali ke Project View (klik nama project)
2. Pastikan klik **kotak pertama** (backend/sapukota)
3. Ulangi Step 2-5 di atas

### Kemungkinan 2: Reference Syntax Tidak Work

Kalau `${{MySQL.MYSQL_URL}}` tidak resolved:

**Fix dengan manual copy-paste:**

1. **Klik MySQL service** → Tab "Variables"
2. Cari variable **`MYSQL_URL`** 
3. **Copy full value** (klik icon copy)
   ```
   mysql://root:xYz123@containers-us-west-199.railway.app:6379/railway
   ```
4. **Klik backend service** → Tab "Variables"
5. Edit variable **`DATABASE_URL`**
6. **Replace** `${{MySQL.MYSQL_URL}}` dengan URL lengkap dari step 3
7. **Update variables**

### Kemungkinan 3: Need Manual Redeploy

1. Backend service → Tab **"Deployments"**
2. Klik **"..."** menu di latest deployment
3. Pilih **"Redeploy"**
4. Tunggu ~2-3 menit

---

## 📋 Quick Checklist

```
[ ] MySQL service ada dan status Active ✅
[ ] Variables di-set di BACKEND service (bukan MySQL) ✅
[ ] Ada 4 variables minimum:
    [ ] DATABASE_URL
    [ ] NODE_ENV
    [ ] JWT_SECRET
    [ ] FRONTEND_URL
[ ] JWT_SECRET sudah di-generate (random 32+ chars) ✅
[ ] Click "Update Variables" ✅
[ ] Wait auto-redeploy (~2-3 menit) ✅
[ ] Check logs: "injecting env (4)" ✅
[ ] Check logs: "Database connected successfully" ✅
[ ] Test: curl backend/api/health = 200 OK ✅
```

---

## 🆘 Masih Error?

1. **Screenshot** deployment logs lengkap
2. **Screenshot** backend service variables page
3. **Check** MySQL service status (Active/Crashed?)
4. **Restart** MySQL service jika crashed:
   - MySQL service → Settings → Restart Service
5. **Redeploy** backend setelah MySQL running

---

## 📖 Panduan Lengkap

Untuk panduan lengkap deployment Railway + Vercel, lihat:

**[PANDUAN_HOSTING_LENGKAP.md](./PANDUAN_HOSTING_LENGKAP.md)**

---

**Last Updated**: April 7, 2026
