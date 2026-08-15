import os
import click
from flask.cli import with_appcontext
from app import db
from app.models import Role, User
from app.utils.password_services import PasswordService

DEFAULT_ROLES = ["Admin", "User"]


@click.command("seed-roles")
@with_appcontext
def seed_roles():
    """Ensure the base Role rows (Admin, User) exist. Safe to run repeatedly."""
    created = []
    for name in DEFAULT_ROLES:
        if not Role.query.filter_by(name=name).first():
            db.session.add(Role(name=name, description=f"{name} role"))
            created.append(name)

    if created:
        db.session.commit()
        click.echo(f"Created roles: {', '.join(created)}")
    else:
        click.echo("Roles already exist — nothing to do.")


@click.command("create-admin")
@click.option("--reset-password", is_flag=True, help="If the admin already exists, reset their password to ADMIN_PASSWORD from .env.")
@with_appcontext
def create_admin(reset_password):
    """
    Create (or update) the platform admin account from environment variables:
    ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FIRST_NAME, ADMIN_LAST_NAME.

    These live in your .env file only — never in source code.
    """
    email = os.environ.get("ADMIN_EMAIL")
    password = os.environ.get("ADMIN_PASSWORD")
    first_name = os.environ.get("ADMIN_FIRST_NAME", "Admin")
    last_name = os.environ.get("ADMIN_LAST_NAME", "User")

    if not email or not password:
        click.echo("ADMIN_EMAIL and ADMIN_PASSWORD must be set in blissico_backend/.env")
        return

    admin_role = Role.query.filter_by(name="Admin").first()
    if not admin_role:
        click.echo("Admin role not found — run `flask seed-roles` first.")
        return

    email = email.strip().lower()
    existing = User.query.filter_by(email=email).first()

    if existing:
        if existing.role_id != admin_role.id:
            existing.role_id = admin_role.id
            click.echo(f"Promoted existing user {email} to Admin.")
        if reset_password:
            existing.password_hash = PasswordService.hash_password(password)
            click.echo("Admin password reset.")
        existing.is_verified = True
        existing.is_active = True
        db.session.commit()
        click.echo(f"Admin account ready: {email}")
        return

    admin = User(
        role_id=admin_role.id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        password_hash=PasswordService.hash_password(password),
        is_verified=True,   # provisioned directly — skips the normal OTP flow
        is_active=True,
    )
    db.session.add(admin)
    db.session.commit()
    click.echo(f"Admin account created: {email}")



