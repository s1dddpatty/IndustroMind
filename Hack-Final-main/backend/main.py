"""
ET-Hack-Backend — FastAPI application entry point.
Registers all Person 1 REST API routers and subscribes to Person 2 event processing.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.core.config import settings
from backend.core.exceptions import register_exception_handlers
from backend.database.base import Base
from backend.database.session import engine


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    """Application lifespan: create tables and subscribe processing service to events."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Subscribe Person 2 processing service to Person 1 events
    from backend.services.processing import processing_service
    processing_service.subscribe()

    yield
    await engine.dispose()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url=settings.DOCS_URL,
    redoc_url=settings.REDOC_URL,
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
register_exception_handlers(app)

# ── Person 1 Core Routers ──
from backend.api.v1.auth import router as auth_router
from backend.api.v1.users import router as users_router
from backend.api.v1.organizations import org_router, plant_router
from backend.api.v1.documents import router as documents_router
from backend.api.v1.notifications import router as notifications_router
from backend.api.v1.audit_logs import router as audit_logs_router
from backend.api.v1.admin import router as admin_router
from backend.api.v1.reports import router as reports_router

# ── Person 2 Integration Routers ──
from backend.api.v1.graph import router as graph_router
from backend.api.v1.integrity import router as integrity_router
from backend.api.v1.decisions import router as decisions_router
from backend.api.v1.dashboard import router as dashboard_router
from backend.api.v1.mortality import router as mortality_router
from backend.api.v1.expert import router as expert_router

# Register all routers under /api/v1
api_prefix = settings.API_PREFIX

app.include_router(auth_router, prefix=api_prefix)
app.include_router(users_router, prefix=api_prefix)
app.include_router(org_router, prefix=api_prefix)
app.include_router(plant_router, prefix=api_prefix)
app.include_router(documents_router, prefix=api_prefix)
app.include_router(notifications_router, prefix=api_prefix)
app.include_router(audit_logs_router, prefix=api_prefix)
app.include_router(admin_router, prefix=api_prefix)
app.include_router(reports_router, prefix=api_prefix)

app.include_router(graph_router, prefix=api_prefix)
app.include_router(integrity_router, prefix=api_prefix)
app.include_router(decisions_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(mortality_router, prefix=api_prefix)
app.include_router(expert_router, prefix=api_prefix)


@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": settings.APP_NAME}


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with service info."""
    return {
        "service": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": settings.DOCS_URL,
    }
