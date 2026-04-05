const { User, Report } = require('../models');

// Public - Get petugas count
exports.getPetugasCount = async (req, res) => {
  try {
    const count = await User.count({
      where: { 
        role: 'petugas',
        status: 'active'
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Get petugas count error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin DLH - Get all petugas
exports.getAllPetugas = async (req, res) => {
  try {
    const petugas = await User.findAll({
      where: { role: 'petugas' },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(petugas);
  } catch (error) {
    console.error('Get petugas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin DLH - Create new petugas
exports.createPetugas = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const petugas = await User.create({
      name,
      email,
      password,
      phone,
      role: 'petugas',
      status: 'active'
    });

    const petugasData = petugas.toJSON();
    delete petugasData.password;

    res.status(201).json({
      message: 'Petugas created successfully',
      petugas: petugasData
    });
  } catch (error) {
    console.error('Create petugas error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin DLH - Update petugas
exports.updatePetugas = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, password } = req.body;

    const petugas = await User.findByPk(id);
    if (!petugas || petugas.role !== 'petugas') {
      return res.status(404).json({ message: 'Petugas not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (status) updateData.status = status;
    if (password) updateData.password = password;

    await petugas.update(updateData);

    const updatedPetugas = petugas.toJSON();
    delete updatedPetugas.password;

    res.json({
      message: 'Petugas updated successfully',
      petugas: updatedPetugas
    });
  } catch (error) {
    console.error('Update petugas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin DLH - Delete petugas
exports.deletePetugas = async (req, res) => {
  try {
    const { id } = req.params;

    const petugas = await User.findByPk(id);
    if (!petugas || petugas.role !== 'petugas') {
      return res.status(404).json({ message: 'Petugas not found' });
    }

    // Check if petugas has active assignments
    const activeReports = await Report.count({
      where: {
        assigned_to: id,
        status: ['assigned', 'in_progress']
      }
    });

    if (activeReports > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete petugas with active assignments' 
      });
    }

    await petugas.destroy();

    res.json({ message: 'Petugas deleted successfully' });
  } catch (error) {
    console.error('Delete petugas error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Petugas - Get my tasks
exports.getMyTasks = async (req, res) => {
  try {
    const { status } = req.query;
    
    const where = { assigned_to: req.user.id };
    if (status) where.status = status;

    const tasks = await Report.findAll({
      where,
      order: [['createdAt', 'DESC']]
    });

    res.json({ data: tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Petugas - Update GPS location
exports.updateGPSLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    await User.update(
      {
        current_latitude: latitude,
        current_longitude: longitude,
        last_location_update: new Date()
      },
      {
        where: { id: req.user.id }
      }
    );

    res.json({ message: 'GPS location updated successfully' });
  } catch (error) {
    console.error('Update GPS location error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin - Get all petugas with GPS locations
exports.getPetugasLocations = async (req, res) => {
  try {
    const petugas = await User.findAll({
      where: { role: 'petugas', status: 'active' },
      attributes: ['id', 'name', 'phone', 'current_latitude', 'current_longitude', 'last_location_update'],
      include: [{
        model: Report,
        as: 'assignedReports',
        where: { status: ['assigned', 'in_progress'] },
        required: false,
        attributes: ['id', 'title', 'location', 'latitude', 'longitude', 'status']
      }]
    });

    res.json({ data: petugas });
  } catch (error) {
    console.error('Get petugas locations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

