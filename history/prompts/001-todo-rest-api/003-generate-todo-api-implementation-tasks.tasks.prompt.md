---
id: 003
title: generate-todo-api-implementation-tasks
stage: tasks
date: 2026-02-13
surface: agent
model: claude-sonnet-4-5-20250929
feature: 001-todo-rest-api
branch: 001-todo-rest-api
user: user
command: /sp.tasks
labels: ["tasks", "implementation", "todo-api", "user-stories", "mvp"]
links:
  spec: specs/001-todo-rest-api/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/001-todo-rest-api/tasks.md
tests:
  - none
---

## Prompt

/sp.tasks

Goal:
Implement Phase II backend — secure, multi-user Todo REST API.

Tasks:
1. Initialize FastAPI project structure
2. Configure environment variables and settings
3. Set up Neon PostgreSQL connection using SQLModel
4. Create database engine and session management
5. Define Task ORM model (id, title, completed, user_id)
6. Create Pydantic schemas (Create, Update, Response)
7. Implement JWT verification dependency (Better Auth integration)
8. Implement user extraction from JWT token
9. Create REST endpoints:
   - GET /api/{user_id}/tasks
   - POST /api/{user_id}/tasks
   - GET /api/{user_id}/tasks/{id}
   - PUT /api/{user_id}/tasks/{id}
   - DELETE /api/{user_id}/tasks/{id}
   - PATCH /api/{user_id}/tasks/{id}/complete
10. Enforce user-scoped filtering in all queries
11. Add proper HTTP status codes and error handling
12. Test endpoints locally with authenticated requests
13. Add minimal README with setup instructions

Rules:
- No frontend logic
- All operations must require valid JWT
- No business logic in route handlers

## Response snapshot

Generated comprehensive implementation task list organized by user story with 61 tasks across 8 phases.

**Task Organization**:

**Phase 1: Setup (6 tasks)**
- Project structure creation
- Dependency management (requirements.txt, pyproject.toml)
- Environment configuration (.env.example, .gitignore)

**Phase 2: Foundational (10 tasks) - BLOCKING**
- Core configuration (config.py, database.py, security.py)
- JWT verification and user extraction dependencies
- FastAPI application setup with middleware and exception handlers
- Alembic initialization
- Custom exception classes and error response models

**Phase 3: User Story 1 - Create and View Todos (12 tasks) - MVP**
- Todo SQLModel with all fields (id, title, description, completed, user_id, timestamps)
- Pydantic schemas (TodoCreate, TodoResponse, TodoListResponse)
- Service layer with create_todo and get_todos methods (user-scoped)
- REST endpoints: POST /todos, GET /todos with pagination and filtering
- Alembic migration for todos table
- Error handling for validation and authentication

**Phase 4: User Story 2 - Mark Complete (6 tasks)**
- TodoUpdate schema
- update_todo service method with ownership validation
- PATCH /todos/{id} endpoint
- Completion timestamp management (set on complete, clear on incomplete)
- 403 Forbidden error handling

**Phase 5: User Story 3 - Update Details (6 tasks)**
- Reuse TodoUpdate schema from US2
- Validation for empty title updates
- Automatic updated_at timestamp handling
- 400 Bad Request error handling

**Phase 6: User Story 4 - Delete Todos (5 tasks)**
- delete_todo service method with ownership validation
- DELETE /todos/{id} endpoint
- Hard delete implementation (permanent removal)
- 404 and 403 error handling

**Phase 7: User Story 5 - Retrieve Individual Todo (5 tasks)**
- get_todo_by_id service method with ownership validation
- GET /todos/{id} endpoint
- Complete attribute verification
- 404 and 403 error handling

**Phase 8: Polish & Cross-Cutting (11 tasks)**
- README.md with setup, API docs, troubleshooting
- Consistent error response format verification
- Request/response logging
- OpenAPI documentation verification
- Complete user journey testing
- User isolation testing
- Pagination testing
- Health check endpoint
- Quickstart validation

**Key Design Decisions**:
- Tasks organized by user story for independent implementation and testing
- Each user story can be completed and validated independently
- MVP = Phase 1 + Phase 2 + Phase 3 (User Story 1 only)
- 15 tasks marked [P] for parallel execution
- No test tasks included (not explicitly requested in spec)
- All tasks follow strict checklist format with IDs, labels, and file paths
- User isolation enforced at service layer (user_id parameter in all methods)

**Parallel Opportunities**:
- Setup phase: 4 tasks can run in parallel
- Foundational phase: 2 tasks can run in parallel
- User Story 1: 4 schema/model tasks can run in parallel
- Polish phase: 6 tasks can run in parallel
- All user stories can start in parallel after Foundational phase completes

**Implementation Strategy**:
- MVP First: Complete Setup + Foundational + US1 (28 tasks) for working todo creation/listing
- Incremental Delivery: Add one user story at a time, test independently, deploy
- Parallel Team: After Foundational, different developers can work on different user stories

## Outcome

- ✅ Impact: Complete, actionable task breakdown ready for implementation
- 🧪 Tests: No test tasks (not requested in spec)
- 📁 Files: 1 file created (tasks.md)
- 🔁 Next prompts: /sp.implement (execute implementation) or manual task execution
- 🧠 Reflection: Task generation successfully organized by user story priority. Each story is independently implementable and testable. Clear MVP path (US1 only = 28 tasks). Parallel opportunities identified for team efficiency.

## Evaluation notes (flywheel)

- Failure modes observed: None - task generation completed successfully
- Graders run and results (PASS/FAIL): Format validation PASSED (all 61 tasks follow checklist format with IDs, labels, file paths)
- Prompt variant (if applicable): Standard /sp.tasks workflow with user story organization
- Next experiment (smallest change to try): Proceed to /sp.implement or begin manual implementation starting with MVP (Phase 1-3)
