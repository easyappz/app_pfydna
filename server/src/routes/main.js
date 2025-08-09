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

const uploadPhoto = require('@src/controllers/photos/uploadPhoto');
const getMyPhotos = require('@src/controllers/photos/getMyPhotos');
const toggleActiveForRating = require('@src/controllers/photos/toggleActiveForRating');

const getNextPhotoForRating = require('@src/controllers/ratings/getNextPhoto');
const createRating = require('@src/controllers/ratings/createRating');

// Users - profile & filters
const getUserProfile = require('@src/controllers/users/getMe');
const updateUserProfile = require('@src/controllers/users/updateMe');
const updateUserFilterSettings = require('@src/controllers/users/updateFilterSettings');

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

// Users - profile & filters
router.get('/users/me', authMiddleware, getUserProfile);
router.patch('/users/me', authMiddleware, updateUserProfile);
router.patch('/users/filter-settings', authMiddleware, updateUserFilterSettings);

// Points & Photos (existing)
router.post('/points/rate', authMiddleware, ratePhoto);
router.post('/photos/activate', authMiddleware, activatePhoto);

// Photos - new endpoints
router.post('/photos/upload', authMiddleware, uploadPhoto);
router.get('/photos/my', authMiddleware, getMyPhotos);
router.post('/photos/:photoId/toggle-active', authMiddleware, toggleActiveForRating);

// Ratings - new endpoints
router.get('/ratings/next', authMiddleware, getNextPhotoForRating);
router.post('/ratings', authMiddleware, createRating);

module.exports = router;
