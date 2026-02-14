"""FastAPI application initialization and configuration."""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.core.config import settings
from app.core.exceptions import ForbiddenError, TodoNotFoundError, UnauthorizedError

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Multi-user Todo REST API with JWT authentication and PostgreSQL persistence",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception handlers
@app.exception_handler(TodoNotFoundError)
async def todo_not_found_handler(request: Request, exc: TodoNotFoundError):
    """Handle TodoNotFoundError exceptions."""
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": str(exc), "error_code": "TODO_NOT_FOUND"},
    )


@app.exception_handler(ForbiddenError)
async def forbidden_handler(request: Request, exc: ForbiddenError):
    """Handle ForbiddenError exceptions."""
    return JSONResponse(
        status_code=status.HTTP_403_FORBIDDEN,
        content={"detail": exc.message, "error_code": "FORBIDDEN"},
    )


@app.exception_handler(UnauthorizedError)
async def unauthorized_handler(request: Request, exc: UnauthorizedError):
    """Handle UnauthorizedError exceptions."""
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": exc.message, "error_code": "UNAUTHORIZED"},
        headers={"WWW-Authenticate": "Bearer"},
    )


# Health check endpoint
@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "healthy", "service": settings.APP_NAME}


# Root endpoint
@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Todo REST API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
    }


# Import and include routers
from app.api.v1 import api_router

app.include_router(api_router, prefix="/api/v1")
