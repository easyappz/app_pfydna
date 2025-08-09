const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    data: { type: String, required: true }, // base64
    mimeType: { type: String, default: null },
    isActiveForRating: { type: Boolean, default: false, index: true },
    // legacy flag kept for backward compatibility
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', PhotoSchema);
