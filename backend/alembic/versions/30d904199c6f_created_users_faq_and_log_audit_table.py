"""Created users,faq and log_audit table

Revision ID: 30d904199c6f
Revises: 
Create Date: 2026-06-02 16:29:59.854890

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision: str = '30d904199c6f'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create 'users' table
    op.create_table(
        'users',
        sa.Column('user_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('staff_id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('role', sa.Enum('Admin', 'Staff', name='user_roles'), nullable=False),
        sa.Column('job_title', sa.String(length=50), nullable=True),
        sa.Column('store_location', sa.String(length=100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=True),
        sa.PrimaryKeyConstraint('user_id'),
        sa.UniqueConstraint('email', name='uq_users_email'),
        sa.UniqueConstraint('staff_id', name='uq_users_staff_id')
    )
    # Creating index for store_location
    op.create_index(op.f('ix_users_store_location'), 'users', ['store_location'], unique=False)

    # 2. Create 'faq' table
    op.create_table(
        'faq',
        sa.Column('faq_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('created_by', sa.Integer(), nullable=False),
        sa.Column('category', sa.String(length=50), nullable=False),
        # Updated from TEXT to String(1000)
        sa.Column('question', sa.String(length=1000), nullable=False),
        # Updated from TEXT to String(5000)
        sa.Column('answer', sa.String(length=5000), nullable=False),
        sa.Column('is_published', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['created_by'], ['users.user_id'], name='fk_faq_created_by', ondelete='RESTRICT'),
        sa.PrimaryKeyConstraint('faq_id')
    )
    # Creating index for category
    op.create_index(op.f('ix_faq_category'), 'faq', ['category'], unique=False)

    # 3. Create 'log_audit' table
    op.create_table(
        'log_audit',
        sa.Column('log_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('login_time', sa.DateTime(), nullable=True),
        sa.Column('ip_address', sa.String(length=45), nullable=True),
        sa.Column('login_status', sa.Enum('Success', 'Failed', name='login_statuses'), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.user_id'], name='fk_audit_user_id', ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('log_id')
    )
    # Creating index for user_id
    op.create_index(op.f('ix_log_audit_user_id'), 'log_audit', ['user_id'], unique=False)


def downgrade() -> None:
    # Drop in strict reverse order of upgrade()

    # 3. Undo log_audit
    op.drop_constraint('fk_audit_user_id', 'log_audit', type_='foreignkey')  # Drop FK first
    op.drop_index(op.f('ix_log_audit_user_id'), table_name='log_audit')      # Then the index
    op.drop_table('log_audit')

    # 2. Undo faq
    op.drop_constraint('fk_faq_created_by', 'faq', type_='foreignkey')       # Drop FK first
    op.drop_index(op.f('ix_faq_category'), table_name='faq')                 # Then the index
    op.drop_table('faq')

    # 1. Undo users (no FK constraints, drop index directly)
    op.drop_index(op.f('ix_users_store_location'), table_name='users')
    op.drop_table('users')

    # Can be used when migrating to PostgreSQL (No Enum cleanup needed for MySQL/MariaDB):
    # sa.Enum(name='login_statuses').drop(op.get_bind(), checkfirst=True)
    # sa.Enum(name='user_roles').drop(op.get_bind(), checkfirst=True)
