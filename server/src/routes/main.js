const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const authRegister = require('@src/controllers/authRegister');
const authLogin = require('@src/controllers/authLogin');
const authMe = require('@src/controllers/authMe');
const authRequestReset = require('@src/controllers/authRequestReset');
const authResetPassword = require('@src/controllers/authResetPassword');
const authMiddleware = require('@src/controllers/middlewares/auth');

const ratePhoto = require('@src/controllers/points/ratePhoto');
const activatePhoto = require('@src/controllers/photos/activatePhoto');

const router = express.Router();

// Serve API schema for frontend integration
router.get('/schema', async (req, res) => {
  try {
    const schemaPath = path.join(process.cwd(), 'server', 'src', 'api_schema.yaml');
    const text = fs.readFileSync(schemaPath, 'utf8');
    res.setHeader('Content-Type', 'text/yaml');
    return res.send(text);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// Health endpoints (examples)
router.get('/hello', async (req, res) => {
  try {
    res.json({ message: 'Hello from API!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Auth routes
router.post('/auth/register', authRegister);
router.post('/auth/login', authLogin);
router.get('/auth/me', authMiddleware, authMe);
router.post('/auth/request-reset', authRequestReset);
router.post('/auth/reset-password', authResetPassword);

// Points & Photos
router.post('/points/rate', authMiddleware, ratePhoto);
router.post('/photos/activate', authMiddleware, activatePhoto);

module.exports = router;
