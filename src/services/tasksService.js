// src/services/tasksService.js
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/client');
const { DEFAULT_PAGE_SIZE, MAX_LIMIT } = require('../config');

const TASK_COL = 'tasks';
const EMP_COL = 'employees';

async function createTask(payload) {
  const db = getDb();
  // Validate assignee exists
  const assigneeId = payload.assignee;
  const assigneeObj = new ObjectId(assigneeId);
  const employee = await db.collection(EMP_COL).findOne({ _id: assigneeObj });
  if (!employee) {
    const err = new Error('Assignee (employee) not found');
    err.statusCode = 400;
    throw err;
  }

  const doc = {
    title: payload.title,
    description: payload.description || '',
    assignee: assigneeObj,
    status: payload.status || 'todo',
    priority: payload.priority || 'medium',
    dueDate: payload.dueDate ? new Date(payload.dueDate) : null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const result = await db.collection(TASK_COL).insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

async function findTasks({ page = 1, limit = DEFAULT_PAGE_SIZE, status, assignee, priority } = {}) {
  const db = getDb();
  limit = Math.min(limit || DEFAULT_PAGE_SIZE, MAX_LIMIT);
  page = Math.max(1, Number(page || 1));
  const skip = (page - 1) * limit;
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (assignee) {
    if (!ObjectId.isValid(assignee)) throw new Error('Invalid assignee id');
    filter.assignee = new ObjectId(assignee);
  }

  const cursor = db.collection(TASK_COL).find(filter).skip(skip).limit(limit);
  const [data, total] = await Promise.all([cursor.toArray(), db.collection(TASK_COL).countDocuments(filter)]);
  return { data, page, totalPages: Math.ceil(total / limit), total };
}

async function findTaskById(id) {
  const db = getDb();
  return db.collection(TASK_COL).findOne({ _id: new ObjectId(id) });
}

async function updateTaskById(id, update) {
  const db = getDb();
  if (update.assignee && !ObjectId.isValid(update.assignee)) {
    const err = new Error('Invalid assignee id');
    err.statusCode = 400;
    throw err;
  }
  if (update.assignee) update.assignee = new ObjectId(update.assignee);
  update.updatedAt = new Date();
  const result = await db.collection(TASK_COL).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: 'after' }
  );
  return result.value;
}

async function deleteTaskById(id) {
  const db = getDb();
  const result = await db.collection(TASK_COL).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = {
  createTask,
  findTasks,
  findTaskById,
  updateTaskById,
  deleteTaskById
};
