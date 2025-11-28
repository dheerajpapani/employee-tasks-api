// src/routes/employees.js
const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employeesController');

// List employees with pagination and optional filters
router.get('/', employeesController.listEmployees);

// Create
router.post('/', employeesController.createEmployee);

// Get by id
router.get('/:id', employeesController.getEmployee);

// Patch / update
router.patch('/:id', employeesController.updateEmployee);

// Delete
router.delete('/:id', employeesController.deleteEmployee);

// List tasks for an employee
router.get('/:id/tasks', employeesController.getEmployeeTasks);

module.exports = router;
