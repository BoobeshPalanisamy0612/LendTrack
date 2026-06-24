const express = require('express');
const router = express.Router();

console.log('✅ authRoutes.js loaded');

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Auth routes working',
  });
});

const {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  resetPassword,
  updateProfile,
  changePassword,
} = require('../controllers/authController');

const { protect } = require('../middleware/authMiddleware');

router.get('/register', (req, res) => {
  res.json({
    success: true,
    message: 'GET register route reached',
  });
});
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:resetToken', resetPassword);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

module.exports = router;