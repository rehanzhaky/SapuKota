const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { auth, adminDLH } = require('../middleware/auth');

router.get('/', auth, adminDLH, statsController.getStats);
router.get('/performance', auth, adminDLH, statsController.getPetugasPerformance);

module.exports = router;

