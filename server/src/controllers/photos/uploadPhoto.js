'use strict';

const Photo = require('@src/models/Photo');
const { assertBase64Under1MB } = require('@src/controllers/services/imageService');

module.exports = async function uploadPhoto(req, res) {
  try {
    const ownerId = req.user && (req.user.id || req.user._id);
    const { dataBase64, mimeType } = req.body || {};

    if (!ownerId) {
      return res.status(401).json({ error: 'Unauthorized: missing user' });
    }

    if (!dataBase64) {
      return res.status(400).json({ error: 'dataBase64 is required' });
    }

    if (!mimeType) {
      return res.status(400).json({ error: 'mimeType is required' });
    }

    if (typeof mimeType !== 'string' || !mimeType.startsWith('image/')) {
      return res.status(400).json({ error: 'mimeType must be an image/* type' });
    }

    try {
      assertBase64Under1MB(dataBase64, 1048576);
    } catch (err) {
      return res.status(err.status || 400).json({ error: err.message });
    }

    try {
      const photo = await Photo.create({
        ownerId,
        data: dataBase64,
        mimeType,
        isActiveForRating: false,
      });

      return res.status(201).json({
        photo: {
          id: photo._id.toString(),
          ownerId: photo.ownerId.toString(),
          dataBase64: photo.data,
          mimeType: photo.mimeType,
          isActiveForRating: photo.isActiveForRating,
          createdAt: photo.createdAt,
          updatedAt: photo.updatedAt,
        },
      });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
