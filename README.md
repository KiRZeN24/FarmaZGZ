# FarmaZGZ - Backend

API REST para gestionar farmacias de guardia en Zaragoza. Desarrollada con NestJS, TypeScript y PostgreSQL.

[![NestJS](https://img.shields.io/badge/NestJS-11-red)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)](https://www.postgresql.org/)

## ✨ Características

- 🔄 **Sincronización automática** con API del Ayuntamiento de Zaragoza
- 🔐 **Autenticación JWT** con roles (USER/ADMIN)
- ✅ **Sistema de validaciones** por usuario y fecha
- 📊 **Estadísticas** de validaciones
- 🛡️ **Guards y decoradores** personalizados
- 🗄️ **TypeORM** para gestión de base de datos

## 🚀 Tecnologías

- **Framework:** NestJS 11
- **Lenguaje:** TypeScript
- **Base de datos:** PostgreSQL 17
- **ORM:** TypeORM
- **Autenticación:** JWT + bcrypt
- **Validación:** class-validator + class-transformer
- **HTTP Client:** Axios

## 📋 Requisitos previos

- Node.js 18.x o superior
- PostgreSQL 17.x o superior
- npm o yarn

## 🛠️ Instalación

1. **Clonar el repositorio:**

git clone https://github.com/KiRZeN24/FarmaZGZ.git

cd farmazgz-backend

2. **Instalar dependencias:**

npm install

3. **Configurar base de datos:**

Crea una base de datos PostgreSQL:

CREATE DATABASE farmazgz;

4. **Configurar variables de entorno:**

Crea un archivo `.env` en la raíz:

Database

DB_HOST=localhost

DB_PORT=5432

DB_USERNAME=postgres

DB_PASSWORD=tu_password

DB_DATABASE=farmazgz

JWT

JWT_SECRET=tu_secret_key

Server

PORT=3001

5. **Ejecutar migraciones (si existen):**

npm run typeorm migration:run

6. **Ejecutar en desarrollo:**

npm run start:dev

La API estará disponible en `http://localhost:3001`

## 🔐 Autenticación

### JWT Strategy

La API utiliza JWT (JSON Web Tokens) para autenticación:

// Payload del token
{
id: string,
username: string,
role: 'USER' | 'ADMIN'
}

### Roles y permisos

- **USER:** Endpoints básicos (ver farmacias, validar)
- **ADMIN:** Todos los endpoints + gestión de usuarios y sincronización

### Guards personalizados

@Roles(UserRole.ADMIN) // Requiere rol ADMIN

@IsPublic() // Endpoint público

## 📚 Documentación de API

### Autenticación

#### Registrarse

POST /auth/signup

Content-Type: application/json

{
"username": "usuario",
"password": "ExamplePassword123!"
}

#### Iniciar sesión

POST /auth/signin

Content-Type: application/json

{
"username": "usuario",
"password": "Password123!"
}

**Respuesta:**

{
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}

#### Obtener perfil

GET /auth/profile

Authorization: Bearer {token}

#### Actualizar perfil

PUT /auth/profile

Authorization: Bearer {token}

Content-Type: application/json

{
"password": "NewPassword123!"
}

### Farmacias

#### Obtener farmacias de hoy

GET /pharmacies/today

#### Obtener detalle de farmacia

GET /pharmacies/:id

#### Obtener validaciones de una farmacia

GET /pharmacies/:id/validations

#### Sincronizar con API del Ayuntamiento (Admin)

POST /pharmacies/sync

Authorization: Bearer {admin_token}

### Validaciones

#### Crear validación

POST /validations

Authorization: Bearer {token}

Content-Type: application/json

{
"pharmacyId": "uuid",
"isValid": true,
"guardDate": "2025-10-28"
}

#### Mis validaciones

GET /validations/my-validations

Authorization: Bearer {token}

### Usuarios (Admin)

#### Listar usuarios

GET /users

Authorization: Bearer {admin_token}

#### Crear usuario

POST /users

Authorization: Bearer {admin_token}

Content-Type: application/json

{
"username": "nuevo_usuario",
"password": "Password123!",
"role": "USER"
}

#### Actualizar usuario

PUT /users/:id

Authorization: Bearer {admin_token}

Content-Type: application/json

{
"username": "nuevo_nombre",
"role": "ADMIN"
}

#### Eliminar usuario

DELETE /users/:id

Authorization: Bearer {admin_token}

## 🗄️ Modelos de datos

### User

{
id: string (UUID)
username: string
hashedPassword: string
role: 'USER' | 'ADMIN'
createdAt: Date
}

### Pharmacy

{
id: string (UUID)
external_id: string
name: string
address: string
phone: string
hours: string
latitude: number | null
longitude: number | null
guard_date: Date
last_updated: Date
}

### Validation

{
id: string (UUID)
userId: string
pharmacyId: string
isValid: boolean
validationDate: Date
createdAt: Date
}

## 🔄 Sincronización con API del Ayuntamiento

El sistema sincroniza automáticamente las farmacias desde:

http://www.zaragoza.es/sede/servicio/farmacia.json?tipo=guardia&fecha=DD-MM-YYYY

**Características:**

- Filtra farmacias con texto genérico
- Actualiza datos existentes
- Preserva historial de validaciones
- Índice único por `(userId, pharmacyId, validationDate)`

## 🛡️ Seguridad

### Validación de contraseñas

- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- Al menos 1 carácter especial

### Hash de contraseñas

Utiliza bcrypt con 10 rondas de salt:

const hashedPassword = await hash(password, 10);

### CORS

Configurado para aceptar peticiones del frontend:

app.enableCors({
origin: 'http://localhost:3001',
credentials: true,
});

## 📊 Base de datos

### Migración inicial

Si usas migraciones, crea una con:

npm run typeorm migration:generate -- -n InitialMigration

npm run typeorm migration:run

### Sincronización automática

En desarrollo, TypeORM sincroniza automáticamente:

synchronize: true // Solo para desarrollo

⚠️ **En producción usa migraciones**
