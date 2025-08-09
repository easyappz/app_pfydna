'use strict';

const mongoose = require('mongoose');

const filterSettingsSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ['any', 'male', 'female', 'other'],
      default: 'any',
    },
    ageFrom: { type: Number, default: null },
    ageTo: { type: Number, default: null },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, default: '' },
    gender: {
      type: String,
      default: null,
      validate: {
        validator: (v) => v === null || ['male', 'female', 'other'].includes(v),
        message: 'Invalid gender value',
      },
    },
    age: { type: Number, default: null },
    points: { type: Number, default: 10 },
    filterSettings: { type: filterSettingsSchema, default: () => ({}) },
  },
  { versionKey: false }
);

userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
