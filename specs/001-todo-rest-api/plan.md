# Implementation Plan: Multi-User Todo REST API

**Branch**: `001-todo-rest-api` | **Date**: 2026-02-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-todo-rest-api/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a secure, multi-user RESTful API for todo management with JWT-based authentication and PostgreSQL persistence. The API implements five core operations (Create, Read, Update, Delete, Toggle Status) with strict user-level data isolation. Architecture follows a layered approach (API → Service → ORM → Database) using FastAPI, SQLModel, and Neon Serverless PostgreSQL.

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.109+, SQLModel 0.0.14+, Pydantic 2.5+, python-jose[cryptography] (JWT), psycopg2-binary (PostgreSQL driver)
**Storage**: Neon Serverless PostgreSQL (cloud-hosted)
**Testing**: pytest 7.4+, pytest-asyncio, httpx (for FastAPI testing)
**Target Platform**: Linux server (containerized deployment)
**Project Type**: Web API (backend only)
**Performance Goals**: <500ms p95 latency for CRUD operations, support 100+ concurrent users
**Constraints**: <200ms p95 for single todo operations, stateless authentication (JWT only), user-scoped queries enforced at service layer
**Scale/Scope**: Multi-tenant (100+ users), ~1000 todos per user expected, 5 REST endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Multi-user Security and Data Isolation
- **Status**: PASS
- **Evidence**: Spec requires user-level data isolation (FR-007), JWT authentication (FR-006), and user-scoped queries enforced at service layer

### ✅ Consistency Between Frontend, Backend, and Database
- **Status**: PASS (Backend only in this phase)
- **Evidence**: Data models will be defined using SQLModel (unified ORM + Pydantic validation), ensuring consistency between API contracts and database schema

### ✅ RESTful API Correctness and Adherence to Standard HTTP Methods
- **Status**: PASS
- **Evidence**: Spec mandates REST conventions (FR-015), proper HTTP status codes (FR-010), and standard resource naming

### ✅ Spec-driven Development Workflow
- **Status**: PASS
- **Evidence**: Following /sp.specify → /sp.plan → /sp.tasks → /sp.implement workflow

### ✅ Progressive Enhancement Without Breaking Phase I Logic
- **Status**: PASS (No Phase I to break)
- **Evidence**: This is the initial backend implementation; no prior logic exists

### ✅ Agentic Dev Stack Only
- **Status**: PASS
- **Evidence**: Development constrained to Agentic Dev Stack methodology (TC-005)

### ✅ Backend: Python FastAPI
- **Status**: PASS
- **Evidence**: FastAPI mandated in technical constraints (TC-001)

### ✅ ORM: SQLModel
- **Status**: PASS
- **Evidence**: SQLModel mandated in technical constraints (TC-002)

### ✅ Database: Neon Serverless PostgreSQL
- **Status**: PASS
- **Evidence**: Neon PostgreSQL mandated in technical constraints (TC-003)

### ✅ Authentication: Better Auth (JWT)
- **Status**: PASS
- **Evidence**: Better Auth JWT verification mandated in technical constraints (TC-004)

**Gate Result**: ✅ ALL CHECKS PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-rest-api/
├── spec.md              # Feature specification
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── openapi.yaml     # OpenAPI 3.0 specification
├── checklists/          # Quality validation
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── api/                 # Route handlers (thin layer)
│   │   ├── __init__.py
│   │   ├── deps.py          # Dependency injection (DB session, current user)
│   │   └── v1/
│   │       ├── __init__.py
│   │       └── todos.py     # Todo endpoints
│   ├── core/                # Core configuration and utilities
│   │   ├── __init__.py
│   │   ├── config.py        # Settings (Pydantic BaseSettings)
│   │   ├── security.py      # JWT verification, user extraction
│   │   └── database.py      # SQLModel engine, session management
│   ├── models/              # SQLModel database models
│   │   ├── __init__.py
│   │   └── todo.py          # Todo model (ORM)
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   └── todo.py          # TodoCreate, TodoUpdate, TodoResponse
│   └── services/            # Business logic layer
│       ├── __init__.py
│       └── todo.py          # Todo CRUD operations (user-scoped)
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures (test client, DB)
│   ├── unit/                # Unit tests (services, models)
│   │   └── test_todo_service.py
│   ├── integration/         # Integration tests (API + DB)
│   │   └── test_todo_api.py
│   └── contract/            # Contract tests (OpenAPI compliance)
│       └── test_openapi_contract.py
├── alembic/                 # Database migrations
│   ├── versions/
│   └── env.py
├── .env.example             # Environment variable template
├── requirements.txt         # Python dependencies
├── pyproject.toml           # Project metadata and tool config
└── README.md                # Setup and usage instructions
```

**Structure Decision**: Backend-only structure selected because this feature implements only the REST API (no frontend in scope). The layered architecture (API → Service → ORM → Database) enforces separation of concerns: route handlers validate requests and delegate to services, services contain business logic and enforce user-scoping, models define database schema, and schemas define API contracts.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All constitution checks passed.

## Architecture Overview

### Layered Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│ Client (Frontend / API Consumer)                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ HTTP + JWT
┌─────────────────────────────────────────────────────────────┐
│ API Layer (app/api/)                                        │
│ - Route handlers (FastAPI endpoints)                        │
│ - Request validation (Pydantic schemas)                     │
│ - Response serialization                                    │
│ - Dependency injection (DB session, current user)           │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ Service calls
┌─────────────────────────────────────────────────────────────┐
│ Service Layer (app/services/)                               │
│ - Business logic                                            │
│ - User-scoped query filtering (security enforcement)        │
│ - Data validation and transformation                        │
│ - Transaction management                                    │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ ORM queries
┌─────────────────────────────────────────────────────────────┐
│ ORM Layer (app/models/ + SQLModel)                          │
│ - Database models (SQLModel classes)                        │
│ - Relationships and constraints                             │
│ - Type-safe query building                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼ SQL
┌─────────────────────────────────────────────────────────────┐
│ Database (Neon Serverless PostgreSQL)                       │
│ - Data persistence                                          │
│ - Constraints and indexes                                   │
│ - Transaction isolation                                     │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

1. **Client Request**: Client sends HTTP request with `Authorization: Bearer <JWT>` header
2. **Authentication**: Security middleware verifies JWT token and extracts user_id
3. **Route Handler**: FastAPI endpoint receives request, validates path/query parameters
4. **Dependency Injection**: Route injects DB session and current_user (from JWT)
5. **Service Invocation**: Route calls service method with user_id and request data
6. **User-Scoped Query**: Service filters all queries by user_id (security enforcement)
7. **Database Operation**: SQLModel executes query against PostgreSQL
8. **Response Serialization**: Service returns data, route serializes to JSON via Pydantic schema
9. **HTTP Response**: FastAPI returns response with appropriate status code

### Security Model

**Authentication**: JWT tokens issued by Better Auth (external system)
- API verifies token signature using Better Auth's public key
- Extracts user_id from token claims
- No session state stored on backend (stateless)

**Authorization**: User-scoped data access
- All service methods require user_id parameter
- All database queries filtered by `WHERE user_id = :user_id`
- No cross-user data access possible at service layer
- Route handlers cannot bypass user-scoping (enforced by service signatures)

**Data Isolation**: Database-level and application-level
- Each todo record has `user_id` foreign key (NOT NULL)
- Service layer enforces user-scoping on all CRUD operations
- No shared todos or public todos in this version

### Design Rules

1. **No Business Logic in Route Handlers**: Route handlers only validate requests, call services, and serialize responses
2. **All Queries User-Scoped**: Every database query must filter by user_id (enforced at service layer)
3. **Service Layer Owns Security**: Services enforce user-scoping; routes cannot bypass this
4. **Schemas Define Contracts**: Pydantic schemas define API contracts; models define database schema
5. **Dependency Injection**: Use FastAPI dependencies for DB sessions and current_user extraction
6. **Explicit Error Handling**: Services raise domain-specific exceptions; routes catch and convert to HTTP responses
7. **Stateless Authentication**: No session storage; JWT contains all necessary user context

## Phase 0: Research (Completed)

### Research Questions Resolved

**Q1: How to integrate Better Auth JWT verification in FastAPI?**
- **Decision**: Use python-jose library for JWT decoding and verification
- **Rationale**: Industry-standard library, supports RS256/HS256 algorithms, integrates cleanly with FastAPI dependencies
- **Implementation**: Create `get_current_user()` dependency that extracts and verifies JWT from Authorization header
- **Alternatives Considered**: PyJWT (less FastAPI-friendly), authlib (overkill for verification-only use case)

**Q2: How to enforce user-scoped queries at service layer?**
- **Decision**: All service methods require `user_id: str` parameter; all queries include `WHERE user_id = :user_id`
- **Rationale**: Explicit parameter makes security enforcement visible and testable; impossible to forget filtering
- **Implementation**: Service method signatures like `def get_todos(db: Session, user_id: str, skip: int, limit: int)`
- **Alternatives Considered**: Thread-local context (implicit, error-prone), middleware injection (bypasses type safety)

**Q3: How to structure SQLModel models for todos?**
- **Decision**: Single `Todo` model with fields: id (UUID), title (str), description (str | None), completed (bool), user_id (str), created_at, updated_at, completed_at (datetime | None)
- **Rationale**: Matches spec requirements (FR-001, FR-009, FR-012, FR-013); simple schema with no relationships
- **Implementation**: SQLModel class with table=True, Field() for constraints and defaults
- **Alternatives Considered**: Separate User model (not needed; Better Auth owns users), soft delete (explicitly out of scope per A-007)

**Q4: How to handle database migrations?**
- **Decision**: Use Alembic for schema migrations
- **Rationale**: Standard tool for SQLAlchemy/SQLModel, supports auto-generation from models, version control for schema
- **Implementation**: Alembic configured to detect SQLModel changes, migrations stored in `alembic/versions/`
- **Alternatives Considered**: Manual SQL scripts (error-prone), SQLModel create_all() (no versioning)

**Q5: How to structure API versioning?**
- **Decision**: Use `/api/v1/` prefix for all endpoints
- **Rationale**: Enables future API evolution without breaking clients; industry standard
- **Implementation**: Router mounted at `/api/v1`, todos endpoints at `/api/v1/todos`
- **Alternatives Considered**: No versioning (breaks clients on changes), header-based versioning (less discoverable)

**Q6: How to handle pagination for todo lists?**
- **Decision**: Offset-based pagination with `skip` and `limit` query parameters
- **Rationale**: Simple, stateless, sufficient for expected scale (~1000 todos per user)
- **Implementation**: Service method accepts skip/limit, returns list + total count
- **Alternatives Considered**: Cursor-based (overkill for scale), page-based (less flexible)

**Q7: How to structure error responses?**
- **Decision**: Consistent JSON error format: `{"detail": "Error message", "error_code": "ERROR_CODE"}`
- **Rationale**: Structured errors enable client-side error handling; error codes support i18n
- **Implementation**: Custom exception classes, FastAPI exception handlers
- **Alternatives Considered**: Plain string errors (not machine-readable), RFC 7807 Problem Details (overkill)

**Q8: How to configure database connection for Neon?**
- **Decision**: Use DATABASE_URL environment variable with connection pooling via SQLModel/SQLAlchemy
- **Rationale**: Standard pattern, supports connection pooling, works with Neon's serverless architecture
- **Implementation**: Settings class loads DATABASE_URL, creates engine with pool_pre_ping=True
- **Alternatives Considered**: Direct psycopg2 (no ORM benefits), connection per request (inefficient)

## Phase 1: Design & Contracts

*Artifacts generated in this phase:*
- `data-model.md` - Entity definitions and relationships
- `contracts/openapi.yaml` - OpenAPI 3.0 API specification
- `quickstart.md` - Setup and usage guide

*Agent context will be updated after artifact generation.*

---

**Next Steps**: Execute Phase 1 artifact generation (data-model.md, contracts/, quickstart.md), then update agent context.
