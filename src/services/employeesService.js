// src/services/employeesService.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/client');
const { DEFAULT_PAGE_SIZE, MAX_LIMIT } = require('../config');

const EMP_COL = 'employees';
const TASK_COL = 'tasks';

async function createEmployee(payload) {
  const db = getDb();
  const doc = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    position: payload.position || '',
    department: payload.department || '',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  const result = await db.collection(EMP_COL).insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

async function findEmployees({ page = 1, limit = DEFAULT_PAGE_SIZE, department, q, sortBy } = {}) {
  const db = getDb();
  limit = Math.min(limit || DEFAULT_PAGE_SIZE, MAX_LIMIT);
  page = Math.max(1, Number(page || 1));
  const skip = (page - 1) * limit;

  const filter = {};
  if (department) filter.department = department;
  if (q) {
    filter.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } }
    ];
  }

  const cursor = db.collection(EMP_COL).find(filter).skip(skip).limit(limit);
  if (sortBy) cursor.sort({ [sortBy]: 1 });

  const [data, total] = await Promise.all([cursor.toArray(), db.collection(EMP_COL).countDocuments(filter)]);
  const totalPages = Math.ceil(total / limit);
  return { data, page, totalPages, total };
}

async function findEmployeeById(id) {
  const db = getDb();
  return db.collection(EMP_COL).findOne({ _id: new ObjectId(id) });
}

async function updateEmployeeById(id, update) {
  const db = getDb();
  update.updatedAt = new Date();
  const result = await db.collection(EMP_COL).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  );
  return result.value;
}

async function deleteEmployeeById(id) {
  const db = getDb();
  const result = await db.collection(EMP_COL).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

async function findTasksByAssignee(assigneeId, { page = 1, limit = DEFAULT_PAGE_SIZE } = {}) {
  const db = getDb();
  limit = Math.min(limit || DEFAULT_PAGE_SIZE, MAX_LIMIT);
  page = Math.max(1, Number(page || 1));
  const skip = (page - 1) * limit;

  const filter = { assignee: new ObjectId(assigneeId) };
  const cursor = db.collection(TASK_COL).find(filter).skip(skip).limit(limit);
  const [data, total] = await Promise.all([cursor.toArray(), db.collection(TASK_COL).countDocuments(filter)]);
  return { data, page, totalPages: Math.ceil(total / limit), total };
}

module.exports = {
  createEmployee,
  findEmployees,
  findEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  findTasksByAssignee
};
