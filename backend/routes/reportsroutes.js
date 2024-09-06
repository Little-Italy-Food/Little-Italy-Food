const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const reportController = require('../controllers/reportscontroller');

// POST /api/reports - Create a new report
router.post('/', auth, reportController.createReport);

// GET /api/reports - Get all reports (admin only)
router.get('/', auth, reportController.getAllReports);

module.exports = router;