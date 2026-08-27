from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from auth import pwd_context
from auth.security import get_current_user, require_admin
from database import get_db

router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.UserResponse)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return current_user


# Fetch all users from Mariadb (admin only)
@router.get("", response_model=list[schemas.UserResponse], dependencies=[Depends(require_admin)])
def get_all_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


# Add a new user into DB (admin only)
@router.post("", status_code=status.HTTP_201_CREATED, dependencies=[Depends(require_admin)])
def create_user(user_data: schemas.UserCreate, db: Session = Depends(get_db)):

    # Admins log in with email + password, so a password is mandatory for them.
    # Staff log in by staff_id alone, so any password sent is ignored.
    hashed_password = None
    if user_data.role == "Admin":
        if not user_data.password:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password is required for Admin accounts."
            )
        if len(user_data.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must be at least 8 characters long."
            )
        hashed_password = pwd_context.hash(user_data.password)

    new_user = models.User(
        staff_id=user_data.staff_id,
        email=user_data.email,
        role=user_data.role,
        job_title=user_data.job_title,
        store_location=user_data.store_location,
        hashed_password=hashed_password
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"status": "success", "user_id": new_user.user_id}
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database insertion failed. Check unique constraints.")


# Update a user's details / activate / deactivate (admin only)
@router.patch("/{user_id}", response_model=schemas.UserResponse)
def update_user(
    user_id: int,
    updates: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_admin: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.user_id == user_id).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    if updates.role is not None and updates.role not in ("Admin", "Staff"):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Role must be either 'Admin' or 'Staff'."
        )

    # Guard against an admin locking themselves out
    if user.user_id == current_admin.user_id:
        if updates.is_active is False:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="You cannot deactivate your own account."
            )
        if updates.role == "Staff":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="You cannot remove your own admin role."
            )

    if updates.email is not None:
        user.email = updates.email
    if updates.role is not None:
        user.role = updates.role
    if updates.job_title is not None:
        user.job_title = updates.job_title
    if updates.store_location is not None:
        user.store_location = updates.store_location
    if updates.is_active is not None:
        user.is_active = updates.is_active

    if updates.password:
        if len(updates.password) < 8:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="Password must be at least 8 characters long."
            )
        user.hashed_password = pwd_context.hash(updates.password)

    # Same rule as creation: Admin accounts must be able to log in with a password
    if user.role == "Admin" and not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="A password is required when promoting a user to Admin."
        )

    try:
        db.commit()
        db.refresh(user)
        return user
    except Exception:
        db.rollback()
        raise HTTPException(status_code=400, detail="Database update failed. Check unique constraints.")
