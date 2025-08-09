const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('@src/models/User');

const JWT_SECRET = 'JWT_SECRET';

// Safe diagnostic logger: never logs secrets or full request bodies
function debugLog(stage, req, extra) {
  try {
    const info = {
      stage,
      method: req.method,
      path: req.originalUrl,
      contentType: req.headers['content-type'] || null,
      bodyKeys: Object.keys(req.body || {}),
      userAgent: req.headers['user-agent'] || null,
      ...extra,
    };
    console.info('[authLogin]', JSON.stringify(info));
  } catch (_) {
    // no-op to avoid impacting flow on logging failure
  }
}

module.exports = async function authLogin(req, res) {
  try {
    debugLog('start', req);

    const { email, password } = req.body || {};

    if (!email || !password) {
      debugLog('validation_failed_missing_fields', req);
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      debugLog('auth_failed_user_not_found', req);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      debugLog('auth_failed_invalid_password', req);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    debugLog('success', req, { userId: user._id.toString() });

    return res.json({ token, user: user.toSafeJSON() });
  } catch (error) {
    debugLog('error_catch', req, { errorName: error.name, errorMessage: error.message });
    return res.status(500).json({ error: error.message });
  }
};
