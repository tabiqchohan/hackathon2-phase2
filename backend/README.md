# Todo REST API - Backend

Multi-user Todo REST API with JWT authentication and PostgreSQL persistence built with FastAPI and SQLModel.

## Features

- ✅ Create, read, update, and delete todos
- ✅ Mark todos as complete/incomplete with timestamp tracking
- ✅ User-level data isolation (users can only access their own todos)
- ✅ JWT-based authentication via Better Auth
- ✅ RESTful API with OpenAPI documentation
- ✅ PostgreSQL persistence with Neon Serverless support
- ✅ Pagination and filtering for todo lists

## Prerequisites

- Python 3.11 or higher
- PostgreSQL database (local or Neon Serverless)
- Better Auth instance for JWT token generation

## Quick Start

### 1. Installation

```bash
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

### 2. Configuration

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database (use your PostgreSQL connection string)
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db

# JWT Configuration (from Better Auth)
JWT_SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256

# Application
APP_NAME=Todo REST API
DEBUG=True
```

### 3. Database Setup

Run database migrations:

```bash
# Apply migrations
alembic upgrade head
```

### 4. Run the Server

```bash
# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/health

## API Endpoints

All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

### Todos

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/todos` | Create a new todo |
| GET | `/api/v1/todos` | List todos (with pagination and filtering) |
| GET | `/api/v1/todos/{id}` | Get a specific todo |
| PATCH | `/api/v1/todos/{id}` | Update a todo |
| DELETE | `/api/v1/todos/{id}` | Delete a todo |

### Query Parameters

**GET /api/v1/todos**:
- `skip` (int, default: 0): Number of todos to skip
- `limit` (int, default: 20, max: 100): Maximum number of todos to return
- `completed` (bool, optional): Filter by completion status

## Usage Examples

### Create a Todo

```bash
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries",
    "description": "Milk, eggs, bread"
  }'
```

### List Todos

```bash
# Get all todos
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Get only completed todos
curl -X GET "http://localhost:8000/api/v1/todos?completed=true" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Pagination
curl -X GET "http://localhost:8000/api/v1/todos?skip=0&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Update a Todo

```bash
# Mark as complete
curl -X PATCH http://localhost:8000/api/v1/todos/{todo_id} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'

# Update title and description
curl -X PATCH http://localhost:8000/api/v1/todos/{todo_id} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Buy groceries and supplies",
    "description": "Milk, eggs, bread, coffee"
  }'
```

### Delete a Todo

```bash
curl -X DELETE http://localhost:8000/api/v1/todos/{todo_id} \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Authentication

This API uses JWT tokens issued by Better Auth. To use the API:

1. Register/login through Better Auth
2. Obtain a JWT token from the authentication response
3. Include the token in the `Authorization` header: `Bearer <token>`

The JWT token must contain a `user_id` or `sub` claim that identifies the user.

## Project Structure

```
backend/
├── app/
│   ├── api/              # API endpoints
│   │   ├── deps.py       # Dependencies (auth, db)
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── todos.py  # Todo endpoints
│   ├── core/             # Core configuration
│   │   ├── config.py     # Settings
│   │   ├── database.py   # Database connection
│   │   ├── security.py   # JWT verification
│   │   └── exceptions.py # Custom exceptions
│   ├── models/           # SQLModel database models
│   │   └── todo.py
│   ├── schemas/          # Pydantic request/response schemas
│   │   ├── error.py
│   │   └── todo.py
│   ├── services/         # Business logic
│   │   └── todo.py
│   └── main.py           # FastAPI application
├── alembic/              # Database migrations
├── tests/                # Test suite
├── .env.example          # Environment template
├── requirements.txt      # Dependencies
└── README.md             # This file
```

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

## Development

### Running Tests

```bash
# Install dev dependencies
pip install -r requirements.txt

# Run tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

### Code Formatting

```bash
# Format code with black
black app/

# Lint with ruff
ruff check app/
```

## Troubleshooting

### Database Connection Issues

**Problem**: `sqlalchemy.exc.OperationalError: could not connect to server`

**Solution**:
- Verify `DATABASE_URL` in `.env` is correct
- Check PostgreSQL is running
- For Neon: Ensure `?sslmode=require` is in connection string

### JWT Verification Fails

**Problem**: `401 Unauthorized: Invalid or expired JWT token`

**Solution**:
- Verify `JWT_SECRET_KEY` matches Better Auth configuration
- Check `JWT_ALGORITHM` is correct (HS256 or RS256)
- Ensure token hasn't expired
- Verify token format: `Authorization: Bearer <token>`

### Port Already in Use

**Problem**: `OSError: [Errno 48] Address already in use`

**Solution**:
```bash
# Use a different port
uvicorn app.main:app --reload --port 8001
```

## License

MIT License - See LICENSE file for details

## Support

For issues and questions, please refer to the project documentation or create an issue in the repository.
