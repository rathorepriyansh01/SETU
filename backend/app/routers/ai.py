from fastapi import APIRouter
from app.schemas.schemas import SearchIn
from app.services.ai_service import ai_service

router = APIRouter(prefix="/api/ai", tags=["AI"])

@router.post("/understand-requirement")
def understand_requirement(req: SearchIn):
    intent = ai_service.understand_requirement(req.query)
    return intent
