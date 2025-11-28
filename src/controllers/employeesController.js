// src/controllers/employeesController.js
const { ObjectId } = require('mongodb');
const {
  createEmployee: createEmployeeService,
  findEmployees,
  findEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
  findTasksByAssignee
} = require('../services/employeesService');
const { ApiError } = require('../utils/errors');

// GET /api/employees
async function listEmployees(req, res, next) {
  try {
    const { page = 1, limit, department, q, sortBy } = req.query;

    const result = await findEmployees({
      page: Number(page),
      limit: limit ? Number(limit) : undefined,
      department,
      q,
      sortBy
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

// POST /api/employees
async function createEmployee(req, res, next) {
  try {
    const { firstName, lastName, email, position, department } = req.body;

    // Validation (stronger)
    if (!firstName?.trim()) throw new ApiError(400, 'First name is required');
    if (!lastName?.trim()) throw new ApiError(400, 'Last name is required');
    if (!email?.trim() || !email.includes('@')) throw new ApiError(400, 'Valid email required');

    if (position && position.length > 50) throw new ApiError(400, 'Position too long');
    if (department && department.length > 50) throw new ApiError(400, 'Department too long');

    const emp = await createEmployeeService({
      firstName,
      lastName,
      email,
      position,
      department
    });

    res.status(201).json(emp);
  } catch (err) {
    // handle duplicate email index error
    if (err && err.code === 11000) {
      return next(new ApiError(400, 'Email already exists'));
    }
    next(err);
  }
}

// GET /api/employees/:id
async function getEmployee(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const emp = await findEmployeeById(id);
    if (!emp) {
      return next(new ApiError(404, 'Employee not found'));
    }

    res.json(emp);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/employees/:id
async function updateEmployee(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const update = req.body;
    const updated = await updateEmployeeById(id, update);

    if (!updated) {
      return next(new ApiError(404, 'Employee not found'));
    }

    res.json(updated);
  } catch (err) {
    if (err && err.code === 11000) {
      return next(new ApiError(400, 'Email already exists'));
    }
    next(err);
  }
}

// DELETE /api/employees/:id
async function deleteEmployee(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const deleted = await deleteEmployeeById(id);
    if (!deleted) {
      return next(new ApiError(404, 'Employee not found'));
    }

    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

// GET /api/employees/:id/tasks
async function getEmployeeTasks(req, res, next) {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      throw new ApiError(400, 'Invalid id');
    }

    const page = Number(req.query.page || 1);
    const limit = req.query.limit ? Number(req.query.limit) : 50;

    const result = await findTasksByAssignee(id, { page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listEmployees,
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeTasks
};
