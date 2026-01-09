const jwt = require('jsonwebtoken');
const { User } = require('../models');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Invalid authentication' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid authentication' });
  }
};

const adminDLH = (req, res, next) => {
  if (req.user.role !== 'admin_dlh') {
    return res.status(403).json({ message: 'Access denied. Admin DLH only.' });
  }
  next();
};

const petugas = (req, res, next) => {
  if (req.user.role !== 'petugas') {
    return res.status(403).json({ message: 'Access denied. Petugas only.' });
  }
  next();
};

const adminOrPetugas = (req, res, next) => {
  if (req.user.role !== 'admin_dlh' && req.user.role !== 'petugas') {
    return res.status(403).json({ message: 'Access denied.' });
  }
  next();
};

module.exports = { auth, adminDLH, petugas, adminOrPetugas };

