const cron = require('node-cron');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { dueReminderTemplate } = require('../utils/emailTemplates');

const alreadyNotifiedToday = async (userId, loanId, type) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const existing = await Notification.findOne({
    userId,
    loanId,
    type,
    createdAt: { $gte: startOfDay },
  });
  return Boolean(existing);
};

const runReminderCheck = async () => {
  console.log('[reminder-job] running due date check...');
  const activeLoans = await Loan.find({ status: { $in: ['active', 'partially_paid'] } }).populate('createdBy');

  const now = new Date();

  for (const loan of activeLoans) {
    const due = new Date(loan.dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));

    let type = null;
    let message = null;

    if (diffDays < 0) {
      type = 'overdue';
      message = `Payment from ${loan.personName} is overdue by ${Math.abs(diffDays)} day(s)`;
      if (loan.status !== 'overdue') {
        loan.status = 'overdue';
        await loan.save();
      }
    } else if (diffDays === 0) {
      type = 'due_today';
      message = `Payment of ₹${loan.amount.toLocaleString()} from ${loan.personName} is due today`;
    } else if (loan.createdBy && diffDays <= (loan.createdBy.notificationPrefs?.dueSoonDays || 3)) {
      type = 'upcoming';
      message = `Payment of ₹${loan.amount.toLocaleString()} from ${loan.personName} is due in ${diffDays} day(s)`;
    }

    if (!type || !loan.createdBy) continue;

    const alreadySent = await alreadyNotifiedToday(loan.createdBy._id, loan._id, type);
    if (alreadySent) continue;

    await Notification.create({
      userId: loan.createdBy._id,
      loanId: loan._id,
      type,
      message,
    });

    if (loan.createdBy.notificationPrefs?.email) {
      await sendEmail({
        to: loan.createdBy.email,
        subject: 'LendTrack reminder - payment due',
        html: dueReminderTemplate(loan.createdBy.name, loan),
      });
    }
  }

  console.log('[reminder-job] done');
};

// Runs once every day at 8:00 AM server time
const startReminderJob = () => {
  cron.schedule('0 8 * * *', runReminderCheck);
  console.log('Reminder cron job scheduled (daily at 08:00)');
};

module.exports = { startReminderJob, runReminderCheck };
