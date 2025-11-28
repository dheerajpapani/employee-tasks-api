// src/config/index.js
require('dotenv').config();

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
const MONGODB_URI = process.env.MONGODB_URI || '';
const DEFAULT_PAGE_SIZE = 50;
const MAX_LIMIT = 500;

if (!MONGODB_URI) {
  console.warn('Warning: MONGODB_URI is not set. Set it in .env or Render environment variables.');
}

module.exports = {
  PORT,
  MONGODB_URI,
  DEFAULT_PAGE_SIZE,
  MAX_LIMIT
};
