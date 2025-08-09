const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: 100,
      default: undefined,
    },
    points: {
      type: Number,
      default: 10,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
      default: undefined,
    },
    age: {
      type: Number,
      min: 0,
      max: 120,
      default: undefined,
    },
    filterSettings: {
      gender: {
        type: String,
        enum: ['male', 'female', 'other', 'any'],
        default: 'any',
      },
      ageFrom: { type: Number, min: 0, max: 120, default: null },
      ageTo: { type: Number, min: 0, max: 120, default: null },
    },
  },
  { timestamps: true }
);

UserSchema.methods.toSafeJSON = function toSafeJSON() {
  const fs = this.filterSettings || {};
  return {
    id: this._id.toString(),
    email: this.email,
    name: this.name || null,
    points: this.points,
    gender: this.gender || null,
    age: typeof this.age === 'number' ? this.age : null,
    filterSettings: {
      gender: fs.gender || 'any',
      ageFrom: typeof fs.ageFrom === 'number' ? fs.ageFrom : null,
      ageTo: typeof fs.ageTo === 'number' ? fs.ageTo : null,
    },
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('User', UserSchema);
