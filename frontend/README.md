# Frontend - Gestor de Tareas

Aplicación React + Vite para el gestor de tareas con autenticación.

## Stack Tecnológico

- **React** - Biblioteca UI
- **Vite** - Herramienta de build
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado de autenticación

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx  # Componente para rutas protegidas
│   ├── context/
│   │   └── AuthContext.jsx      # Contexto de autenticación
│   ├── pages/
│   │   ├── Login.jsx            # Página de inicio de sesión
│   │   ├── Register.jsx         # Página de registro
│   │   └── Tasks.jsx            # Página de gestión de tareas
│   ├── services/
│   │   └── api.js               # Servicio API con axios
│   ├── App.jsx                  # Componente principal
│   ├── main.jsx                 # Punto de entrada
│   └── index.css                # Estilos globales
├── package.json
└── vite.config.js
```

## Instalación

Las dependencias ya están instaladas. Si necesitas reinstalar:

```bash
npm install
```

## Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Crear build de producción
- `npm run preview` - Previsualizar build de producción

## Configuración

El frontend está configurado para conectarse al backend en `http://localhost:3000/api`.

Si necesitas cambiar la URL, modifica `baseURL` en `src/services/api.js`.

## Funcionalidades

### Autenticación

- **Registro**: Crear cuenta con nombre, email y contraseña
- **Login**: Iniciar sesión con email y contraseña
- **Logout**: Cerrar sesión (elimina token de localStorage)
- **Protección de rutas**: La página de tareas requiere autenticación

### Gestión de Tareas

- **Crear tarea**: Título, descripción opcional, estado (pendiente, en_progreso, completada)
- **Ver tareas**: Lista de todas las tareas del usuario
- **Editar tarea**: Modificar título, descripción y estado
- **Eliminar tarea**: Eliminar tarea con confirmación
- **Estados visuales**: Colores diferentes según el estado de la tarea

## Uso

1. Asegúrate de que el backend esté corriendo en `http://localhost:3000`
2. Inicia el frontend:
```bash
npm run dev
```
3. Abre `http://localhost:5173` en tu navegador
4. Regístrate o inicia sesión
5. Gestiona tus tareas

## Estado de Autenticación

El token JWT se guarda en `localStorage` bajo la clave `token`.
El contexto `AuthContext` gestiona el estado de autenticación globalmente.
