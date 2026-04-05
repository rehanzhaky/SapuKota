# 🚀 Panduan Deploy SapuKota ke Hostinger VPS

## Persyaratan
- **Hostinger VPS** (minimal VPS 1 atau lebih tinggi)
- Domain (opsional, bisa pakai IP VPS)
- Akses SSH ke VPS

---

## 📋 Langkah 1: Setup VPS Hostinger

### 1.1 Beli & Setup VPS
1. Login ke [Hostinger](https://www.hostinger.co.id)
2. Pilih **VPS Hosting** (rekomendasi: VPS 1 atau VPS 2)
3. Pilih Operating System: **Ubuntu 22.04 LTS**
4. Setelah VPS aktif, catat:
   - **IP Address VPS**
   - **Username** (biasanya `root`)
   - **Password** (dikirim via email)

### 1.2 Connect via SSH
```bash
ssh root@YOUR_VPS_IP
# Masukkan password yang diberikan Hostinger
```

---

## 📦 Langkah 2: Install Dependencies di VPS

### 2.1 Update System
```bash
apt update && apt upgrade -y
```

### 2.2 Install Node.js (versi 18 LTS)
```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2.3 Install MySQL
```bash
# Install MySQL Server
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation
# Ikuti prompts:
# - Set root password: pilih password yang kuat
# - Remove anonymous users: Y
# - Disallow root login remotely: N (untuk development, Y untuk production)
# - Remove test database: Y
# - Reload privilege tables: Y
```

### 2.4 Install Git
```bash
apt install -y git
```

### 2.5 Install PM2 (Process Manager)
```bash
npm install -g pm2
```

### 2.6 Install Nginx (Web Server)
```bash
apt install -y nginx
```

---

## 🗄️ Langkah 3: Setup Database MySQL

### 3.1 Login ke MySQL
```bash
mysql -u root -p
# Masukkan password yang kamu set di langkah 2.3
```

### 3.2 Buat Database & User
```sql
-- Buat database
CREATE DATABASE sapukota;

-- Buat user untuk aplikasi (ganti 'password_kuat' dengan password pilihan kamu)
CREATE USER 'sapukota_user'@'localhost' IDENTIFIED BY 'password_kuat';

-- Berikan akses penuh ke database
GRANT ALL PRIVILEGES ON sapukota.* TO 'sapukota_user'@'localhost';

-- Apply changes
FLUSH PRIVILEGES;

-- Keluar
EXIT;
```

---

## 📂 Langkah 4: Upload & Setup Aplikasi

### 4.1 Clone/Upload Project

**Opsi A: Upload via Git (Recommended)**
```bash
cd /var/www
git clone https://github.com/YOUR_USERNAME/SapuKota.git
cd SapuKota
```

**Opsi B: Upload via SFTP**
- Gunakan FileZilla atau WinSCP
- Connect ke VPS (IP, username, password)
- Upload folder project ke `/var/www/SapuKota`

### 4.2 Setup Backend

```bash
cd /var/www/SapuKota/backend

# Install dependencies
npm install --production

# Buat file environment
nano .env
```

**Isi file `.env`:**
```env
# Database
DB_HOST=localhost
DB_USER=sapukota_user
DB_PASSWORD=password_kuat
DB_NAME=sapukota

# JWT Secret (ganti dengan string random panjang)
JWT_SECRET=ganti_dengan_string_random_yang_sangat_panjang_dan_aman

# Server
PORT=5000
NODE_ENV=production
```

Save dengan `Ctrl+X`, lalu `Y`, lalu `Enter`

### 4.3 Setup Database Schema

```bash
# Run migrations
cd /var/www/SapuKota/backend

# Import semua migrations
mysql -u sapukota_user -p sapukota < migrations/update_reports_table.sql
mysql -u sapukota_user -p sapukota < migrations/add_coordinates_to_reports.sql
mysql -u sapukota_user -p sapukota < migrations/add_petugas_tracking.sql
mysql -u sapukota_user -p sapukota < migrations/add_petugas_gps_tracking.sql
mysql -u sapukota_user -p sapukota < migrations/add_user_gps_tracking.sql
```

### 4.4 Buat Admin User (Opsional)
```bash
# Edit seeder untuk set password admin kamu
nano src/seeders/createAdmin.js

# Run seeder
node src/seeders/createAdmin.js
```

### 4.5 Setup Frontend

```bash
cd /var/www/SapuKota/frontend

# Install dependencies
npm install

# Update API base URL untuk production
nano src/services/api.js
```

**Edit `api.js` - Ganti base URL:**
```javascript
const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-domain.com/api'  // atau 'http://YOUR_VPS_IP/api'
  : 'http://localhost:5000/api';
```

**Build production:**
```bash
npm run build
# Hasil build ada di folder 'dist'
```

---

## 🚀 Langkah 5: Deploy dengan PM2

### 5.1 Start Backend dengan PM2
```bash
cd /var/www/SapuKota/backend

# Start aplikasi
pm2 start src/server.js --name sapukota-backend

# Save PM2 process list
pm2 save

# Setup PM2 startup script (auto-start on reboot)
pm2 startup
# Copy-paste command yang muncul, lalu jalankan
```

### 5.2 Verifikasi Backend
```bash
# Check status
pm2 status

# Check logs
pm2 logs sapukota-backend

# Test API
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"SapuKota API is running"}
```

---

## 🌐 Langkah 6: Setup Nginx (Web Server)

### 6.1 Buat Config Nginx
```bash
nano /etc/nginx/sites-available/sapukota
```

**Isi dengan config berikut:**
```nginx
server {
    listen 80;
    server_name YOUR_VPS_IP;  # atau your-domain.com jika pakai domain

    # Frontend (React build)
    location / {
        root /var/www/SapuKota/frontend/dist;
        try_files $uri $uri/ /index.html;
        index index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }

    # Uploads folder
    location /uploads {
        alias /var/www/SapuKota/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

### 6.2 Enable Site & Restart Nginx
```bash
# Create symlink
ln -s /etc/nginx/sites-available/sapukota /etc/nginx/sites-enabled/

# Test config
nginx -t

# Restart Nginx
systemctl restart nginx

# Enable Nginx on boot
systemctl enable nginx
```

---

## 🔒 Langkah 7: Setup SSL (HTTPS) - Opsional tapi Recommended

### 7.1 Install Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### 7.2 Generate SSL Certificate (jika pakai domain)
```bash
# Ganti your-domain.com dengan domain kamu
certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS: 2 (Yes)
```

### 7.3 Auto-renewal
```bash
# Test renewal
certbot renew --dry-run

# Certbot otomatis setup cron job untuk auto-renewal
```

---

## 🔥 Langkah 8: Setup Firewall (UFW)

```bash
# Enable firewall
ufw enable

# Allow SSH
ufw allow 22/tcp

# Allow HTTP & HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

---

## ✅ Langkah 9: Verifikasi & Test

### 9.1 Test Aplikasi
```bash
# Check backend
curl http://YOUR_VPS_IP/api/health

# Check PM2 status
pm2 status

# Check Nginx
systemctl status nginx

# Check logs
pm2 logs sapukota-backend
tail -f /var/log/nginx/error.log
```

### 9.2 Buka di Browser
1. Buka `http://YOUR_VPS_IP` (atau `https://your-domain.com`)
2. Test login, buat laporan, dll
3. Test GPS features

---

## 🛠️ Maintenance & Troubleshooting

### Update Aplikasi
```bash
# Pull latest code
cd /var/www/SapuKota
git pull origin main

# Update backend
cd backend
npm install --production
pm2 restart sapukota-backend

# Update frontend
cd ../frontend
npm install
npm run build

# Restart Nginx
systemctl restart nginx
```

### Check Logs
```bash
# Backend logs
pm2 logs sapukota-backend

# Nginx error logs
tail -f /var/log/nginx/error.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

### Restart Services
```bash
# Restart backend
pm2 restart sapukota-backend

# Restart Nginx
systemctl restart nginx

# Restart MySQL
systemctl restart mysql
```

### Database Backup
```bash
# Backup database
mysqldump -u sapukota_user -p sapukota > backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u sapukota_user -p sapukota < backup_20260405.sql
```

### Monitor Resources
```bash
# CPU & Memory usage
htop

# Disk space
df -h

# PM2 monitoring
pm2 monit
```

---

## 📊 Performance Tips

1. **Enable Nginx Gzip Compression**
```bash
nano /etc/nginx/nginx.conf
# Uncomment gzip settings
systemctl restart nginx
```

2. **Optimize MySQL**
```bash
nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Adjust based on VPS RAM
systemctl restart mysql
```

3. **Setup Log Rotation**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## 🆘 Support & Resources

- **Hostinger VPS Tutorial**: https://www.hostinger.com/tutorials/vps
- **PM2 Documentation**: https://pm2.keymetrics.io/
- **Nginx Documentation**: https://nginx.org/en/docs/

---

## 📝 Checklist Deployment

- [ ] VPS sudah aktif dan bisa diakses via SSH
- [ ] Node.js, MySQL, Nginx terinstall
- [ ] Database sudah dibuat dan migrations dijalankan
- [ ] Backend running dengan PM2
- [ ] Frontend sudah di-build
- [ ] Nginx configured dan running
- [ ] Firewall (UFW) enabled
- [ ] SSL certificate installed (jika pakai domain)
- [ ] Test semua fitur berjalan normal
- [ ] Backup strategy sudah setup

---

**Selamat! Aplikasi SapuKota kamu sudah live! 🎉**

Access via: `http://YOUR_VPS_IP` atau `https://your-domain.com`
