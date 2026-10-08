const express = require('express');
const router = express.Router();
const {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/auth');
const {
  taskValidation,
  handleValidationErrors,
} = require('../middleware/validate');

/**
 * @route   GET /api/tasks
 * @desc    Obtener todas las tareas del usuario
 * @access  Privado (requiere token)
 */
router.get('/', authenticateToken, getAllTasks);

/**
 * @route   GET /api/tasks/:id
 * @desc    Obtener una tarea específica
 * @access  Privado (requiere token)
 */
router.get('/:id', authenticateToken, getTaskById);

/**
 * @route   POST /api/tasks
 * @desc    Crear una nueva tarea
 * @access  Privado (requiere token)
 */
router.post('/', authenticateToken, taskValidation, handleValidationErrors, createTask);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Actualizar una tarea existente
 * @access  Privado (requiere token)
 */
router.put('/:id', authenticateToken, taskValidation, handleValidationErrors, updateTask);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Eliminar una tarea
 * @access  Privado (requiere token)
 */
router.delete('/:id', authenticateToken, deleteTask);

module.exports = router;
