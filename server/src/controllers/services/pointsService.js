'use strict';

const User = require('@src/models/User');

async function addPoint(userId, reason = 'generic_add') {
  try {
    const updated = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: 1 } },
      { new: true }
    );

    if (!updated) {
      const err = new Error('User not found for addPoint');
      err.status = 404;
      throw err;
    }

    return updated;
  } catch (error) {
    throw error;
  }
}

async function deductPoint(userId, reason = 'generic_deduct') {
  try {
    const updated = await User.findOneAndUpdate(
      { _id: userId, points: { $gte: 1 } },
      { $inc: { points: -1 } },
      { new: true }
    );

    if (!updated) {
      const err = new Error('Insufficient points or user not found for deductPoint');
      err.status = 400;
      throw err;
    }

    return updated;
  } catch (error) {
    throw error;
  }
}

async function requireAtLeastOnePoint(userId) {
  try {
    const user = await User.findById(userId).select('points');
    if (!user) {
      const err = new Error('User not found for requireAtLeastOnePoint');
      err.status = 404;
      throw err;
    }

    if ((user.points || 0) < 1) {
      const err = new Error('Insufficient points');
      err.status = 400;
      throw err;
    }

    return true;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  addPoint,
  deductPoint,
  requireAtLeastOnePoint,
};
