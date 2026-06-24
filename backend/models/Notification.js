const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    loanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Loan',
      default: null,
    },
    type: {
      type: String,
      enum: ['due_today', 'upcoming', 'overdue', 'payment_received', 'family_invite', 'general'],
      default: 'general',
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
// Prevent duplicate reminder spam for the same loan + type on the same day
notificationSchema.index(
  { userId: 1, loanId: 1, type: 1, createdAt: 1 }
);

module.exports = mongoose.model('Notification', notificationSchema);
