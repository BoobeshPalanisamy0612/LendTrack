const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const Loan = require('../models/Loan');
const PaymentHistory = require('../models/PaymentHistory');
const Notification = require('../models/Notification');
const { buildVisibilityFilter, canModifyLoan } = require('../utils/accessControl');

// @desc    Create a loan record
// @route   POST /api/loans
// @access  Private
const createLoan = asyncHandler(async (req, res) => {
  const {
    personName,
    relationship,
    type,
    amount,
    interestRate,
    interestType,
    compoundFrequency,
    startDate,
    dueDate,
    notes,
  } = req.body;

  if (!personName || !type || !amount || !startDate || !dueDate) {
    res.status(400);
    throw new Error('personName, type, amount, startDate and dueDate are required');
  }

  const loan = await Loan.create({
    personName,
    relationship,
    type,
    amount,
    interestRate: interestRate || 0,
    interestType: interestType || 'none',
    compoundFrequency: compoundFrequency || 'yearly',
    startDate,
    dueDate,
    notes,
    createdBy: req.user._id,
    familyGroup: req.user.familyGroup || null,
  });

  res.status(201).json({ success: true, loan });
});

// @desc    Get all loans visible to the user (own + family), with search/filter/pagination
// @route   GET /api/loans
// @access  Private
const getLoans = asyncHandler(async (req, res) => {
  const { search, type, status, relationship, sortBy = '-createdAt', page = 1, limit = 20 } = req.query;

  const filter = buildVisibilityFilter(req.user);

  if (type && ['lent', 'borrowed'].includes(type)) filter.type = type;
  if (status) filter.status = status;
  if (relationship) filter.relationship = relationship;
  if (search) {
    filter.$and = [
      filter.$or ? { $or: filter.$or } : {},
      { $or: [{ personName: { $regex: search, $options: 'i' } }, { notes: { $regex: search, $options: 'i' } }] },
    ];
    delete filter.$or;
  }

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);

  const [loans, total] = await Promise.all([
    Loan.find(filter)
      .populate('createdBy', 'name email avatarColor')
      .sort(sortBy)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Loan.countDocuments(filter),
  ]);

  res.json({
    success: true,
    loans,
    pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) },
  });
});

// @desc    Get a single loan with payment history
// @route   GET /api/loans/:id
// @access  Private
const getLoanById = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id).populate('createdBy', 'name email avatarColor');

  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  const filter = buildVisibilityFilter(req.user);
  const visible = await Loan.findOne({ _id: loan._id, ...filter });
  if (!visible) {
    res.status(403);
    throw new Error('You do not have access to this loan record');
  }

  const payments = await PaymentHistory.find({ loanId: loan._id }).sort('-paymentDate');
  const interestBreakdown = loan.calculateInterest();

  res.json({ success: true, loan, payments, interestBreakdown });
});

// @desc    Update a loan
// @route   PUT /api/loans/:id
// @access  Private
const updateLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  if (!canModifyLoan(req.user, loan)) {
    res.status(403);
    throw new Error('You do not have permission to edit this record');
  }

  const fields = [
    'personName',
    'relationship',
    'type',
    'amount',
    'interestRate',
    'interestType',
    'compoundFrequency',
    'startDate',
    'dueDate',
    'notes',
    'status',
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) loan[field] = req.body[field];
  });

  await loan.save();
  res.json({ success: true, loan });
});

// @desc    Delete a loan
// @route   DELETE /api/loans/:id
// @access  Private
const deleteLoan = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);

  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  if (!canModifyLoan(req.user, loan)) {
    res.status(403);
    throw new Error('You do not have permission to delete this record');
  }

  // remove associated uploaded files from disk
  loan.documents.forEach((doc) => {
    const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
    fs.unlink(filePath, () => {});
  });

  await PaymentHistory.deleteMany({ loanId: loan._id });
  await Notification.deleteMany({ loanId: loan._id });
  await loan.deleteOne();

  res.json({ success: true, message: 'Loan record deleted' });
});

// @desc    Mark a loan as paid (full) or record a partial payment
// @route   POST /api/loans/:id/pay
// @access  Private
const markLoanPaid = asyncHandler(async (req, res) => {
  const { paidAmount, paymentDate, method, note, full } = req.body;

  const loan = await Loan.findById(req.params.id);
  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  if (!canModifyLoan(req.user, loan)) {
    res.status(403);
    throw new Error('You do not have permission to update this record');
  }

  const { total } = loan.calculateInterest();
  const amountToRecord = full ? total - loan.amountPaid : Number(paidAmount);

  if (!amountToRecord || amountToRecord <= 0) {
    res.status(400);
    throw new Error('Provide a valid paid amount');
  }

  const payment = await PaymentHistory.create({
    loanId: loan._id,
    paidAmount: amountToRecord,
    paymentDate: paymentDate || Date.now(),
    method: method || 'cash',
    note,
    recordedBy: req.user._id,
  });

  loan.amountPaid += amountToRecord;
  loan.status = loan.amountPaid >= total ? 'paid' : 'partially_paid';
  await loan.save();

  await Notification.create({
    userId: loan.createdBy,
    loanId: loan._id,
    type: 'payment_received',
    message: `A payment of ₹${amountToRecord.toLocaleString()} was recorded for ${loan.personName}`,
  });

  res.json({ success: true, loan, payment });
});

// @desc    Upload one or more documents to a loan
// @route   POST /api/loans/:id/documents
// @access  Private
const uploadLoanDocuments = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  if (!canModifyLoan(req.user, loan)) {
    res.status(403);
    throw new Error('You do not have permission to update this record');
  }

  if (!req.files || req.files.length === 0) {
    res.status(400);
    throw new Error('No files uploaded');
  }

  const newDocs = req.files.map((file) => ({
    fileName: file.filename,
    originalName: file.originalname,
    fileUrl: `/uploads/${file.filename}`,
    fileType: file.mimetype,
  }));

  loan.documents.push(...newDocs);
  await loan.save();

  res.json({ success: true, documents: loan.documents });
});

// @desc    Delete a single document from a loan
// @route   DELETE /api/loans/:id/documents/:docId
// @access  Private
const deleteLoanDocument = asyncHandler(async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) {
    res.status(404);
    throw new Error('Loan record not found');
  }

  if (!canModifyLoan(req.user, loan)) {
    res.status(403);
    throw new Error('You do not have permission to update this record');
  }

  const doc = loan.documents.id(req.params.docId);
  if (!doc) {
    res.status(404);
    throw new Error('Document not found');
  }

  const filePath = path.join(__dirname, '..', 'uploads', doc.fileName);
  fs.unlink(filePath, () => {});
  doc.deleteOne();
  await loan.save();

  res.json({ success: true, documents: loan.documents });
});

module.exports = {
  createLoan,
  getLoans,
  getLoanById,
  updateLoan,
  deleteLoan,
  markLoanPaid,
  uploadLoanDocuments,
  deleteLoanDocument,
};
