# 🚀 Quick Deployment Guide - Hostinger VPS

## Prasyarat
- ✅ Sudah beli **Hostinger VPS** (minimal VPS 1)
- ✅ Dapat IP Address VPS dan SSH password
- ✅ Punya tools: Terminal (Mac/Linux) atau PuTTY (Windows)

---

## 📦 Langkah Cepat (30 menit)

### 1️⃣ Connect ke VPS & Run Setup Script
```bash
# Connect via SSH
ssh root@YOUR_VPS_IP

# Download & run setup script
cd /tmp
curl -O https://raw.githubusercontent.com/YOUR_REPO/main/setup-vps.sh
bash setup-vps.sh

# Secure MySQL
mysql_secure_installation
# Set password: [pilih password kuat]
# Jawab Y untuk semua pertanyaan
```

### 2️⃣ Setup Database
```bash
# Login MySQL
mysql -u root -p

# Copy-paste SQL berikut:
CREATE DATABASE sapukota;
CREATE USER 'sapukota_user'@'localhost' IDENTIFIED BY 'GantiDenganPasswordKuat123!';
GRANT ALL PRIVILEGES ON sapukota.* TO 'sapukota_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3️⃣ Upload Project

**Via Git:**
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/SapuKota.git
cd SapuKota
```

**Via SFTP:**
- Gunakan FileZilla: `sftp://YOUR_VPS_IP`
- Username: `root`
- Password: [SSH password]
- Upload folder ke: `/var/www/SapuKota`

### 4️⃣ Setup Backend
```bash
cd /var/www/SapuKota/backend

# Copy environment example
cp .env.example .env

# Edit .env
nano .env
# Isi:
# DB_PASSWORD=GantiDenganPasswordKuat123!
# JWT_SECRET=GantiDenganRandomString64Characters
# Save: Ctrl+X, Y, Enter

# Install & run migrations
npm install --production
mysql -u sapukota_user -p sapukota < migrations/update_reports_table.sql
mysql -u sapukota_user -p sapukota < migrations/add_coordinates_to_reports.sql
mysql -u sapukota_user -p sapukota < migrations/add_petugas_tracking.sql
mysql -u sapukota_user -p sapukota < migrations/add_petugas_gps_tracking.sql
mysql -u sapukota_user -p sapukota < migrations/add_user_gps_tracking.sql

# Create admin user (opsional)
node src/seeders/createAdmin.js

# Start with PM2
pm2 start src/server.js --name sapukota-backend
pm2 save
pm2 startup
# Copy-paste command yang muncul
```

### 5️⃣ Setup Frontend
```bash
cd /var/www/SapuKota/frontend

# Install & build
npm install
npm run build
```

### 6️⃣ Setup Nginx
```bash
# Copy nginx config
cp /var/www/SapuKota/nginx.conf /etc/nginx/sites-available/sapukota

# Edit: ganti YOUR_VPS_IP_OR_DOMAIN
nano /etc/nginx/sites-available/sapukota
# Ganti line: server_name YOUR_VPS_IP_OR_DOMAIN;
# Menjadi: server_name 123.45.67.89; (IP VPS kamu)
# Save: Ctrl+X, Y, Enter

# Enable site
ln -s /etc/nginx/sites-available/sapukota /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 7️⃣ Test!
Buka browser: `http://YOUR_VPS_IP`

---

## 🔧 Commands Berguna

```bash
# Cek status backend
pm2 status
pm2 logs sapukota-backend

# Cek status Nginx
systemctl status nginx

# Restart backend
pm2 restart sapukota-backend

# Update aplikasi (setelah push code baru)
cd /var/www/SapuKota
bash deploy.sh
```

---

## 🆘 Troubleshooting

**Backend tidak jalan?**
```bash
pm2 logs sapukota-backend --lines 50
```

**Database connection error?**
- Cek credentials di `/var/www/SapuKota/backend/.env`
- Test: `mysql -u sapukota_user -p sapukota`

**404 Not Found?**
```bash
nginx -t
tail -f /var/log/nginx/error.log
```

**Port 5000 already in use?**
```bash
pm2 delete all
pm2 start /var/www/SapuKota/backend/src/server.js --name sapukota-backend
```

---

## 📝 Checklist

- [ ] VPS bisa diakses via SSH
- [ ] Setup script sudah dijalankan
- [ ] MySQL secure & database dibuat
- [ ] Project sudah diupload
- [ ] Backend .env sudah diisi
- [ ] Migrations sudah dijalankan
- [ ] PM2 running backend
- [ ] Frontend sudah di-build
- [ ] Nginx configured
- [ ] Bisa akses via browser

---

**Done! App kamu live di:** `http://YOUR_VPS_IP` 🎉

**Panduan lengkap:** Lihat `DEPLOYMENT_HOSTINGER.md`
