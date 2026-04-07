# 🚀 Deploy Frontend ke Vercel + Custom Domain sapukota.id

Panduan super detail deploy frontend SapuKota ke Vercel dan setup custom domain **sapukota.id**.

---

## 📋 Yang Anda Butuhkan:

- [x] Backend sudah deployed di Railway ✅
- [x] Backend URL: `https://sapukota-production.up.railway.app`
- [x] Admin user sudah dibuat ✅
- [ ] Akun Vercel (gratis)
- [ ] Domain sapukota.id (sudah punya ✅)
- [ ] Akses ke DNS management domain (Namecheap, Cloudflare, GoDaddy, dll)

---

## 🎯 BAGIAN 1: Deploy Frontend ke Vercel

### **Step 1: Login ke Vercel**

1. Buka browser, pergi ke [vercel.com](https://vercel.com)

2. Klik tombol **"Sign Up"** atau **"Login"** (pojok kanan atas)

3. Pilih **"Continue with GitHub"** atau **"Login with GitHub"**

```
┌─────────────────────────────────────┐
│  Welcome to Vercel                  │
│                                     │
│  [Continue with GitHub]             │
│  [Continue with GitLab]             │
│  [Continue with Bitbucket]          │
│  [Continue with Email]              │
└─────────────────────────────────────┘
```

4. Akan redirect ke GitHub → **"Authorize Vercel"**

5. Klik **"Authorize vercel"** (tombol hijau)

6. Anda akan kembali ke Vercel Dashboard

---

### **Step 2: Import Project dari GitHub**

#### 2.1 Klik Add New

1. Di Vercel Dashboard (setelah login), pojok kanan atas ada tombol **"Add New..."**

2. **Klik tombol tersebut**

3. Dropdown menu muncul:
   ```
   ┌─────────────────┐
   │ Project         │
   │ Team            │
   │ Domain          │
   └─────────────────┘
   ```

4. **Klik "Project"**

#### 2.2 Import Git Repository

1. Halaman **"Import Git Repository"** akan muncul

2. Anda akan lihat section **"Import Git Repository"** dengan list repositories

3. Cari repository **"SapuKota"** di list

**Kalau repository TIDAK MUNCUL:**

1. Klik **"Adjust GitHub App Permissions"** atau **"Add GitHub Account"**
2. Pilih akun GitHub Anda
3. Grant access ke repository SapuKota:
   - Option A: **"All repositories"** (semua repo)
   - Option B: **"Only select repositories"** → Pilih **SapuKota** ✅
4. Klik **"Save"** atau **"Install"**
5. Kembali ke Vercel, repository akan muncul

#### 2.3 Import Repository

1. Setelah repository **SapuKota** muncul di list
2. Klik tombol **"Import"** di sebelah kanan nama repository

```
┌──────────────────────────────────────────┐
│ SapuKota                                 │
│ your-github-username/SapuKota            │
│ Updated X hours ago         [Import]  ← Klik ini  │
└──────────────────────────────────────────┘
```

---

### **Step 3: Configure Project Settings** ⚠️ **CRITICAL!**

Setelah klik Import, halaman **"Configure Project"** muncul.

#### 3.1 Project Name

```
Project Name: SapuKota  (atau biarkan default)
```

Anda bisa edit atau biarkan default. Name ini untuk internal Vercel saja.

#### 3.2 Framework Preset

Vercel auto-detect framework:

```
Framework Preset: Vite  ✅ (auto-detected)
```

**Jangan ubah ini!** Vercel sudah detect dengan benar.

#### 3.3 Root Directory ⚠️ **PENTING!**

Ini adalah **langkah paling penting**!

1. Cari section **"Root Directory"**

2. Default-nya kosong atau `./`

3. Klik tombol **"Edit"** di sebelah kanan

```
┌────────────────────────────────────────┐
│ Root Directory                         │
│ ./                            [Edit]   │ ← Klik ini
└────────────────────────────────────────┘
```

4. Setelah klik Edit, akan muncul **folder picker** atau **input field**

5. **Pilih folder: `frontend`** atau ketik: `frontend`

```
┌────────────────────────────────────────┐
│ Root Directory                         │
│ frontend/                     [✓]      │
└────────────────────────────────────────┘
```

6. Klik **checkmark** atau klik di luar untuk save

**JANGAN centang** option: _"Include source files outside of the Root Directory in the Build Step"_

#### 3.4 Build and Output Settings

Vercel sudah set otomatis dari detection:

```
Build Command:     npm run build      ✅ (auto)
Output Directory:  dist               ✅ (auto)
Install Command:   npm install        ✅ (auto)
```

**Biarkan semua default, jangan diubah!**

#### 3.5 Environment Variables ⚠️ **SUPER PENTING!**

Scroll ke bawah, cari section **"Environment Variables"**.

##### 3.5.1 Expand Environment Variables Section

Kalau collapsed, klik untuk expand:

```
┌────────────────────────────────────────┐
│ Environment Variables          [▼]     │
└────────────────────────────────────────┘
```

##### 3.5.2 Add Variable

1. Setelah expand, ada 3 input fields:

```
┌──────────────────────────────────────────────┐
│ Key                                          │
│ [________________]                           │
│                                              │
│ Value                                        │
│ [________________]                           │
│                                              │
│ Environment                                  │
│ [ ] Production  [ ] Preview  [ ] Development │
└──────────────────────────────────────────────┘
```

2. **Field 1 - Key:** Ketik `VITE_API_URL`

```
Key: VITE_API_URL
```

⚠️ **HARUS persis!** 
- Prefix `VITE_` wajib (Vite requirement)
- Huruf besar semua: `VITE_API_URL`
- Pakai underscore `_`, bukan dash `-`

3. **Field 2 - Value:** Ketik backend Railway URL + `/api`

```
Value: https://sapukota-production.up.railway.app/api
```

⚠️ **CRITICAL:**
- **HARUS pakai `/api` di akhir!**
- ✅ Correct: `https://sapukota-production.up.railway.app/api`
- ❌ Wrong: `https://sapukota-production.up.railway.app` (missing `/api`)
- ❌ Wrong: `https://sapukota-production.up.railway.app/api/` (trailing slash)

4. **Field 3 - Environment:** Centang **SEMUA**

```
✅ Production
✅ Preview
✅ Development
```

Centang ketiga-tiganya agar env variable tersedia di all environments.

5. Klik tombol **"Add"** atau icon checkmark

##### 3.5.3 Verify Variable Added

Setelah klik Add, Anda akan lihat variable dalam list:

```
┌──────────────────────────────────────────────┐
│ Name: VITE_API_URL                           │
│ Value: https://sapukota-production.up.ra...  │
│ Scope: Production, Preview, Development      │
│ [Edit] [Remove]                              │
└──────────────────────────────────────────────┘
```

✅ **Pastikan variable ini muncul sebelum deploy!**

---

### **Step 4: Deploy!** 🚀

#### 4.1 Click Deploy Button

1. Scroll ke paling bawah halaman configure

2. Ada tombol besar **"Deploy"**

```
┌────────────────────────────────┐
│         [Deploy]               │
└────────────────────────────────┘
```

3. **Klik tombol "Deploy"**

#### 4.2 Monitor Build Progress

Setelah klik Deploy, Vercel akan:

1. **Clone repository** dari GitHub
2. **Install dependencies** (`npm install`)
3. **Build project** (`npm run build`)
4. **Deploy to CDN**

Anda akan lihat **build logs** streaming real-time:

```
┌─────────────────────────────────────────────┐
│ Building...                                 │
├─────────────────────────────────────────────┤
│                                             │
│ [14:32:10] Cloning repository...            │
│ [14:32:15] Installing dependencies...       │
│ [14:32:20] > npm install                    │
│ [14:32:45] Dependencies installed (234 pkg) │
│ [14:32:46] Building application...          │
│ [14:32:47] > vite build                     │
│ [14:32:50]   ✓ building for production...   │
│ [14:33:15]   ✓ 156 modules transformed      │
│ [14:33:20]   dist/index.html     1.2 kB     │
│ [14:33:20]   dist/assets/...     523 kB     │
│ [14:33:21] ✓ built in 34.5s                 │
│ [14:33:22] Build Completed                  │
│ [14:33:23] Deploying...                     │
│ [14:33:35] ✅ Deployment Ready               │
│                                             │
│ https://sapukota-xxx.vercel.app             │
└─────────────────────────────────────────────┘
```

**Expected timeline:**
- Install dependencies: ~30-60 detik
- Build: ~30-90 detik
- Deploy: ~10-20 detik
- **Total: 2-5 menit**

#### 4.3 Deployment Success! ✅

Setelah selesai, Anda akan lihat:

1. **Confetti animation** 🎉 (kalau first deployment)
2. **"Congratulations!"** message
3. **Preview screenshot** dari website
4. **URL Vercel** otomatis (format: `https://sapukota-xxx.vercel.app`)

```
┌─────────────────────────────────────────────┐
│          🎉 Congratulations!                │
│                                             │
│   Your project has been deployed!           │
│                                             │
│   https://sapukota-git-main-xxx.vercel.app  │
│                                             │
│   [Visit]  [View Deployment]                │
└─────────────────────────────────────────────┘
```

5. **Klik "Visit"** untuk buka website

#### 4.4 Test Frontend (Vercel Subdomain)

1. Website akan buka di tab baru

2. Anda akan lihat homepage SapuKota

3. **Test login:**
   - Klik tombol **"Login"**
   - Email: `admin@sapukota.id`
   - Password: `admin123`
   - Klik **"Login"**

4. **Kalau berhasil login:**
   - Redirect ke dashboard ✅
   - Lihat statistik
   - Menu sidebar muncul

5. **Kalau error "Network Error" atau "Cannot connect":**
   - Check browser console (F12 → Console tab)
   - Kemungkinan CORS issue atau env variable salah
   - Lihat section Troubleshooting di bawah

---

## 🌐 BAGIAN 2: Setup Custom Domain sapukota.id

Sekarang frontend sudah live di Vercel subdomain. Mari setup custom domain **sapukota.id**.

### **Step 5: Add Domain di Vercel**

#### 5.1 Pergi ke Project Settings

1. Dari halaman deployment success, klik **"Continue to Dashboard"** atau logo Vercel

2. Anda akan di **Project Dashboard**

3. Klik tab **"Settings"** (menu atas)

```
┌────────────────────────────────────────────┐
│ Overview | Deployments | Analytics | Settings │
│                                  ↑           │
│                              Klik ini        │
└────────────────────────────────────────────┘
```

#### 5.2 Pergi ke Domains Settings

1. Di sidebar kiri Settings, cari **"Domains"**

```
Settings
├─ General
├─ Domains        ← Klik ini
├─ Git
├─ Environment Variables
├─ Functions
└─ ...
```

2. **Klik "Domains"**

#### 5.3 Add Custom Domain

1. Di halaman Domains, ada input field **"Add a domain"**

```
┌────────────────────────────────────────────┐
│ Domains                                    │
├────────────────────────────────────────────┤
│                                            │
│ Enter the domain you would like to add    │
│ [_________________________________]  [Add] │
│                                            │
└────────────────────────────────────────────┘
```

2. Ketik: `sapukota.id`

3. Klik tombol **"Add"**

#### 5.4 Domain Verification

Vercel akan check domain:

**Scenario A: Domain belum dipakai**
```
✅ sapukota.id is available!
```

**Scenario B: Domain sudah dipakai di Vercel lain**
```
❌ This domain is already in use
```

**Scenario C: Need to verify ownership**
```
⚠️  Invalid Configuration
Please add the following DNS records:
```

Kemungkinan besar Anda akan dapat Scenario C.

#### 5.5 Add WWW Subdomain (Optional tapi Recommended)

Setelah add `sapukota.id`, Vercel akan suggest add `www`:

```
┌────────────────────────────────────────────┐
│ Would you like to add www.sapukota.id too? │
│                                            │
│ [Yes, add www.sapukota.id]  [No, skip]    │
└────────────────────────────────────────────┘
```

**Klik "Yes, add www.sapukota.id"** (recommended)

Ini akan redirect:
- `www.sapukota.id` → `sapukota.id` (otomatis)
- User bisa akses dengan atau tanpa `www`

---

### **Step 6: Configure DNS Records**

Sekarang Anda harus update DNS settings domain sapukota.id.

#### 6.1 Get DNS Instructions dari Vercel

Setelah add domain, Vercel akan show **DNS configuration instructions**:

```
┌────────────────────────────────────────────────────┐
│ Configure DNS for sapukota.id                      │
├────────────────────────────────────────────────────┤
│                                                    │
│ Add the following DNS records at your registrar:  │
│                                                    │
│ Type   Name    Value                              │
│ ──────────────────────────────────────────────    │
│ A      @       76.76.21.21                        │
│ CNAME  www     cname.vercel-dns.com               │
│                                                    │
│ Or use Vercel nameservers:                        │
│ ns1.vercel-dns.com                                │
│ ns2.vercel-dns.com                                │
└────────────────────────────────────────────────────┘
```

**Copy informasi ini!** Anda akan butuh untuk step berikutnya.

#### 6.2 Buka DNS Management Panel

Domain **sapukota.id** dibeli di mana? (Namecheap, GoDaddy, Cloudflare, Niagahoster, dll?)

**Contoh untuk berbagai registrar:**

##### **If domain di Namecheap:**

1. Login [namecheap.com](https://www.namecheap.com)
2. Pergi ke **"Domain List"**
3. Klik **"Manage"** di samping sapukota.id
4. Tab **"Advanced DNS"**

##### **If domain di GoDaddy:**

1. Login [godaddy.com](https://www.godaddy.com)
2. Pergi ke **"My Products"** → **"Domains"**
3. Klik **sapukota.id**
4. Tab **"DNS"** atau **"DNS Management"**

##### **If domain di Cloudflare:**

1. Login [cloudflare.com](https://dash.cloudflare.com)
2. Select site **sapukota.id**
3. Tab **"DNS"**

##### **If domain di Niagahoster/Indo:**

1. Login member area
2. Layanan Saya → Domain
3. Kelola Domain → sapukota.id
4. DNS Management

#### 6.3 Add DNS Records

##### Option A: Menggunakan Vercel A Record (Recommended)

**Add 2 records ini:**

**Record 1 - Apex domain:**
```
Type:  A
Name:  @  (atau biarkan kosong, atau sapukota.id)
Value: 76.76.21.21
TTL:   Automatic atau 3600
```

**Record 2 - WWW subdomain:**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   Automatic atau 3600
```

##### Option B: Menggunakan CNAME (Alternative)

**Record 1 - Apex via CNAME flattening:**
```
Type:  CNAME
Name:  @
Value: cname.vercel-dns.com
TTL:   Automatic
```

(Hanya work kalau DNS provider support CNAME flattening - Cloudflare support, Namecheap tidak)

**Record 2 - WWW:**
```
Type:  CNAME
Name:  www
Value: cname.vercel-dns.com
TTL:   Automatic
```

##### Option C: Menggunakan Vercel Nameservers (Advanced)

Kalau mau full control ke Vercel:

1. Di DNS management, cari **"Nameservers"** atau **"Custom DNS"**
2. Ganti nameservers ke:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```
3. Save changes

**Pros:**
- Vercel manage semua DNS
- Auto SSL certificate renewal
- Fast propagation

**Cons:**
- Email records harus di-setup ulang kalau ada
- MX records, TXT records, dll harus dipindah

#### 6.4 Hapus DNS Records yang Conflict (PENTING!)

Sebelum save, **pastikan tidak ada A record atau CNAME yang conflict**:

**Hapus:**
- A record lama untuk `@` atau apex domain
- CNAME record lama untuk `@`
- A record lama untuk `www`
- CNAME record lama untuk `www` yang point ke selain Vercel

**Biarkan (jangan dihapus):**
- MX records (untuk email)
- TXT records (untuk verification, SPF, DKIM)
- NS records (nameservers)
- Records untuk subdomain lain (mail, cpanel, dll)

#### 6.5 Save DNS Changes

1. Klik **"Save Changes"** atau **"Add Record"**
2. Konfirmasi kalau ada prompt
3. DNS changes disimpan

**Propagation time:**
- Minimum: 10-30 menit
- Average: 1-2 jam
- Maximum: 24-48 jam

---

### **Step 7: Verify Domain di Vercel**

#### 7.1 Wait for DNS Propagation

Setelah add DNS records, tunggu beberapa menit.

#### 7.2 Check Verification Status

1. Kembali ke **Vercel** → Project → **Settings** → **Domains**

2. Status domain akan berubah:

**Status awal:**
```
❌ Invalid Configuration
sapukota.id
```

**Setelah DNS propagate:**
```
✅ Valid Configuration
sapukota.id
```

#### 7.3 Force Refresh (Optional)

Kalau sudah 10 menit tapi masih invalid:

1. Klik **"Refresh"** atau **"Check Again"** di Vercel
2. Atau hover domain, klik **"..."** → **"Refresh"**

#### 7.4 Check DNS Propagation

Buka website ini untuk check DNS:

**Check via dig:**
```bash
dig sapukota.id
dig www.sapukota.id
```

**Expected output:**
```
;; ANSWER SECTION:
sapukota.id.        300    IN    A    76.76.21.21
www.sapukota.id.    300    IN    CNAME    cname.vercel-dns.com.
```

**Check via online tool:**
- [whatsmydns.net](https://www.whatsmydns.net)
- Enter: `sapukota.id`
- Type: `A`
- Check global propagation

---

### **Step 8: SSL Certificate (Otomatis)** 🔒

Setelah domain verified:

1. Vercel **otomatis generate SSL certificate** (Let's Encrypt)
2. Proses ini ~5-10 menit
3. Status berubah dari:
   ```
   ⚠️  Certificate pending
   ```
   Ke:
   ```
   ✅ Certificate issued
   ```

4. Website otomatis tersedia dengan **HTTPS**:
   - `https://sapukota.id` ✅
   - `https://www.sapukota.id` ✅

---

### **Step 9: Set Primary Domain (Optional)**

Kalau Anda add `www.sapukota.id` juga:

#### 9.1 Choose Primary Domain

Vercel akan tanya mana yang jadi primary:

**Option A:** `sapukota.id` (apex, no www) - **RECOMMENDED**

**Option B:** `www.sapukota.id` (with www)

#### 9.2 Set Primary

1. Vercel → Settings → Domains
2. Hover domain yang mau dijadikan primary
3. Klik **"..."** menu
4. Pilih **"Set as Primary Domain"**

**Result:**
- Primary domain: `sapukota.id` ✅
- Redirect: `www.sapukota.id` → `sapukota.id` (otomatis)

---

## 🔄 BAGIAN 3: Update Backend untuk CORS

### **Step 10: Update FRONTEND_URL di Railway**

Sekarang frontend punya 2 URLs:
- Vercel: `https://sapukota-xxx.vercel.app`
- Custom: `https://sapukota.id`

Backend harus allow CORS untuk **custom domain**.

#### 10.1 Update Environment Variable

1. **Railway Dashboard** → Klik **backend service**

2. Tab **"Variables"**

3. Edit variable **`FRONTEND_URL`**

4. **Ganti value** menjadi custom domain:

**Before:**
```env
FRONTEND_URL=https://sapukota.vercel.app
```

**After:**
```env
FRONTEND_URL=https://sapukota.id
```

5. Klik **"Update"** atau **"Save"**

6. Backend akan **auto-restart** (~30 detik)

#### 10.2 Verify CORS Config

Check backend code (`src/server.js`) sudah allow `process.env.FRONTEND_URL`:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,  // ← ini akan jadi https://sapukota.id
].filter(Boolean);
```

✅ Code Anda sudah benar!

---

## 🎉 BAGIAN 4: Test Full Application dengan Custom Domain

### **Step 11: Test Website di sapukota.id**

#### 11.1 Open Website

Buka browser, pergi ke:

```
https://sapukota.id
```

(Atau `https://www.sapukota.id` kalau add www)

#### 11.2 Verify HTTPS

Check address bar:

```
🔒 https://sapukota.id
```

- Harus ada **padlock icon** 🔒
- Harus **HTTPS** (bukan HTTP)
- No certificate warnings

#### 11.3 Test Login

1. **Homepage muncul** dengan benar

2. **Akses halaman login** dengan mengetik URL langsung:
   
   Di Vercel subdomain:
   ```
   https://sapukota-xxx.vercel.app/login
   ```
   
   Atau setelah custom domain setup:
   ```
   https://sapukota.id/login
   ```
   
   Ketik `/login` di akhir URL di address bar browser.

3. **Login form** muncul

4. Input credentials:
   ```
   Email:    admin@sapukota.id
   Password: admin123
   ```

5. Klik **"Login"**

6. **Kalau berhasil:**
   - Redirect ke dashboard `/admin` ✅
   - Menu sidebar muncul
   - Statistik load
   - No error di console

#### 11.4 Test Features

**Dashboard Admin:**
- Statistik cards muncul
- Chart/grafik loading
- Data dari backend

**Laporan:**
- Create laporan baru
- Upload foto
- GPS location (allow browser permission)
- Submit laporan

**Users Management:**
- List users
- Add petugas
- Edit user

**Maps:**
- TPS locations muncul di map
- Markers clickable
- Info window show data

#### 11.5 Test Mobile Responsive

1. Buka di **mobile browser** atau
2. Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
3. Test:
   - Navigation menu (hamburger)
   - Forms responsive
   - Maps responsive
   - Upload foto via camera

---

## ✅ Final Checklist

```
[x] Backend deployed di Railway
[x] Database MySQL setup & running
[x] Admin user created
[x] Backend tested (curl login)
[x] Frontend deployed ke Vercel
[x] Environment variable VITE_API_URL set
[x] Vercel deployment SUCCESS
[x] Custom domain sapukota.id added
[x] DNS records configured (A & CNAME)
[x] Domain verified di Vercel
[x] SSL certificate issued (HTTPS active)
[x] Primary domain set
[x] FRONTEND_URL updated di Railway backend
[x] CORS working untuk custom domain
[x] Login test SUCCESS
[x] Full features tested
```

---

## 🎊 SELAMAT! Deployment Complete!

Aplikasi SapuKota sekarang **LIVE** di internet:

### 📍 URLs:

**Frontend (Main):**
- Production: `https://sapukota.id` ✅
- Alternative: `https://www.sapukota.id` (redirect ke apex)
- Vercel subdomain: `https://sapukota-xxx.vercel.app` (masih aktif)

**Backend API:**
- Railway: `https://sapukota-production.up.railway.app/api`

**Database:**
- MySQL di Railway (private network, tidak bisa diakses publik)

### 🔑 Credentials:

**Admin:**
- Email: `admin@sapukota.id`
- Password: `admin123`
- ⚠️ **UBAH PASSWORD setelah first login!**

### 🚀 Auto-Deploy Setup:

**Frontend:**
- Push ke GitHub branch `main` → Auto-deploy ke Vercel ✅
- Preview deployment untuk pull requests

**Backend:**
- Push ke GitHub → Auto-deploy ke Railway ✅
- Environment variables persistent

---

## 🔧 Troubleshooting

### ❌ Problem: Domain not verified / Invalid Configuration

**Solusi:**

1. **Check DNS records:**
   ```bash
   dig sapukota.id
   dig www.sapukota.id
   ```

2. **Expected output:**
   ```
   sapukota.id.        IN    A     76.76.21.21
   www.sapukota.id.    IN    CNAME cname.vercel-dns.com
   ```

3. **Kalau output salah:**
   - Kembali ke DNS management
   - Verify records sudah correct
   - Save lagi
   - Tunggu 10-30 menit

4. **Check conflicts:**
   - Hapus A record lama untuk apex
   - Hapus CNAME lama untuk www
   - Hapus redirect rules kalau ada

### ❌ Problem: SSL Certificate not issued

**Solusi:**

1. Domain harus **verified** dulu (check mark hijau)

2. **Force refresh** di Vercel Domains page

3. **Wait longer** (bisa 30 menit - 2 jam pertama kali)

4. **Check CAA records:**
   ```bash
   dig sapukota.id CAA
   ```
   
   Kalau ada CAA records, pastikan allow Let's Encrypt:
   ```
   0 issue "letsencrypt.org"
   0 issuewild "letsencrypt.org"
   ```

### ❌ Problem: 404 NOT_FOUND saat akses /login atau routes lain

**Symptoms:**
```
404: NOT_FOUND
Code: NOT_FOUND
ID: sin1::xxxxx
```

**Root Cause:**
Vercel tidak tau bahwa ini Single Page Application (SPA) dengan client-side routing. Vercel mencari file `/login.html` yang tidak ada.

**Solusi:**

File `vercel.json` sudah ada di folder `frontend/` yang configure rewrite rules:

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

Kalau file ini belum ada:

1. **Create file** `frontend/vercel.json` dengan content di atas

2. **Commit & push:**
   ```bash
   git add frontend/vercel.json
   git commit -m "Add Vercel SPA routing config"
   git push origin main
   ```

3. **Vercel auto-redeploy** (~2-3 menit)

4. **Test lagi:**
   ```
   https://sapukota.vercel.app/login
   ```
   
   Sekarang harus work! ✅

**Why this works:**
- Semua requests (`/(.*)`}) di-rewrite ke `/index.html`
- React Router di frontend handle routing
- Client-side navigation works properly

---

### ❌ Problem: Login error "Network Error"

**Solusi:**

1. **Open browser console** (F12 → Console)

2. **Check error message:**
   ```
   CORS error: Access blocked by CORS policy
   ```

3. **Fix:**
   - Railway backend → Variables
   - `FRONTEND_URL=https://sapukota.id` (no trailing slash!)
   - Update & wait restart

4. **Check VITE_API_URL:**
   - Vercel → Settings → Environment Variables
   - `VITE_API_URL=https://sapukota-production.up.railway.app/api`
   - Harus ada `/api` di akhir!

5. **Redeploy frontend** kalau update env var:
   - Vercel → Deployments
   - Latest → "..." menu → Redeploy

### ❌ Problem: Website loading tapi blank

**Solusi:**

1. **F12 → Console** untuk check errors

2. **Possible causes:**
   - JavaScript error
   - API URL wrong
   - 404 assets

3. **Fix:**
   - Check `VITE_API_URL` di Vercel settings
   - Redeploy with correct env var

### ❌ Problem: www tidak redirect ke apex

**Solusi:**

1. **Vercel → Settings → Domains**

2. **Set primary domain:**
   - Hover `sapukota.id`
   - "..." menu → "Set as Primary Domain"

3. **Verify redirect:**
   ```bash
   curl -I https://www.sapukota.id
   ```
   
   Expected: `301 Moved Permanently` → `https://sapukota.id`

---

## 📞 Support Resources

### Vercel

- Docs: [vercel.com/docs](https://vercel.com/docs)
- Support: [vercel.com/support](https://vercel.com/support)
- Status: [vercel-status.com](https://www.vercel-status.com/)

### Railway

- Docs: [docs.railway.app](https://docs.railway.app)
- Discord: [discord.gg/railway](https://discord.gg/railway)
- Status: [status.railway.app](https://status.railway.app)

### DNS

- DNS Checker: [whatsmydns.net](https://www.whatsmydns.net)
- SSL Checker: [ssllabs.com](https://www.ssllabs.com/ssltest/)

---

## 🎯 Next Steps (Post-Deployment)

### Security

- [ ] Change admin password
- [ ] Setup 2FA (if available)
- [ ] Regular security audits

### Monitoring

- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Google Analytics, Vercel Analytics)

### Performance

- [ ] Image optimization
- [ ] Code splitting
- [ ] Caching strategy

### Backups

- [ ] Database backups (Railway cron)
- [ ] Regular exports
- [ ] Disaster recovery plan

---

**Deployment Date:** April 7, 2026  
**Version:** 1.0.0  
**Status:** ✅ PRODUCTION READY

**🎉 Congratulations on your successful deployment!**
