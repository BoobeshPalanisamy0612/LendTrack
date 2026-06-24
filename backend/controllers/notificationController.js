const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get all notifications for logged-in user
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
  const { unreadOnly } = req.query;
  const filter = { userId: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const notifications = await Notification.find(filter).sort('-createdAt').limit(50).populate('loanId', 'personName amount dueDate');

  const unreadCount = await Notification.countDocuments({ userId: req.user._id, isRead: false });

  res.json({ success: true, notifications, unreadCount });
});

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  notification.isRead = true;
  await notification.save();
  res.json({ success: true, notification });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: 'All notifications marked as read' });
});

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }
  res.json({ success: true, message: 'Notification deleted' });
});

// @desc    Get reminder center data - grouped due today / upcoming / overdue
// @route   GET /api/notifications/reminders
// @access  Private
const getReminders = asyncHandler(async (req, res) => {
  const Loan = require('../models/Loan');
  const { buildVisibilityFilter } = require('../utils/accessControl');

  const filter = buildVisibilityFilter(req.user);
  const loans = await Loan.find({ ...filter, status: { $ne: 'paid' } });

  const now = new Date();
  const grouped = { overdue: [], dueToday: [], upcoming: [] };

  loans.forEach((loan) => {
    const due = new Date(loan.dueDate);
    if (due < now && due.toDateString() !== now.toDateString()) {
      grouped.overdue.push(loan);
    } else if (due.toDateString() === now.toDateString()) {
      grouped.dueToday.push(loan);
    } else if (due > now) {
      grouped.upcoming.push(loan);
    }
  });

  grouped.upcoming.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  grouped.overdue.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  res.json({ success: true, ...grouped });
});

module.exports = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getReminders,
};
