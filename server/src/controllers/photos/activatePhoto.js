'use strict';

const Photo = require('@src/models/Photo');
const { assertBase64Under1MB } = require('@src/controllers/services/imageService');
const { requireAtLeastOnePoint, deductPoint } = require('@src/controllers/services/pointsService');

module.exports = async function activatePhoto(req, res) {
  try {
    const ownerId = req.user && (req.user.id || req.user._id);
    const { imageBase64 } = req.body || {};

    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // 1) Validate image size (<= 1MB)
    try {
      assertBase64Under1MB(imageBase64, 1048576);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }

    // 2) Ensure user has at least one point
    try {
      await requireAtLeastOnePoint(ownerId);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }

    // 3) Deduct point and create photo
    try {
      const userAfterDeduct = await deductPoint(ownerId, 'activate_photo');
      const photo = await Photo.create({ ownerId, data: imageBase64, active: true });

      return res.status(201).json({
        photo: {
          id: photo._id.toString(),
          ownerId: photo.ownerId.toString(),
          data: photo.data,
          active: photo.active,
          createdAt: photo.createdAt,
        },
        owner: { id: userAfterDeduct._id.toString(), points: userAfterDeduct.points },
      });
    } catch (err) {
      return res.status(err.status || 500).json({ error: err.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
