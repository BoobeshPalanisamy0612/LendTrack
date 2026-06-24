const asyncHandler = require('express-async-handler');
const { calculateInterest } = require('../utils/interestCalculator');

// @desc    Calculate simple/compound interest from given inputs
// @route   POST /api/calculator/interest
// @access  Private
const calculateInterestHandler = asyncHandler(async (req, res) => {
  const { principal, rate, duration, durationUnit = 'years', type = 'simple', frequency = 'yearly' } = req.body;

  if (!principal || !rate || !duration) {
    res.status(400);
    throw new Error('principal, rate and duration are required');
  }

  if (principal <= 0 || rate < 0 || duration <= 0) {
    res.status(400);
    throw new Error('principal and duration must be positive, rate cannot be negative');
  }

  const years = durationUnit === 'months' ? duration / 12 : durationUnit === 'days' ? duration / 365 : duration;

  const result = calculateInterest(Number(principal), Number(rate), years, type, frequency);

  res.json({
    success: true,
    input: { principal, rate, duration, durationUnit, type, frequency },
    result: {
      interestAmount: result.interest,
      totalPayable: result.total,
    },
  });
});

module.exports = { calculateInterestHandler };
