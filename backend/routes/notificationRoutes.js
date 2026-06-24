const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  getReminders,
} = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');
const { runReminderCheck } = require('../utils/reminderJob');
const asyncHandler = require('express-async-handler');

router.use(protect);

router.get('/', getNotifications);
router.get('/reminders', getReminders);
router.put('/read-all', markAllNotificationsRead);
router.put('/:id/read', markNotificationRead);
router.delete('/:id', deleteNotification);

// Dev/testing helper: manually trigger the daily reminder sweep on demand
router.post(
  '/run-check',
  asyncHandler(async (req, res) => {
    await runReminderCheck();
    res.json({ success: true, message: 'Reminder check executed' });
  })
);

module.exports = router;
