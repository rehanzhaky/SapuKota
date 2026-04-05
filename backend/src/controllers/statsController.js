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
      group: ['status'],
      raw: true
    });

    // Reports by assigned petugas - using raw query for better GROUP BY handling
    const reportsByPetugasRaw = await sequelize.query(`
      SELECT 
        r.assigned_to,
        COUNT(r.id) as count,
        u.id as petugas_id,
        u.name as petugas_name
      FROM reports r
      LEFT JOIN users u ON r.assigned_to = u.id
      WHERE r.assigned_to IS NOT NULL
      GROUP BY r.assigned_to, u.id, u.name
      ORDER BY count DESC
    `, { 
      type: sequelize.QueryTypes.SELECT 
    });

    // Format reportsByPetugas
    const reportsByPetugas = reportsByPetugasRaw.map(item => ({
      assigned_to: item.assigned_to,
      count: parseInt(item.count),
      assignedPetugas: {
        id: item.petugas_id,
        name: item.petugas_name,
        full_name: item.petugas_name // Use name as full_name for compatibility
      }
    }));

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
      where: { 
        status: {
          [Op.in]: ['assigned', 'in_progress']
        }
      }
    });

    res.json({
      totalReports,
      reportsByStatus,
      reportsByCategory: [], // Empty array since we don't have category field
      reportsByPetugas,
      totalPetugas,
      completedThisMonth,
      pendingReports,
      inProgressReports
    });
  } catch (error) {
    console.error('Get stats error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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

