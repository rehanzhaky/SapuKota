const { User } = require('../models');
require('dotenv').config();

const debugLogin = async () => {
  try {
    const email = 'admin@sapukota.id';
    const password = 'admin123';

    console.log('=== DEBUG LOGIN ===');
    console.log('Email:', email);
    console.log('Password:',password);
    console.log('');

    // Find user
    const user = await User.findOne({ where: { email } });
    
    if (!user) {
      console.log('❌ User NOT found in database');
      process.exit(1);
    }

    console.log('✅ User found');
    console.log('User ID:', user.id);
    console.log('User email:', user.email);
    console.log('User name:', user.name);
    console.log('User role:', user.role);
    console.log('User status:', user.status);
    console.log('User password hash:', user.password);
    console.log('');

    // Test password
    console.log('Testing password:', password);
    const isPasswordValid = await user.comparePassword(password);
    console.log('Password valid:', isPasswordValid);
    console.log('');

    // Check status
    if (user.status !== 'active') {
      console.log('❌ User status is not active:', user.status);
      process.exit(1);
    }

    console.log('=== LOGIN SHOULD SUCCEED ===');
    console.log('✅ User exists');
    console.log('✅ Password matches');
    console.log('✅ Status is active');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

debugLogin();
