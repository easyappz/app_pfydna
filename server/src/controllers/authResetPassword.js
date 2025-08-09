const bcrypt = require('bcryptjs');
const User = require('@src/models/User');
const PasswordReset = require('@src/models/PasswordReset');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

module.exports = async function authResetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!/^\d{6}$/.test(String(code || ''))) {
      return res.status(400).json({ error: 'Invalid code format. It must be a 6-digit number' });
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const reset = await PasswordReset.findOne({ email: normalizedEmail, code: String(code), used: false });
    if (!reset) {
      return res.status(400).json({ error: 'Invalid or already used reset code' });
    }

    if (reset.expiresAt.getTime() < Date.now()) {
      return res.status(400).json({ error: 'Reset code has expired' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(String(newPassword), salt);
    await user.save();

    reset.used = true;
    await reset.save();

    // Optionally invalidate other codes
    await PasswordReset.updateMany({ email: normalizedEmail, used: false }, { $set: { used: true } });

    return res.json({ message: 'Password has been updated successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
