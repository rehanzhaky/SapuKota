const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('Report', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'assigned', 'in_progress', 'completed', 'rejected'),
    defaultValue: 'pending'
  },
  admin_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  assigned_to: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completion_photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  completion_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  accepted_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  accept_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  accept_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  arrived_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  petugas_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  petugas_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  complete_latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  complete_longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  }
}, {
  tableName: 'reports',
  timestamps: true
});

module.exports = Report;

