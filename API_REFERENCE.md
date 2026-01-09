# 🔌 API Reference - SapuKota.id

Base URL: `http://localhost:5000/api`

## 📋 Table of Contents
- [Authentication](#authentication)
- [Reports (Public)](#reports-public)
- [Reports (Admin)](#reports-admin)
- [Users/Petugas](#userspetugas)
- [Statistics](#statistics)

---

## 🔐 Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@sapukota.id",
  "password": "admin123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin DLH",
    "email": "admin@sapukota.id",
    "role": "admin_dlh",
    "phone": "081234567890"
  }
}
```

### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer {token}
```

---

## 📝 Reports (Public)

### Create Report
```http
POST /api/reports
Content-Type: multipart/form-data

{
  "reporter_name": "John Doe",
  "reporter_phone": "081234567890",
  "reporter_email": "john@example.com",
  "location": "Jl. Sudirman No. 123",
  "latitude": "-6.200000",
  "longitude": "106.816666",
  "description": "Tumpukan sampah di pinggir jalan",
  "category": "sampah_rumah_tangga",
  "photo": <file>
}
```

### Get All Reports
```http
GET /api/reports?page=1&limit=10&status=pending&category=sampah_rumah_tangga&search=sudirman
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `category` (optional): Filter by category
- `search` (optional): Search in name, location, description

**Response:**
```json
{
  "reports": [...],
  "totalPages": 5,
  "currentPage": 1,
  "totalReports": 50
}
```

### Get Recent Reports
```http
GET /api/reports/recent
```

Returns 4 most recent reports (excluding rejected).

### Get Report by ID
```http
GET /api/reports/:id
```

---

## 👨‍💼 Reports (Admin)

### Update Report Status
```http
PUT /api/reports/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "assigned",
  "assigned_to": 2,
  "admin_notes": "Ditugaskan ke Petugas A"
}
```

**Status Options:**
- `pending` - Menunggu review
- `approved` - Disetujui
- `assigned` - Ditugaskan ke petugas
- `in_progress` - Sedang dikerjakan
- `completed` - Selesai
- `rejected` - Ditolak

---

## 🚛 Reports (Petugas)

### Update Task Progress
```http
PUT /api/reports/:id/progress
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "status": "completed",
  "completion_notes": "Sampah sudah diangkut",
  "completion_photo": <file>
}
```

---

## 👥 Users/Petugas

### Get All Petugas (Admin Only)
```http
GET /api/users/petugas
Authorization: Bearer {token}
```

### Create Petugas (Admin Only)
```http
POST /api/users/petugas
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Petugas A",
  "email": "petugas@sapukota.id",
  "password": "password123",
  "phone": "081234567890"
}
```

### Update Petugas (Admin Only)
```http
PUT /api/users/petugas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Petugas A Updated",
  "phone": "081234567891",
  "status": "active"
}
```

**Note:** Password is optional. Only include if you want to change it.

### Delete Petugas (Admin Only)
```http
DELETE /api/users/petugas/:id
Authorization: Bearer {token}
```

### Get My Tasks (Petugas Only)
```http
GET /api/users/tasks?status=assigned
Authorization: Bearer {token}
```

---

## 📊 Statistics

### Get Dashboard Stats (Admin Only)
```http
GET /api/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "totalReports": 100,
  "reportsByStatus": [
    { "status": "pending", "count": 10 },
    { "status": "completed", "count": 50 }
  ],
  "reportsByCategory": [
    { "category": "sampah_rumah_tangga", "count": 60 }
  ],
  "totalPetugas": 5,
  "completedThisMonth": 20,
  "pendingReports": 10,
  "inProgressReports": 15
}
```

### Get Petugas Performance (Admin Only)
```http
GET /api/stats/performance
Authorization: Bearer {token}
```

---

## 📁 File Upload

### Supported Formats
- JPG, JPEG, PNG

### Max File Size
- 5 MB

### Upload Endpoints
- `POST /api/reports` - Report photo
- `PUT /api/reports/:id/progress` - Completion photo

---

## ❌ Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "message": "Access denied. Admin DLH only."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

## 🧪 Testing with cURL

### Create Report
```bash
curl -X POST http://localhost:5000/api/reports \
  -F "reporter_name=John Doe" \
  -F "reporter_phone=081234567890" \
  -F "location=Jl. Sudirman" \
  -F "description=Sampah menumpuk" \
  -F "category=sampah_rumah_tangga" \
  -F "photo=@/path/to/image.jpg"
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sapukota.id","password":"admin123"}'
```

### Get Reports (with auth)
```bash
curl -X GET http://localhost:5000/api/reports \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Notes

- All authenticated endpoints require `Authorization: Bearer {token}` header
- Tokens expire after 30 days
- File uploads use `multipart/form-data`
- Other requests use `application/json`
- All timestamps are in ISO 8601 format

