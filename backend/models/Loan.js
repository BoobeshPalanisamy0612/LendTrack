const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  fileUrl: String,
  fileType: String,
  uploadedAt: { type: Date, default: Date.now },
});

const loanSchema = new mongoose.Schema(
  {
    personName: {
      type: String,
      required: [true, 'Person name is required'],
      trim: true,
    },
    relationship: {
      type: String,
      trim: true,
      default: 'Other',
    },
    type: {
      type: String,
      enum: ['lent', 'borrowed'],
      required: [true, 'Loan type is required'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount must be positive'],
    },
    amountPaid: {
      type: Number,
      default: 0,
      min: 0,
    },
    interestRate: {
      type: Number,
      default: 0,
      min: 0,
    },
    interestType: {
      type: String,
      enum: ['simple', 'compound', 'none'],
      default: 'none',
    },
    compoundFrequency: {
      type: String,
      enum: ['yearly', 'half-yearly', 'quarterly', 'monthly'],
      default: 'yearly',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    status: {
      type: String,
      enum: ['active', 'paid', 'overdue', 'partially_paid'],
      default: 'active',
    },
    documents: [documentSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    familyGroup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FamilyGroup',
      default: null,
    },
  },
  { timestamps: true }
);

loanSchema.index({ createdBy: 1, status: 1 });
loanSchema.index({ familyGroup: 1 });
loanSchema.index({ dueDate: 1 });
loanSchema.index({ personName: 'text', notes: 'text' });

// Virtual: computed total payable amount including interest
loanSchema.methods.calculateInterest = function () {
  const principal = this.amount;
  const rate = this.interestRate / 100;
  const start = new Date(this.startDate);
  const end = new Date(this.dueDate);
  const years = Math.max((end - start) / (1000 * 60 * 60 * 24 * 365), 0);

  if (this.interestType === 'none' || !this.interestRate) {
    return { interest: 0, total: principal };
  }

  if (this.interestType === 'simple') {
    const interest = principal * rate * years;
    return { interest: Math.round(interest * 100) / 100, total: Math.round((principal + interest) * 100) / 100 };
  }

  if (this.interestType === 'compound') {
    const freqMap = { yearly: 1, 'half-yearly': 2, quarterly: 4, monthly: 12 };
    const n = freqMap[this.compoundFrequency] || 1;
    const total = principal * Math.pow(1 + rate / n, n * years);
    const interest = total - principal;
    return { interest: Math.round(interest * 100) / 100, total: Math.round(total * 100) / 100 };
  }

  return { interest: 0, total: principal };
};

module.exports = mongoose.model('Loan', loanSchema);
