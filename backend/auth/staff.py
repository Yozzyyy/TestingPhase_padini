from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth.security import create_access_token, log_login_attempt

router = APIRouter(
    prefix="/api/auth",
    tags=["Staff Authentication"]
)

@router.post("/login/staff")
def login_staff(request_data: schemas.StaffLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.staff_id == request_data.staff_id,
        models.User.role == "Staff"
    ).first()

    client_ip = request.client.host if request.client else "Unknown"

    if not user:
        log_login_attempt(db, None, client_ip, "Failed", attempted_identifier=str(request_data.staff_id))
        raise HTTPException(status_code=401, detail="Invalid Staff ID or not authorized as Staff.")

    if not user.is_active:
        log_login_attempt(db, user.user_id, client_ip, "Failed")
        raise HTTPException(status_code=403, detail="Account is deactivated.")

    log_login_attempt(db, user.user_id, client_ip, "Success")
    token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}
