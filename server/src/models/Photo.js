'use strict';

const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    data: { type: String, required: true }, // base64 only, size validated in controller (<= 1MB)
    mimeType: { type: String, default: '' },
    isActiveForRating: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model('Photo', photoSchema);
