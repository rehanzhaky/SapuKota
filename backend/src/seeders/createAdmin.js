const { sequelize, User } = require('../models');
require('dotenv').config();

const createDefaultAdmin = async () => {
  try {
    // Sync database (create tables if not exist)
    console.log('🔄 Syncing database...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced successfully\n');

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@sapukota.id' }
    });

    if (existingAdmin) {
      console.log('Admin already exists');
      return;
    }

    // Create default admin
    const admin = await User.create({
      name: 'Admin DLH',
      email: 'admin@sapukota.id',
      password: 'admin123',
      role: 'admin_dlh',
      phone: '081234567890',
      status: 'active'
    });

    console.log('✅ Default admin created successfully');
    console.log('Email: admin@sapukota.id');
    console.log('Password: admin123');
    console.log('⚠️  Please change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createDefaultAdmin();

