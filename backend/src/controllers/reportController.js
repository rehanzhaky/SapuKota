const { Report, User } = require('../models');
const { Op } = require('sequelize');

// Public - Create new report
exports.createReport = async (req, res) => {
  try {
    const { title, location, latitude, longitude, description } = req.body;

    const report = await Report.create({
      title,
      location,
      latitude,
      longitude,
      description,
      photo: req.file ? req.file.filename : null,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Laporan berhasil dibuat',
      report
    });
  } catch (error) {
    console.error('Create report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Public - Get all reports (for landing page)
exports.getAllReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    
    if (status) where.status = status;
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows } = await Report.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['createdAt', 'DESC']],
      include: [{
        model: User,
        as: 'assignedPetugas',
        attributes: ['id', 'name', 'phone']
      }]
    });

    res.json({
      reports: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalReports: count
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public - Get recent reports (for homepage)
exports.getRecentReports = async (req, res) => {
  try {
    const reports = await Report.findAll({
      limit: 4,
      order: [['createdAt', 'DESC']],
      where: {
        status: { [Op.ne]: 'rejected' }
      }
    });

    res.json(reports);
  } catch (error) {
    console.error('Get recent reports error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Public - Get report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'assignedPetugas',
        attributes: ['id', 'name', 'phone']
      }]
    });

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json(report);
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - Update report status
exports.updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, admin_notes, assigned_to } = req.body;

    const report = await Report.findByPk(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    const updateData = { status };
    if (admin_notes) updateData.admin_notes = admin_notes;
    if (assigned_to) updateData.assigned_to = assigned_to;

    await report.update(updateData);

    const updatedReport = await Report.findByPk(id, {
      include: [{
        model: User,
        as: 'assignedPetugas',
        attributes: ['id', 'name', 'phone']
      }]
    });

    res.json({
      message: 'Report updated successfully',
      report: updatedReport
    });
  } catch (error) {
    console.error('Update report error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Petugas - Update task progress
exports.updateTaskProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completion_notes } = req.body;

    const report = await Report.findByPk(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    const updateData = { status };
    if (completion_notes) updateData.completion_notes = completion_notes;
    if (req.file) updateData.completion_photo = req.file.filename;
    if (status === 'completed') updateData.completed_at = new Date();

    await report.update(updateData);

    res.json({
      message: 'Task updated successfully',
      report
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

