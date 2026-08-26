"""Allow default card customizations without an end user

Revision ID: b8c3d4e5f6a7
Revises: 911069844d71
Create Date: 2026-08-25

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "b8c3d4e5f6a7"
down_revision = "911069844d71"
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table("card_customizations", schema=None) as batch_op:
        batch_op.alter_column(
            "user_id",
            existing_type=sa.Integer(),
            nullable=True,
        )


def downgrade():
    with op.batch_alter_table("card_customizations", schema=None) as batch_op:
        batch_op.alter_column(
            "user_id",
            existing_type=sa.Integer(),
            nullable=False,
        )