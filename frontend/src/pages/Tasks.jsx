import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../services/api';

/**
 * Página de gestión de tareas
 * @returns {import('react').JSX.Element}
 */
const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pendiente',
  });
  const [error, setError] = useState('');

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Cargar tareas al montar el componente
   */
  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Cargar todas las tareas del usuario
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError('Error al cargar tareas');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calcular contador de tareas por estado
   * @returns {Object} Objeto con contadores por estado
   */
  const getCounters = () => {
    return {
      total: tasks.length,
      pendiente: tasks.filter((t) => t.status === 'pendiente').length,
      en_progreso: tasks.filter((t) => t.status === 'en_progreso').length,
      completada: tasks.filter((t) => t.status === 'completada').length,
    };
  };

  /**
   * Manejar cambios en el formulario
   * @param {import('react').ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>} e - Evento de cambio
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /**
   * Crear una nueva tarea
   * @param {import('react').FormEvent} e - Evento de envío
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await taskService.create(formData);
      setFormData({ title: '', description: '', status: 'pendiente' });
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear tarea');
    }
  };

  /**
   * Iniciar edición de una tarea
   * @param {Object} task - Tarea a editar
   */
  const startEdit = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
    });
    setShowForm(true);
  };

  /**
   * Actualizar una tarea existente
   * @param {import('react').FormEvent} e - Evento de envío
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await taskService.update(editingTask.id, formData);
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pendiente' });
      setShowForm(false);
      loadTasks();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al actualizar tarea');
    }
  };

  /**
   * Cancelar el formulario
   */
  const handleCancel = () => {
    setEditingTask(null);
    setFormData({ title: '', description: '', status: 'pendiente' });
    setShowForm(false);
    setError('');
  };

  /**
   * Cambiar el estado de una tarea directamente desde la tarjeta
   * @param {number} taskId - ID de la tarea
   * @param {string} newStatus - Nuevo estado
   */
  const handleStatusChange = async (taskId, newStatus) => {
    setUpdatingStatus(taskId);
    try {
      await taskService.update(taskId, { status: newStatus });
      loadTasks();
    } catch (err) {
      setError('Error al actualizar estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  /**
   * Eliminar una tarea
   * @param {number} id - ID de la tarea a eliminar
   */
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      return;
    }

    try {
      await taskService.delete(id);
      loadTasks();
    } catch (err) {
      setError('Error al eliminar tarea');
    }
  };

  /**
   * Cerrar sesión
   */
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  /**
   * Obtener clase CSS según el estado de la tarea
   * @param {string} status - Estado de la tarea
   * @returns {string} Clase CSS
   */
  const getStatusClass = (status) => {
    const statusClasses = {
      pendiente: 'status-pendiente',
      en_progreso: 'status-en-progreso',
      completada: 'status-completada',
    };
    return statusClasses[status] || '';
  };

  /**
   * Obtener clase CSS de la tarjeta según el estado
   * @param {string} status - Estado de la tarea
   * @returns {string} Clase CSS
   */
  const getCardClass = (status) => {
    const cardClasses = {
      pendiente: 'card-pendiente',
      en_progreso: 'card-en-progreso',
      completada: 'card-completada',
    };
    return cardClasses[status] || '';
  };

  const counters = getCounters();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Cargando tareas...</p>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <header className="tasks-header">
        <h1>Mis Tareas</h1>
        <div className="header-actions">
          <span className="user-info">Hola, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* Contadores de tareas */}
      <div className="counters-container">
        <div className="counter-card counter-total">
          <span className="counter-number">{counters.total}</span>
          <span className="counter-label">Total</span>
        </div>
        <div className="counter-card counter-pendiente">
          <span className="counter-number">{counters.pendiente}</span>
          <span className="counter-label">Pendientes</span>
        </div>
        <div className="counter-card counter-en-progreso">
          <span className="counter-number">{counters.en_progreso}</span>
          <span className="counter-label">En Progreso</span>
        </div>
        <div className="counter-card counter-completada">
          <span className="counter-number">{counters.completada}</span>
          <span className="counter-label">Completadas</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button
        className="create-button"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? 'Cancelar' : '+ Nueva Tarea'}
      </button>

      {showForm && (
        <div className="task-form-container">
          <h2>{editingTask ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <form onSubmit={editingTask ? handleUpdate : handleCreate}>
            <div className="form-group">
              <label htmlFor="title">Título</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                maxLength="200"
                placeholder="Escribe el título de la tarea"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Descripción</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength="1000"
                rows="3"
                placeholder="Describe los detalles de la tarea (opcional)"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Estado</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pendiente">Pendiente</option>
                <option value="en_progreso">En Progreso</option>
                <option value="completada">Completada</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit">
                {editingTask ? 'Actualizar' : 'Crear'}
              </button>
              <button type="button" onClick={handleCancel}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h2>No tienes tareas aún</h2>
            <p>¡Crea tu primera tarea para empezar a organizarte!</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className={`task-card ${getCardClass(task.status)}`}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`task-status ${getStatusClass(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </div>
              {task.description && (
                <p className="task-description">{task.description}</p>
              )}
              <div className="task-status-selector">
                <label>Estado:</label>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(task.id, e.target.value)}
                  disabled={updatingStatus === task.id}
                  className="status-select"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_progreso">En Progreso</option>
                  <option value="completada">Completada</option>
                </select>
                {updatingStatus === task.id && (
                  <span className="updating-indicator">⏳</span>
                )}
              </div>
              <div className="task-actions">
                <button onClick={() => startEdit(task)} className="edit-button">
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="delete-button"
                >
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Tasks;
