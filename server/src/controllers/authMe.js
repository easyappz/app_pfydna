module.exports = async function authMe(req, res) {
  try {
    const user = req.user;
    return res.json({ user: user.toSafeJSON() });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
