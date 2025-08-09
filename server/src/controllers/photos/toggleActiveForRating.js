'use strict';

const Photo = require('@src/models/Photo');
const { requireAtLeastOnePoint } = require('@src/controllers/services/pointsService');

module.exports = async function toggleActiveForRating(req, res) {
  try {
    const ownerId = req.user && (req.user.id || req.user._id);
    const { photoId } = req.params;
    const desiredActive = (req.body && typeof req.body.active === 'boolean') ? req.body.active : null;

    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    if (!photoId) {
      return res.status(400).json({ error: 'photoId is required' });
    }

    const photo = await Photo.findOne({ _id: photoId, ownerId });
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found or not owned by user' });
    }

    const nextState = desiredActive === null ? !photo.isActiveForRating : desiredActive;

    if (nextState === true && photo.isActiveForRating === false) {
      try {
        await requireAtLeastOnePoint(ownerId);
      } catch (err) {
        return res.status(err.status || 400).json({ error: err.message });
      }
    }

    photo.isActiveForRating = nextState;
    await photo.save();

    return res.json({
      photo: {
        id: photo._id.toString(),
        ownerId: photo.ownerId.toString(),
        isActiveForRating: photo.isActiveForRating,
        dataBase64: photo.data,
        mimeType: photo.mimeType || null,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt,
      }
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
