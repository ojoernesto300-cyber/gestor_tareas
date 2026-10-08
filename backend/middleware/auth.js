const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

/**
 * Middleware de autenticación para verificar tokens JWT
 * @param {import('express').Request} req - Objeto de solicitud Express
 * @param {import('express').Response} res - Objeto de respuesta Express
 * @param {import('express').NextFunction} next - Función next de Express
 * @returns {void}
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido o expirado' });
    }

    // Añadir el ID del usuario al objeto de solicitud
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  });
};

module.exports = { authenticateToken };
