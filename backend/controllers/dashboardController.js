const asyncHandler = require('express-async-handler');
const Loan = require('../models/Loan');
const PaymentHistory = require('../models/PaymentHistory');
const { buildVisibilityFilter } = require('../utils/accessControl');

// @desc    Get dashboard summary - totals, upcoming due dates, recent transactions
// @route   GET /api/dashboard/summary
// @access  Private
const getDashboardSummary = asyncHandler(async (req, res) => {
  const filter = buildVisibilityFilter(req.user);

  const loans = await Loan.find(filter);

  let totalLent = 0;
  let totalBorrowed = 0;
  let totalLentOutstanding = 0;
  let totalBorrowedOutstanding = 0;

  loans.forEach((loan) => {
    const { total } = loan.calculateInterest();
    const outstanding = Math.max(total - loan.amountPaid, 0);
    if (loan.type === 'lent') {
      totalLent += loan.amount;
      totalLentOutstanding += outstanding;
    } else {
      totalBorrowed += loan.amount;
      totalBorrowedOutstanding += outstanding;
    }
  });

  const now = new Date();
  const sevenDaysOut = new Date();
  sevenDaysOut.setDate(now.getDate() + 7);

  const activeLoans = loans.filter((l) => l.status !== 'paid');

  const overdue = activeLoans.filter((l) => new Date(l.dueDate) < now);
  const dueToday = activeLoans.filter((l) => new Date(l.dueDate).toDateString() === now.toDateString());
  const upcoming = activeLoans.filter((l) => {
    const due = new Date(l.dueDate);
    return due > now && due <= sevenDaysOut;
  });

  const upcomingDueDates = [...overdue, ...dueToday, ...upcoming]
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 8)
    .map((l) => ({
      _id: l._id,
      personName: l.personName,
      amount: l.amount,
      dueDate: l.dueDate,
      type: l.type,
      urgency: new Date(l.dueDate) < now ? 'overdue' : new Date(l.dueDate).toDateString() === now.toDateString() ? 'due_today' : 'upcoming',
    }));

  const recentTransactions = await PaymentHistory.find({ loanId: { $in: loans.map((l) => l._id) } })
    .populate('loanId', 'personName type')
    .sort('-paymentDate')
    .limit(6);

  const recentLoans = [...loans]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6)
    .map((l) => ({ _id: l._id, personName: l.personName, amount: l.amount, type: l.type, status: l.status, createdAt: l.createdAt }));

  res.json({
    success: true,
    summary: {
      totalLent: Math.round(totalLent * 100) / 100,
      totalBorrowed: Math.round(totalBorrowed * 100) / 100,
      totalLentOutstanding: Math.round(totalLentOutstanding * 100) / 100,
      totalBorrowedOutstanding: Math.round(totalBorrowedOutstanding * 100) / 100,
      netPosition: Math.round((totalLentOutstanding - totalBorrowedOutstanding) * 100) / 100,
      activeLoanCount: activeLoans.length,
      overdueCount: overdue.length,
      dueTodayCount: dueToday.length,
      upcomingCount: upcoming.length,
    },
    upcomingDueDates,
    recentTransactions,
    recentLoans,
  });
});

// @desc    Get monthly statistics for charting (last 6 months by default)
// @route   GET /api/dashboard/monthly-stats
// @access  Private
const getMonthlyStats = asyncHandler(async (req, res) => {
  const filter = buildVisibilityFilter(req.user);
  const months = Math.min(parseInt(req.query.months, 10) || 6, 24);

  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const loans = await Loan.find({ ...filter, createdAt: { $gte: since } });

  const buckets = {};
  for (let i = 0; i < months; i++) {
    const d = new Date(since);
    d.setMonth(d.getMonth() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets[key] = { month: d.toLocaleString('default', { month: 'short', year: '2-digit' }), lent: 0, borrowed: 0 };
  }

  loans.forEach((loan) => {
    const d = new Date(loan.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (buckets[key]) {
      if (loan.type === 'lent') buckets[key].lent += loan.amount;
      else buckets[key].borrowed += loan.amount;
    }
  });

  const data = Object.values(buckets);
  res.json({ success: true, data });
});

module.exports = { getDashboardSummary, getMonthlyStats };
