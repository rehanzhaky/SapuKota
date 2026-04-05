const { Report, User } = require('../models');
const { Op } = require('sequelize');

// Public - Create new report
exports.createReport = async (req, res) => {
  try {
    const { title, location, latitude, longitude, description } = req.body;

    const report = await Report.create({
      title,
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
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
    
    if (status) {
      // Support comma-separated status values for filtering multiple statuses
      if (status.includes(',')) {
        where.status = { [Op.in]: status.split(',') };
      } else {
        where.status = status;
      }
    }
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
      limit: 10,
      order: [['createdAt', 'DESC']],
      where: {
        status: { [Op.ne]: 'rejected' }
      }
    });

    res.json({ data: reports });
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

    const updateData = {};
    
    // If assigned_to is provided, automatically set status to 'assigned'
    if (assigned_to) {
      updateData.assigned_to = assigned_to;
      updateData.status = 'assigned';
    } else if (status) {
      updateData.status = status;
    }
    
    if (admin_notes) updateData.admin_notes = admin_notes;

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

// Petugas - Accept task with GPS location
exports.acceptTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'GPS coordinates are required' });
    }

    const report = await Report.findByPk(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to accept this task' });
    }

    if (report.status !== 'assigned') {
      return res.status(400).json({ message: 'Task is not in assigned status' });
    }

    // Update with acceptance information
    await report.update({
      accepted_at: new Date(),
      accept_latitude: parseFloat(latitude),
      accept_longitude: parseFloat(longitude),
      status: 'in_progress'
    });

    res.json({
      message: 'Task accepted successfully. Status updated to in_progress.',
      report
    });
  } catch (error) {
    console.error('Accept task error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Petugas - Update task progress
exports.updateTaskProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, completion_notes, latitude, longitude } = req.body;

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
    
    // If completing task, save completion GPS and timestamp
    if (status === 'completed') {
      updateData.completed_at = new Date();
      if (latitude && longitude) {
        updateData.complete_latitude = parseFloat(latitude);
        updateData.complete_longitude = parseFloat(longitude);
      }
    }

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

// Petugas - Check-in at location (mark arrival)
exports.checkInAtLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'GPS coordinates are required' });
    }

    const report = await Report.findByPk(id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to check-in to this task' });
    }

    // Update arrival information
    await report.update({
      arrived_at: new Date(),
      petugas_latitude: parseFloat(latitude),
      petugas_longitude: parseFloat(longitude),
      status: report.status === 'assigned' ? 'in_progress' : report.status
    });

    res.json({
      message: 'Successfully checked in at location',
      report
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

