# Quickstart Guide: Todo REST API

**Feature**: 001-todo-rest-api | **Date**: 2026-02-13
**Related**: [spec.md](./spec.md) | [plan.md](./plan.md) | [data-model.md](./data-model.md)

## Overview

This guide provides step-by-step instructions to set up, run, and test the Todo REST API locally.

## Prerequisites

- Python 3.11 or higher
- PostgreSQL database (or Neon Serverless PostgreSQL account)
- Better Auth instance (for JWT token generation)
- Git (for cloning the repository)

## Quick Start (5 minutes)

### 1. Clone and Setup

```bash
# Clone the repository
git clone <repository-url>
cd phase2

# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# - DATABASE_URL: PostgreSQL connection string
# - JWT_SECRET_KEY: Secret key for JWT verification (from Better Auth)
# - JWT_ALGORITHM: Algorithm for JWT (e.g., HS256 or RS256)
```

**Example .env file**:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
# For Neon Serverless:
# DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/todo_db?sslmode=require

# JWT Configuration (from Better Auth)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# Application
APP_NAME=Todo REST API
DEBUG=True
```

### 3. Initialize Database

```bash
# Run database migrations
alembic upgrade head

# Verify tables created
# Connect to your database and check for 'todos' table
```

### 4. Start the Server

```bash
# Run development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Server will start at http://localhost:8000
# API documentation available at http://localhost:8000/docs
```

### 5. Test the API

**Option A: Using the Interactive Docs (Swagger UI)**

1. Open http://localhost:8000/docs in your browser
2. Click "Authorize" button
3. Enter your JWT token: `Bearer <your-jwt-token>`
4. Try the endpoints interactively

**Option B: Using curl**

```bash
# Set your JWT token
export JWT_TOKEN="your-jwt-token-here"

# Create a todo
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries", "description": "Milk, eggs, bread"}'

# List todos
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get a specific todo (replace {id} with actual UUID)
curl -X GET http://localhost:8000/api/v1/todos/{id} \
  -H "Authorization: Bearer $JWT_TOKEN"

# Update a todo
curl -X PATCH http://localhost:8000/api/v1/todos/{id} \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Delete a todo
curl -X DELETE http://localhost:8000/api/v1/todos/{id} \
  -H "Authorization: Bearer $JWT_TOKEN"
```

## Project Structure

```text
backend/
├── app/
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # Route handlers
│   │   ├── deps.py          # Dependencies (DB session, auth)
│   │   └── v1/
│   │       └── todos.py     # Todo endpoints
│   ├── core/                # Core configuration
│   │   ├── config.py        # Settings
│   │   ├── security.py      # JWT verification
│   │   └── database.py      # Database connection
│   ├── models/              # SQLModel database models
│   │   └── todo.py          # Todo model
│   ├── schemas/             # Pydantic request/response schemas
│   │   └── todo.py          # Todo schemas
│   └── services/            # Business logic
│       └── todo.py          # Todo CRUD operations
├── tests/                   # Test suite
├── alembic/                 # Database migrations
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── requirements.txt         # Python dependencies
└── README.md                # Project documentation
```

## API Endpoints

All endpoints are prefixed with `/api/v1` and require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/todos` | List todos (with pagination and filtering) |
| POST | `/todos` | Create a new todo |
| GET | `/todos/{id}` | Get a specific todo |
| PATCH | `/todos/{id}` | Update a todo |
| DELETE | `/todos/{id}` | Delete a todo |

## Authentication

### Getting a JWT Token

JWT tokens are issued by Better Auth (external system). To get a token:

1. Register/login through Better Auth
2. Obtain JWT token from Better Auth response
3. Use token in `Authorization: Bearer <token>` header

### Token Format

The JWT token must contain a `user_id` claim that identifies the user. Example payload:

```json
{
  "user_id": "user_123",
  "exp": 1708012800,
  "iat": 1707926400
}
```

## Common Operations

### Create a Todo

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write README and API docs"
  }'
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "completed": false,
  "user_id": "user_123",
  "created_at": "2026-02-13T10:00:00Z",
  "updated_at": "2026-02-13T10:00:00Z",
  "completed_at": null
}
```

### List Todos with Filtering

```bash
# Get all todos
curl -X GET "http://localhost:8000/api/v1/todos" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get only completed todos
curl -X GET "http://localhost:8000/api/v1/todos?completed=true" \
  -H "Authorization: Bearer $JWT_TOKEN"

# Get incomplete todos with pagination
curl -X GET "http://localhost:8000/api/v1/todos?completed=false&skip=0&limit=10" \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response** (200 OK):
```json
{
  "items": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write README and API docs",
      "completed": false,
      "user_id": "user_123",
      "created_at": "2026-02-13T10:00:00Z",
      "updated_at": "2026-02-13T10:00:00Z",
      "completed_at": null
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 20
}
```

### Mark Todo as Complete

```bash
curl -X PATCH http://localhost:8000/api/v1/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write README and API docs",
  "completed": true,
  "user_id": "user_123",
  "created_at": "2026-02-13T10:00:00Z",
  "updated_at": "2026-02-13T10:30:00Z",
  "completed_at": "2026-02-13T10:30:00Z"
}
```

### Update Todo Details

```bash
curl -X PATCH http://localhost:8000/api/v1/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation and tests",
    "description": "Write README, API docs, and unit tests"
  }'
```

### Delete a Todo

```bash
curl -X DELETE http://localhost:8000/api/v1/todos/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response** (204 No Content)

## Error Handling

All errors return a consistent JSON format:

```json
{
  "detail": "Human-readable error message",
  "error_code": "MACHINE_READABLE_CODE"
}
```

### Common Error Codes

| Status | Error Code | Description |
|--------|------------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid JWT token |
| 403 | FORBIDDEN | User doesn't own the resource |
| 404 | TODO_NOT_FOUND | Todo doesn't exist |
| 500 | INTERNAL_SERVER_ERROR | Unexpected server error |

### Example Error Response

```bash
# Attempt to access another user's todo
curl -X GET http://localhost:8000/api/v1/todos/other-user-todo-id \
  -H "Authorization: Bearer $JWT_TOKEN"
```

**Response** (403 Forbidden):
```json
{
  "detail": "You do not have permission to access this todo",
  "error_code": "FORBIDDEN"
}
```

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/integration/test_todo_api.py

# Run with verbose output
pytest -v
```

## Development Workflow

### 1. Make Changes

Edit code in `app/` directory following the layered architecture:
- **Models** (`app/models/`): Database schema
- **Schemas** (`app/schemas/`): API contracts
- **Services** (`app/services/`): Business logic
- **Routes** (`app/api/`): HTTP endpoints

### 2. Create Migration (if schema changed)

```bash
# Auto-generate migration
alembic revision --autogenerate -m "Description of changes"

# Review generated migration in alembic/versions/

# Apply migration
alembic upgrade head
```

### 3. Run Tests

```bash
pytest
```

### 4. Test Manually

Use Swagger UI at http://localhost:8000/docs or curl commands

## Troubleshooting

### Database Connection Issues

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`

**Solution**:
- Verify DATABASE_URL in .env is correct
- Check PostgreSQL is running
- For Neon: Ensure `?sslmode=require` is in connection string

### JWT Verification Fails

**Problem**: `401 Unauthorized: Invalid or expired JWT token`

**Solution**:
- Verify JWT_SECRET_KEY matches Better Auth configuration
- Check JWT_ALGORITHM is correct (HS256 or RS256)
- Ensure token hasn't expired
- Verify token format: `Authorization: Bearer <token>`

### Migration Errors

**Problem**: `alembic.util.exc.CommandError: Can't locate revision identified by 'xxx'`

**Solution**:
```bash
# Reset migrations (development only!)
alembic downgrade base
alembic upgrade head
```

### Port Already in Use

**Problem**: `OSError: [Errno 48] Address already in use`

**Solution**:
```bash
# Find process using port 8000
# On macOS/Linux:
lsof -i :8000
# On Windows:
netstat -ano | findstr :8000

# Kill the process or use a different port
uvicorn app.main:app --reload --port 8001
```

## Next Steps

- **Run Tests**: Execute `/sp.tasks` to generate implementation tasks
- **Implement Features**: Follow task breakdown for systematic implementation
- **Deploy**: Configure production environment and deploy to cloud platform
- **Monitor**: Set up logging and monitoring for production

## Additional Resources

- [OpenAPI Specification](./contracts/openapi.yaml) - Complete API contract
- [Data Model](./data-model.md) - Entity definitions and database schema
- [Implementation Plan](./plan.md) - Architecture and design decisions
- [Feature Specification](./spec.md) - Requirements and success criteria
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/)
- [Alembic Documentation](https://alembic.sqlalchemy.org/)
