---
description: "Implementation tasks for Multi-User Todo REST API"
---

# Tasks: Multi-User Todo REST API

**Input**: Design documents from `/specs/001-todo-rest-api/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend structure**: `backend/app/` (as defined in plan.md)
- All Python files require `__init__.py` in their directories

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure: backend/app/{api,core,models,schemas,services}/, backend/tests/, backend/alembic/
- [x] T002 Create all __init__.py files in backend/app/, backend/app/api/, backend/app/core/, backend/app/models/, backend/app/schemas/, backend/app/services/
- [x] T003 [P] Create requirements.txt with dependencies: fastapi>=0.109.0, sqlmodel>=0.0.14, pydantic>=2.5.0, python-jose[cryptography], psycopg2-binary, uvicorn[standard], alembic, python-dotenv
- [x] T004 [P] Create .env.example with template variables: DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM, APP_NAME, DEBUG
- [x] T005 [P] Create pyproject.toml with project metadata and tool configurations
- [x] T006 [P] Create .gitignore for Python project (venv/, __pycache__/, .env, *.pyc, .pytest_cache/)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Create core configuration in backend/app/core/config.py using Pydantic BaseSettings for DATABASE_URL, JWT_SECRET_KEY, JWT_ALGORITHM
- [x] T008 Create database engine and session management in backend/app/core/database.py with SQLModel engine, get_db() dependency
- [x] T009 Create JWT verification utilities in backend/app/core/security.py with verify_token() and decode_token() functions
- [x] T010 Create get_current_user() dependency in backend/app/api/deps.py that extracts user_id from JWT token
- [x] T011 Create get_db() dependency in backend/app/api/deps.py for database session injection
- [x] T012 Create FastAPI application in backend/app/main.py with CORS middleware, exception handlers, and health check endpoint
- [x] T013 Create API v1 router structure in backend/app/api/v1/__init__.py
- [x] T014 Initialize Alembic in backend/alembic/ with env.py configured for SQLModel
- [x] T015 [P] Create custom exception classes in backend/app/core/exceptions.py: TodoNotFoundError, ForbiddenError, ValidationError
- [x] T016 [P] Create error response models in backend/app/schemas/error.py: ErrorResponse with detail and error_code fields

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and View Personal Todos (Priority: P1) 🎯 MVP

**Goal**: Enable users to create new todos and view their personal todo list with proper authentication and user isolation

**Independent Test**: Authenticate as a user, create multiple todos via POST /api/v1/todos, retrieve list via GET /api/v1/todos, verify only user's todos are returned

### Implementation for User Story 1

- [x] T017 [P] [US1] Create Todo SQLModel in backend/app/models/todo.py with fields: id (UUID), title (str, max 200), description (Optional[str], max 2000), completed (bool, default False), user_id (str, indexed), created_at, updated_at, completed_at (Optional[datetime])
- [x] T018 [P] [US1] Create TodoCreate schema in backend/app/schemas/todo.py with title (required, 1-200 chars) and description (optional, max 2000 chars) fields, add validator to ensure title is not empty after trimming
- [x] T019 [P] [US1] Create TodoResponse schema in backend/app/schemas/todo.py with all Todo fields, enable from_attributes for ORM compatibility
- [x] T020 [P] [US1] Create TodoListResponse schema in backend/app/schemas/todo.py with items (list[TodoResponse]), total (int), skip (int), limit (int) fields
- [x] T021 [US1] Create todo service in backend/app/services/todo.py with create_todo(db: Session, user_id: str, todo_data: TodoCreate) -> Todo method that enforces user_id assignment
- [x] T022 [US1] Add get_todos(db: Session, user_id: str, skip: int, limit: int, completed: Optional[bool]) -> tuple[list[Todo], int] method to backend/app/services/todo.py with user-scoped filtering
- [x] T023 [US1] Create todos router in backend/app/api/v1/todos.py with POST /todos endpoint that uses get_current_user and get_db dependencies, calls create_todo service, returns 201 with TodoResponse
- [x] T024 [US1] Add GET /todos endpoint to backend/app/api/v1/todos.py with query params (skip, limit, completed), uses get_current_user and get_db dependencies, calls get_todos service, returns 200 with TodoListResponse
- [x] T025 [US1] Mount todos router in backend/app/api/v1/__init__.py and include in main.py at /api/v1 prefix
- [x] T026 [US1] Create initial Alembic migration for todos table in backend/alembic/versions/ using alembic revision --autogenerate -m "Create todos table"
- [x] T027 [US1] Add validation error handling for TodoCreate in POST /todos endpoint, return 400 with ErrorResponse for validation failures
- [x] T028 [US1] Add authentication error handling in todos endpoints, return 401 with ErrorResponse for missing/invalid JWT

**Checkpoint**: At this point, User Story 1 should be fully functional - users can create and list their todos with proper authentication and isolation

---

## Phase 4: User Story 2 - Mark Todos as Complete (Priority: P2)

**Goal**: Enable users to toggle completion status of their todos with timestamp tracking

**Independent Test**: Create a todo, mark it complete via PATCH /api/v1/todos/{id}, verify completed=true and completed_at is set, mark incomplete, verify completed=false and completed_at is null

### Implementation for User Story 2

- [x] T029 [P] [US2] Create TodoUpdate schema in backend/app/schemas/todo.py with optional fields: title (Optional[str], 1-200 chars), description (Optional[str], max 2000 chars), completed (Optional[bool]), add validator for title if provided
- [x] T030 [US2] Add update_todo(db: Session, user_id: str, todo_id: UUID, todo_data: TodoUpdate) -> Optional[Todo] method to backend/app/services/todo.py that enforces user ownership, updates completed_at when completed changes
- [x] T031 [US2] Add PATCH /todos/{todo_id} endpoint to backend/app/api/v1/todos.py that uses get_current_user and get_db dependencies, calls update_todo service, returns 200 with TodoResponse or 404 if not found
- [x] T032 [US2] Add ownership validation in update_todo service - return None if todo doesn't exist or user doesn't own it
- [x] T033 [US2] Add 403 Forbidden error handling in PATCH endpoint when user attempts to update another user's todo
- [x] T034 [US2] Ensure completed_at is set to current UTC time when completed changes from False to True, and cleared when changed from True to False

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can create, list, and toggle completion status

---

## Phase 5: User Story 3 - Update Todo Details (Priority: P3)

**Goal**: Enable users to edit title and description of their todos

**Independent Test**: Create a todo, update its title and description via PATCH /api/v1/todos/{id}, verify changes persist and updated_at timestamp is updated

### Implementation for User Story 3

- [x] T035 [US3] Verify TodoUpdate schema from US2 already supports title and description updates (no new schema needed)
- [x] T036 [US3] Verify update_todo service method from US2 handles title and description updates correctly
- [x] T037 [US3] Verify PATCH endpoint from US2 handles title and description updates correctly
- [x] T038 [US3] Add validation in update_todo service to reject empty title updates (after trimming), return validation error
- [x] T039 [US3] Ensure updated_at timestamp is automatically updated on any field change via SQLModel or database trigger
- [x] T040 [US3] Add 400 Bad Request error handling in PATCH endpoint for validation errors (empty title, exceeding max length)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - full CRUD except delete

---

## Phase 6: User Story 4 - Delete Todos (Priority: P4)

**Goal**: Enable users to permanently delete their todos

**Independent Test**: Create a todo, delete it via DELETE /api/v1/todos/{id}, verify 204 response, attempt to retrieve it and verify 404 response

### Implementation for User Story 4

- [x] T041 [US4] Add delete_todo(db: Session, user_id: str, todo_id: UUID) -> bool method to backend/app/services/todo.py that enforces user ownership, returns True if deleted, False if not found or not owned
- [x] T042 [US4] Add DELETE /todos/{todo_id} endpoint to backend/app/api/v1/todos.py that uses get_current_user and get_db dependencies, calls delete_todo service, returns 204 No Content on success
- [x] T043 [US4] Add 404 Not Found error handling in DELETE endpoint when todo doesn't exist
- [x] T044 [US4] Add 403 Forbidden error handling in DELETE endpoint when user attempts to delete another user's todo
- [x] T045 [US4] Ensure delete operation is permanent (hard delete, not soft delete per spec assumption A-007)

**Checkpoint**: At this point, User Stories 1-4 should all work independently - full CRUD operations complete

---

## Phase 7: User Story 5 - Retrieve Individual Todo Details (Priority: P5)

**Goal**: Enable users to retrieve detailed information about a specific todo by its ID

**Independent Test**: Create a todo, retrieve it by ID via GET /api/v1/todos/{id}, verify all attributes are returned correctly

### Implementation for User Story 5

- [x] T046 [US5] Add get_todo_by_id(db: Session, user_id: str, todo_id: UUID) -> Optional[Todo] method to backend/app/services/todo.py that enforces user ownership
- [x] T047 [US5] Add GET /todos/{todo_id} endpoint to backend/app/api/v1/todos.py that uses get_current_user and get_db dependencies, calls get_todo_by_id service, returns 200 with TodoResponse
- [x] T048 [US5] Add 404 Not Found error handling in GET endpoint when todo doesn't exist
- [x] T049 [US5] Add 403 Forbidden error handling in GET endpoint when user attempts to retrieve another user's todo
- [x] T050 [US5] Verify TodoResponse schema includes all required fields per OpenAPI spec: id, title, description, completed, user_id, created_at, updated_at, completed_at

**Checkpoint**: All user stories (1-5) should now be independently functional - complete API implementation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final documentation

- [x] T051 [P] Create README.md in backend/ with setup instructions: prerequisites, installation, environment configuration, database setup, running the server
- [x] T052 [P] Add API documentation section to README.md with endpoint list and authentication instructions
- [x] T053 [P] Add troubleshooting section to README.md covering common issues: database connection, JWT verification, port conflicts
- [x] T054 [P] Verify all endpoints return consistent error response format per ErrorResponse schema
- [x] T055 [P] Add request/response logging in main.py for debugging (log level configurable via environment)
- [x] T056 Verify OpenAPI documentation is auto-generated correctly at /docs endpoint with all schemas and examples
- [ ] T057 Test complete user journey: create account in Better Auth, get JWT token, create todo, list todos, update todo, mark complete, delete todo
- [ ] T058 Verify user isolation: create todos as user A, attempt to access as user B, confirm 403 errors
- [ ] T059 Verify pagination works correctly: create 25 todos, test skip/limit parameters, verify total count
- [x] T060 [P] Add database connection health check endpoint at /health that verifies database connectivity
- [ ] T061 Run quickstart.md validation: follow all setup steps, verify all curl examples work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Extends US1 endpoints but independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Reuses US2 infrastructure but independently testable
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Models and schemas can be created in parallel (marked [P])
- Services depend on models being complete
- Endpoints depend on services being complete
- Error handling can be added after core endpoint implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T003, T004, T005, T006)
- All Foundational tasks marked [P] can run in parallel (T015, T016)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- Within User Story 1: T017, T018, T019, T020 can run in parallel (all schemas/models)
- Within User Story 2: T029 can start immediately (schema creation)
- Within User Story 4: T041 and T042 can be developed in parallel if service interface is defined first
- All Polish tasks marked [P] can run in parallel (T051, T052, T053, T054, T055, T060)

---

## Parallel Example: User Story 1

```bash
# Launch all schemas/models for User Story 1 together:
Task: "Create Todo SQLModel in backend/app/models/todo.py"
Task: "Create TodoCreate schema in backend/app/schemas/todo.py"
Task: "Create TodoResponse schema in backend/app/schemas/todo.py"
Task: "Create TodoListResponse schema in backend/app/schemas/todo.py"

# After models complete, launch service methods:
Task: "Create todo service with create_todo method"
Task: "Add get_todos method to todo service"

# After service complete, launch endpoints:
Task: "Create POST /todos endpoint"
Task: "Add GET /todos endpoint"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T016) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T017-T028)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Create todos as different users
   - Verify user isolation
   - Test pagination
   - Verify authentication errors
5. Deploy/demo if ready - you now have a working MVP!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP - basic todo creation and listing)
3. Add User Story 2 → Test independently → Deploy/Demo (adds completion tracking)
4. Add User Story 3 → Test independently → Deploy/Demo (adds editing capability)
5. Add User Story 4 → Test independently → Deploy/Demo (adds deletion)
6. Add User Story 5 → Test independently → Deploy/Demo (adds individual retrieval)
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T016)
2. Once Foundational is done:
   - Developer A: User Story 1 (T017-T028) - MVP priority
   - Developer B: User Story 2 (T029-T034)
   - Developer C: User Story 4 (T041-T045) - independent of US2/US3
3. After US1 and US2 complete:
   - Developer A: User Story 3 (T035-T040) - reuses US2 infrastructure
   - Developer B: User Story 5 (T046-T050)
4. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 61
- **Setup Phase**: 6 tasks
- **Foundational Phase**: 10 tasks (BLOCKING)
- **User Story 1 (MVP)**: 12 tasks
- **User Story 2**: 6 tasks
- **User Story 3**: 6 tasks
- **User Story 4**: 5 tasks
- **User Story 5**: 5 tasks
- **Polish Phase**: 11 tasks
- **Parallel Opportunities**: 15 tasks marked [P]

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story?] Description with file path`
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Backend structure uses backend/app/ not src/ per plan.md
- No test tasks included as tests were not explicitly requested in specification
- User isolation enforced at service layer via user_id parameter in all methods
- JWT verification handled by get_current_user() dependency
- All endpoints use /api/v1 prefix per plan.md versioning strategy
