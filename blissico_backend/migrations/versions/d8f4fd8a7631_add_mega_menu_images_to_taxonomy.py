"""add mega menu images to taxonomy models

Revision ID: d8f4fd8a7631
Revises: 8ff4011dfb70
Create Date: 2026-10-05 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'd8f4fd8a7631'
down_revision = '8ff4011dfb70'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.add_column(sa.Column('mega_menu_image', sa.String(length=255), nullable=True))

    with op.batch_alter_table('collections', schema=None) as batch_op:
        batch_op.add_column(sa.Column('mega_menu_image', sa.String(length=255), nullable=True))

    with op.batch_alter_table('occasions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('mega_menu_image', sa.String(length=255), nullable=True))


def downgrade():
    with op.batch_alter_table('categories', schema=None) as batch_op:
        batch_op.drop_column('mega_menu_image')

    with op.batch_alter_table('collections', schema=None) as batch_op:
        batch_op.drop_column('mega_menu_image')

    with op.batch_alter_table('occasions', schema=None) as batch_op:
        batch_op.drop_column('mega_menu_image')
