const express = require('express');
const mongoose = require('mongoose');

/**
 * Example mongoose model (commented)
 */
// const MongoTestSchema = new mongoose.Schema({
//   value: { type: String, required: true },
// });
// const MongoModelTest = mongoose.model('Test', MongoTestSchema);
// const newTest = new MongoModelTest({ value: 'test-value' });
// newTest.save();

const router = express.Router();

// GET /api/hello
router.get('/hello', async (req, res) => {
  try {
    res.json({ message: 'Hello from API!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/status
router.get('/status', async (req, res) => {
  try {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
