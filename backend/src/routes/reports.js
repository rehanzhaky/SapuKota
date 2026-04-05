const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { auth, adminDLH, petugas } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.post('/', upload.single('photo'), reportController.createReport);
router.get('/', reportController.getAllReports);
router.get('/recent', reportController.getRecentReports);
router.get('/:id', reportController.getReportById);

// Admin routes
router.put('/:id/status', auth, adminDLH, reportController.updateReportStatus);

// Petugas routes
router.post('/:id/accept', auth, petugas, reportController.acceptTask);
router.put('/:id/progress', auth, petugas, upload.single('completion_photo'), reportController.updateTaskProgress);
router.post('/:id/checkin', auth, petugas, reportController.checkInAtLocation);

module.exports = router;

