# Gestor de Tareas

Aplicación web completa para gestión de tareas personales con autenticación de usuarios. Permite crear, editar, eliminar y organizar tareas con diferentes estados (pendiente, en progreso, completada).

## 📋 Descripción

El Gestor de Tareas es una aplicación full-stack que combina:

- **Backend**: API REST con Node.js, Express y PostgreSQL (Supabase)
- **Frontend**: Aplicación React con Vite y diseño responsive
- **Autenticación**: Sistema de registro/login con JWT
- **Gestión de tareas**: CRUD completo con estados visuales y contadores

## 🛠 Tecnologías

### Backend
- **Node.js** - Runtime de JavaScript
- **Express** - Framework web
- **PostgreSQL** (Supabase) - Base de datos relacional
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos
- **cors** - Habilitación de CORS
- **dotenv** - Gestión de variables de entorno

### Frontend
- **React** - Biblioteca UI
- **Vite** - Herramienta de build y desarrollo
- **React Router** - Enrutamiento
- **Axios** - Cliente HTTP
- **Context API** - Gestión de estado global

## 📁 Estructura del Proyecto

```
gestor_tareas/
├── backend/                      # API REST
│   ├── config/
│   │   ├── auth.js              # Configuración JWT
│   │   └── database.js          # Configuración PostgreSQL
│   ├── controllers/
│   │   ├── authController.js    # Lógica de autenticación
│   │   └── taskController.js    # Lógica de tareas
│   ├── middleware/
│   │   ├── auth.js              # Middleware de autenticación JWT
│   │   └── validate.js          # Middleware de validación
│   ├── routes/
│   │   ├── authRoutes.js        # Rutas de autenticación
│   │   └── taskRoutes.js        # Rutas de tareas
│   ├── database/
│   │   └── init.sql             # Script de inicialización BD
│   ├── index.js                 # Punto de entrada
│   ├── package.json
│   └── .env.example             # Plantilla de variables de entorno
│
├── frontend/                     # Aplicación React
│   ├── src/
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx # Rutas protegidas
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Contexto de autenticación
│   │   ├── pages/
│   │   │   ├── Login.jsx         # Página de login
│   │   │   ├── Register.jsx      # Página de registro
│   │   │   └── Tasks.jsx         # Página de gestión de tareas
│   │   ├── services/
│   │   │   └── api.js            # Cliente axios
│   │   ├── App.jsx               # Componente principal
│   │   ├── main.jsx              # Punto de entrada
│   │   └── index.css             # Estilos globales
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## 🚀 Instalación

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Cuenta de Supabase (para PostgreSQL)

### 1. Configuración del Backend

1. **Navegar al directorio del backend**:
```bash
cd backend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de Supabase:
```env
# Configuración de la base de datos PostgreSQL (Supabase)
DB_HOST=tu-host-supabase.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=tu-usuario-supabase
DB_PASSWORD=tu-password-supabase

# Configuración de JWT
JWT_SECRET=tu-clave-secreta-muy-segura-cambiar-en-produccion
JWT_EXPIRES_IN=24h

# Configuración del servidor
PORT=3000
NODE_ENV=development

# URL del frontend para CORS
# Desarrollo: http://localhost:5173
# Producción: https://tu-frontend.com
FRONTEND_URL=http://localhost:5173
```

4. **Inicializar la base de datos**:
   - Ve al [SQL Editor](https://supabase.com/dashboard/project/_/sql) de tu proyecto Supabase
   - Ejecuta el contenido del archivo `backend/database/init.sql`

5. **Iniciar el servidor**:
```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El backend estará disponible en `http://localhost:3000`

### 2. Configuración del Frontend

1. **Navegar al directorio del frontend**:
```bash
cd frontend
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
```bash
cp .env.example .env
```

Edita el archivo `.env` con la URL de tu API:
```env
# URL de la API del backend
# Desarrollo: http://localhost:3000/api
# Producción: https://tu-backend.com/api
VITE_API_URL=http://localhost:3000/api
```

4. **Iniciar el servidor de desarrollo**:
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

## 🔌 Endpoints de la API

### Autenticación

#### Registrar usuario
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "Clave12345"
}
```

**Respuesta exitosa** (201):
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez"
  }
}
```

#### Iniciar sesión
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@example.com",
  "password": "Clave12345"
}
```

**Respuesta exitosa** (200):
```json
{
  "message": "Inicio de sesión exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez"
  }
}
```

#### Obtener perfil (Requiere token)
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

**Respuesta exitosa** (200):
```json
{
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "created_at": "2026-10-08T12:00:00.000Z"
  }
}
```

### Tareas (Todas requieren token)

#### Obtener todas las tareas
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Respuesta exitosa** (200):
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Mi primera tarea",
      "description": "Descripción de la tarea",
      "status": "pendiente",
      "created_at": "2026-10-08T12:00:00.000Z",
      "updated_at": "2026-10-08T12:00:00.000Z"
    }
  ]
}
```

#### Obtener una tarea específica
```http
GET /api/tasks/:id
Authorization: Bearer <token>
```

#### Crear una nueva tarea
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Nueva tarea",
  "description": "Descripción opcional",
  "status": "pendiente"
}
```

**Respuesta exitosa** (201):
```json
{
  "message": "Tarea creada exitosamente",
  "task": {
    "id": 2,
    "user_id": 1,
    "title": "Nueva tarea",
    "description": "Descripción opcional",
    "status": "pendiente",
    "created_at": "2026-10-08T12:00:00.000Z",
    "updated_at": "2026-10-08T12:00:00.000Z"
  }
}
```

#### Actualizar una tarea
```http
PUT /api/tasks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Título actualizado",
  "description": "Descripción actualizada",
  "status": "completada"
}
```

**Respuesta exitosa** (200):
```json
{
  "message": "Tarea actualizada exitosamente",
  "task": {
    "id": 1,
    "user_id": 1,
    "title": "Título actualizado",
    "description": "Descripción actualizada",
    "status": "completada",
    "created_at": "2026-10-08T12:00:00.000Z",
    "updated_at": "2026-10-08T13:00:00.000Z"
  }
}
```

#### Eliminar una tarea
```http
DELETE /api/tasks/:id
Authorization: Bearer <token>
```

**Respuesta exitosa** (200):
```json
{
  "message": "Tarea eliminada exitosamente"
}
```

## 🎨 Características del Frontend

### Autenticación
- Registro de nuevos usuarios
- Inicio de sesión con email y contraseña
- Cierre de sesión
- Protección de rutas (solo usuarios autenticados pueden ver tareas)
- Token JWT almacenado en localStorage

### Gestión de Tareas
- **Lista de tareas**: Grid responsive con tarjetas coloridas según estado
- **Crear tareas**: Formulario con título, descripción y estado
- **Editar tareas**: Modificar cualquier atributo de la tarea
- **Eliminar tareas**: Con confirmación previa
- **Cambio rápido de estado**: Selector directo en cada tarjeta
- **Contadores**: Visualización de tareas por estado (Total, Pendientes, En Progreso, Completadas)
- **Estados visuales**:
  - 🟡 Pendiente: Tarjeta amarilla
  - 🔵 En Progreso: Tarjeta azul
  - 🟢 Completada: Tarjeta verde

### Diseño
- **Responsive**: Adaptado para móvil, tablet y desktop
- **Indicadores de carga**: Spinner animado durante operaciones
- **Mensajes de error**: Descriptivos y basados en respuestas del backend
- **Estado vacío**: Mensaje motivacional cuando no hay tareas
- **Transiciones suaves**: Efectos hover y animaciones

## 🔒 Seguridad

- Contraseñas encriptadas con bcrypt (10 rounds)
- Tokens JWT con expiración configurable (24h por defecto)
- Validación de datos en el backend con express-validator
- Middleware de autenticación en rutas protegidas
- Variables sensibles en `.env` (no incluidas en git)
- CORS configurado para permitir solicitudes del frontend

## 📝 Variables de Entorno

### Backend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de Supabase | `aws-0-us-east-1.pooler.supabase.com` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `DB_NAME` | Nombre de la base de datos | `postgres` |
| `DB_USER` | Usuario de Supabase | `postgres.xxxxx` |
| `DB_PASSWORD` | Contraseña de Supabase | `tu-password` |
| `JWT_SECRET` | Clave secreta para JWT | `clave-secreta-muy-segura` |
| `JWT_EXPIRES_IN` | Expiración del token | `24h` |
| `PORT` | Puerto del servidor | `3000` |
| `NODE_ENV` | Entorno | `development` o `production` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:5173` |

### Frontend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL de la API del backend | `http://localhost:3000/api` |

## 🧪 Testing Manual

### Probar el Backend con PowerShell

```powershell
# Registrar usuario
$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/register -ContentType "application/json" -Body '{"name":"Test User","email":"test@example.com","password":"Clave12345"}'

# Iniciar sesión
$r = Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/auth/login -ContentType "application/json" -Body '{"email":"test@example.com","password":"Clave12345"}'
$token = $r.token

# Obtener tareas
Invoke-RestMethod -Uri http://localhost:3000/api/tasks -Headers @{Authorization="Bearer $token"}

# Crear tarea
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/tasks -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body '{"title":"Mi tarea","description":"Descripción","status":"pendiente"}'

# Actualizar tarea
Invoke-RestMethod -Method Put -Uri http://localhost:3000/api/tasks/1 -Headers @{Authorization="Bearer $token"} -ContentType "application/json" -Body '{"status":"completada"}'

# Eliminar tarea
Invoke-RestMethod -Method Delete -Uri http://localhost:3000/api/tasks/1 -Headers @{Authorization="Bearer $token"}
```

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia ISC.

## 👤 Autor

Desarrollado como proyecto de gestión de tareas personales.

---

## 🌐 Despliegue en Producción

### Backend

1. **Configurar variables de entorno de producción**:
```env
NODE_ENV=production
PORT=3000
DB_HOST=tu-host-produccion.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=tu-usuario-produccion
DB_PASSWORD=tu-password-produccion
JWT_SECRET=tu-clave-secreta-muy-segura-produccion
JWT_EXPIRES_IN=24h
FRONTEND_URL=https://tu-frontend.com
```

2. **Construir y desplegar**:
```bash
cd backend
npm install
npm start
```

### Frontend

1. **Configurar variables de entorno de producción**:
```env
VITE_API_URL=https://tu-backend.com/api
```

2. **Construir para producción**:
```bash
cd frontend
npm install
npm run build
```

3. **Desplegar la carpeta `dist`** en tu servicio de hosting (Vercel, Netlify, etc.)

---

**Nota**: Para producción, asegúrate de:
- Usar variables de entorno seguras
- Configurar SSL/TLS
- Implementar rate limiting
- Usar una clave JWT secreta fuerte
- Configurar correctamente CORS para tu dominio (`FRONTEND_URL`)
- Habilitar logging y monitoreo
- Usar HTTPS en producción
