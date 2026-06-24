const mongoose = require('mongoose');

const familyGroupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default: 'My Family',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, required: true, lowercase: true, trim: true },
        role: { type: String, enum: ['admin', 'member'], default: 'member' },
        status: { type: String, enum: ['pending', 'accepted'], default: 'pending' },
        inviteToken: String,
        invitedAt: { type: Date, default: Date.now },
        joinedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyGroup', familyGroupSchema);
