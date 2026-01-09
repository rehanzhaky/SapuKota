# 🔧 Troubleshooting Guide - SapuKota.id

## ⚡ Common Errors (SOLVED)

### Error: "Cannot apply unknown utility class `bg-primary-500`"

**Full Error:**
```
[plugin:vite:css] [postcss] tailwindcss: Cannot apply unknown utility class `bg-primary-500`
```

**Penyebab:** Tailwind CSS v4 mengubah sintaks dan memerlukan `@tailwindcss/postcss`

**Solusi:** Downgrade ke Tailwind v3 (lebih stabil)
```bash
cd frontend
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3.4.0 postcss@^8.4.35 autoprefixer@^10.4.18
```

Update `postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},      // Bukan '@tailwindcss/postcss'
    autoprefixer: {},
  },
}
```

### Error: "Table 'sapukota_db.users' doesn't exist"

**Penyebab:** Tables belum dibuat di database

**Solusi:** Seeder sudah diupdate untuk auto-create tables
```bash
cd backend
npm run seed:admin
```

Seeder akan otomatis:
1. Sync database (create tables)
2. Create admin user

---

## 🗄️ Database Issues

### Error: "ECONNREFUSED" atau "Connection refused"

**Penyebab:** MySQL tidak running

**Solusi:**
```bash
# Check if MySQL is running
brew services list | grep mysql

# Start MySQL
brew services start mysql

# Atau restart
brew services restart mysql
```

### Error: "Access denied for user 'root'@'localhost'"

**Penyebab:** Password MySQL salah

**Solusi:**
1. Cek password MySQL Anda
2. Update `backend/.env`:
```env
DB_PASSWORD=your_correct_password
```

### Error: "Unknown database 'sapukota_db'"

**Penyebab:** Database belum dibuat

**Solusi:**
```bash
mysql -u root -p
CREATE DATABASE sapukota_db;
exit;
```

### Error: "Table doesn't exist"

**Penyebab:** Tables belum dibuat

**Solusi:**
Backend akan otomatis membuat tables saat pertama kali running. Pastikan:
1. Database sudah dibuat
2. Koneksi berhasil
3. Restart backend server

---

## 🔌 Backend Issues

### Error: "Port 5000 already in use"

**Solusi:**
```bash
# Kill process di port 5000
lsof -ti:5000 | xargs kill -9

# Atau ubah port di backend/.env
PORT=5001
```

### Error: "Cannot find module"

**Solusi:**
```bash
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Error: "JWT must be provided"

**Penyebab:** Token tidak dikirim atau expired

**Solusi:**
1. Login ulang untuk mendapatkan token baru
2. Pastikan token disimpan di localStorage
3. Check Authorization header di request

---

## 🎨 Frontend Issues

### Error: "Port 3000 already in use"

**Solusi:**
```bash
# Kill process di port 3000
lsof -ti:3000 | xargs kill -9

# Atau ubah port di vite.config.js
server: {
  port: 3001
}
```

### Error: "Cannot find module" atau "Module not found"

**Solusi:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Error: "Network Error" atau "Failed to fetch"

**Penyebab:** Backend tidak running atau CORS issue

**Solusi:**
1. Pastikan backend running di http://localhost:5000
2. Check console browser untuk error detail
3. Pastikan proxy di vite.config.js sudah benar

### Halaman blank atau tidak muncul

**Solusi:**
1. Check console browser (F12)
2. Clear browser cache
3. Hard reload (Cmd+Shift+R di Mac)

---

## 📁 File Upload Issues

### Error: "File too large"

**Penyebab:** File lebih dari 5MB

**Solusi:**
1. Compress image sebelum upload
2. Atau ubah limit di `backend/src/middleware/upload.js`:
```javascript
limits: { fileSize: 10 * 1024 * 1024 } // 10MB
```

### Error: "Invalid file type"

**Penyebab:** Format file tidak didukung

**Solusi:**
Gunakan format JPG, JPEG, atau PNG saja.

### Upload berhasil tapi gambar tidak muncul

**Solusi:**
1. Check folder `backend/uploads/` ada file-nya
2. Pastikan backend serving static files
3. Check URL gambar di browser: http://localhost:5000/uploads/filename.jpg

---

## 🔐 Authentication Issues

### Login berhasil tapi redirect ke home

**Penyebab:** Token tidak tersimpan

**Solusi:**
1. Check localStorage di browser (F12 → Application → Local Storage)
2. Pastikan ada key `token` dan `user`
3. Clear localStorage dan login ulang

### Logout tidak berfungsi

**Solusi:**
```javascript
// Manual clear localStorage
localStorage.clear()
// Refresh page
```

### Protected route tidak berfungsi

**Solusi:**
1. Check token masih valid (belum expired)
2. Check role user sesuai dengan allowedRoles
3. Login ulang

---

## 🌐 CORS Issues

### Error: "CORS policy: No 'Access-Control-Allow-Origin'"

**Solusi:**
Pastikan backend sudah enable CORS di `backend/src/server.js`:
```javascript
app.use(cors());
```

---

## 📱 Responsive Design Issues

### Layout rusak di mobile

**Solusi:**
1. Check viewport meta tag di `frontend/index.html`
2. Test dengan Chrome DevTools (F12 → Toggle device toolbar)
3. Check Tailwind breakpoints

---

## 🚀 Production Deployment Issues

### Environment variables tidak terbaca

**Solusi:**
1. Pastikan file `.env` ada di production
2. Atau set environment variables di hosting platform
3. Restart server setelah update .env

### Build frontend gagal

**Solusi:**
```bash
cd frontend
rm -rf node_modules dist
npm install
npm run build
```

### Static files tidak serve

**Solusi:**
Pastikan backend serve static files:
```javascript
app.use(express.static('dist'));
```

---

## 🧪 Testing Issues

### Seeder admin gagal

**Solusi:**
```bash
cd backend
# Delete existing admin
mysql -u root -p sapukota_db -e "DELETE FROM users WHERE email='admin@sapukota.id';"

# Run seeder again
npm run seed:admin
```

### Data tidak muncul di frontend

**Solusi:**
1. Check API response di Network tab (F12)
2. Check console untuk error
3. Test API dengan Postman/cURL
4. Check database ada data-nya

---

## 💡 General Tips

### Clear Everything and Start Fresh

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd ../frontend
rm -rf node_modules package-lock.json dist
npm install

# Database
mysql -u root -p
DROP DATABASE sapukota_db;
CREATE DATABASE sapukota_db;
exit;

# Restart servers
cd backend && npm run dev
cd frontend && npm run dev
```

### Check Logs

**Backend:**
- Check terminal output
- Look for error stack traces

**Frontend:**
- Open browser console (F12)
- Check Network tab for failed requests
- Check Console tab for JavaScript errors

### Verify Installation

```bash
# Check Node version
node --version  # Should be v16+

# Check npm version
npm --version

# Check MySQL
mysql --version

# Check if ports are free
lsof -i:3000
lsof -i:5000
```

---

## 📞 Still Having Issues?

1. Check all documentation files:
   - README.md
   - SETUP.md
   - INSTALL_MYSQL.md
   - API_REFERENCE.md

2. Search for similar issues online

3. Check error messages carefully

4. Try the "Clear Everything" solution above

5. Contact developer or open an issue

---

**Last Updated:** 2026-01-09

