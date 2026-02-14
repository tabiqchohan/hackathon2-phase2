# Data Model: Todo Frontend Application

## Entities

### User
Represents a registered user in the system

**Fields**:
- id: string (unique identifier from auth system)
- email: string (user's email address)
- name: string (optional display name)
- createdAt: Date (account creation timestamp)
- updatedAt: Date (last update timestamp)

**Relationships**:
- Has many Todo items (user.todos)

### Todo
Represents a task item owned by a user

**Fields**:
- id: string (unique identifier)
- title: string (required task title)
- description: string (optional task description)
- completed: boolean (completion status, default: false)
- userId: string (foreign key to User)
- createdAt: Date (task creation timestamp)
- updatedAt: Date (last update timestamp)
- completedAt: Date (optional timestamp when marked complete)

**Validation Rules**:
- title must be between 1-255 characters
- completed must be boolean
- userId must reference an existing user
- createdAt and updatedAt are automatically managed

**State Transitions**:
- New Todo: completed = false, completedAt = null
- When marked complete: completed = true, completedAt = current timestamp
- When marked incomplete: completed = false, completedAt = null

## API Request/Response Objects

### Todo Creation Request
```
{
  title: string,
  description?: string
}
```

### Todo Response Object
```
{
  id: string,
  title: string,
  description?: string,
  completed: boolean,
  userId: string,
  createdAt: string, // ISO date string
  updatedAt: string, // ISO date string
  completedAt?: string // ISO date string, nullable
}
```

### Todo Update Request
```
{
  title?: string,
  description?: string,
  completed?: boolean
}
```

### Authentication Response
```
{
  user: {
    id: string,
    email: string,
    name?: string
  },
  token: string
}
```