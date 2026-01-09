# 🗑️ SapuKota.id - Sistem Pelaporan Sampah Liar

Sistem pelaporan dan pengangkutan sampah liar berbasis web untuk menciptakan lingkungan yang lebih bersih dan sehat.

![Tech Stack](https://img.shields.io/badge/React-18-blue)
![Express](https://img.shields.io/badge/Express-5-green)
![MySQL](https://img.shields.io/badge/MySQL-8-orange)
![Tailwind](https://img.shields.io/badge/Tailwind-3-cyan)

## 🎯 Fitur Utama

### 🌐 Landing Page (Public)
- **Home**: Hero section, statistik real-time, 4 laporan terbaru, FAQ
- **Laporan**: Daftar semua laporan dengan filter & search
- **Buat Laporan**: Form pelaporan sampah tanpa perlu login
  - Upload foto sampah
  - Lokasi dengan GPS
  - Kategori sampah
  - Tracking status laporan

### 👨‍💼 Admin DLH Dashboard
- **Dashboard**: Statistik lengkap (total laporan, pending, in progress, completed)
- **Kelola Laporan**:
  - Review laporan masuk
  - Approve/Reject laporan
  - Assign laporan ke petugas
  - Tambah catatan admin
- **Kelola Petugas**:
  - CRUD petugas
  - Kelola status aktif/nonaktif
  - Lihat performa petugas
- **Statistik & Report**: Grafik laporan per status dan kategori

### 🚛 Petugas Dashboard
- **Daftar Tugas**: Lihat semua tugas yang di-assign
- **Update Status**:
  - Ditugaskan → Dalam Proses → Selesai
  - Upload foto bukti penyelesaian
  - Tambah catatan penyelesaian
- **Riwayat**: Lihat tugas yang sudah diselesaikan

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Express.js 5 + Sequelize ORM
- **Database**: MySQL 8
- **Authentication**: JWT (JSON Web Token)
- **File Upload**: Multer
- **Styling**: Tailwind CSS dengan tema hijau & oren

## 📁 Struktur Project

```
SapuKota/
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin DLH pages
│   │   │   └── petugas/     # Petugas pages
│   │   ├── services/        # API services
│   │   ├── context/         # React Context (Auth)
│   │   └── utils/           # Utility functions
│   ├── public/              # Static files
│   └── package.json
│
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── models/          # Sequelize models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth & upload middleware
│   │   └── seeders/         # Database seeders
│   ├── uploads/             # Uploaded files
│   └── package.json
│
├── README.md
└── SETUP.md                 # Detailed setup instructions
```

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- MySQL 8+
- npm atau yarn

### 1. Clone & Install

```bash
# Clone repository
git clone <repository-url>
cd SapuKota

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE sapukota_db;
exit;
```

### 3. Configure Environment

Edit `backend/.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=sapukota_db
DB_PORT=3306
JWT_SECRET=sapukota_secret_key_2026
```

### 4. Seed Admin User

```bash
cd backend
npm run seed:admin
```

Credentials:
- Email: `admin@sapukota.id`
- Password: `admin123`

### 5. Run Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# Running on http://localhost:3000
```

### 6. Access Application

- **Landing Page**: http://localhost:3000
- **Login Admin**: http://localhost:3000/login
- **API Docs**: http://localhost:5000/api/health

## 📱 User Flow

### Masyarakat (Public)
1. Buka website SapuKota.id
2. Klik "Buat Laporan"
3. Isi form (nama, telepon, lokasi, foto, deskripsi)
4. Submit laporan
5. Lihat status di halaman "Laporan"

### Admin DLH
1. Login dengan credentials admin
2. Dashboard menampilkan statistik
3. Review laporan pending
4. Approve dan assign ke petugas
5. Monitor progress semua laporan
6. Kelola data petugas

### Petugas
1. Login dengan credentials petugas
2. Lihat daftar tugas yang di-assign
3. Update status: Dalam Proses
4. Selesaikan tugas
5. Upload foto bukti
6. Update status: Selesai

## 🎨 Design System

**Color Palette:**
- Primary (Hijau): `#10B981`
- Secondary (Oren): `#F97316`
- Background: `#F9FAFB`
- Text: `#1F2937`

**Typography:**
- Font: System fonts (San Francisco, Segoe UI, Roboto)
- Headings: Bold, 2xl-4xl
- Body: Regular, sm-base

## 📊 Database Schema

### Users Table
- id, name, email, password, role (admin_dlh/petugas), phone, status

### Reports Table
- id, reporter_name, reporter_phone, reporter_email
- location, latitude, longitude
- description, category, photo
- status (pending/approved/assigned/in_progress/completed/rejected)
- assigned_to (FK to Users), admin_notes
- completion_photo, completion_notes, completed_at

## 🔐 API Endpoints

### Public
- `POST /api/reports` - Create report
- `GET /api/reports` - Get all reports
- `GET /api/reports/recent` - Get recent reports
- `GET /api/reports/:id` - Get report by ID

### Auth
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile

### Admin DLH
- `PUT /api/reports/:id/status` - Update report status
- `GET /api/users/petugas` - Get all petugas
- `POST /api/users/petugas` - Create petugas
- `PUT /api/users/petugas/:id` - Update petugas
- `DELETE /api/users/petugas/:id` - Delete petugas
- `GET /api/stats` - Get statistics
- `GET /api/stats/performance` - Get petugas performance

### Petugas
- `GET /api/users/tasks` - Get my tasks
- `PUT /api/reports/:id/progress` - Update task progress

## 🧪 Testing

Lihat file `SETUP.md` untuk panduan testing lengkap.

## 📝 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Developer

Developed with ❤️ for a cleaner environment.

---

**Note**: Pastikan MySQL sudah running sebelum menjalankan backend. Untuk troubleshooting, lihat `SETUP.md`.

