'use strict';

require('module-alias/register');

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const apiRoutes = require('@src/routes/main');

const app = express();

// Basic request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} - ${ms}ms`);
  });
  next();
});

// Middlewares
app.use(cors());
// Use built-in body parsers. Limit 2mb; image (<=1MB decoded) is validated in controllers.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Routes
app.use('/api', apiRoutes);

// 404 for API
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler: return precise messages and details
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: {
      message: err.message || 'Internal Server Error',
      name: err.name || 'Error',
      code: err.code || null,
    },
  });
});

// DB connection (MongoDB via mongoose)
(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('Warning: MONGO_URI is not set. Please provide process.env.MONGO_URI to connect MongoDB.');
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }

  // Server start
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
