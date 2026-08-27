from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload

import models
import schemas


from auth.security import require_admin
from database import get_db

router = APIRouter(
    prefix="/api/audit-logs",
    tags=["Audit Logs"]
)

@router.get("", response_model=list[schemas.AuditLogResponse], dependencies=[Depends(require_admin)])
def get_all_audit_logs(db: Session = Depends(get_db)):
    logs = (db.query(models.LogAudit).options(joinedload(models.LogAudit.user)).order_by(models.LogAudit.login_time.desc(), models.LogAudit.log_id.desc()).all())
    return [
        schemas.AuditLogResponse(
            log_id=log.log_id,
            user_id=log.user_id,
            staff_id=log.user.staff_id if log.user else None,
            email=log.user.email if log.user else None,
            attempted_identifier=log.attempted_identifier,
            login_time=log.login_time,
            ip_address=log.ip_address,
            login_status=log.login_status,
        )
        for log in logs
    ]
