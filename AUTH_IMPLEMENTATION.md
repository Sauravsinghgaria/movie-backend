# Authentication API Implementation Guide

## Overview

This document outlines the authentication system implementation for the Movie Backend API.

## API Endpoints

### 1. **POST /api/auth/login**

**Purpose**: Authenticate user and return JWT token. Creates user if not exists.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Parameters**:

- `email` (string, required): User's email address
- `password` (string, required): User's password (will be hashed with bcrypt)
- `rememberMe` (boolean, optional): If true, token expires in 30 days; if false (default), expires in 24 hours

**Response (Success - 200 OK)**:

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "rememberMe": true
  }
}
```

**Response (Error - 400 Bad Request)**:

```json
{
  "statusCode": 400,
  "message": "Email and password are required"
}
```

**Response (Error - 401 Unauthorized)**:

```json
{
  "statusCode": 401,
  "message": "Invalid credentials"
}
```

**Behavior**:

- If user exists: Validates password using bcrypt
- If user doesn't exist: Creates new user with hashed password
- Returns JWT token valid for 24 hours (or 30 days if rememberMe is true)
- Updates user's rememberMe flag based on login request

---

### 2. **POST /api/auth/logout**

**Purpose**: Logout user by invalidating their session

**Request Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Response (Success - 200 OK)**:

```json
{
  "message": "Logout successful"
}
```

**Response (Error - 400 Bad Request)**:

```json
{
  "statusCode": 400,
  "message": "Authorization header is required"
}
```

**Response (Error - 400 Bad Request)**:

```json
{
  "statusCode": 400,
  "message": "Invalid token"
}
```

**Behavior**:

- Validates JWT token from Authorization header
- Updates user's rememberMe flag to false (session invalidation)
- Returns success message

---

## Implementation Details

### Technology Stack

- **Password Hashing**: bcrypt (10 salt rounds)
- **JWT Tokens**: jsonwebtoken
- **Database**: PostgreSQL with TypeORM
- **Framework**: NestJS

### File Structure

```
src/auth/
├── auth.controller.ts    # HTTP request handlers
├── auth.service.ts       # Business logic
└── auth.module.ts        # Module configuration

src/entities/
└── users.entity.ts       # User database entity
```

### Security Features

1. **Password Hashing**
   - Uses bcrypt with 10 salt rounds
   - Passwords are never stored in plain text
   - Uses secure comparison for verification

2. **JWT Tokens**
   - Signed with secret key (configurable via JWT_SECRET env var)
   - Automatic expiration based on rememberMe flag
   - Verified on logout

3. **Error Handling**
   - Invalid credentials don't reveal if email exists
   - Proper HTTP status codes (400, 401)
   - Validation for required fields

### Database Schema

**User Entity**:

```typescript
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  rememberMe: boolean;

  @Column({ default: true })
  isActive: boolean;
}
```

---

## Usage Examples

### Example 1: Login (New User)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "rememberMe": false
  }'
```

**Result**: New user is created, password is hashed, JWT token is returned

### Example 2: Login (Existing User)

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securePassword123",
    "rememberMe": true
  }'
```

**Result**: User is authenticated, JWT token with 30-day expiration is returned

### Example 3: Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Result**: User's rememberMe flag is set to false, session is invalidated

---

## Environment Variables

Configure the following in your `.env` file:

```env
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRES_IN=24h
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=asdf
DB_NAME=movie-backend
```

---

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod

# Run tests
npm test

# Run e2e tests
npm run test:e2e
```

---

## Dependencies

```json
{
  "dependencies": {
    "bcrypt": "^5.x.x",
    "jsonwebtoken": "^9.x.x",
    "@nestjs/common": "^11.x.x",
    "@nestjs/core": "^11.x.x",
    "@nestjs/typeorm": "^11.x.x",
    "typeorm": "^0.3.x",
    "pg": "^8.x.x"
  },
  "devDependencies": {
    "@types/bcrypt": "^5.x.x",
    "@types/jsonwebtoken": "^9.x.x"
  }
}
```

---

## Notes

- JWT_SECRET should be changed in production to a strong, random key
- Consider implementing token refresh mechanism for better UX
- For production, use environment variables for all sensitive configuration
- Consider adding rate limiting on login endpoint to prevent brute force attacks
- Consider implementing email verification for new user registration
