const mongoose = require('mongoose');

const PhotoSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    data: { type: String, required: true }, // base64
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Photo', PhotoSchema);
