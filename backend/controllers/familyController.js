const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const FamilyGroup = require('../models/FamilyGroup');
const User = require('../models/User');
const { sendEmail } = require('../config/email');
const { familyInviteTemplate } = require('../utils/emailTemplates');

// @desc    Get current user's family group with members
// @route   GET /api/family
// @access  Private
const getFamilyGroup = asyncHandler(async (req, res) => {
  if (!req.user.familyGroup) {
    return res.json({ success: true, familyGroup: null });
  }

  const group = await FamilyGroup.findById(req.user.familyGroup)
    .populate('owner', 'name email avatarColor')
    .populate('members.user', 'name email avatarColor role');

  res.json({ success: true, familyGroup: group });
});

// @desc    Create a family group (if user doesn't have one yet)
// @route   POST /api/family
// @access  Private
const createFamilyGroup = asyncHandler(async (req, res) => {
  if (req.user.familyGroup) {
    res.status(400);
    throw new Error('You are already part of a family group');
  }

  const group = await FamilyGroup.create({
    name: req.body.name || `${req.user.name}'s Family`,
    owner: req.user._id,
    members: [
      {
        user: req.user._id,
        email: req.user.email,
        role: 'admin',
        status: 'accepted',
        joinedAt: new Date(),
      },
    ],
  });

  req.user.familyGroup = group._id;
  req.user.role = 'admin';
  await req.user.save();

  res.status(201).json({ success: true, familyGroup: group });
});

// @desc    Invite a member by email
// @route   POST /api/family/invite
// @access  Private (Admin only)
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = 'member' } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required');
  }

  if (!req.user.familyGroup) {
    res.status(400);
    throw new Error('Create a family group before inviting members');
  }

  const group = await FamilyGroup.findById(req.user.familyGroup);
  if (!group) {
    res.status(404);
    throw new Error('Family group not found');
  }

  const isOwnerAdmin = group.owner.toString() === req.user._id.toString() || req.user.role === 'admin';
  if (!isOwnerAdmin) {
    res.status(403);
    throw new Error('Only admins can invite members');
  }

  const alreadyInvited = group.members.find((m) => m.email === email.toLowerCase());
  if (alreadyInvited) {
    res.status(400);
    throw new Error('This person has already been invited');
  }

  const inviteToken = crypto.randomBytes(20).toString('hex');
  const existingUser = await User.findOne({ email: email.toLowerCase() });

  group.members.push({
    user: existingUser ? existingUser._id : undefined,
    email: email.toLowerCase(),
    role: role === 'admin' ? 'admin' : 'member',
    status: 'pending',
    inviteToken,
  });

  await group.save();

  const inviteUrl = `${process.env.CLIENT_URL}/family/accept-invite/${inviteToken}`;
  await sendEmail({
    to: email,
    subject: `${req.user.name} invited you to LendTrack`,
    html: familyInviteTemplate(req.user.name, group.name, inviteUrl),
  });

  res.status(201).json({ success: true, message: `Invite sent to ${email}`, familyGroup: group });
});

// @desc    Accept a family invite using the token from email
// @route   POST /api/family/accept-invite/:token
// @access  Private (must be logged in / will register first on frontend)
const acceptInvite = asyncHandler(async (req, res) => {
  const group = await FamilyGroup.findOne({ 'members.inviteToken': req.params.token });

  if (!group) {
    res.status(404);
    throw new Error('Invite link is invalid or has expired');
  }

  const member = group.members.find((m) => m.inviteToken === req.params.token);

  if (member.email !== req.user.email.toLowerCase()) {
    res.status(403);
    throw new Error('This invite was sent to a different email address');
  }

  member.status = 'accepted';
  member.user = req.user._id;
  member.joinedAt = new Date();
  member.inviteToken = undefined;
  await group.save();

  req.user.familyGroup = group._id;
  req.user.role = member.role;
  await req.user.save();

  res.json({ success: true, message: 'You have joined the family group', familyGroup: group });
});

// @desc    Update a member's role (admin/member)
// @route   PUT /api/family/members/:memberId/role
// @access  Private (Admin only)
const updateMemberRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const group = await FamilyGroup.findById(req.user.familyGroup);

  if (!group) {
    res.status(404);
    throw new Error('Family group not found');
  }

  const member = group.members.id(req.params.memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  member.role = role === 'admin' ? 'admin' : 'member';
  await group.save();

  if (member.user) {
    await User.findByIdAndUpdate(member.user, { role: member.role });
  }

  res.json({ success: true, familyGroup: group });
});

// @desc    Remove a member from the family group
// @route   DELETE /api/family/members/:memberId
// @access  Private (Admin only)
const removeMember = asyncHandler(async (req, res) => {
  const group = await FamilyGroup.findById(req.user.familyGroup);

  if (!group) {
    res.status(404);
    throw new Error('Family group not found');
  }

  const member = group.members.id(req.params.memberId);
  if (!member) {
    res.status(404);
    throw new Error('Member not found');
  }

  if (member.user) {
    await User.findByIdAndUpdate(member.user, { familyGroup: null, role: 'admin' });
  }

  member.deleteOne();
  await group.save();

  res.json({ success: true, familyGroup: group });
});

module.exports = {
  getFamilyGroup,
  createFamilyGroup,
  inviteMember,
  acceptInvite,
  updateMemberRole,
  removeMember,
};
