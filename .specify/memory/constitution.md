<!--
Sync Impact Report:
Version change: 1.0.0 → 1.0.0 (initial creation)
Added sections: All sections added based on project requirements
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✅ updated
  - .specify/templates/spec-template.md: ✅ updated
  - .specify/templates/tasks-template.md: ✅ updated
  - .specify/templates/commands/*.md: ✅ updated
  - README.md: ⚠ pending
Modified principles: None (new project)
Follow-up TODOs: None
-->
# Phase II — Todo Full-Stack Web Application Constitution

## Core Principles

### Multi-user Security and Data Isolation
All user data must be properly isolated and secured; User access controls must prevent unauthorized data access; Each user can only access their own todos and related data
<!-- Ensures privacy and security in multi-user environment -->

### Consistency Between Frontend, Backend, and Database
Data models and API contracts must be consistent across all application layers; Changes to schema must be propagated to all affected components; Synchronous updates required when any layer changes
<!-- Ensures system reliability and reduces integration errors -->

### RESTful API Correctness and Adherence to Standard HTTP Methods
All API endpoints must follow REST conventions and proper HTTP method usage; Responses must conform to standard HTTP status codes and response formats; Endpoints must be discoverable and predictable
<!-- Enables interoperability and predictable API behavior -->

### Spec-driven Development Workflow (spec → plan → tasks → implement)
All development must follow the sequence: specification, planning, task breakdown, then implementation; Changes must flow through each stage in order; All code must be traceable to spec items
<!-- Ensures systematic and traceable development process -->

### Progressive Enhancement Without Breaking Phase I Logic
New features must enhance existing functionality without removing or breaking previous capabilities; Backward compatibility must be maintained for existing API endpoints and UI features; New features should build upon established patterns
<!-- Maintains continuity and prevents regression in existing functionality -->

### Agentic Dev Stack Only
Development must use automated agents and tooling; Manual coding is prohibited; All changes must be made through specified agent workflows
<!-- Ensures consistent and reproducible development process -->

## Technology Stack Standards

### Frontend: Next.js 16+ (App Router)
All frontend components must use Next.js App Router architecture; Client-side rendering and server-side rendering must be properly utilized; Responsive design patterns must be implemented consistently
<!-- Provides modern frontend framework with optimal performance -->

### Backend: Python FastAPI
All API endpoints must be implemented using FastAPI framework; Request/response validation must leverage Pydantic models; Async capabilities must be leveraged for performance
<!-- Ensures fast, type-safe API development -->

### ORM: SQLModel
Database operations must use SQLModel ORM exclusively; Model definitions must follow SQLModel conventions; Type safety must be maintained in database queries
<!-- Provides typed database interaction with SQLAlchemy benefits -->

### Database: Neon Serverless PostgreSQL
All data persistence must use Neon PostgreSQL service; Connection pooling and scalability must be leveraged; Schema migrations must be properly managed
<!-- Ensures reliable, scalable cloud database infrastructure -->

### Authentication: Better Auth (JWT)
All user authentication must use Better Auth with JWT tokens; Token validation must occur on protected endpoints; Session management must be secure and stateless
<!-- Provides secure, standardized authentication mechanism -->

## Development Workflow

### All Todo Operations Accessible via Web Interface and API
Every todo operation (Add, View, Update, Delete, Mark Complete) must be available through both UI and API; Consistent behavior must be maintained across both interfaces; Error handling must be equivalent in both implementations
<!-- Ensures comprehensive feature availability -->

### Frontend Responsive Design and Intuitive UX
User interface must work across desktop, tablet, and mobile devices; User experience must be intuitive and efficient; Accessibility standards must be followed
<!-- Provides consistent user experience across platforms -->

### Clear, Modular Project Structure and Code Readability
Code organization must follow modular patterns; Dependencies must be clear and minimal; Code must be documented where not self-explanatory
<!-- Facilitates maintenance and onboarding -->

## Governance

All development must adhere to the specified technology stack constraints; All API contracts must be verifiable against the specification; Automated testing must cover all specified functionality; Code reviews must verify compliance with these principles

**Version**: 1.0.0 | **Ratified**: 2026-02-07 | **Last Amended**: 2026-02-07