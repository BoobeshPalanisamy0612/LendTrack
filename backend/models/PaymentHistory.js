const mongoose = require('mongoose');

const paymentHistorySchema = new mongoose.Schema(
  {
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      required: true,
    },
    paidAmount: {
      type: Number,
      required: [true, 'Paid amount is required'],
      min: [0.01, 'Paid amount must be greater than 0'],
    },
    paymentDate: {
      type: Date,
      required: [true, 'Payment date is required'],
      default: Date.now,
    },
    method: {
      type: String,
      enum: ['cash', 'bank_transfer', 'upi', 'cheque', 'other'],
      default: 'cash',
    },
    note: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

paymentHistorySchema.index({ loanId: 1 });

module.exports = mongoose.model('PaymentHistory', paymentHistorySchema);
