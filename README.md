# 🗑️ SapuKota - Sistem Pelaporan Sampah Digital

Aplikasi web untuk melaporkan dan mengelola sampah di kota Batam dengan fitur GPS tracking untuk petugas lapangan.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📋 Fitur Utama

### Untuk Masyarakat (Public)
- 📸 **Laporan Sampah dengan GPS**: Upload foto dan lokasi sampah yang ditemukan
- 🗺️ **Peta Interaktif**: Lihat sebaran laporan dan lokasi TPS terdekat
- 📊 **Tracking Status**: Pantau status laporan (pending, diproses, selesai, ditolak)
- 📱 **Responsive Design**: Dapat diakses dari mobile dan desktop

### Untuk Petugas Lapangan
- ✅ **Task Management**: Terima dan kelola tugas dari admin
- 🗺️ **GPS Navigation**: Navigasi real-time ke lokasi laporan
- 📍 **Check-in GPS**: Rekam lokasi saat menerima dan menyelesaikan tugas
- 📸 **Bukti Penyelesaian**: Upload foto setelah sampah diangkut

### Untuk Admin DLH
- 📊 **Dashboard Analytics**: Statistik laporan dan performa petugas
- 👥 **Manajemen Petugas**: Kelola data petugas lapangan
- 📋 **Review & Assign**: Review laporan dan assign ke petugas
- 🗺️ **Live Tracking**: Pantau posisi real-time petugas di peta
- 📈 **Laporan Berkala**: Statistik dan charts

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Leaflet** - Interactive maps
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express 5** - Web framework
- **Sequelize** - ORM
- **MySQL** - Database
- **JWT** - Authentication
- **Multer** - File upload

## 📦 Installation

### Prerequisites
- Node.js 16+ 
- MySQL 8+
- npm atau yarn

### Local Development Setup

1. **Clone repository**
```bash
git clone https://github.com/YOUR_USERNAME/SapuKota.git
cd SapuKota
```

2. **Setup Backend**
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env dengan database credentials kamu
nano .env

# Create database
mysql -u root -p
CREATE DATABASE sapukota;
EXIT;

# Run migrations
mysql -u root -p sapukota < migrations/update_reports_table.sql
mysql -u root -p sapukota < migrations/add_coordinates_to_reports.sql
mysql -u root -p sapukota < migrations/add_petugas_tracking.sql
mysql -u root -p sapukota < migrations/add_petugas_gps_tracking.sql
mysql -u root -p sapukota < migrations/add_user_gps_tracking.sql

# Create admin user (optional)
node src/seeders/createAdmin.js

# Start backend
npm start
# Backend running at http://localhost:5000
```

3. **Setup Frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend running at http://localhost:3000
```

4. **Access Application**
- Open browser: `http://localhost:3000`
- Default admin: Check `backend/src/seeders/createAdmin.js`

## 🚀 Deployment

### 🆓 Deploy GRATIS (Recommended)
**Hosting 100% gratis dengan Railway.app**

- ⚡ **Quick Start (15 menit)**: [RAILWAY_DEPLOY.md](RAILWAY_DEPLOY.md)
- 📚 **Semua Opsi Gratis**: [DEPLOYMENT_FREE.md](DEPLOYMENT_FREE.md)
- ✅ Free tier: $5/bulan credit (cukup untuk 24/7)
- 💻 Dapat subdomain gratis + support custom domain

### 💳 Deploy ke VPS (Berbayar)
**Untuk production dengan high traffic**

- 📖 **Quick Deploy**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- 📘 **Full Guide**: [DEPLOYMENT_HOSTINGER.md](DEPLOYMENT_HOSTINGER.md)
- 💰 Biaya: ~Rp 80.000/bulan (Hostinger VPS)

## 📁 Project Structure

```
SapuKota/
├── backend/
│   ├── src/
│   │   ├── config/          # Database config
│   │   ├── controllers/     # Business logic
│   │   ├── middleware/      # Auth, upload, etc
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── seeders/         # Database seeders
│   │   └── server.js        # Entry point
│   ├── migrations/          # SQL migrations
│   ├── uploads/             # User uploads
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/          # Images, icons
│   │   ├── components/      # Reusable components
│   │   ├── context/         # React context
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   └── petugas/     # Petugas pages
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── DEPLOYMENT_HOSTINGER.md  # Full deployment guide
├── QUICK_DEPLOY.md          # Quick deployment guide
├── setup-vps.sh             # VPS setup script
├── deploy.sh                # Deployment script
└── nginx.conf               # Nginx configuration
```

## 🔑 Environment Variables

### Backend (.env)
```env
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sapukota
JWT_SECRET=your_secret_key_minimum_32_chars
PORT=5000
NODE_ENV=development
```

## 📱 API Endpoints

### Public
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create report
- `GET /api/users/petugas/count` - Get petugas count

### Protected (Requires JWT)
- `GET /api/users/me` - Get current user
- `PUT /api/reports/:id/status` - Update report status (admin)
- `GET /api/users/my-tasks` - Get petugas tasks
- `POST /api/reports/:id/accept` - Accept task (petugas)
- `POST /api/reports/:id/checkin` - Check-in at location (petugas)
- `GET /api/users/petugas/locations` - Get all petugas GPS (admin)
- `POST /api/users/gps/update` - Update GPS location (petugas)

## 🗺️ GPS Features

### Admin GPS Tracking
- Real-time monitoring posisi petugas di peta
- Melihat rute dari petugas ke lokasi tugas
- Auto-refresh setiap 10 detik
- Info detail petugas dan tugas aktif

### Petugas Navigation
- Peta navigasi ke lokasi tugas
- Perhitungan jarak real-time
- Auto-update GPS ke backend
- Integrasi Google Maps untuk turn-by-turn directions

## 👥 User Roles

1. **Public User** (Anonymous)
   - Buat laporan sampah
   - Lihat status laporan
   - Akses peta publik

2. **Petugas** (role: petugas)
   - Terima & complete tasks
   - GPS check-in/check-out
   - Upload foto bukti penyelesaian
   - Navigasi ke lokasi

3. **Admin DLH** (role: admin_dlh)
   - Review & approve/reject laporan
   - Assign laporan ke petugas
   - Kelola data petugas
   - Tracking GPS petugas
   - Analytics & reports

## 🔧 Development Commands

### Backend
```bash
npm start              # Start server
npm run dev            # Start with nodemon (auto-reload)
npm run seed:admin     # Create admin user
```

### Frontend
```bash
npm run dev            # Start dev server
npm run build          # Build for production
npm run preview        # Preview production build
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check MySQL is running
systemctl status mysql

# Check credentials in .env
cat backend/.env
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### GPS Not Working
- Pastikan browser mengizinkan akses GPS
- Hanya berfungsi di HTTPS atau localhost
- Check browser console untuk error

## 📊 Database Schema

### Main Tables
- `users` - User accounts (admin, petugas)
- `reports` - Laporan sampah
- `gps_tracking` - GPS history (future feature)

### Key Fields
- Reports: GPS coordinates, photos, status, timestamps
- Users: GPS location (current_latitude, current_longitude, last_location_update)

## 🛡️ Security Features

- JWT authentication
- Password hashing (bcrypt)
- Input validation
- SQL injection prevention (Sequelize ORM)
- File upload restrictions
- CORS configuration
- Role-based access control

## 📈 Future Enhancements

- [ ] Push notifications untuk petugas
- [ ] Real-time updates via WebSocket
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] QR code untuk TPS
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourhandle](https://github.com/yourhandle)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Leaflet for mapping library
- OpenStreetMap for map tiles
- TailwindCSS for styling framework
- Hostinger for VPS hosting

---

**Made with ❤️ for Batam City**

Untuk deployment ke Hostinger VPS: **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)**
