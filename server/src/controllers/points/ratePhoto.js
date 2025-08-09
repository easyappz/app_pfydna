'use strict';

const { addPoint, deductPoint } = require('@src/controllers/services/pointsService');

module.exports = async function ratePhoto(req, res) {
  try {
    const raterId = req.user && (req.user.id || req.user._id);
    const { ownerId, rating } = req.body || {};

    if (!raterId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required' });
    }

    if (typeof rating === 'undefined') {
      return res.status(400).json({ error: 'rating is required' });
    }

    let raterUpdated;
    try {
      // Step 1: Add +1 to rater for contributing a rating
      raterUpdated = await addPoint(raterId, 'rate_photo_reward');
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }

    try {
      // Step 2: Deduct -1 from owner as a cost of receiving a rating
      const ownerUpdated = await deductPoint(ownerId, 'photo_rated_cost');

      return res.status(200).json({
        rater: { id: raterUpdated._id.toString(), points: raterUpdated.points },
        owner: { id: ownerUpdated._id.toString(), points: ownerUpdated.points },
      });
    } catch (err) {
      // Rollback rater reward if owner deduction fails
      try {
        await deductPoint(raterId, 'rollback_rate_photo_reward');
      } catch (rollbackErr) {
        return res.status(500).json({
          error: 'Failed to deduct from owner and rollback rater reward',
          details: {
            initialError: err.message,
            rollbackError: rollbackErr.message,
          },
        });
      }

      return res.status(err.status || 500).json({
        error: err.message,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
