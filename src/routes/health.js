// src/routes/health.js
const express = require('express');
const router = express.Router();
const { getDb } = require('../db/client');

router.get('/', async (req, res) => {
  try {
    const db = getDb();
    // ping DB
    await db.command({ ping: 1 });
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', db: 'disconnected', message: err.message });
  }
});

module.exports = router;
