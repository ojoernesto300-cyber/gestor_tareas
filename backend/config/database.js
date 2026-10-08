const { Pool } = require('pg');
require('dotenv').config();

/**
 * Configuración del pool de conexiones a PostgreSQL
 * @type {Pool}
 */
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

/**
 * Prueba la conexión a la base de datos
 * @returns {Promise<void>}
 */
const testConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('✅ Conexión a PostgreSQL establecida correctamente');
  } catch (error) {
    console.error('❌ Error al conectar a PostgreSQL:', error.message);
    process.exit(1);
  }
};

module.exports = { pool, testConnection };
