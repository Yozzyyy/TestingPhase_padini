from datetime import datetime

from pydantic import BaseModel, ConfigDict
from pydantic_core.core_schema import datetime_schema
from sqlalchemy.sql.sqltypes import Date, DateTime

class UserCreate(BaseModel):
    staff_id: int
    email: str
    role: str = "Staff"  # Default
    job_title: str
    store_location: str
    # Required for Admin accounts (enforced in the endpoint); Staff log in by ID only
    password: str | None = None

class UserUpdate(BaseModel):
    # All fields optional: only the ones provided are changed (staff_id is immutable)
    email: str | None = None
    role: str | None = None
    job_title: str | None = None
    store_location: str | None = None
    is_active: bool | None = None
    # Sets a new password; required when promoting a passwordless user to Admin
    password: str | None = None

class StaffLogin(BaseModel):
    staff_id: int

class AdminLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    staff_id: int
    email: str
    role: str
    job_title: str | None = None
    store_location: str | None = None
    is_active: bool

class AuditLogResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    log_id: int
    user_id: int | None = None
    staff_id: int | None = None
    email: str | None = None
    attempted_identifier: str | None = None
    login_time: datetime
    ip_address: str | None = None
    login_status: str
