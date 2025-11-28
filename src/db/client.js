// src/db/client.js
const { MongoClient } = require('mongodb');
const { MONGODB_URI } = require('../config');

let client = null;
let db = null;

async function connectToMongo() {
  if (db) return db;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI not set in environment');
  }

  // For modern MongoDB Node driver (v5+), no need for useNewUrlParser/useUnifiedTopology
  client = new MongoClient(MONGODB_URI);

  await client.connect();

  // Use the database in the URI if present, else env override, else fallback
  const dbName = client.options?.dbName || process.env.MONGODB_DB || 'employee_tasks_db';
  db = client.db(dbName);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToMongo() first.');
  }
  return db;
}

function getClient() {
  if (!client) {
    throw new Error('MongoClient not initialized.');
  }
  return client;
}

async function closeMongo() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

module.exports = {
  connectToMongo,
  getDb,
  getClient,
  closeMongo
};
