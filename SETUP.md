# Setup Instructions - SapuKota.id

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Database Setup

### Opsi 1: Otomatis (Recommended - Paling Mudah!)

1. **Create MySQL Database**
```bash
mysql -u root -p
# Masukkan password MySQL Anda
```
```sql
CREATE DATABASE sapukota_db;
exit;
```

2. **Configure Database Connection**
Edit `backend/.env` file dan update kredensial MySQL:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password  # Ganti dengan password MySQL Anda
DB_NAME=sapukota_db
DB_PORT=3306
```

3. **Tables akan otomatis dibuat** saat menjalankan seeder di step berikutnya!

### Opsi 2: Manual via phpMyAdmin atau MySQL Workbench

1. Buka phpMyAdmin atau MySQL Workbench
2. Import file `database.sql` yang sudah disediakan
3. Atau copy-paste isi file `database.sql` ke SQL query editor
4. Execute query
5. Tables dan sample data akan otomatis dibuat

## Backend Setup

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install dependencies** (already done)
```bash
npm install
```

3. **Create default admin user**
```bash
npm run seed:admin
```
This will create:
- Email: admin@sapukota.id
- Password: admin123

4. **Start backend server**
```bash
npm run dev
```
Backend will run on http://localhost:5000

## Frontend Setup

1. **Navigate to frontend directory** (in new terminal)
```bash
cd frontend
```

2. **Install dependencies** (already done)
```bash
npm install
```

3. **Start frontend development server**
```bash
npm run dev
```
Frontend will run on http://localhost:3000

## Access the Application

- **Landing Page**: http://localhost:3000
- **Login Admin**: http://localhost:3000/login
- **Admin Credentials**: 
  - Email: admin@sapukota.id
  - Password: admin123adm

## Default Users

After seeding, you have:
1. **Admin DLH**: admin@sapukota.id / admin123

You can create petugas users from the Admin DLH dashboard.

## Testing the Application

1. **As Public User**:
   - Visit homepage
   - Click "Buat Laporan" to create a report
   - View all reports in "Laporan" page

2. **As Admin DLH**:
   - Login with admin credentials
   - View dashboard statistics
   - Manage reports (approve, assign to petugas)
   - Create and manage petugas users

3. **As Petugas**:
   - Login with petugas credentials (created by admin)
   - View assigned tasks
   - Update task status and upload completion photos

## Troubleshooting

- If database connection fails, check MySQL is running and credentials are correct
- If port 3000 or 5000 is already in use, you can change it in vite.config.js or .env
- Make sure both backend and frontend are running simultaneously

