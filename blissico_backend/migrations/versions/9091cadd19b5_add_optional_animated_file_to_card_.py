"""add optional animated_file to card_templates

Revision ID: 9091cadd19b5
Revises: b8c3d4e5f6a7
Create Date: 2026-08-29 23:48:43.276827

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9091cadd19b5'
down_revision = 'b8c3d4e5f6a7'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Backfill existing NULL records so the constraint doesn't fail
    # Update user_id=0 or a valid fallback user ID in your database
    op.execute("UPDATE card_customizations SET user_id = 1 WHERE user_id IS NULL")
    op.execute(
        "UPDATE contact_messages SET is_replied = FALSE WHERE is_replied IS NULL"
    )

    # 2. Run schema alterations
    with op.batch_alter_table("card_customizations", schema=None) as batch_op:
        batch_op.alter_column(
            "user_id", existing_type=sa.INTEGER(), nullable=False
        )

    with op.batch_alter_table("card_templates", schema=None) as batch_op:
        batch_op.add_column(
            sa.Column("animated_file", sa.String(length=255), nullable=True)
        )

    with op.batch_alter_table("contact_messages", schema=None) as batch_op:
        batch_op.alter_column(
            "is_replied", existing_type=sa.BOOLEAN(), nullable=False
        )


def downgrade():
    with op.batch_alter_table('contact_messages', schema=None) as batch_op:
        batch_op.alter_column('is_replied',
               existing_type=sa.BOOLEAN(),
               nullable=True)

    with op.batch_alter_table('card_templates', schema=None) as batch_op:
        batch_op.drop_column('animated_file')

    with op.batch_alter_table('card_customizations', schema=None) as batch_op:
        batch_op.alter_column('user_id',
               existing_type=sa.INTEGER(),
               nullable=True)