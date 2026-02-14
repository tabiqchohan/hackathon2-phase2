"""API v1 router configuration."""
from fastapi import APIRouter

from app.api.v1.todos import router as todos_router

# Create main API router
api_router = APIRouter()

# Include sub-routers
api_router.include_router(todos_router, prefix="/todos", tags=["todos"])
