# 🚀 Quick Start Guide - Todo Application

## Prerequisites
- Python 3.11+ installed
- Node.js 18+ installed
- PostgreSQL database (local or Neon Serverless)

## Setup Instructions

### Backend Setup (Terminal 1)

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment**
   - Windows:
     ```bash
     venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. **Install dependencies** (one by one if memory issues occur)
   ```bash
   pip install fastapi uvicorn sqlmodel psycopg2-binary alembic pydantic pydantic-settings python-jose python-dotenv
   ```

5. **Configure environment**
   - `.env` file already created with default values
   - **IMPORTANT**: Update `DATABASE_URL` in `.env` with your PostgreSQL connection string
   - Update `JWT_SECRET_KEY` with your Better Auth secret

6. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

7. **Start backend server**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

   Backend will be available at:
   - API: http://localhost:8000
   - Docs: http://localhost:8000/docs
   - Health: http://localhost:8000/health

---

### Frontend Setup (Terminal 2)

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   - `.env.local` file already created with:
     ```
     NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
     ```

4. **Start frontend server**
   ```bash
   npm run dev
   ```

   Frontend will be available at:
   - App: http://localhost:3000

---

## Testing the Application

### Option 1: Using Swagger UI (Backend Only)

1. Open http://localhost:8000/docs
2. Click "Authorize" button
3. Enter JWT token: `Bearer YOUR_JWT_TOKEN`
4. Test all endpoints interactively

### Option 2: Using Frontend + Backend

1. Open http://localhost:3000
2. Sign up / Sign in (requires Better Auth setup)
3. Create, view, update, and delete todos
4. Mark todos as complete/incomplete

---

## Quick Test with curl (Backend Only)

```bash
# Set your JWT token
export JWT_TOKEN="your-jwt-token-here"

# Create a todo
curl -X POST http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Todo", "description": "Testing the API"}'

# List todos
curl -X GET http://localhost:8000/api/v1/todos \
  -H "Authorization: Bearer $JWT_TOKEN"
```

---

## Troubleshooting

### Backend Issues

**MemoryError during pip install**:
```bash
# Install packages individually
pip install fastapi
pip install uvicorn[standard]
pip install sqlmodel
pip install psycopg2-binary
pip install alembic
pip install pydantic pydantic-settings
pip install python-jose[cryptography]
pip install python-dotenv
```

**Database connection error**:
- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` is correct
- For Neon: Ensure `?sslmode=require` is in connection string

**JWT verification fails**:
- Verify `JWT_SECRET_KEY` matches Better Auth configuration
- Check token format: `Authorization: Bearer <token>`

### Frontend Issues

**npm install fails**:
```bash
# Clear cache and retry
npm cache clean --force
npm install
```

**API connection error**:
- Verify backend is running on port 8000
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Ensure CORS is configured in backend `.env`

---

## Project Status

✅ **Backend (Complete)**:
- All 5 REST endpoints implemented
- JWT authentication integrated
- User-level data isolation enforced
- Database migrations ready
- OpenAPI documentation available

✅ **Frontend (Existing)**:
- Next.js 16 with App Router
- Authentication pages
- Dashboard for todo management
- Responsive design

---

## Next Steps

1. **Set up Better Auth** for JWT token generation
2. **Configure database** (PostgreSQL or Neon)
3. **Run both servers** in separate terminals
4. **Test the application** end-to-end

---

## File Locations

- Backend: `D:\Quarter004\phase2\backend\`
- Frontend: `D:\Quarter004\phase2\frontend\`
- Backend .env: `backend\.env`
- Frontend .env: `frontend\.env.local`
- API Docs: http://localhost:8000/docs (when backend running)
