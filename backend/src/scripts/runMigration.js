const sequelize = require('../config/database');
const fs = require('fs');
const path = require('path');

async function runMigration() {
  try {
    console.log('🔄 Menjalankan migration: add_petugas_tracking...');
    
    const migrationSQL = fs.readFileSync(
      path.join(__dirname, '../../migrations/add_petugas_tracking.sql'),
      'utf8'
    );

    // Split by semicolon to handle multiple statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      await sequelize.query(statement);
      console.log('✅ Executed:', statement.substring(0, 50) + '...');
    }

    console.log('✅ Migration berhasil dijalankan!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration error:', error.message);
    
    // Check if columns already exist
    if (error.message.includes('Duplicate column')) {
      console.log('ℹ️  Kolom sudah ada di database, migration tidak perlu dijalankan lagi.');
      process.exit(0);
    }
    
    process.exit(1);
  }
}

runMigration();
