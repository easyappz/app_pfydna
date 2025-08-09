'use strict';

const User = require('@src/models/User');

const ALLOWED_GENDERS = ['male', 'female', 'other'];

function validateAndNormalizeName(value) {
  if (value === null) return { action: 'unset' };
  if (typeof value === 'undefined') return { action: 'ignore' };
  if (typeof value !== 'string') {
    throw new Error('Field "name" must be a string, null, or omitted');
  }
  const v = value.trim();
  if (v.length === 0) return { action: 'unset' };
  if (v.length > 100) {
    throw new Error('Field "name" length must be <= 100 characters');
  }
  return { action: 'set', value: v };
}

function validateAndNormalizeGender(value) {
  if (value === null) return { action: 'unset' };
  if (typeof value === 'undefined') return { action: 'ignore' };
  if (typeof value !== 'string' || !ALLOWED_GENDERS.includes(value)) {
    throw new Error('Field "gender" must be one of: male, female, other, null, or omitted');
  }
  return { action: 'set', value };
}

function validateAndNormalizeAge(value) {
  if (value === null) return { action: 'unset' };
  if (typeof value === 'undefined') return { action: 'ignore' };
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error('Field "age" must be an integer, null, or omitted');
  }
  if (value < 0 || value > 120) {
    throw new Error('Field "age" must be between 0 and 120');
  }
  return { action: 'set', value };
}

module.exports = async function updateMe(req, res) {
  try {
    const { name, gender, age } = req.body || {};

    const normName = validateAndNormalizeName(name);
    const normGender = validateAndNormalizeGender(gender);
    const normAge = validateAndNormalizeAge(age);

    if (
      normName.action === 'ignore' &&
      normGender.action === 'ignore' &&
      normAge.action === 'ignore'
    ) {
      return res.status(400).json({ error: 'No updatable fields provided. Allowed: name, gender, age' });
    }

    const $set = {};
    const $unset = {};

    if (normName.action === 'set') $set.name = normName.value;
    if (normName.action === 'unset') $unset.name = '';

    if (normGender.action === 'set') $set.gender = normGender.value;
    if (normGender.action === 'unset') $unset.gender = '';

    if (normAge.action === 'set') $set.age = normAge.value;
    if (normAge.action === 'unset') $unset.age = '';

    const update = {};
    if (Object.keys($set).length) update.$set = $set;
    if (Object.keys($unset).length) update.$unset = $unset;

    const updated = await User.findByIdAndUpdate(req.user._id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ user: updated.toSafeJSON() });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
