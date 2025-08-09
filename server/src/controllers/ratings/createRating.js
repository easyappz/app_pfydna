'use strict';

const mongoose = require('mongoose');
const Photo = require('@src/models/Photo');
const Rating = require('@src/models/Rating');
const User = require('@src/models/User');

function isValidObjectId(id) {
  return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

module.exports = async function createRating(req, res) {
  let session;
  try {
    const raterId = req.user && (req.user.id || req.user._id);
    if (!raterId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    const { photoId, value } = req.body || {};

    if (!photoId || !isValidObjectId(photoId)) {
      return res.status(400).json({ error: 'photoId is required and must be a valid id' });
    }

    const valNum = Number(value);
    if (!Number.isInteger(valNum) || valNum < 1 || valNum > 5) {
      return res.status(400).json({ error: 'value must be an integer between 1 and 5' });
    }

    // Optional fast pre-check for duplicates
    const existing = await Rating.findOne({ photoId, raterId });
    if (existing) {
      return res.status(409).json({ error: 'You have already rated this photo' });
    }

    session = await mongoose.startSession();

    const result = await session.withTransaction(async () => {
      // Load photo and owner
      const photo = await Photo.findById(photoId).session(session);
      if (!photo) {
        throw Object.assign(new Error('Photo not found'), { status: 404 });
      }
      if (!photo.isActiveForRating) {
        throw Object.assign(new Error('Photo is not active for rating'), { status: 400 });
      }

      const raterObjectId = new mongoose.Types.ObjectId(raterId);

      if (photo.ownerId.toString() === raterObjectId.toString()) {
        throw Object.assign(new Error('You cannot rate your own photo'), { status: 400 });
      }

      // Create rating first (unique on {photoId, raterId})
      await Rating.create([
        {
          photoId: photo._id,
          raterId: raterObjectId,
          ownerId: photo.ownerId,
          value: valNum,
        },
      ], { session });

      // +1 to rater
      const raterUpdated = await User.findOneAndUpdate(
        { _id: raterObjectId },
        { $inc: { points: 1 } },
        { new: true, session }
      );
      if (!raterUpdated) {
        throw Object.assign(new Error('Rater not found'), { status: 404 });
      }

      // -1 to owner (reject if would go below 0)
      const ownerUpdated = await User.findOneAndUpdate(
        { _id: photo.ownerId, points: { $gte: 1 } },
        { $inc: { points: -1 } },
        { new: true, session }
      );
      if (!ownerUpdated) {
        throw Object.assign(new Error('Owner has insufficient points to receive a rating'), { status: 400 });
      }

      return {
        raterPoints: raterUpdated.points,
        ownerPoints: ownerUpdated.points,
        rating: {
          photoId: photo._id.toString(),
          value: valNum,
        },
      };
    });

    return res.status(201).json({
      rating: result.rating,
      balances: {
        rater: result.raterPoints,
        owner: result.ownerPoints,
      },
    });
  } catch (error) {
    // Handle duplicate key error for unique index on (photoId, raterId)
    if (error && error.code === 11000) {
      return res.status(409).json({ error: 'Duplicate rating: you have already rated this photo' });
    }
    const status = error.status || 500;
    return res.status(status).json({ error: error.message });
  } finally {
    if (session) {
      try { await session.endSession(); } catch (_) {}
    }
  }
};
