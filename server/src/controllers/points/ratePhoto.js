'use strict';

const mongoose = require('mongoose');
const { addPoint, deductPoint } = require('@src/controllers/services/pointsService');

function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

module.exports = async function ratePhoto(req, res) {
  let session;
  try {
    const raterId = req.user && (req.user.id || req.user._id);
    const { ownerId, rating } = req.body || {};

    if (!raterId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    if (!ownerId || !isValidObjectId(ownerId)) {
      return res.status(400).json({ error: 'ownerId is required and must be a valid id' });
    }

    const raterStr = String(raterId);
    const ownerStr = String(ownerId);
    if (raterStr === ownerStr) {
      return res.status(400).json({ error: 'You cannot transfer points to yourself' });
    }

    if (typeof rating !== 'undefined') {
      const val = Number(rating);
      if (!Number.isInteger(val) || val < 1 || val > 5) {
        return res.status(400).json({ error: 'rating must be an integer between 1 and 5 if provided' });
      }
    }

    session = await mongoose.startSession();

    const result = await session.withTransaction(async () => {
      const updatedRater = await addPoint(raterStr, 'rate_photo_reward', { session });
      const updatedOwner = await deductPoint(ownerStr, 'photo_rated_cost', { session });

      return {
        rater: { id: updatedRater._id.toString(), points: updatedRater.points },
        owner: { id: updatedOwner._id.toString(), points: updatedOwner.points },
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    const status = error.status || 500;
    return res.status(status).json({ error: error.message });
  } finally {
    if (session) {
      try { await session.endSession(); } catch (_) {}
    }
  }
};
