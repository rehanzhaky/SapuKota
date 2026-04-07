const { User } = require('../models');
require('dotenv').config();

const testPassword = async () => {
  try {
    const admin = await User.findOne({ 
      where: { email: 'admin@sapukota.id' } 
    });

    if (!admin) {
      console.log('❌ Admin NOT found');
      process.exit(1);
    }

    console.log('✅ Admin found');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Status:', admin.status);
    console.log('Password hash:', admin.password);
    console.log('');

    // Test password comparison
    const testPassword = 'admin123';
    console.log('Testing password:', testPassword);
    
    const isValid = await admin.comparePassword(testPassword);
    console.log('Password comparison result:', isValid);

    if (isValid) {
      console.log('✅ Password comparison SUCCESS');
    } else {
      console.log('❌ Password comparison FAILED');
      console.log('The password hash in DB does not match the test password');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testPassword();
