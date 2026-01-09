const sequelize = require('../config/database');
const User = require('./User');
const Report = require('./Report');

// Define associations
Report.belongsTo(User, { 
  foreignKey: 'assigned_to', 
  as: 'assignedPetugas',
  onDelete: 'SET NULL'
});

User.hasMany(Report, { 
  foreignKey: 'assigned_to', 
  as: 'assignedReports'
});

module.exports = {
  sequelize,
  User,
  Report
};

