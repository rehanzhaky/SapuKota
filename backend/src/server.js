const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173', // Local development (Vite default)
  'http://localhost:5174', // Alternative local port
  process.env.FRONTEND_URL, // Production frontend (Vercel)
].filter(Boolean); // Remove undefined values

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/users', require('./routes/users'));
app.use('/api/stats', require('./routes/stats'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SapuKota API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

// Auto-create default admin user if not exists
const createDefaultAdmin = async () => {
  try {
    const { User } = require('./models');
    const existingAdmin = await User.findOne({
      where: { email: 'admin@sapukota.id' }
    });

    if (!existingAdmin) {
      await User.create({
        name: 'Admin DLH',
        email: 'admin@sapukota.id',
        password: 'admin123',
        role: 'admin_dlh',
        phone: '081234567890',
        status: 'active'
      });
      console.log('✅ Default admin created (admin@sapukota.id / admin123)');
      console.log('⚠️  IMPORTANT: Change the password after first login!');
    }
  } catch (error) {
    console.error('⚠️  Could not create default admin:', error.message);
  }
};

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync database (create tables if not exist, alter existing ones to match models)
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized (auto-migration enabled)');

    // Auto-create default admin if not exists
    await createDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Unable to start server:', error);
    process.exit(1);
  }
};

startServer();

