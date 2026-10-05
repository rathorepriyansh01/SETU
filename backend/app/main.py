import logging
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database.database import engine, Base
from app.database.seed_data import seed_database
from app.routers import auth, patient, dispatcher, hospital, admin, ai
from app.websocket.connection_manager import manager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("setu.main")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="2.0.0",
    description="SETU — Smart Emergency & Healthcare Resilience Platform for Bhopal, MP"
)

origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins and "*" not in origins else ["*"],
    allow_origin_regex=r"https://.*\.vercel\.app" if "*" not in origins else None,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to build tables and seed Bhopal network data
@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    seed_database()
    logger.info("SETU FastAPI Backend startup complete.")

# Include Routers
app.include_router(auth.router)
app.include_router(patient.router)
app.include_router(dispatcher.router)
app.include_router(hospital.router)
app.include_router(admin.router)
app.include_router(ai.router)

@app.get("/")
def root():
    return {
        "message": "SETU Healthcare Resilience Platform API",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": settings.PROJECT_NAME,
        "demo_city": settings.DEFAULT_CITY,
        "mode": "Demo Network / Simulated Data"
    }

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Echo or process incoming ping
            await websocket.send_json({"type": "PONG", "message": data})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
