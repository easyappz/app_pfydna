const jwt = require('jsonwebtoken');
const User = require('@src/models/User');

const JWT_SECRET = 'JWT_SECRET';

module.exports = async function auth(req, res, next) {
  try {
    const header = req.headers['authorization'] || '';
    const parts = header.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Authorization header missing or malformed' });
    }

    const token = parts[1];
    const payload = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(payload.id);
    if (!user) {
      return res.status(401).json({ error: 'User not found for provided token' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};
