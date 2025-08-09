const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('@src/models/User');

const JWT_SECRET = 'JWT_SECRET';

module.exports = async function authLogin(req, res) {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(String(password), user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.json({ token, user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
