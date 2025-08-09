const User = require('@src/models/User');
const PasswordReset = require('@src/models/PasswordReset');

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ''));
}

function generateCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

module.exports = async function authRequestReset(req, res) {
  try {
    const { email } = req.body || {};

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Invalidate previous unused codes for this email
    await PasswordReset.updateMany({ email: normalizedEmail, used: false }, { $set: { used: true } });

    const created = await PasswordReset.create({ email: normalizedEmail, code, expiresAt, used: false });

    return res.json({
      message: 'Password reset code created. In test mode the code is returned in response.',
      code: created.code,
      expiresAt: created.expiresAt.toISOString(),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
