const express = require('express');
const router = express.Router();
const {
  getFamilyGroup,
  createFamilyGroup,
  inviteMember,
  acceptInvite,
  updateMemberRole,
  removeMember,
} = require('../controllers/familyController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/').get(getFamilyGroup).post(createFamilyGroup);
router.post('/invite', adminOnly, inviteMember);
router.post('/accept-invite/:token', acceptInvite);
router.put('/members/:memberId/role', adminOnly, updateMemberRole);
router.delete('/members/:memberId', adminOnly, removeMember);

module.exports = router;
