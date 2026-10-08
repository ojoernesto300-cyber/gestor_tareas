const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @param {import('express').NextFunction} next - Función next de Express
 * @returns {void}
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

/**
 * Reglas de validación para el registro de usuario
 * @type {Array}
 */
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio'),
];

/**
 * Reglas de validación para el inicio de sesión
 * @type {Array}
 */
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria'),
];

/**
 * Reglas de validación para crear/actualizar tareas
 * @type {Array}
 */
const taskValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título es obligatorio')
    .isLength({ max: 200 })
    .withMessage('El título no puede exceder 200 caracteres'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  body('status')
    .optional()
    .isIn(['pendiente', 'en_progreso', 'completada'])
    .withMessage('El estado debe ser: pendiente, en_progreso o completada'),
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  taskValidation,
};
