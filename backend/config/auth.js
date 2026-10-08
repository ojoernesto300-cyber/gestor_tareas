require('dotenv').config();

/**
 * Clave secreta para firmar los tokens JWT
 * @type {string}
 */
const JWT_SECRET = process.env.JWT_SECRET || 'clave-secreta-por-defecto-cambiar-en-produccion';

/**
 * Tiempo de expiración del token de acceso
 * @type {string}
 */
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

module.exports = { JWT_SECRET, JWT_EXPIRES_IN };
