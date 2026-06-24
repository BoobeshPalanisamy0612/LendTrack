const express = require('express');
const router = express.Router();
const { calculateInterestHandler } = require('../controllers/calculatorController');
const { protect } = require('../middleware/authMiddleware');

router.post('/interest', protect, calculateInterestHandler);

module.exports = router;
