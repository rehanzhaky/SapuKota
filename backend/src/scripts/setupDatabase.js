const { sequelize } = require('../models');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected\n');

    console.log('🔄 Creating/updating tables...');
    // force: false = don't drop existing tables
    // alter: true = modify tables to match models
    await sequelize.sync({ alter: true });
    console.log('✅ All tables created/updated successfully\n');

    console.log('📋 Tables created:');
    const [results] = await sequelize.query('SHOW TABLES');
    results.forEach(row => {
      console.log(`  - ${Object.values(row)[0]}`);
    });

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
};

setupDatabase();
