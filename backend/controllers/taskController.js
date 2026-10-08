const { pool } = require('../config/database');

/**
 * Controlador para obtener todas las tareas del usuario autenticado
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );

    res.json({ tasks: result.rows });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};

/**
 * Controlador para obtener una tarea específica por ID
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    res.json({ task: result.rows[0] });
  } catch (error) {
    console.error('Error al obtener tarea:', error);
    res.status(500).json({ error: 'Error al obtener tarea' });
  }
};

/**
 * Controlador para crear una nueva tarea
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const result = await pool.query(
      'INSERT INTO tasks (user_id, title, description, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.userId, title, description || null, status || 'pendiente']
    );

    res.status(201).json({
      message: 'Tarea creada exitosamente',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

/**
 * Controlador para actualizar una tarea existente
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    // Verificar que la tarea pertenece al usuario
    const taskExists = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (taskExists.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), status = COALESCE($3, status), updated_at = NOW() WHERE id = $4 RETURNING *',
      [title, description, status, id]
    );

    res.json({
      message: 'Tarea actualizada exitosamente',
      task: result.rows[0],
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

/**
 * Controlador para eliminar una tarea
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @returns {Promise<void>}
 */
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que la tarea pertenece al usuario
    const taskExists = await pool.query(
      'SELECT id FROM tasks WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (taskExists.rows.length === 0) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [id]);

    res.json({ message: 'Tarea eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error al eliminar tarea' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
