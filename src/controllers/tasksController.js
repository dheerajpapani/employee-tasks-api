// src/controllers/tasksController.js
const { ObjectId } = require('mongodb');
const {
  createTask: createTaskService,
  findTasks,
  findTaskById,
  updateTaskById,
  deleteTaskById
} = require('../services/tasksService');
const { ApiError } = require('../utils/errors');

// GET /api/tasks
async function listTasks(req, res, next) {
  try {
    const { page = 1, limit, status, assignee, priority } = req.query;

    const result = await findTasks({
      page: Number(page),
      limit: limit ? Number(limit) : undefined,
      status,
      assignee,
      priority
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/tasks
async function createTask(req, res, next) {
  try {
    const {
      title,
      description,
      assignee,
      status = 'todo',
      priority = 'medium',
      dueDate
    } = req.body;

    if (!title?.trim()) throw new ApiError(400, 'Task title required');
    if (!assignee) throw new ApiError(400, 'Assignee id required');
    if (!ObjectId.isValid(assignee)) throw new ApiError(400, 'Invalid assignee id');

    const validStatuses = ['todo', 'in-progress', 'done'];
    if (!validStatuses.includes(status)) throw new ApiError(400, 'Invalid status');

    const validPriority = ['low', 'medium', 'high'];
    if (!validPriority.includes(priority)) throw new ApiError(400, 'Invalid priority');

    const created = await createTaskService({
      title,
      description,
      assignee,
      status,
      priority,
      dueDate
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
}

// GET /api/tasks/:id
async function getTask(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const task = await findTaskById(id);
    if (!task) {
      return next(new ApiError(404, 'Task not found'));
    }

    res.json(task);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/tasks/:id
async function updateTask(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const updated = await updateTaskById(id, req.body);
    if (!updated) {
      return next(new ApiError(404, 'Task not found'));
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/tasks/:id
async function deleteTask(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const deleted = await deleteTaskById(id);
    if (!deleted) {
      return next(new ApiError(404, 'Task not found'));
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask
};
