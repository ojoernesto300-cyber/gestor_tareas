const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { pool, testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

/**
 * Inicializar la aplicación Express
 * @type {import('express').Express}
 */
const app = express();

/**
 * Puerto en el que se ejecutará el servidor
 * @type {number}
 */
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

/**
 * Ruta de health check
 * @route   GET /
 * @desc    Verificar que el servidor está funcionando
 */
app.get('/', (req, res) => {
  res.json({ message: 'API del Gestor de Tareas funcionando correctamente' });
});

/**
 * Middleware para manejar rutas no encontradas
 */
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

/**
 * Middleware para manejar errores globales
 */
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

/**
 * Iniciar el servidor
 */
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    await testConnection();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
      console.log(`📡 API disponible en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await pool.end();
  process.exit(0);
});

startServer();

module.exports = app;
