"""Alembic migration script template."""
from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    """Create todos table."""
    op.create_table(
        'todos',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('description', sa.String(length=2000), nullable=True),
        sa.Column('completed', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('user_id', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_todos_user_id', 'todos', ['user_id'])
    op.create_index('ix_todos_user_completed', 'todos', ['user_id', 'completed'])


def downgrade() -> None:
    """Drop todos table."""
    op.drop_index('ix_todos_user_completed', table_name='todos')
    op.drop_index('ix_todos_user_id', table_name='todos')
    op.drop_table('todos')
