'use strict';

const mongoose = require('mongoose');
const Photo = require('@src/models/Photo');
const Rating = require('@src/models/Rating');

function parseIntOrNull(v) {
  if (v === undefined || v === null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

module.exports = async function getNextPhoto(req, res) {
  try {
    const raterId = req.user && (req.user.id || req.user._id);
    if (!raterId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    // Resolve filters: query takes precedence over user.filterSettings
    const userFS = (req.user && req.user.filterSettings) || {};
    const genderRaw = (typeof req.query.gender === 'string' && req.query.gender.trim()) || userFS.gender || 'any';
    const ageFromRaw = req.query.ageFrom !== undefined ? req.query.ageFrom : userFS.ageFrom;
    const ageToRaw = req.query.ageTo !== undefined ? req.query.ageTo : userFS.ageTo;

    const gender = ['male', 'female', 'other', 'any'].includes(genderRaw) ? genderRaw : 'any';
    const ageFrom = parseIntOrNull(ageFromRaw);
    const ageTo = parseIntOrNull(ageToRaw);

    if (ageFrom !== null && (ageFrom < 0 || ageFrom > 120)) {
      return res.status(400).json({ error: 'ageFrom must be between 0 and 120' });
    }
    if (ageTo !== null && (ageTo < 0 || ageTo > 120)) {
      return res.status(400).json({ error: 'ageTo must be between 0 and 120' });
    }
    if (ageFrom !== null && ageTo !== null && ageFrom > ageTo) {
      return res.status(400).json({ error: 'ageFrom must be <= ageTo' });
    }

    const raterObjectId = new mongoose.Types.ObjectId(raterId);

    // Fetch already rated photo IDs to exclude
    const ratedPhotoIds = await Rating.find({ raterId: raterObjectId }).distinct('photoId');

    const matchBase = {
      isActiveForRating: true,
      ownerId: { $ne: raterObjectId },
    };
    if (ratedPhotoIds && ratedPhotoIds.length > 0) {
      matchBase._id = { $nin: ratedPhotoIds };
    }

    const ownerFilter = {};
    if (gender && gender !== 'any') {
      ownerFilter['owner.gender'] = gender;
    }
    if (ageFrom !== null) {
      ownerFilter['owner.age'] = Object.assign(ownerFilter['owner.age'] || {}, { $gte: ageFrom });
    }
    if (ageTo !== null) {
      ownerFilter['owner.age'] = Object.assign(ownerFilter['owner.age'] || {}, { $lte: ageTo });
    }

    const pipeline = [
      { $match: matchBase },
      { $lookup: { from: 'users', localField: 'ownerId', foreignField: '_id', as: 'owner' } },
      { $unwind: '$owner' },
    ];

    if (Object.keys(ownerFilter).length > 0) {
      pipeline.push({ $match: ownerFilter });
    }

    // Randomize selection to reduce bias
    pipeline.push({ $sample: { size: 1 } });

    // Only return necessary fields
    pipeline.push({
      $project: {
        _id: 1,
        data: 1,
        mimeType: 1,
        isActiveForRating: 1,
        owner: {
          _id: '$owner._id',
          gender: '$owner.gender',
          age: '$owner.age',
        },
      },
    });

    const results = await Photo.aggregate(pipeline);

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'No photos available for rating with current filters' });
    }

    const item = results[0];

    return res.json({
      photo: {
        id: item._id.toString(),
        dataBase64: item.data,
        mimeType: item.mimeType || null,
        isActiveForRating: !!item.isActiveForRating,
      },
      owner: {
        id: item.owner._id.toString(),
        gender: item.owner.gender || null,
        age: typeof item.owner.age === 'number' ? item.owner.age : null,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
