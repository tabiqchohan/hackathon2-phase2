"""Custom exception classes for the Todo API."""


class TodoNotFoundError(Exception):
    """Raised when a todo is not found."""

    def __init__(self, todo_id: str):
        self.todo_id = todo_id
        super().__init__(f"Todo with id {todo_id} not found")


class ForbiddenError(Exception):
    """Raised when a user attempts to access a resource they don't own."""

    def __init__(self, message: str = "You do not have permission to access this resource"):
        self.message = message
        super().__init__(message)


class ValidationError(Exception):
    """Raised when validation fails."""

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class UnauthorizedError(Exception):
    """Raised when authentication fails."""

    def __init__(self, message: str = "Invalid or expired JWT token"):
        self.message = message
        super().__init__(message)
