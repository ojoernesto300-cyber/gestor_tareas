# Backend - Gestor de Tareas

API REST para el gestor de tareas con autenticación JWT.

## Stack Tecnológico

- **Node.js** + **Express** - Framework web
- **PostgreSQL** (Supabase) - Base de datos
- **JWT** - Autenticación con tokens
- **bcryptjs** - Encriptación de contraseñas
- **express-validator** - Validación de datos

## Estructura del Proyecto

```
backend/
├── config/
│   ├── auth.js          # Configuración de JWT
│   └── database.js      # Configuración de PostgreSQL
├── controllers/
│   ├── authController.js # Lógica de autenticación
│   └── taskController.js # Lógica de tareas
├── middleware/
│   ├── auth.js          # Middleware de autenticación JWT
│   └── validate.js      # Middleware de validación
├── routes/
│   ├── authRoutes.js    # Rutas de autenticación
│   └── taskRoutes.js    # Rutas de tareas
├── database/
│   └── init.sql         # Script de inicialización de BD
├── index.js             # Punto de entrada
├── package.json
└── .env.example         # Variables de entorno ejemplo
```

## Instalación

1. Copiar el archivo de ejemplo de variables de entorno:
```bash
cp .env.example .env
```

2. Configurar las variables de entorno en `.env`:
- Credenciales de Supabase
- Clave secreta de JWT
- Puerto del servidor

3. Ejecutar el script de inicialización de la base de datos en Supabase:
   - Ir al SQL Editor de Supabase
   - Ejecutar el contenido de `database/init.sql`

4. Instalar dependencias (ya realizado):
```bash
npm install
```

## Scripts Disponibles

- `npm start` - Iniciar el servidor en modo producción
- `npm run dev` - Iniciar el servidor con nodemon (desarrollo)

## Endpoints de la API

### Autenticación

- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil del usuario (requiere token)

### Tareas

- `GET /api/tasks` - Obtener todas las tareas del usuario (requiere token)
- `GET /api/tasks/:id` - Obtener una tarea específica (requiere token)
- `POST /api/tasks` - Crear nueva tarea (requiere token)
- `PUT /api/tasks/:id` - Actualizar tarea (requiere token)
- `DELETE /api/tasks/:id` - Eliminar tarea (requiere token)

## Formato de Token

Para acceder a los endpoints protegidos, incluir el token en el header:
```
Authorization: Bearer <token>
```

## Validaciones

- **Registro**: email válido, contraseña mínimo 6 caracteres, nombre obligatorio
- **Login**: email válido, contraseña obligatoria
- **Tareas**: título obligatorio (máx 200 caracteres), descripción opcional (máx 1000), estado: pendiente/en_progreso/completada
