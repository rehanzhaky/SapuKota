const { Report, User } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Get statistics for dashboard
exports.getStats = async (req, res) => {
  try {
    // Total reports
    const totalReports = await Report.count();

    // Reports by status
    const reportsByStatus = await Report.findAll({
      attributes: [
        'status',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['status']
    });

    // Reports by category
    const reportsByCategory = await Report.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['category']
    });

    // Total petugas
    const totalPetugas = await User.count({
      where: { role: 'petugas', status: 'active' }
    });

    // Completed reports this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const completedThisMonth = await Report.count({
      where: {
        status: 'completed',
        completed_at: {
          [Op.gte]: startOfMonth
        }
      }
    });

    // Pending reports
    const pendingReports = await Report.count({
      where: { status: 'pending' }
    });

    // In progress reports
    const inProgressReports = await Report.count({
      where: { status: ['assigned', 'in_progress'] }
    });

    res.json({
      totalReports,
      reportsByStatus,
      reportsByCategory,
      totalPetugas,
      completedThisMonth,
      pendingReports,
      inProgressReports
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get petugas performance
exports.getPetugasPerformance = async (req, res) => {
  try {
    const performance = await Report.findAll({
      attributes: [
        'assigned_to',
        [sequelize.fn('COUNT', sequelize.col('Report.id')), 'totalTasks'],
        [sequelize.fn('SUM', sequelize.literal("CASE WHEN status = 'completed' THEN 1 ELSE 0 END")), 'completedTasks']
      ],
      where: {
        assigned_to: { [Op.ne]: null }
      },
      include: [{
        model: User,
        as: 'assignedPetugas',
        attributes: ['id', 'name', 'phone']
      }],
      group: ['assigned_to', 'assignedPetugas.id']
    });

    res.json(performance);
  } catch (error) {
    console.error('Get performance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

