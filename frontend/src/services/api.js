import axios from 'axios';

/**
 * URL de la API del backend (configurada mediante variable de entorno)
 * @type {string}
 */
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Instancia de axios configurada para comunicarse con la API del backend
 * @type {import('axios').AxiosInstance}
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Interceptor para añadir el token JWT a las solicitudes
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Servicio de autenticación
 */
export const authService = {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del servidor
   */
  register: async ({ name, email, password }) => {
    const response = await api.post('/auth/register', { name, email, password });
    return response.data;
  },

  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del servidor con token
   */
  login: async ({ email, password }) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  /**
   * Obtener el perfil del usuario autenticado
   * @returns {Promise<Object>} Datos del perfil
   */
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

/**
 * Servicio de tareas
 */
export const taskService = {
  /**
   * Obtener todas las tareas del usuario
   * @returns {Promise<Array>} Lista de tareas
   */
  getAll: async () => {
    const response = await api.get('/tasks');
    return response.data.tasks;
  },

  /**
   * Crear una nueva tarea
   * @param {Object} taskData - Datos de la tarea
   * @param {string} taskData.title - Título de la tarea
   * @param {string} [taskData.description] - Descripción de la tarea
   * @param {string} [taskData.status] - Estado de la tarea (pendiente, en_progreso, completada)
   * @returns {Promise<Object>} Tarea creada
   */
  create: async ({ title, description, status }) => {
    const response = await api.post('/tasks', { title, description, status });
    return response.data.task;
  },

  /**
   * Actualizar una tarea existente
   * @param {number} id - ID de la tarea
   * @param {Object} taskData - Datos a actualizar
   * @param {string} [taskData.title] - Título de la tarea
   * @param {string} [taskData.description] - Descripción de la tarea
   * @param {string} [taskData.status] - Estado de la tarea
   * @returns {Promise<Object>} Tarea actualizada
   */
  update: async (id, { title, description, status }) => {
    const response = await api.put(`/tasks/${id}`, { title, description, status });
    return response.data.task;
  },

  /**
   * Eliminar una tarea
   * @param {number} id - ID de la tarea
   * @returns {Promise<Object>} Respuesta del servidor
   */
  delete: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};

export default api;
