const express = require('express');
const router = express.Router();
const { getDashboardSummary, getMonthlyStats } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getDashboardSummary);
router.get('/monthly-stats', getMonthlyStats);

module.exports = router;
