# Mini CRM Backend

Production-grade backend assignment for **Prysm Labs** - A comprehensive CRM system built with NestJS, PostgreSQL, and Prisma.

---

## Tech Stack

- **NestJS** (TypeScript)
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **bcrypt** for password hashing
- **class-validator & class-transformer**
- **Swagger** for API documentation

---

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
JWT_SECRET="your-secure-random-jwt-secret-min-32-chars"
PORT=3000
```

**Environment Variables:**

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token signing (minimum 32 characters recommended)
- `PORT`: Server port (default: 3000)

### 3. Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

This will:
- Create the database schema
- Set up User, Customer, and Task tables
- Apply all necessary constraints and relationships

### 4. Start the Server

**Development mode:**

```bash
npm run start:dev
# or
yarn start:dev
```

**Production mode:**

```bash
npm run build
npm run start:prod
```

The server will start on `http://localhost:3000` (or your configured PORT).

---

## API Documentation

Once the server is running, access the **Swagger documentation** at:

```
http://localhost:3000/api
```

Swagger provides:
- Interactive API testing
- Complete endpoint documentation
- Request/response schemas
- JWT authentication testing

---

## Authentication Flow

### 1. Register a User

**Endpoint:** `POST /auth/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "ADMIN"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "ADMIN"
}
```

**Roles:** `ADMIN` or `EMPLOYEE`

### 2. Login

**Endpoint:** `POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Use JWT Token

For protected endpoints, include the token in the Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

In Swagger, click the **Authorize** button and enter: `Bearer <your-token>`

---

## API Endpoints

### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get JWT token

### Users (ADMIN only)

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user role

### Customers

- `POST /customers` - Create customer (ADMIN only)
- `GET /customers?page=1&limit=10` - Get paginated customers (ALL)
- `GET /customers/:id` - Get customer by ID (ALL)
- `PATCH /customers/:id` - Update customer (ADMIN only)
- `DELETE /customers/:id` - Delete customer (ADMIN only)

### Tasks

- `POST /tasks` - Create task (ADMIN only)
- `GET /tasks` - Get tasks (ADMIN: all, EMPLOYEE: own tasks)
- `GET /tasks/:id` - Get task by ID
- `PATCH /tasks/:id/status` - Update task status

---

## Authorization Rules

### ADMIN

- Full CRUD access to Users, Customers, and Tasks
- Can create tasks and assign to employees
- Can view all tasks

### EMPLOYEE

- Read-only access to Customers
- Can view only assigned tasks
- Can update status of own tasks only

---

## Data Models

### User

```typescript
{
  id: number;
  name: string;
  email: string;
  password: string; // hashed
  role: 'ADMIN' | 'EMPLOYEE';
  createdAt: Date;
}
```

### Customer

```typescript
{
  id: number;
  name: string;
  email: string; // unique
  phone: string; // unique
  company?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Task

```typescript
{
  id: number;
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  assignedTo: number; // User ID (must be EMPLOYEE)
  customerId: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## Validation Rules

- Email must be unique across users and customers
- Phone must be unique across customers
- Password minimum 8 characters
- Tasks can only be assigned to EMPLOYEE role users
- Customer and assignee must exist when creating tasks

---

## Error Responses

- `400 Bad Request` - Validation error
- `401 Unauthorized` - Invalid credentials or missing token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email/phone

---

## Testing with cURL

### Register Admin

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### Create Customer (with JWT)

```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Acme Corp",
    "email": "contact@acme.com",
    "phone": "+1234567890",
    "company": "Acme Corporation"
  }'
```

---

## Project Structure

```
src/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── jwt.strategy.ts
│   ├── dto/
│       ├── register.dto.ts
│       ├── login.dto.ts
│
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── dto/
│       ├── update-user-role.dto.ts
│
├── customers/
│   ├── customers.controller.ts
│   ├── customers.service.ts
│   ├── customers.module.ts
│   ├── dto/
│       ├── create-customer.dto.ts
│       ├── update-customer.dto.ts
│
├── tasks/
│   ├── tasks.controller.ts
│   ├── tasks.service.ts
│   ├── tasks.module.ts
│   ├── dto/
│       ├── create-task.dto.ts
│       ├── update-task-status.dto.ts
│
├── common/
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   ├── roles.guard.ts
│   ├── decorators/
│       ├── roles.decorator.ts
│
├── prisma/
│   ├── prisma.service.ts
│   ├── schema.prisma
│
├── app.module.ts
├── main.ts
```

---

## Additional Prisma Commands

View database in Prisma Studio:

```bash
npx prisma studio
```

Reset database:

```bash
npx prisma migrate reset
```

Create new migration:

```bash
npx prisma migrate dev --name migration_name
```

---

## Security Features

- Passwords hashed using bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Role-based access control (RBAC)
- Input validation on all endpoints
- Protected routes with JWT authentication
- SQL injection prevention via Prisma ORM

---

## Notes

- No sample data or seeds included (as per assignment requirements)
- All validations handled via class-validator decorators
- Automatic 400 errors for invalid inputs
- Swagger allows direct JWT testing via UI
- PostgreSQL connection pooling handled by Prisma

---

## Support

For issues or questions, refer to:
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Swagger Documentation](https://swagger.io/docs)
