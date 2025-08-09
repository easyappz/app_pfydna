'use strict';

const mongoose = require('mongoose');
const Photo = require('@src/models/Photo');
const Rating = require('@src/models/Rating');

module.exports = async function getMyPhotos(req, res) {
  try {
    const ownerId = req.user && (req.user.id || req.user._id);
    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    const photos = await Photo.find({ ownerId }).sort({ createdAt: -1 }).lean();

    if (photos.length === 0) {
      return res.json({ photos: [] });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

    let statsAgg = [];
    try {
      statsAgg = await Rating.aggregate([
        { $match: { ownerId: ownerObjectId } },
        { $lookup: { from: 'users', localField: 'raterId', foreignField: '_id', as: 'rater' } },
        { $unwind: { path: '$rater', preserveNullAndEmptyArrays: true } },
        { $addFields: {
            gender: { $ifNull: ['$rater.gender', 'unknown'] },
            age: '$rater.age',
          }
        },
        { $addFields: {
            ageGroup: {
              $switch: {
                branches: [
                  { case: { $and: [ { $gte: ['$age', 0] }, { $lte: ['$age', 17] } ] }, then: '0-17' },
                  { case: { $and: [ { $gte: ['$age', 18] }, { $lte: ['$age', 24] } ] }, then: '18-24' },
                  { case: { $and: [ { $gte: ['$age', 25] }, { $lte: ['$age', 34] } ] }, then: '25-34' },
                  { case: { $and: [ { $gte: ['$age', 35] }, { $lte: ['$age', 44] } ] }, then: '35-44' },
                  { case: { $and: [ { $gte: ['$age', 45] }, { $lte: ['$age', 54] } ] }, then: '45-54' },
                  { case: { $gte: ['$age', 55] }, then: '55+' },
                ],
                default: 'unknown',
              }
            }
          }
        },
        { $facet: {
            overall: [
              { $group: { _id: '$photoId', avg: { $avg: '$value' }, count: { $sum: 1 } } }
            ],
            byGender: [
              { $group: { _id: { photoId: '$photoId', gender: '$gender' }, avg: { $avg: '$value' }, count: { $sum: 1 } } }
            ],
            byAgeGroup: [
              { $group: { _id: { photoId: '$photoId', ageGroup: '$ageGroup' }, avg: { $avg: '$value' }, count: { $sum: 1 } } }
            ]
        } }
      ]);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }

    const overall = (statsAgg[0] && statsAgg[0].overall) || [];
    const byGender = (statsAgg[0] && statsAgg[0].byGender) || [];
    const byAgeGroup = (statsAgg[0] && statsAgg[0].byAgeGroup) || [];

    const key = (v) => (typeof v === 'string' ? v : (v ? v.toString() : ''));

    const overallMap = {};
    for (const o of overall) {
      overallMap[key(o._id)] = { average: o.avg, count: o.count };
    }

    const genderMap = {};
    for (const g of byGender) {
      const pid = key(g._id.photoId);
      const gender = g._id.gender || 'unknown';
      if (!genderMap[pid]) genderMap[pid] = {};
      genderMap[pid][gender] = { average: g.avg, count: g.count };
    }

    const ageMap = {};
    for (const a of byAgeGroup) {
      const pid = key(a._id.photoId);
      const group = a._id.ageGroup || 'unknown';
      if (!ageMap[pid]) ageMap[pid] = {};
      ageMap[pid][group] = { average: a.avg, count: a.count };
    }

    const result = photos.map((p) => ({
      id: p._id.toString(),
      ownerId: p.ownerId.toString(),
      dataBase64: p.data,
      mimeType: p.mimeType || null,
      isActiveForRating: !!p.isActiveForRating,
      createdAt: p.createdAt,
      stats: {
        overall: overallMap[p._id.toString()] || { average: null, count: 0 },
        byGender: genderMap[p._id.toString()] || {},
        byAgeGroup: ageMap[p._id.toString()] || {},
      },
    }));

    return res.json({ photos: result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
