'use strict';

const User = require('@src/models/User');

module.exports = async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
