import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

/**
 * Contexto de autenticación
 * @type {import('react').Context<AuthContextType>}
 */
const AuthContext = createContext(null);

/**
 * Hook personalizado para usar el contexto de autenticación
 * @returns {AuthContextType} Datos y funciones de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de autenticación
 * @param {Object} props - Props del componente
 * @param {import('react').ReactNode} props.children - Componentes hijos
 * @returns {import('react').JSX.Element}
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  /**
   * Verificar si hay un token almacenado al cargar la aplicación
   */
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Opcional: verificar el token obteniendo el perfil
      authService
        .getProfile()
        .then((data) => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @param {string} userData.name - Nombre del usuario
   * @param {string} userData.email - Email del usuario
   * @param {string} userData.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del registro
   */
  const register = async ({ name, email, password }) => {
    const data = await authService.register({ name, email, password });
    return data;
  };

  /**
   * Iniciar sesión
   * @param {Object} credentials - Credenciales del usuario
   * @param {string} credentials.email - Email del usuario
   * @param {string} credentials.password - Contraseña del usuario
   * @returns {Promise<Object>} Respuesta del login con token
   */
  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  /**
   * Cerrar sesión
   */
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
