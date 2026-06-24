/**
 * Builds a Mongo filter so a user sees their own loans plus any loans
 * shared within their family group.
 */
const buildVisibilityFilter = (user) => {
  if (user.familyGroup) {
    return { $or: [{ createdBy: user._id }, { familyGroup: user.familyGroup }] };
  }
  return { createdBy: user._id };
};

/**
 * Determines if a user can modify (edit/delete) a given loan.
 * Admins in the loan's family group, or the original creator, can modify.
 */
const canModifyLoan = (user, loan) => {
  if (loan.createdBy.toString() === user._id.toString()) return true;
  if (loan.familyGroup && user.familyGroup && loan.familyGroup.toString() === user.familyGroup.toString()) {
    return user.role === 'admin';
  }
  return false;
};

module.exports = { buildVisibilityFilter, canModifyLoan };
