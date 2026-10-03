from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.models import AuditEvent
from app.websocket.connection_manager import manager

class AuditService:
    @staticmethod
    async def log_event(
        db: Session,
        actor_role: str,
        event_type: str,
        entity_id: Optional[str] = None,
        actor_id: Optional[str] = None,
        metadata_json: Optional[Dict[str, Any]] = None
    ) -> AuditEvent:
        """
        Persists audit event to SQLite and broadcasts via WebSocket live feed.
        """
        event = AuditEvent(
            actor_role=actor_role,
            actor_id=actor_id,
            event_type=event_type,
            entity_id=str(entity_id) if entity_id else None,
            metadata_json=metadata_json or {}
        )
        db.add(event)
        db.commit()
        db.refresh(event)

        # Broadcast real-time update
        await manager.broadcast({
            "type": "AUDIT_EVENT",
            "data": {
                "id": event.id,
                "actor_role": event.actor_role,
                "event_type": event.event_type,
                "entity_id": event.entity_id,
                "metadata_json": event.metadata_json,
                "created_at": event.created_at.isoformat()
            }
        })
        return event

audit_service = AuditService()
