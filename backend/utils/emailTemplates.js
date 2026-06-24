const wrapper = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#F7F4EC;font-family:Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:32px 24px;">
    <div style="background:#0B1F3A;padding:20px 24px;border-radius:8px 8px 0 0;">
      <span style="color:#F7F4EC;font-size:20px;font-weight:bold;letter-spacing:0.5px;">LendTrack</span>
    </div>
    <div style="background:#ffffff;padding:28px 24px;border-radius:0 0 8px 8px;border:1px solid #e5e1d6;">
      <h2 style="color:#0B1F3A;margin-top:0;">${title}</h2>
      ${bodyHtml}
    </div>
    <p style="color:#8B95A6;font-size:12px;text-align:center;margin-top:16px;">
      You're receiving this email because you have an account on LendTrack.
    </p>
  </div>
</body>
</html>
`;

const resetPasswordTemplate = (name, resetUrl) =>
  wrapper(
    'Reset your password',
    `<p>Hi ${name},</p>
     <p>We received a request to reset your LendTrack password. Click the button below to choose a new one. This link expires in 15 minutes.</p>
     <p style="text-align:center;margin:28px 0;">
       <a href="${resetUrl}" style="background:#2F9E6E;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Reset password</a>
     </p>
     <p>If you didn't request this, you can safely ignore this email.</p>`
  );

const familyInviteTemplate = (inviterName, groupName, inviteUrl) =>
  wrapper(
    "You've been invited to a family group",
    `<p>${inviterName} invited you to join <strong>${groupName}</strong> on LendTrack to view and manage shared loan records together.</p>
     <p style="text-align:center;margin:28px 0;">
       <a href="${inviteUrl}" style="background:#0B1F3A;color:#ffffff;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Accept invite</a>
     </p>`
  );

const dueReminderTemplate = (name, loan) =>
  wrapper(
    'Payment reminder',
    `<p>Hi ${name},</p>
     <p>This is a reminder about a loan record for <strong>${loan.personName}</strong>:</p>
     <p style="font-family:monospace;font-size:18px;color:#0B1F3A;">₹${loan.amount.toLocaleString()}</p>
     <p>Due date: <strong>${new Date(loan.dueDate).toDateString()}</strong></p>`
  );

module.exports = { resetPasswordTemplate, familyInviteTemplate, dueReminderTemplate };
