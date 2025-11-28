// src/routes/tasks.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasksController');

// List tasks
router.get('/', tasksController.listTasks);

// Create task
router.post('/', tasksController.createTask);

// Get task
router.get('/:id', tasksController.getTask);

// Update
router.patch('/:id', tasksController.updateTask);

// Delete
router.delete('/:id', tasksController.deleteTask);

module.exports = router;
