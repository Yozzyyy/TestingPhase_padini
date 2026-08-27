from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session

from database import get_db
import models
import schemas
from auth.security import pwd_context, create_access_token, log_login_attempt

router = APIRouter(
    prefix="/api/auth",
    tags=["Admin Authentication"]
)

@router.post("/login/admin")
def login_admin(request_data: schemas.AdminLogin, request: Request, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        models.User.email == request_data.email,
        models.User.role == "Admin"
    ).first()

    client_ip = request.client.host if request.client else "Unknown"

    if not user:
        log_login_attempt(db, None, client_ip, "Failed", attempted_identifier=request_data.email)
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    if not user.hashed_password or not pwd_context.verify(request_data.password, user.hashed_password):
        log_login_attempt(db, user.user_id, client_ip, "Failed")
        raise HTTPException(status_code=401, detail="Invalid Credentials")

    log_login_attempt(db, user.user_id, client_ip, "Success")
    token = create_access_token(data={"sub": str(user.user_id), "role": user.role})
    return {"access_token": token, "token_type": "bearer", "role": user.role}
