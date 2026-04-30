```markdown
# Task Management API

A REST API for task management with user authentication, JWT tokens, and role-based access control.

## Setup

1. Clone the repository
2. Install dependencies

```bash
npm install
```

3. Create a `.env` file using `.env.example` as a template

```
PORT=3001
JWT_SECRET=your-jwt-secret
ADMIN_PASSWORD=your-admin-password
EMAIL=your-admin-email
```

4. Start the server

```bash
npm run dev
```

## Endpoints

### Auth

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register a new user |
| POST | /api/auth/login | Public | Login and get token |
| GET | /api/auth/me | User | Get current user |

### Tasks

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/tasks | User | Get your tasks |
| POST | /api/tasks | User | Create a task |
| PUT | /api/tasks/:id | Owner | Update a task |
| DELETE | /api/tasks/:id | Owner | Delete a task |

### Admin

| Method | Endpoint         | Access | Description    |
|--------|----------        |--------|-------------   |
| GET    | /api/admin/tasks | Admin  | View all tasks |

## Authentication

Include the JWT token in the Authorization header:

```postman

Authorization: Bearer YOUR_TOKEN

```

## Task Fields

| Field | Required | Values |
| ------- | ---------- | -------- |
| title | Yes | 3-100 characters |
| description | Yes | Min 10 characters |
| status | Yes | todo, in-progress, completed |

## Tech Stack

- Node.js / Express
- bcryptjs
- jsonwebtoken
- helmet, cors, express-rate-limit
