const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Loan = require('../models/Loan');
const PaymentHistory = require('../models/PaymentHistory');

const seed = async () => {
  await connectDB();

  console.log('Clearing existing demo data...');
  await User.deleteMany({ email: 'demo@lendtrack.app' });

  const user = await User.create({
    name: 'Demo User',
    email: 'demo@lendtrack.app',
    password: 'demo1234',
    role: 'admin',
  });

  console.log('Created demo user: demo@lendtrack.app / demo1234');

  const today = new Date();
  const daysFromNow = (n) => new Date(today.getTime() + n * 24 * 60 * 60 * 1000);
  const daysAgo = (n) => new Date(today.getTime() - n * 24 * 60 * 60 * 1000);

  const loans = await Loan.insertMany([
    {
      personName: 'Ravi Kumar',
      relationship: 'Friend',
      type: 'lent',
      amount: 15000,
      interestRate: 5,
      interestType: 'simple',
      startDate: daysAgo(60),
      dueDate: daysAgo(2),
      notes: 'Lent for medical emergency',
      status: 'overdue',
      createdBy: user._id,
    },
    {
      personName: 'Priya Sharma',
      relationship: 'Sister',
      type: 'lent',
      amount: 5000,
      interestRate: 0,
      interestType: 'none',
      startDate: daysAgo(30),
      dueDate: today,
      notes: 'For college fees',
      status: 'active',
      createdBy: user._id,
    },
    {
      personName: 'Arjun Mehta',
      relationship: 'Colleague',
      type: 'lent',
      amount: 2000,
      interestRate: 0,
      interestType: 'none',
      startDate: daysAgo(10),
      dueDate: daysFromNow(5),
      notes: '',
      status: 'active',
      createdBy: user._id,
    },
    {
      personName: 'State Bank Loan',
      relationship: 'Other',
      type: 'borrowed',
      amount: 50000,
      interestRate: 8.5,
      interestType: 'compound',
      compoundFrequency: 'yearly',
      startDate: daysAgo(180),
      dueDate: daysFromNow(185),
      notes: 'Personal loan for home renovation',
      status: 'active',
      createdBy: user._id,
    },
    {
      personName: 'Mom',
      relationship: 'Parent',
      type: 'borrowed',
      amount: 3000,
      interestRate: 0,
      interestType: 'none',
      startDate: daysAgo(5),
      dueDate: daysFromNow(2),
      notes: '',
      status: 'active',
      createdBy: user._id,
    },
  ]);

  await PaymentHistory.create({
    loanId: loans[1]._id,
    paidAmount: 1000,
    paymentDate: daysAgo(5),
    method: 'upi',
    note: 'Partial payment',
    recordedBy: user._id,
  });

  console.log(`Seeded ${loans.length} loan records.`);
  console.log('Done. You can now log in with demo@lendtrack.app / demo1234');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
