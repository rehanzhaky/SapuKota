const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminDLH, petugas } = require('../middleware/auth');

// Public routes
router.get('/petugas/count', userController.getPetugasCount);

// Admin DLH routes
router.get('/petugas', auth, adminDLH, userController.getAllPetugas);
router.get('/petugas/locations', auth, adminDLH, userController.getPetugasLocations);
router.post('/petugas', auth, adminDLH, userController.createPetugas);
router.put('/petugas/:id', auth, adminDLH, userController.updatePetugas);
router.delete('/petugas/:id', auth, adminDLH, userController.deletePetugas);

// Petugas routes
router.get('/tasks', auth, petugas, userController.getMyTasks);
router.post('/gps/update', auth, petugas, userController.updateGPSLocation);

module.exports = router;

