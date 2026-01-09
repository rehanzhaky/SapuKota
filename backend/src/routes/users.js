const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminDLH, petugas } = require('../middleware/auth');

// Admin DLH routes
router.get('/petugas', auth, adminDLH, userController.getAllPetugas);
router.post('/petugas', auth, adminDLH, userController.createPetugas);
router.put('/petugas/:id', auth, adminDLH, userController.updatePetugas);
router.delete('/petugas/:id', auth, adminDLH, userController.deletePetugas);

// Petugas routes
router.get('/tasks', auth, petugas, userController.getMyTasks);

module.exports = router;

