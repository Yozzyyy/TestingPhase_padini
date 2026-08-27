import datetime
from typing import Optional
from sqlalchemy import Integer, String, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database import Base

# 1. Honest-but-annoying: matches the DB, but Python type is bool | None
# is_active: Mapped[Optional[bool]] = mapped_column(Boolean, default=True)

# 2. Clean-but-schema-changing: Python type is bool, but column becomes NOT NULL
#    → next autogenerate would emit an alter_column migration
# is_active: Mapped[bool] = mapped_column(Boolean, default=True)

# 3. What we did: explicit nullable= overrides the annotation's inference
#    → DB column stays nullable (matches reality, no migration),
#      Python type is plain bool
# is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=True)

# Option 3 keeps both sides happy: the schema description still matches the real (nullable) columns,
# while the type checker sees the non-optional type that reflects how the column actually behaves,
# since the default= guarantees every row written through the app gets a value.
# That tension is also why I said the tidy end state is a migration making the columns NOT NULL:
# then option 2 becomes correct, and the override (and the comments explaining it) can be deleted.

# 1. The Users Table Model
class User(Base):
    __tablename__ = "users"
    user_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    staff_id: Mapped[int] = mapped_column(Integer, nullable=False, unique=True) # Unique automatically creates an index
    email: Mapped[str] = mapped_column(String(255), nullable=False, unique=True) # Unique automatically creates an index
    role: Mapped[str] = mapped_column(Enum("Admin", "Staff", name="user_roles"), nullable=False, default="Staff")
    job_title: Mapped[Optional[str]] = mapped_column(String(50))
    # ADDED INDEX: Speeds up filtering employees by physical outlet
    store_location: Mapped[Optional[str]] = mapped_column(String(100), index=True)
    # nullable=True matches the existing DB schema; the default means it's never None in practice
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=True)
    hashed_password: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    faqs: Mapped[list["FAQ"]] = relationship("FAQ", back_populates="creator")
    audit_logs: Mapped[list["LogAudit"]] = relationship("LogAudit", back_populates="user")


# 2. The FAQ Table Model
class FAQ(Base):
    __tablename__ = "faq"
    faq_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_by: Mapped[int] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="RESTRICT"), nullable=False)
    # ADDED INDEX: Crucial for your HR chatbot filtering by 'Leave', 'Dress Code', etc.
    category: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    question: Mapped[str] = mapped_column(String(1000), nullable=False)
    answer: Mapped[str] = mapped_column(String(5000), nullable=False)
    # nullable=True matches the existing DB schema; the defaults mean these are never None in practice
    is_published: Mapped[bool] = mapped_column(Boolean, default=False, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=True)

    # Relationships
    creator: Mapped["User"] = relationship("User", back_populates="faqs")


# 3. The Log Audit Table Model
class LogAudit(Base):
    __tablename__ = "log_audit"
    log_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    # ADDED INDEX: Drastically speeds up lookups or JOINs fetching a single user's log timeline
    # Nullable: failed attempts against nonexistent accounts have no user to reference
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=True, index=True)
    # The staff_id/email submitted when no matching user exists
    attempted_identifier: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    # nullable=True matches the existing DB schema; the default means it's never None in practice
    login_time: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(45))
    login_status: Mapped[str] = mapped_column(Enum("Success", "Failed", name="login_statuses"), nullable=False)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User", back_populates="audit_logs")
