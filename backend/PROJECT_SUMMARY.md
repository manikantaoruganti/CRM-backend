# Mini CRM Backend - Project Summary

## Production-Grade Backend Assignment for Prysm Labs

### Tech Stack (Exact)
- **NestJS** v10.0.0 (TypeScript)
- **PostgreSQL** v15
- **Prisma ORM** v5.22.0
- **JWT** (@nestjs/jwt v10.2.0)
- **bcrypt** v5.1.1
- **class-validator** v0.14.0 & **class-transformer** v0.5.1
- **Swagger** (@nestjs/swagger v7.1.17)

---

## Project Structure

```
backend/
│
├── src/
│   ├── auth/
│   │   ├── dto/
│   │   │   ├── register.dto.ts
│   │   │   └── login.dto.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   │
│   ├── users/
│   │   ├── dto/
│   │   │   └── update-user-role.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   │
│   ├── customers/
│   │   ├── dto/
│   │   │   ├── create-customer.dto.ts
│   │   │   └── update-customer.dto.ts
│   │   ├── customers.controller.ts
│   │   ├── customers.service.ts
│   │   └── customers.module.ts
│   │
│   ├── tasks/
│   │   ├── dto/
│   │   │   ├── create-task.dto.ts
│   │   │   └── update-task-status.dto.ts
│   │   ├── tasks.controller.ts
│   │   ├── tasks.service.ts
│   │   └── tasks.module.ts
│   │
│   ├── common/
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── roles.guard.ts
│   │   └── decorators/
│   │       └── roles.decorator.ts
│   │
│   ├── prisma/
│   │   ├── prisma.service.ts
│   │   └── schema.prisma
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── prisma/
│   ├── schema.prisma
│   └── migrations/
│
├── package.json
├── tsconfig.json
├── nest-cli.json
├── .env
├── .env.example
├── README.md
├── DELIVERABLE_CHECKLIST.md
└── PROJECT_SUMMARY.md
```

---

## Database Models

### User
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role
  createdAt DateTime @default(now())
  tasks     Task[]   @relation("AssignedTasks")
}

enum Role {
  ADMIN
  EMPLOYEE
}
```

### Customer
```prisma
model Customer {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  phone     String   @unique
  company   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]
}
```

### Task
```prisma
model Task {
  id          Int        @id @default(autoincrement())
  title       String
  description String?
  status      TaskStatus @default(PENDING)
  assignedTo  Int
  assignee    User       @relation("AssignedTasks", fields: [assignedTo], references: [id])
  customerId  Int
  customer    Customer   @relation(fields: [customerId], references: [id])
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  DONE
}
```

---

## API Endpoints

### Authentication
- **POST** `/auth/register` - Register new user
- **POST** `/auth/login` - Login and get JWT token

### Users (ADMIN only)
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get user by ID
- **PATCH** `/users/:id` - Update user role

### Customers
- **POST** `/customers` - Create customer (ADMIN only)
- **GET** `/customers?page=1&limit=10` - Get paginated customers (ALL)
- **GET** `/customers/:id` - Get customer by ID (ALL)
- **PATCH** `/customers/:id` - Update customer (ADMIN only)
- **DELETE** `/customers/:id` - Delete customer (ADMIN only)

### Tasks
- **POST** `/tasks` - Create task (ADMIN only)
- **GET** `/tasks` - Get tasks (ADMIN: all, EMPLOYEE: own)
- **GET** `/tasks/:id` - Get task by ID
- **PATCH** `/tasks/:id/status` - Update task status

---

## Authorization Matrix

| Endpoint | ADMIN | EMPLOYEE |
|----------|-------|----------|
| **Users** |||
| GET /users | ✅ | ❌ |
| GET /users/:id | ✅ | ❌ |
| PATCH /users/:id | ✅ | ❌ |
| **Customers** |||
| POST /customers | ✅ | ❌ |
| GET /customers | ✅ | ✅ (read-only) |
| GET /customers/:id | ✅ | ✅ (read-only) |
| PATCH /customers/:id | ✅ | ❌ |
| DELETE /customers/:id | ✅ | ❌ |
| **Tasks** |||
| POST /tasks | ✅ | ❌ |
| GET /tasks | ✅ (all) | ✅ (own only) |
| GET /tasks/:id | ✅ (all) | ✅ (own only) |
| PATCH /tasks/:id/status | ✅ (all) | ✅ (own only) |

---

## Key Features

### Security
- ✅ bcrypt password hashing (10 rounds)
- ✅ JWT authentication (7-day expiration)
- ✅ Role-based access control (RBAC)
- ✅ Guards: JwtAuthGuard + RolesGuard
- ✅ Never expose passwords in responses

### Validation
- ✅ class-validator decorators on all DTOs
- ✅ @IsNotEmpty(), @IsEmail(), @MinLength()
- ✅ @IsEnum() for Role and TaskStatus
- ✅ Automatic 400 for invalid input
- ✅ Global ValidationPipe

### Error Handling
- ✅ 400 - Validation errors
- ✅ 401 - Invalid credentials
- ✅ 403 - Insufficient permissions
- ✅ 404 - Resource not found
- ✅ 409 - Duplicate email/phone

### Business Logic
- ✅ Tasks can only be assigned to EMPLOYEE users
- ✅ Unique email & phone constraints
- ✅ Proper pagination with metadata
- ✅ Filtered task retrieval by role
- ✅ Status updates restricted by ownership

### Documentation
- ✅ Swagger UI at `/api`
- ✅ All endpoints documented
- ✅ Bearer Auth configured
- ✅ Request/Response schemas
- ✅ Interactive testing

---

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/minicrm?schema=public"
JWT_SECRET="your-secure-jwt-secret-min-32-chars"
PORT=5001
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Build & Run
```bash
npm run build
npm run start:prod
```

Server: `http://localhost:5001`
Swagger: `http://localhost:5001/api`

---

## Testing Flow

### 1. Register Admin
```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "ADMIN"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:5001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

Response: `{ "token": "eyJ..." }`

### 3. Use Token
```bash
TOKEN="your-jwt-token"

curl -X GET http://localhost:5001/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## Code Quality

- ✅ Production-grade TypeScript code
- ✅ No unused imports or variables
- ✅ Clean, maintainable architecture
- ✅ Proper separation of concerns
- ✅ Following NestJS best practices
- ✅ No boilerplate or unnecessary files
- ✅ Compiles without errors
- ✅ Ready for deployment

---

## Deliverables

- ✅ Complete NestJS backend source code
- ✅ Prisma schema with migrations
- ✅ Environment configuration files
- ✅ Comprehensive README.md
- ✅ package.json with exact dependencies
- ✅ TypeScript configuration
- ✅ No tests (as instructed)
- ✅ No Docker (as instructed)
- ✅ No sample data (as instructed)

---

## Status: ✅ COMPLETE

**All requirements implemented according to Prysm Labs specifications.**
**Production-ready code, no deviations from tech stack.**
**Ready for evaluation.**

---

*Generated: January 27, 2026*
*Assignment: Mini CRM Backend - Prysm Labs*
