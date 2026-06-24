/**
 * Calculate simple or compound interest.
 * @param {number} principal
 * @param {number} ratePercent - annual interest rate, e.g. 10 for 10%
 * @param {number} years - duration in years (can be fractional)
 * @param {'simple'|'compound'} type
 * @param {'yearly'|'half-yearly'|'quarterly'|'monthly'} frequency - only used for compound
 */
const calculateInterest = (principal, ratePercent, years, type = 'simple', frequency = 'yearly') => {
  const rate = ratePercent / 100;

  if (type === 'compound') {
    const freqMap = { yearly: 1, 'half-yearly': 2, quarterly: 4, monthly: 12 };
    const n = freqMap[frequency] || 1;
    const total = principal * Math.pow(1 + rate / n, n * years);
    const interest = total - principal;
    return {
      interest: Math.round(interest * 100) / 100,
      total: Math.round(total * 100) / 100,
    };
  }

  // default: simple interest
  const interest = principal * rate * years;
  const total = principal + interest;
  return {
    interest: Math.round(interest * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

module.exports = { calculateInterest };
