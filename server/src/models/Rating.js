'use strict';

const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema(
  {
    photoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Photo', required: true, index: true },
    raterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Rating value must be an integer between 1 and 5',
      },
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: false }, versionKey: false }
);

// Prevent duplicate rating from the same user for the same photo
ratingSchema.index({ photoId: 1, raterId: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);
