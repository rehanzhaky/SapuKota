# Install MySQL di macOS

## Opsi 1: Menggunakan Homebrew (Recommended)

### 1. Install Homebrew (jika belum ada)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Install MySQL
```bash
brew install mysql
```

### 3. Start MySQL Service
```bash
brew services start mysql
```

### 4. Secure MySQL Installation (Optional)
```bash
mysql_secure_installation
```

### 5. Login ke MySQL
```bash
mysql -u root -p
# Jika tidak ada password, tekan Enter saja
```

### 6. Buat Database
```sql
CREATE DATABASE sapukota_db;
SHOW DATABASES;
exit;
```

## Opsi 2: Download MySQL Installer

1. Download dari: https://dev.mysql.com/downloads/mysql/
2. Pilih macOS version
3. Install dengan mengikuti wizard
4. Catat password root yang diberikan
5. Buka System Preferences → MySQL → Start MySQL Server

## Opsi 3: Menggunakan XAMPP/MAMP

### XAMPP
1. Download dari: https://www.apachefriends.org/
2. Install dan jalankan
3. Start MySQL dari control panel
4. Default: user=root, password=(kosong)

### MAMP
1. Download dari: https://www.mamp.info/
2. Install dan jalankan
3. Start servers
4. Default: user=root, password=root

## Verifikasi Instalasi

```bash
# Check MySQL version
mysql --version

# Check if MySQL is running
brew services list | grep mysql
# atau
ps aux | grep mysql
```

## Troubleshooting

### MySQL tidak bisa start
```bash
# Stop MySQL
brew services stop mysql

# Remove old files
rm -rf /usr/local/var/mysql

# Reinstall
brew reinstall mysql

# Start again
brew services start mysql
```

### Lupa password root
```bash
# Stop MySQL
brew services stop mysql

# Start in safe mode
mysqld_safe --skip-grant-tables &

# Login without password
mysql -u root

# Reset password
ALTER USER 'root'@'localhost' IDENTIFIED BY 'new_password';
FLUSH PRIVILEGES;
exit;

# Restart MySQL normally
brew services restart mysql
```

## Konfigurasi untuk SapuKota

Setelah MySQL terinstall dan running:

1. **Buat Database**
```bash
mysql -u root -p
```
```sql
CREATE DATABASE sapukota_db;
exit;
```

2. **Update backend/.env**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password_here
DB_NAME=sapukota_db
DB_PORT=3306
```

3. **Test Connection**
```bash
cd backend
npm run dev
```

Jika muncul "✅ Database connected successfully", berarti sudah berhasil!

## Alternative: Menggunakan SQLite (Untuk Development)

Jika tidak ingin install MySQL, bisa menggunakan SQLite:

1. Install sqlite3:
```bash
cd backend
npm install sqlite3
```

2. Update `backend/src/config/database.js`:
```javascript
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});
```

3. Tidak perlu setup database, langsung jalankan:
```bash
npm run dev
```

