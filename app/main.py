from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse, FileResponse
import os
from app.api.endpoints import router as validate_router
from app.api.asp_mock import router as mock_router
from app.api.health import router as health_router
from app.api.batch import router as batch_router
from app.api.history import router as history_router
from app.api.analytics import router as analytics_router
from app.core.config import settings
from app.core.logging import RequestLoggingMiddleware, log
from app.middleware.auth import APIKeyMiddleware
from app.core.exceptions import validation_exception_handler, unhandled_exception_handler
from app.db.session import init_db

# Init DB
init_db()

app = FastAPI(
    title=settings.app_name,
    description="""## Enterprise E-Invoicing Validation Engine Aligned with **UAE PINT AE** mandatory field requirements.
### Endpoints
- **`/api/v1/validate-invoice`** — Accepts raw ERP payloads (SAP, Oracle, Dynamics).
  Adapter normalises to PINT AE schema before validation.
- **`/asp/v1/validate`** — Accepts pre-normalised PINT AE payload. Simulates ASP forwarding.
- **`/asp/v1/submit`** — Simulates FTA submission. Returns clearance ID.
- **`/api/v1/batch-validate`** — Submit up to 500 invoices asynchronously.
### Error Categories
| Category | Description |
|---|---|
| `FORMAT` | Field format or presence violation |
| `CALCULATION` | Mathematical inconsistency |
| `COMPLIANCE` | PINT AE business rule violation |
    """,
    version=settings.api_version,
    contact={"name": "E-Invoicing POC", "email": "support@yourdomain.com"},
    license_info={"name": "Proprietary"}
)

# SlowAPI Limiter setup
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
def get_tenant_key(request: Request):
    return getattr(request.state, "tenant_id", get_remote_address(request))
limiter = Limiter(key_func=get_tenant_key)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Middlewares (Order matters: outermost first)
@app.middleware("http")
async def limit_payload_size(request: Request, call_next):
    if request.headers.get("content-length"):
        if int(request.headers.get("content-length")) > settings.max_payload_bytes:
            return JSONResponse(status_code=413, content={"error": "Payload too large"})
    return await call_next(request)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://manasdevhub.github.io",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)
app.add_middleware(APIKeyMiddleware)
app.add_middleware(RequestLoggingMiddleware)

# Exceptions
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Prometheus setup
from prometheus_client import make_asgi_app
metrics_app = make_asgi_app()
app.mount("/metrics", metrics_app)

# Routers
app.include_router(health_router, prefix="/health", tags=["Health Probes"])
app.include_router(validate_router, prefix="/api/v1", tags=["Internal Validation"])
app.include_router(batch_router, prefix="/api/v1", tags=["Batch Processing"])
app.include_router(history_router, prefix="/api/v1", tags=["History API"])
app.include_router(analytics_router, prefix="/api/v1", tags=["Analytics API"])
app.include_router(mock_router, prefix="/asp/v1", tags=["ASP Mock Simulation"])

@app.get("/")
def read_root():
    return FileResponse("frontend/dist/index.html")

# Serve static files from the dist folder
if os.path.exists("frontend/dist"):
    app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")
    
    @app.get("/{rest_of_path:path}")
    async def react_spa_router(rest_of_path: str):
        # Look for the file in the dist folder
        file_path = os.path.join("frontend/dist", rest_of_path)
        if os.path.isfile(file_path):
            return FileResponse(file_path)
        # Otherwise, return index.html for React routing
        return FileResponse("frontend/dist/index.html")
