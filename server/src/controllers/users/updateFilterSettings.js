'use strict';

const User = require('@src/models/User');

const ALLOWED_FILTER_GENDERS = ['any', 'male', 'female', 'other'];

function validateAndNormalizeFilterGender(value) {
  if (typeof value === 'undefined') return { action: 'ignore' };
  if (value === null) return { action: 'set', value: 'any' };
  if (typeof value !== 'string' || !ALLOWED_FILTER_GENDERS.includes(value)) {
    throw new Error('Field "gender" must be one of: any, male, female, other, or null');
  }
  return { action: 'set', value };
}

function validateAndNormalizeAgeBound(fieldName, value) {
  if (typeof value === 'undefined') return { action: 'ignore' };
  if (value === null) return { action: 'unset' };
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new Error(`Field "${fieldName}" must be an integer, null, or omitted`);
  }
  if (value < 0 || value > 120) {
    throw new Error(`Field "${fieldName}" must be between 0 and 120`);
  }
  return { action: 'set', value };
}

module.exports = async function updateFilterSettings(req, res) {
  try {
    const { gender, ageFrom, ageTo } = req.body || {};

    const normGender = validateAndNormalizeFilterGender(gender);
    const normFrom = validateAndNormalizeAgeBound('ageFrom', ageFrom);
    const normTo = validateAndNormalizeAgeBound('ageTo', ageTo);

    if (
      normGender.action === 'ignore' &&
      normFrom.action === 'ignore' &&
      normTo.action === 'ignore'
    ) {
      return res.status(400).json({ error: 'No updatable fields provided. Allowed: gender, ageFrom, ageTo' });
    }

    // Prepare temporary values to validate logical constraint ageFrom <= ageTo
    // We need current settings to compare when one side is omitted
    const current = req.user.filterSettings || {};
    const nextAgeFrom = normFrom.action === 'set' ? normFrom.value : (normFrom.action === 'unset' ? null : (typeof current.ageFrom === 'number' ? current.ageFrom : null));
    const nextAgeTo = normTo.action === 'set' ? normTo.value : (normTo.action === 'unset' ? null : (typeof current.ageTo === 'number' ? current.ageTo : null));

    if (typeof nextAgeFrom === 'number' && typeof nextAgeTo === 'number') {
      if (nextAgeFrom > nextAgeTo) {
        return res.status(400).json({ error: 'Validation error: ageFrom must be less than or equal to ageTo' });
      }
    }

    const $set = {};
    const $unset = {};

    if (normGender.action === 'set') $set['filterSettings.gender'] = normGender.value;

    if (normFrom.action === 'set') $set['filterSettings.ageFrom'] = normFrom.value;
    if (normFrom.action === 'unset') $unset['filterSettings.ageFrom'] = '';

    if (normTo.action === 'set') $set['filterSettings.ageTo'] = normTo.value;
    if (normTo.action === 'unset') $unset['filterSettings.ageTo'] = '';

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
